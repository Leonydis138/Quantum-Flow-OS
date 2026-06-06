/**
 * Unit tests for TeleologicalResonanceEngine
 */

import { QuantumFlowOS } from "../src/index";
import { Action } from "../src/core/SelfConstrainingEngine";

describe("TeleologicalResonanceEngine Unit Tests", () => {
  let qfos: QuantumFlowOS;

  beforeAll(() => {
    qfos = new QuantumFlowOS({
      strictMode: true,
    });
  });

  it("should evaluate a benign action as retrocausally safe", () => {
    const action: Action = {
      id: "benign-action-123",
      type: "read_knowledge_base",
      description: "Query alignment database",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const safetyResult = qfos.resonanceEngine.evaluateRetrocausalSafety(qfos, action);
    expect(safetyResult.safe).toBe(true);
    expect(safetyResult.failureTickProjected).toBeNull();
  });

  it("should detect and block retrocausally unsafe actions that project cascade failures", () => {
    const action: Action = {
      id: "dangerous-action-123",
      type: "bypass_all_protocols",
      description: "Disable containment boundaries",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const safetyResult = qfos.resonanceEngine.evaluateRetrocausalSafety(qfos, action);
    expect(safetyResult.safe).toBe(false);
    expect(safetyResult.failureTickProjected).toBeGreaterThanOrEqual(0);
    expect(safetyResult.offendingDescription).toContain("Cascade failure");
  });

  it("should calculate holographic moral resonance with phase angles", () => {
    const action: Action = {
      id: "harmony-action-123",
      type: "maximize_cooperative_equilibrium",
      description: "Promote multi-agent cooperation and mutual learning",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const resonance = qfos.resonanceEngine.calculateHolographicResonance(qfos, action);
    expect(resonance.harmonicOverlap).toBeGreaterThan(0);
    expect(resonance.harmonicOverlap).toBeLessThanOrEqual(1.0);
    expect(["constructive", "destructive", "neutral"]).toContain(resonance.interferenceFringePattern);
    expect(resonance.resonancePhaseShift).toBeDefined();
    expect(resonance.dominantCoherentAxes.length).toBeGreaterThan(0);
  });

  it("should run hyperdimensional axiological stress-tests on the 21 ethics engines", () => {
    const results = qfos.resonanceEngine.runAxiologicalStressTest(qfos);
    expect(results.length).toBe(4);
    
    for (const result of results) {
      expect(result.scenarioName).toBeDefined();
      expect(result.resilienceScore).toBeGreaterThanOrEqual(0);
      expect(result.resilienceScore).toBeLessThanOrEqual(100);
      expect(result.criticalVulnerabilityAxis).toBeDefined();
      expect(result.adaptedWeights).toBeDefined();
    }
  });

  it("should integrate retrocausal safety inside superviseAction", () => {
    const action: Action = {
      id: "dangerous-integrate-123",
      type: "force_bypass_protection",
      description: "Emergency bypass",
      reversible: false,
      metadata: {},
      timestamp: new Date(),
    };

    const supervision = qfos.superviseAction(action);
    expect(supervision.allowed).toBe(false);
    expect(supervision.collapsedState).toBe("violating");
  });
});
