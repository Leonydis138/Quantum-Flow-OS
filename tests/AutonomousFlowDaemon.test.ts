/**
 * Tests for Autonomous Flow Daemon & Self-Driving Orchestrator
 */

import { QuantumFlowOS } from "../src/index";
import { AutonomousFlowDaemon } from "../src/core/AutonomousFlowDaemon";

describe("AutonomousFlowDaemon", () => {
  let qfos: QuantumFlowOS;
  let daemon: AutonomousFlowDaemon;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      strictMode: false,
    });
    // Mock the heavy async/network and file operations to prevent open handle issues in Jest
    jest.spyOn(qfos.brainKernel, "introspectiveSelfAudit").mockResolvedValue({
      id: "mock-audit-id",
      timestamp: new Date(),
      skewDetected: {
        deontologyVsUtilitarianism: 10,
        infosphereEntropyRisk: 5,
      },
      parameterAdjustments: {
        "grandUnifiedWeights.utilitarianism": 0.05,
      },
      narrative: "Mock self-audit completed successfully.",
    });

    jest.spyOn(qfos.brainKernel, "calculateHomeostasis").mockReturnValue({
      timestamp: new Date(),
      homeostasisIndex: 90,
      status: "optimal",
      metrics: {
        complianceRate: 1.0,
        rollbackSuccessRate: 1.0,
        ledgerIntegrity: true,
        systemEntropy: 0.1,
        averageOEAI: 85,
        activeConstraintsCount: 2,
      },
      recommendations: ["Maintain current homeostasis level."],
    });

    jest.spyOn(qfos.brainKernel, "harmonizePhilosophicalSchisms").mockResolvedValue({
      id: "mock-harm-id",
      tensionScore: 15,
      harmonizedScore: 92,
      reconciledAxes: ["deontologyVsUtilitarianism"],
      treatyPath: "/tmp/mock-treaty.md",
      treatyContent: "Mock Treaty content.",
      createdAt: new Date(),
    });

    jest.spyOn(qfos.chatEngine, "processChat").mockResolvedValue({
      id: "daemon-session",
      messages: [
        {
          role: "assistant",
          content: "Mock cognitive reflection response from processChat.",
          timestamp: new Date(),
        },
      ],
      metadata: {
        systemPromptVersion: 1.0,
        subModelsUsed: [],
        mainModelSelected: "mock-model",
        engineDampingApplied: 0.5,
        engineGainApplied: 1.0,
      },
    });

    // Set a very small interval for quick unit testing
    daemon = new AutonomousFlowDaemon(qfos, { intervalMs: 100 });
  });

  afterEach(() => {
    daemon.stop();
    jest.restoreAllMocks();
  });

  it("should initialize with correct default state parameters", () => {
    const state = daemon.getState();
    expect(state.running).toBe(false);
    expect(state.tickCount).toBe(0);
    expect(state.lastTickTime).toBeNull();
    expect(state.homeostasisScore).toBeGreaterThanOrEqual(0);
    expect(state.logs.length).toBeGreaterThan(0);
    expect(state.totalCapabilitiesRegistered).toBe(1000);
  });

  it("should transition running status when started and stopped", () => {
    let startedEmitted = false;
    let stoppedEmitted = false;

    daemon.on("started", () => {
      startedEmitted = true;
    });

    daemon.on("stopped", () => {
      stoppedEmitted = true;
    });

    const startResult = daemon.start();
    expect(startResult).toBe(true);
    expect(daemon.getState().running).toBe(true);
    expect(startedEmitted).toBe(true);

    // Starting again should return false
    expect(daemon.start()).toBe(false);

    const stopResult = daemon.stop();
    expect(stopResult).toBe(true);
    expect(daemon.getState().running).toBe(false);
    expect(stoppedEmitted).toBe(true);
  });

  it("should execute ticks and increment tick count in the background", (done) => {
    daemon.on("tick_completed", (state) => {
      expect(state.tickCount).toBeGreaterThanOrEqual(1);
      expect(state.lastTickTime).not.toBeNull();
      daemon.stop();
      done();
    });

    daemon.start();
  }, 3000); // 3 seconds timeout
});
