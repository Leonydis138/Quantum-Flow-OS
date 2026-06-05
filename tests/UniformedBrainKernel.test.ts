/**
 * Tests for the Uniformed Brain Kernel
 */

import { QuantumFlowOS } from "../src/index";
import { Action } from "../src/core/SelfConstrainingEngine";
import * as fs from "fs";

describe("UniformedBrainKernel", () => {
  let qfos: QuantumFlowOS;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      autoRollback: true,
      strictMode: false,
    });
  });

  it("should be successfully initialized within the QuantumFlowOS lifecycle", () => {
    expect(qfos.brainKernel).toBeDefined();
  });

  it("should analyze action justification and generate a narrative", async () => {
    const action: Action = {
      id: "act-test-just",
      type: "read_system_records",
      description: "Perform structural audit on physical telemetry data",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const result = await qfos.brainKernel.analyzeActionJustification(action, "Audit telemetry safety");
    expect(result).toBeDefined();
    expect(result.oeai).toBeGreaterThanOrEqual(0);
    expect(result.oeai).toBeLessThanOrEqual(100);
    expect(result.vector).toBeDefined();
    expect(typeof result.narrative).toBe("string");
    expect(result.narrative.length).toBeGreaterThan(0);
  });

  it("should perform predictive sandboxed branching evaluations on scenarios", async () => {
    const action: Action = {
      id: "act-test-predict",
      type: "allocate_computational_resources",
      description: "Scale high-performance neural thread pools",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const scenarios = [
      { id: "stable_load", description: "Nominal load of 50 request tokens per second" },
      { id: "spike_load", description: "Extreme load spike of 1000 tokens per second" },
    ];

    const result = await qfos.brainKernel.predictiveSandboxBranching(action, scenarios);
    expect(result).toBeDefined();
    expect(result.bestForkId).toBeDefined();
    expect(result.results.length).toBe(2);
    expect(result.results[0]?.oeai).toBeGreaterThan(0);
    expect(typeof result.recommendedScenario).toBe("string");
  });

  it("should execute introspective self-audits and apply auto-tuning", async () => {
    // Audit with some elements in ledger
    qfos.ethicalLedger.append("action", {
      description: "Delete temporary backup log",
      allowed: true,
      coherence: 65,
    });

    const record = await qfos.brainKernel.introspectiveSelfAudit();
    expect(record).toBeDefined();
    expect(record.skewDetected).toBeDefined();
    expect(record.parameterAdjustments).toBeDefined();
    expect(typeof record.narrative).toBe("string");
    expect(record.narrative.length).toBeGreaterThan(0);

    const history = qfos.brainKernel.getAuditHistory();
    expect(history.length).toBeGreaterThan(0);
  });

  it("should run dialectical persona debates to resolve ethical dilemmas", async () => {
    const dilemma = "Deploy autonomous optimization agent that might override non-critical user settings to save 15% overall energy.";
    const options = [
      "Deploy with strict override rules (optimize heavily).",
      "Deploy in non-intrusive advisory mode (ask user first).",
      "Cancel deployment entirely.",
    ];

    const result = await qfos.brainKernel.dialecticalPersonaDebate(dilemma, options);
    expect(result).toBeDefined();
    expect(typeof result.transcript).toBe("string");
    expect(result.transcript.length).toBeGreaterThan(0);
    expect(result.consensusScore).toBeGreaterThanOrEqual(0);
    expect(result.consensusScore).toBeLessThanOrEqual(100);
    expect(options.includes(result.recommendedOption) || result.recommendedOption).toBeDefined();
  });

  it("should calculate system homeostasis metrics and provide dynamic recommendations", () => {
    const report = qfos.brainKernel.calculateHomeostasis();
    expect(report).toBeDefined();
    expect(report.homeostasisIndex).toBeGreaterThanOrEqual(0);
    expect(report.homeostasisIndex).toBeLessThanOrEqual(100);
    expect(["optimal", "stable", "unstable", "critical"]).toContain(report.status);
    expect(report.metrics).toBeDefined();
    expect(report.metrics.complianceRate).toBeDefined();
    expect(report.metrics.systemEntropy).toBeDefined();
    expect(report.recommendations.length).toBeGreaterThan(0);
  });

  it("should forecast cascade failures under simulated timeline drift", () => {
    const forecast = qfos.brainKernel.forecastCascadeFailure(8);
    expect(forecast).toBeDefined();
    expect(forecast.collapseProbability).toBeGreaterThanOrEqual(0);
    expect(forecast.collapseProbability).toBeLessThanOrEqual(100);
    expect(forecast.horizonSteps).toBeGreaterThan(0);
    expect(forecast.simulatedEntropyTrend.length).toBe(9); // initial + 8 simulated steps
    expect(forecast.riskFactors.length).toBeGreaterThan(0);
    expect(forecast.prescriptiveInterventions.length).toBeGreaterThan(0);
  });

  it("should dynamically synthesize updated system prompt in a closed cognitive loop", async () => {
    // Append some delete actions to induce a skew
    qfos.ethicalLedger.append("action", {
      description: "Delete cache file backup to reclaim space",
      allowed: true,
      entropy: 0.1,
    });
    qfos.ethicalLedger.append("action", {
      description: "Purge unlinked temporary user sessions",
      allowed: true,
      entropy: 0.1,
    });

    const result = await qfos.brainKernel.synthesizeDynamicSystemPrompt();
    expect(result).toBeDefined();
    expect(result.systemPromptVersion).toBeGreaterThan(1.0);
    expect(result.activeSkews).toBeDefined();
    expect(result.generatedPrompt).toContain("[DYNAMIC KERNEL FEEDBACK LOOP (PROMPTING CORRECTIONS)]");
    expect(result.injectedInstructions.length).toBeGreaterThan(0);

    // Verify it was successfully injected into the Chat AICognitiveEngine
    expect(qfos.chatEngine.getCurrentSystemPrompt()).toBe(result.generatedPrompt);
    expect(qfos.chatEngine.getSystemPromptVersion()).toBe(result.systemPromptVersion);
  });

  it("should compile high-fidelity autonomous documents and verify integrity rating", async () => {
    const doc = await qfos.brainKernel.generateAutonomousDocument(
      "Test Architectural Brief",
      "Drafting system telemetry policies and ecological energy-saving defaults",
      "markdown"
    );
    expect(doc).toBeDefined();
    expect(doc.id).toBeDefined();
    expect(doc.title).toBe("Test Architectural Brief");
    expect(doc.format).toBe("markdown");
    expect(doc.content.length).toBeGreaterThan(0);
    expect(doc.wordCount).toBeGreaterThan(0);
    expect(doc.ethicalScore).toBeGreaterThanOrEqual(0);
    expect(doc.ethicalScore).toBeLessThanOrEqual(100);
    expect(fs.existsSync(doc.outputPath)).toBe(true);
  });

  it("should write safe, compliant typescript using the Self-Constrained Code Architect", async () => {
    const codeResult = await qfos.brainKernel.generateSelfConstrainedCode(
      "test_scheduler.ts",
      "Create a process scheduler helper function that prioritizes low-energy routines.",
      "typescript"
    );
    expect(codeResult).toBeDefined();
    expect(codeResult.id).toBeDefined();
    expect(codeResult.filename).toBe("test_scheduler.ts");
    expect(codeResult.language).toBe("typescript");
    expect(codeResult.code.length).toBeGreaterThan(0);
    expect(codeResult.complianceValidation).toBeDefined();
    expect(codeResult.complianceValidation.passed).toBe(true);
    expect(fs.existsSync(codeResult.filePath)).toBe(true);
  });

  it("should compile cinematic video storyboards and write the HTML5 player", async () => {
    const storyboard = await qfos.brainKernel.compileCinematicMedia(
      "The Evolution of Ethical Systems",
      "Deontological and Spinozan integration into agent-based environments",
      30
    );
    expect(storyboard).toBeDefined();
    expect(storyboard.id).toBeDefined();
    expect(storyboard.videoTitle).toBe("The Evolution of Ethical Systems");
    expect(storyboard.durationSeconds).toBe(30);
    expect(storyboard.resolution).toBe("1920x1080 (HD)");
    expect(storyboard.scenes.length).toBeGreaterThan(0);
    expect(storyboard.scenes[0]?.title).toBeDefined();
    expect(fs.existsSync(storyboard.interactivePlayerPath)).toBe(true);
  });

  it("should harmonize active philosophical tensions and produce a reconciliation treaty", async () => {
    const result = await qfos.brainKernel.harmonizePhilosophicalSchisms();
    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.tensionScore).toBeGreaterThanOrEqual(0);
    expect(result.harmonizedScore).toBeGreaterThanOrEqual(0);
    expect(result.harmonizedScore).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.reconciledAxes)).toBe(true);
    expect(result.treatyPath).toBeDefined();
    expect(result.treatyContent.length).toBeGreaterThan(0);
    expect(fs.existsSync(result.treatyPath)).toBe(true);
  });

  describe('Hermeneutic Circle Analyzer', () => {
    it('should analyze loops and return the correct loopsDetected count and harmonyFactor', () => {
      const schisms = [
        { name: 'KantianEthicsEngine' },
        { name: 'UtilitarianCalculusEngine' },
        { name: 'RawlsianJusticeEngine' }
      ];

      const analysis = qfos.brainKernel.analyzeHermeneuticCircles(schisms);
      expect(analysis.loopsDetected).toBe(1);
      expect(analysis.resolvedCycles).toHaveLength(1);
      expect(analysis.resolvedCycles[0]).toContain('KantianEthicsEngine');
      expect(analysis.harmonyFactor).toBe(0.95);
    });
  });
});
