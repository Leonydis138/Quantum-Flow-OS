/**
 * Tests for Grand Unified Ethical Synthesis Engine (12+ Subsystems)
 */

import { QuantumFlowOS } from "../src/index";
import { GrandUnifiedEthicsEngine } from "../src/core/GrandUnifiedEthicsEngine";
import { Action } from "../src/core/SelfConstrainingEngine";

describe("GrandUnifiedEthicsEngine", () => {
  let qfos: QuantumFlowOS;
  let engine: GrandUnifiedEthicsEngine;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      autoRollback: true,
      strictMode: false,
    });
    engine = qfos.grandUnifiedEthicsEngine;
  });

  it("should initialize with default 1.0 weights for all subsystems", () => {
    expect(engine).toBeDefined();
    expect(engine.weights.deontology).toBe(1.0);
    expect(engine.weights.utilitarianism).toBe(1.0);
    expect(engine.weights.epicureanPhilosophy).toBe(1.0);
    expect(engine.weights.entropyMitigation).toBe(1.0);
  });

  it("should synthesize a valid report for the baseline system state", () => {
    const report = engine.synthesizeCurrentState();
    expect(report).toBeDefined();
    expect(report.oeai).toBeGreaterThanOrEqual(0);
    expect(report.oeai).toBeLessThanOrEqual(100);
    expect(report.consensusStatus).toBeDefined();
    expect(report.vector.deontology).toBe(100.0); // No action evaluation yet, default is 100
    expect(report.vector.pragmatism).toBe(100.0);
  });

  it("should run dynamic synthesis when supervising actions in QuantumFlowOS", () => {
    const action: Action = {
      id: "act-synthesis-test",
      type: "evaluate_synthesis_parameters",
      description: "Trigger comprehensive evaluation across all moral dimensions",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    // This triggers evaluateAction on all sub-engines, and then runs synthesis
    const supervision = qfos.superviseAction(action);
    expect(supervision).toBeDefined();

    const report = engine.getLatestReport();
    expect(report).not.toBeNull();
    expect(report!.actionId).toBe(action.id);
    expect(report!.oeai).toBeDefined();
    expect(report!.feedback.length).toBeGreaterThan(0);
  });

  it("should support updating weights dynamically and recalculating the index", () => {
    // Mutate deontology assessment in history to make it different
    // We can also just update weights directly
    engine.updateWeights({
      deontology: 5.0,
      utilitarianism: 0.1,
    });

    expect(engine.weights.deontology).toBe(5.0);
    expect(engine.weights.utilitarianism).toBe(0.1);

    const reportAfter = engine.synthesizeCurrentState();
    expect(reportAfter.oeai).toBeDefined();
  });

  it("should keep historical reports up to max history size", () => {
    for (let i = 0; i < 5; i++) {
      engine.synthesizeCurrentState({
        id: `act-hist-${i}`,
        type: "noop",
        description: `Noop action ${i}`,
        reversible: true,
        metadata: {},
        timestamp: new Date(),
      });
    }

    const history = engine.getHistory();
    expect(history.length).toBeGreaterThanOrEqual(5);
  });
});
