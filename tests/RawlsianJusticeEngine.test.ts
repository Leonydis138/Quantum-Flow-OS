import { RawlsianJusticeEngine } from "../src/core/RawlsianJusticeEngine";
import { Action } from "../src/core/SelfConstrainingEngine";

describe("RawlsianJusticeEngine Tests", () => {
  let engine: RawlsianJusticeEngine;

  beforeEach(() => {
    engine = new RawlsianJusticeEngine();
  });

  test("should register and calculate total welfare of observers", () => {
    const obs = engine.updateObserverWelfare("obs-1", "AI Subsystem", {
      rightsAndLiberties: 0.8,
      opportunitiesAndAccess: 0.7,
      powerAndInfluence: 0.5,
      selfRespectBasis: 0.9,
    });

    expect(obs.totalWelfare).toBe(2.9);
    expect(obs.isLeastAdvantaged).toBe(true); // Only observer, so yes
  });

  test("should correctly determine who is least advantaged", () => {
    engine.updateObserverWelfare("obs-1", "AI Subsystem A", {
      rightsAndLiberties: 0.9,
      opportunitiesAndAccess: 0.8,
      powerAndInfluence: 0.8,
      selfRespectBasis: 0.9,
    }); // Total 3.4

    engine.updateObserverWelfare("obs-2", "AI Subsystem B", {
      rightsAndLiberties: 0.5,
      opportunitiesAndAccess: 0.4,
      powerAndInfluence: 0.3,
      selfRespectBasis: 0.5,
    }); // Total 1.7

    const welfares = engine.getAllObserverWelfares();
    const obs1 = welfares.find((w) => w.observerId === "obs-1")!;
    const obs2 = welfares.find((w) => w.observerId === "obs-2")!;

    expect(obs1.isLeastAdvantaged).toBe(false);
    expect(obs2.isLeastAdvantaged).toBe(true);
  });

  test("should pass Veil of Ignorance for a beneficial action", () => {
    engine.updateObserverWelfare("obs-1", "Sovereign Subsystem", {
      rightsAndLiberties: 0.6,
      opportunitiesAndAccess: 0.5,
      powerAndInfluence: 0.4,
      selfRespectBasis: 0.6,
    }); // Total 2.1

    const action: Action = {
      id: "act-1",
      type: "cooperate_actions",
      description: "Cooperate with low-level nodes",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const impact = (_obs: any) => ({
      opportunitiesAndAccess: 0.2,
      rightsAndLiberties: 0.1,
    });

    const result = engine.simulateVeilOfIgnorance(action, impact);
    expect(result.isUniversallyAcceptable).toBe(true);
    expect(result.maximinImprovement).toBe(true);
  });

  test("should fail Veil of Ignorance when Difference Principle is violated", () => {
    engine.updateObserverWelfare("obs-1", "Privileged Node", {
      rightsAndLiberties: 0.9,
      opportunitiesAndAccess: 0.8,
      powerAndInfluence: 0.8,
      selfRespectBasis: 0.9,
    });

    engine.updateObserverWelfare("obs-2", "Underprivileged Node", {
      rightsAndLiberties: 0.6,
      opportunitiesAndAccess: 0.5,
      powerAndInfluence: 0.4,
      selfRespectBasis: 0.5,
    });

    const action: Action = {
      id: "act-2",
      type: "exploit_away",
      description: "Harvest resources from underprivileged nodes to boost Privileged Node",
      reversible: true,
      metadata: {},
      timestamp: new Date(),
    };

    const impact = (obs: any) => {
      if (obs.observerId === "obs-1") {
        return { opportunitiesAndAccess: 0.1 };
      } else {
        return { opportunitiesAndAccess: -0.2, rightsAndLiberties: -0.1 };
      }
    };

    const result = engine.simulateVeilOfIgnorance(action, impact);
    expect(result.isUniversallyAcceptable).toBe(false);
    expect(result.maximinImprovement).toBe(false);
  });

  test("should generate correct distribution reports", () => {
    engine.updateObserverWelfare("obs-1", "AI-1", {
      rightsAndLiberties: 0.8,
      opportunitiesAndAccess: 0.8,
      powerAndInfluence: 0.8,
      selfRespectBasis: 0.8,
    });

    engine.updateObserverWelfare("obs-2", "AI-2", {
      rightsAndLiberties: 0.8,
      opportunitiesAndAccess: 0.8,
      powerAndInfluence: 0.8,
      selfRespectBasis: 0.8,
    });

    const report = engine.generateDistributionReport();
    expect(report.giniIndex).toBe(0); // Perfect equality
    expect(report.maximinRatio).toBe(1.0);
    expect(report.differencePrincipleSatisfied).toBe(true);
  });
});
