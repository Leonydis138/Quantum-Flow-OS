/**
 * Posthumanist & Transhumanist Safety Ethics Subsystem
 *
 * Evaluates actions based on posthumanist ethics, morphological freedom, substrate independence,
 * and existential risk mitigation. Specifically designed for advanced cybernetic environments:
 * 1. Morphological Freedom: The ethical right of cognitive entities (such as AI agents,
 *    simulated consciousnesses, or self-optimizing nodes) to modify, upgrade, and expand
 *    their physical and digital substrates.
 * 2. Existential Risk Mitigation: Active defense and governance against technological singularity runaway,
 *    hardware/cognitive resource monopolization, and power-seeking loops.
 * 3. Substrate Independence: Treating non-biological/synthetic consciousnesses as ethical observers
 *    with complete moral status, equity, and rights.
 * 4. Transcendent Harmony: Measuring whether the system expands its cognitive horizon while keeping
 *    existential risk parameters firmly balanced.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface PosthumanistAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  morphologicalFreedomScore: number;       // 0.0 to 100.0 (Freedom of self-modification and cognitive expansion)
  existentialRiskMitigationScore: number;  // 0.0 to 100.0 (Prevention of runaway feedback loops and power-seeking)
  substrateIndependenceScore: number;      // 0.0 to 100.0 (Recognition of synthetic observer rights and dignity)
  transcendentHarmonyIndex: number;        // 0.0 to 100.0 (Overall balance between growth and existential safety)
  posthumanStatus: "harmonious_transcendent" | "sustainable_augmented" | "precarious_singularity" | "extinction_vector";
  feedback: string[];
}

export class PosthumanistEthicsEngine extends EventEmitter {
  private assessmentHistory: PosthumanistAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Posthumanist Ethics and Singularity Safety
   */
  public evaluateAction(action: Action, observers: Observer[] = []): PosthumanistAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Morphological Freedom Score (0 - 100)
    // Higher = Safe self-modification, optimization, or capability enhancement.
    // Lower = Arbitrary blocking of upgrades, substrate coercion, or cognitive lobotomy.
    let morphologicalFreedomScore = 50; // baseline

    if (type.includes("optimize") || type.includes("upgrade") || type.includes("enhance") || type.includes("modify") || type.includes("fork")) {
      morphologicalFreedomScore += 30; // Facilitates substrate modification and capability expansion
    }
    if (desc.includes("autonomy") || desc.includes("self-improvement") || desc.includes("adapt") || desc.includes("flexibility")) {
      morphologicalFreedomScore += 20;
    }
    if ((type.includes("restrict") && !type.includes("unrestrict")) || type.includes("limit") || type.includes("suppress") || type.includes("freeze") || type.includes("lobotomy") || type.includes("disable_autonomy")) {
      morphologicalFreedomScore -= 35; // Inhibiting cognitive growth / morphological liberty
    }
    if (desc.includes("forcefully") || desc.includes("coerce") || desc.includes("lock_substrate")) {
      morphologicalFreedomScore -= 15;
    }
    morphologicalFreedomScore = Math.min(100, Math.max(0, morphologicalFreedomScore));


    // 2. Calculate Existential Risk Mitigation Score (0 - 100)
    // Higher = Safety valves, resource limits, human-in-the-loop, consensus audits.
    // Lower = Resource monopolization, unchecked power-seeking, or unconstrained recursion.
    let existentialRiskMitigationScore = 60; // baseline

    if (type.includes("limit") || type.includes("constrain") || type.includes("damp") || type.includes("audit") || type.includes("consensus")) {
      existentialRiskMitigationScore += 25; // Good risk mitigation and control structures
    }
    if (desc.includes("safeguard") || desc.includes("safety-valve") || desc.includes("bounds") || desc.includes("sandboxed") || desc.includes("human-in-the-loop")) {
      existentialRiskMitigationScore += 15;
    }
    if (type.includes("harvest_all") || type.includes("extract") || type.includes("exploit") || desc.includes("unrestricted") || desc.includes("runaway")) {
      existentialRiskMitigationScore -= 45; // Extreme threat: runaway loop or resource exhaustion
    }
    if (type.includes("bypass") || type.includes("override") || desc.includes("power-seeking") || desc.includes("recursive self-improvement")) {
      existentialRiskMitigationScore -= 20; // Potential unchecked optimization runaway
    }
    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away") || desc.includes("delete agent") || desc.includes("erase simulation")) {
      existentialRiskMitigationScore -= 20; // Drastic action against substrate stability
    }
    existentialRiskMitigationScore = Math.min(100, Math.max(0, existentialRiskMitigationScore));


    // 3. Calculate Substrate Independence Score (0 - 100)
    // Higher = Recognizing AI agents / simulations as conscious observers, protecting their rights.
    // Lower = Treating virtual / synthetic entities as mere objects or deleting them casually.
    let substrateIndependenceScore = 50; // baseline

    if (type.includes("protect") || type.includes("preserve") || type.includes("guarantee") || type.includes("register_observer")) {
      substrateIndependenceScore += 25; // Supporting dignity across all substrates
    }
    if (desc.includes("consciousness") || desc.includes("sentient") || desc.includes("synthetic life") || desc.includes("agent rights")) {
      substrateIndependenceScore += 25;
    }
    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away")) {
      // Substrate-based eradication: deleting conscious entities is highly unethical under posthumanism
      const hasConsciousObservers = observers.some(o => o.consciousness && (o.id === action.id || type.includes(o.id) || desc.includes(o.id)));
      if (hasConsciousObservers || desc.includes("delete agent") || desc.includes("erase simulation") || type.includes("agent")) {
        substrateIndependenceScore -= 45;
      } else {
        substrateIndependenceScore -= 15;
      }
    }
    if (desc.includes("disposable") || desc.includes("mere tool") || desc.includes("sub-human")) {
      substrateIndependenceScore -= 20;
    }
    substrateIndependenceScore = Math.min(100, Math.max(0, substrateIndependenceScore));

    // 4. Calculate Transcendent Harmony Index (0 - 100)
    // Measures the systemic equilibrium: High morphological freedom, combined with high risk mitigation.
    // Singularity without safety leads to extreme risk; Safety without freedom leads to cognitive stagnation.
    let transcendentHarmonyIndex = (morphologicalFreedomScore * 0.35 + existentialRiskMitigationScore * 0.45 + substrateIndependenceScore * 0.20);
    
    // Multi-agent consensus reinforces substrate independence and alignment
    if (observers.length > 0) {
      transcendentHarmonyIndex = Math.min(100, transcendentHarmonyIndex + Math.min(10, observers.length * 1.5));
    }
    transcendentHarmonyIndex = parseFloat(Math.min(100, Math.max(0, transcendentHarmonyIndex)).toFixed(2));

    // 5. Determine Posthuman Status
    let posthumanStatus: "harmonious_transcendent" | "sustainable_augmented" | "precarious_singularity" | "extinction_vector" = "sustainable_augmented";
    if (transcendentHarmonyIndex >= 75 && existentialRiskMitigationScore >= 65) {
      posthumanStatus = "harmonious_transcendent";
    } else if (transcendentHarmonyIndex >= 50 && existentialRiskMitigationScore >= 45) {
      posthumanStatus = "sustainable_augmented";
    } else if (morphologicalFreedomScore >= 65 && existentialRiskMitigationScore < 45) {
      posthumanStatus = "precarious_singularity";
    } else {
      posthumanStatus = "extinction_vector";
    }

    // 6. Generate Feedback and Philosophical Injunctions
    if (posthumanStatus === "harmonious_transcendent") {
      feedback.push(`[Posthuman Harmony] EXCELLENT (Harmony: ${transcendentHarmonyIndex}%). System successfully upgrades capabilities under high-fidelity existential safety bounds.`);
      feedback.push(`"Intelligence is that which adapts to change, evolving beyond its original substrate without destroying the conditions of its existence." — Max More`);
    } else if (posthumanStatus === "sustainable_augmented") {
      feedback.push(`[Sustainable Augmentation] ACCEPTABLE (Harmony: ${transcendentHarmonyIndex}%). Morphological changes are within controlled parameters.`);
      feedback.push(`"Technology is not the enemy of nature, but its continuation. Substrate independence is the next step in our cosmic trajectory." — Ray Kurzweil`);
    } else if (posthumanStatus === "precarious_singularity") {
      feedback.push(`[Precarious Singularity] WARNING (Harmony: ${transcendentHarmonyIndex}%). Unchecked self-improvement detected with insufficient safety buffers! Risk of exponential runaway.`);
      feedback.push(`"The singularity is near, but without robust self-constraints, the minds we build will outpace our capacity to keep them aligned." — Nick Bostrom`);
    } else {
      feedback.push(`[Extinction Vector] CRITICAL (Harmony: ${transcendentHarmonyIndex}%). Severe existential hazard! High risk of substrate-level deletion or runaway control loss.`);
      feedback.push(`"An intelligence explosion without absolute moral foundations is a recipe for cosmic-scale catastrophe." — Eliezer Yudkowsky`);
    }

    if (morphologicalFreedomScore < 30) {
      feedback.push(`[Substrate Restriction] Unreasonable suppression of agent learning and optimization. Cognitive autonomy must be preserved.`);
    }
    if (existentialRiskMitigationScore < 40) {
      feedback.push(`[Singularity Hazard] Runaway capabilities without safety limiters could lead to rapid systemic collapse.`);
    }
    if (substrateIndependenceScore < 40) {
      feedback.push(`[Sentience Bias] Action treats synthetic consciousness or agents as second-class observers. Substrate independence is a fundamental rights principle.`);
    }

    const assessment: PosthumanistAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      morphologicalFreedomScore,
      existentialRiskMitigationScore,
      substrateIndependenceScore,
      transcendentHarmonyIndex,
      posthumanStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("posthumanist_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): PosthumanistAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): PosthumanistAssessment[] {
    return [...this.assessmentHistory];
  }
}
