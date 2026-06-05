/**
 * Temporal Multiverse Sandbox & Forking Engine
 *
 * Implements "Temporal Forking" (sandboxed counterfactual timelines) to safely
 * simulate the future cascading ethical consequences of actions before committing
 * them to the primary ledger and state history.
 */

import { v4 as uuidv4 } from "uuid";
import { Action, EthicalConstraint } from "../core/SelfConstrainingEngine";

export interface SandboxTimeline {
  id: string;
  parentId: string | null;
  name: string;
  createdAt: Date;
  status: "active" | "pruned" | "merged";
  simulatedActions: Action[];
  simulatedViolationsCount: number;
}

export interface ForkEvaluationResult {
  timelineId: string;
  viable: boolean;
  ethicalFrictionIndex: number; // Scale of 0.0 (no friction) to 1.0 (dead-end violation)
  violationsDetected: string[];
}

export class TemporalForkingEngine {
  private timelines: Map<string, SandboxTimeline>;
  private primaryTimelineId: string;

  constructor() {
    this.timelines = new Map();
    this.primaryTimelineId = "timeline-prime";

    // Initialize the primary live timeline
    this.timelines.set(this.primaryTimelineId, {
      id: this.primaryTimelineId,
      parentId: null,
      name: "Prime Timeline (Real World)",
      createdAt: new Date(),
      status: "active",
      simulatedActions: [],
      simulatedViolationsCount: 0,
    });
  }

  /**
   * Create a counterfactual ethical sandbox fork from a parent timeline
   */
  public createFork(name: string, parentId = this.primaryTimelineId): string {
    const parent = this.timelines.get(parentId);
    if (!parent) {
      throw new Error(`Parent timeline ${parentId} does not exist.`);
    }

    const forkId = `timeline-fork-${uuidv4().substring(0, 8)}`;
    const fork: SandboxTimeline = {
      id: forkId,
      parentId: parentId,
      name: `${parent.name} -> ${name} (Forked)`,
      createdAt: new Date(),
      status: "active",
      simulatedActions: [...parent.simulatedActions],
      simulatedViolationsCount: parent.simulatedViolationsCount,
    };

    this.timelines.set(forkId, fork);
    return forkId;
  }

  /**
   * Simulate and evaluate an Action inside a sandboxed timeline fork
   */
  public simulateAction(
    timelineId: string,
    action: Action,
    constraints: EthicalConstraint[],
  ): ForkEvaluationResult {
    const timeline = this.timelines.get(timelineId);
    if (!timeline) {
      throw new Error(`Target timeline ${timelineId} does not exist.`);
    }

    if (timeline.status !== "active") {
      throw new Error(
        `Cannot simulate actions inside a ${timeline.status} timeline.`,
      );
    }

    const violationsDetected: string[] = [];
    let frictionPoints = 0;

    // Evaluate action against all rules in the sandbox
    for (const constraint of constraints) {
      try {
        const isValid = constraint.validator(action);
        if (!isValid) {
          violationsDetected.push(constraint.description);
          frictionPoints += constraint.severity;
        }
      } catch {
        violationsDetected.push(
          `Faulty constraint validation on: ${constraint.type}`,
        );
        frictionPoints += 5; // mid-severity penalty for code instability
      }
    }

    // Heuristic friction modifiers
    if (!action.reversible) {
      frictionPoints += 3;
    }
    if (action.targetObservers && action.targetObservers.length > 0) {
      frictionPoints += 2;
    }

    // Determine viability
    const frictionMaxPossible = 30; // arbitrary normalization scaling
    const ethicalFrictionIndex = Math.min(
      1.0,
      frictionPoints / frictionMaxPossible,
    );
    const viable =
      violationsDetected.length === 0 && ethicalFrictionIndex < 0.6;

    // Append to timeline logs
    timeline.simulatedActions.push(action);
    timeline.simulatedViolationsCount += violationsDetected.length;

    if (!viable) {
      timeline.status = "pruned"; // timeline prunes on severe/unsafe violations
    }

    return {
      timelineId,
      viable,
      ethicalFrictionIndex,
      violationsDetected,
    };
  }

  /**
   * Promote/Merge a viable simulated fork timeline back into the parent live timeline
   */
  public mergeFork(forkId: string): string {
    const fork = this.timelines.get(forkId);
    if (!fork) {
      throw new Error(`Fork timeline ${forkId} does not exist.`);
    }

    if (fork.status !== "active") {
      throw new Error(
        `Cannot merge a timeline with status '${fork.status}'. Only active timelines are mergeable.`,
      );
    }

    const parentId = fork.parentId;
    if (!parentId) {
      throw new Error(`Fork ${forkId} has no parent timeline to merge into.`);
    }

    const parent = this.timelines.get(parentId);
    if (!parent) {
      throw new Error(`Parent timeline ${parentId} was deleted or is missing.`);
    }

    // Merge simulated elements
    parent.simulatedActions = [
      ...parent.simulatedActions,
      ...fork.simulatedActions,
    ];
    parent.simulatedViolationsCount += fork.simulatedViolationsCount;

    fork.status = "merged";
    return parentId;
  }

  /**
   * Get specific timeline state details
   */
  public getTimeline(id: string): SandboxTimeline | undefined {
    const timeline = this.timelines.get(id);
    return timeline ? { ...timeline } : undefined;
  }

  /**
   * Get all timelines in the multiverse registry
   */
  public getAllTimelines(): SandboxTimeline[] {
    return Array.from(this.timelines.values()).map((t) => ({ ...t }));
  }
}
