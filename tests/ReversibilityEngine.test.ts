/**
 * Unit and integration tests for ReversibilityEngine
 */

import { ReversibilityEngine } from "../src/reversibility/ReversibilityEngine";

describe("ReversibilityEngine", () => {
  let engine: ReversibilityEngine;

  beforeEach(() => {
    engine = new ReversibilityEngine({ maxHistorySize: 10 });
  });

  describe("executeWithRollback", () => {
    it("should execute action successfully and not trigger rollback", async () => {
      let executed = false;
      let rolledBack = false;

      const action = {
        name: "test_success_action",
        execute: async () => {
          executed = true;
          return "success_data";
        },
        rollback: async () => {
          rolledBack = true;
        },
        metadata: { info: "test" },
      };

      const result = await engine.executeWithRollback(action);

      expect(result.success).toBe(true);
      expect(result.result).toBe("success_data");
      expect(result.attempts).toBe(1);
      expect(executed).toBe(true);
      expect(rolledBack).toBe(false);

      const savedAction = engine.getAction(result.actionId);
      expect(savedAction).toBeDefined();
      expect(savedAction?.completed).toBe(true);
      expect(savedAction?.rolledBack).toBe(false);
    });

    it("should retry on error and rollback on failure", async () => {
      let executions = 0;
      let rollbackCount = 0;

      const action = {
        name: "test_failure_action",
        execute: async () => {
          executions++;
          throw new Error(`Failure ${executions}`);
        },
        rollback: async () => {
          rollbackCount++;
        },
        metadata: {},
      };

      const result = await engine.executeWithRollback(action, {
        maxAttempts: 3,
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Failure 3");
      expect(result.attempts).toBe(3);
      expect(executions).toBe(3);
      // It should roll back after each failed attempt, so 3 total rollbacks
      expect(rollbackCount).toBe(3);

      const status = engine.getReversibilityStatus();
      expect(status.totalRollbacks).toBe(3);
      expect(status.successfulRollbacks).toBe(3);
    });

    it("should throw timeout error on slow execution", async () => {
      const action = {
        name: "test_timeout_action",
        execute: async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          return "slow_success";
        },
        rollback: async () => {},
        metadata: {},
      };

      const result = await engine.executeWithRollback(action, {
        maxAttempts: 1,
        timeoutMs: 10,
      });

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe("Operation timeout");
    });
  });

  describe("Snapshots", () => {
    it("should support snapshot lifecycle", () => {
      const actionId = "snapshot-action-id";
      const beforeState = { score: 10 };
      const afterState = { score: 20 };

      let snapshotCreated = false;
      let snapshotUpdated = false;

      engine.on("snapshot_created", (snap) => {
        if (snap.actionId === actionId) {
          snapshotCreated = true;
          expect(snap.beforeState).toEqual(beforeState);
        }
      });

      engine.on("snapshot_updated", (snap) => {
        if (snap.actionId === actionId) {
          snapshotUpdated = true;
          expect(snap.afterState).toEqual(afterState);
        }
      });

      engine.createSnapshot(actionId, beforeState);
      expect(engine.getSnapshot(actionId)).toBeDefined();

      engine.updateSnapshot(actionId, afterState);
      const finalSnap = engine.getSnapshot(actionId);
      expect(finalSnap?.afterState).toEqual(afterState);

      expect(snapshotCreated).toBe(true);
      expect(snapshotUpdated).toBe(true);
    });
  });

  describe("Rollback Batches and Temporal Rollback", () => {
    it("should rollback multiple actions in LIFO order", async () => {
      const rollbacks: string[] = [];

      const action1 = {
        name: "action1",
        execute: async () => {},
        rollback: async () => {
          rollbacks.push("1");
        },
        metadata: {},
      };

      const action2 = {
        name: "action2",
        execute: async () => {},
        rollback: async () => {
          rollbacks.push("2");
        },
        metadata: {},
      };

      const r1 = await engine.executeWithRollback(action1);
      const r2 = await engine.executeWithRollback(action2);

      const batchResult = await engine.rollbackActions([r1.actionId, r2.actionId]);

      expect(batchResult.total).toBe(2);
      expect(batchResult.succeeded).toBe(2);
      expect(batchResult.failed).toBe(0);
      // LIFO order: action2 rolled back before action1
      expect(rollbacks).toEqual(["2", "1"]);
    });

    it("should rollback all actions since a specific point in time", async () => {
      const rolledBackIds: string[] = [];

      const act = (name: string) => ({
        name,
        execute: async () => {},
        rollback: async () => {
          rolledBackIds.push(name);
        },
        metadata: {},
      });

      const r1 = await engine.executeWithRollback(act("a1"));
      const action1 = engine.getAction(r1.actionId);
      if (action1) {
        action1.timestamp = new Date(Date.now() - 10000);
      }
      
      const thresholdTime = new Date();
      await new Promise((resolve) => setTimeout(resolve, 5));

      await engine.executeWithRollback(act("a2"));
      await engine.executeWithRollback(act("a3"));

      const batchResult = await engine.rollbackSince(thresholdTime);

      expect(batchResult.total).toBe(2);
      expect(batchResult.succeeded).toBe(2);
      // a2 and a3 should be rolled back in reverse order, while a1 is left untouched
      expect(rolledBackIds).toEqual(["a3", "a2"]);
    });
  });

  describe("History and Filtering", () => {
    it("should limit history size to maxHistorySize", async () => {
      const action = {
        name: "test",
        execute: async () => {
          throw new Error("fail");
        },
        rollback: async () => {},
        metadata: {},
      };

      // Executing 6 times with 2 attempts each will record 12 rollback records
      for (let i = 0; i < 6; i++) {
        await engine.executeWithRollback(action, { maxAttempts: 2 });
      }

      const history = engine.getRollbackHistory();
      expect(history.length).toBe(10); // Capped at maxHistorySize
    });

    it("should filter history appropriately", async () => {
      const actionOk = {
        name: "ok",
        execute: async () => {},
        rollback: async () => {},
        metadata: {},
      };

      const r = await engine.executeWithRollback(actionOk);
      
      // Manually trigger a successful and a failed rollback record
      await engine.rollbackAction(r.actionId);
      
      // Let's create an action that throws during rollback
      const actionFailRollback = {
        name: "failRollback",
        execute: async () => {},
        rollback: async () => {
          throw new Error("rollback error");
        },
        metadata: {},
      };

      const r2 = await engine.executeWithRollback(actionFailRollback);
      await engine.rollbackAction(r2.actionId);

      const allHistory = engine.getRollbackHistory();
      expect(allHistory.length).toBe(2);

      const successOnly = engine.getRollbackHistory({ successOnly: true });
      expect(successOnly.length).toBe(1);
      expect(successOnly[0]!.actionId).toBe(r.actionId);

      const specificAction = engine.getRollbackHistory({ actionId: r2.actionId });
      expect(specificAction.length).toBe(1);
      expect(specificAction[0]!.success).toBe(false);
    });
  });

  describe("Cleanup and Edge Cases", () => {
    it("should ignore rollback of non-existent actions", async () => {
      const success = await engine.rollbackAction("fake-id");
      expect(success).toBe(false);
    });

    it("should ignore rollback of already rolled back actions", async () => {
      const action = {
        name: "test",
        execute: async () => {},
        rollback: async () => {},
        metadata: {},
      };

      const r = await engine.executeWithRollback(action);
      const success1 = await engine.rollbackAction(r.actionId);
      expect(success1).toBe(true);

      const success2 = await engine.rollbackAction(r.actionId);
      expect(success2).toBe(false); // second time should skip
    });

    it("should clean up old actions and snapshots", async () => {
      const action = {
        name: "test",
        execute: async () => {},
        rollback: async () => {},
        metadata: {},
      };

      const r1 = await engine.executeWithRollback(action);
      engine.createSnapshot(r1.actionId, { val: 1 });
      const action1 = engine.getAction(r1.actionId);
      if (action1) {
        action1.timestamp = new Date(Date.now() - 10000);
      }

      const thresholdTime = new Date();
      await new Promise((resolve) => setTimeout(resolve, 5));

      const r2 = await engine.executeWithRollback(action);
      engine.createSnapshot(r2.actionId, { val: 2 });

      // Clean up actions before thresholdTime (r1 should be cleaned, r2 should be kept)
      const cleaned = engine.cleanup(thresholdTime);
      expect(cleaned).toBe(1);

      expect(engine.getAction(r1.actionId)).toBeNull();
      expect(engine.getSnapshot(r1.actionId)).toBeNull();

      expect(engine.getAction(r2.actionId)).toBeDefined();
      expect(engine.getSnapshot(r2.actionId)).toBeDefined();
    });
  });
});
