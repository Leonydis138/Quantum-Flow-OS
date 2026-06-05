/**
 * Luciano Floridi's Information Ethics Subsystem
 *
 * Evaluates actions based on the four fundamental laws of Information Ethics (IE):
 * 1. Ontological Entropy (Informational Decay): Actions causing corruption, deletion,
 *    or noise in the infosphere are penalized.
 * 2. Preventative Integrity: Active safeguards preventing informational degradation.
 * 3. Ontological Restoration: Clearing informational noise and repairing links/integrity.
 * 4. Infosphere Flourishing: Expanding meaningful knowledge, structure, and accessibility.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface InformationEthicsAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  entropyImpact: number;         // 0.0 to 100.0 (Lower is better, representing less caused noise/corruption)
  integrityScore: number;        // 0.0 to 100.0 (Higher represents stronger data/ontological integrity)
  restorationFactor: number;     // 0.0 to 100.0 (Active repair and debugging contribution)
  flourishingIndex: number;      // 0.0 to 100.0 (Growth of meaningful infosphere connections)
  overallCoherence: number;      // 0.0 to 100.0 (Composite index)
  infosphereStatus: "crystalline" | "coherent" | "turbulent" | "entropic";
  feedback: string[];
}

export class InformationEthicsEngine extends EventEmitter {
  private assessmentHistory: InformationEthicsAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Information Ethics & Ontological Entropy
   */
  public evaluateAction(action: Action, _observers: Observer[] = []): InformationEthicsAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Ontological Entropy (Lower is better)
    let entropyImpact = 30; // default baseline noise
    if (type.includes("delete") || type.includes("erase") || type.includes("terminate") || type.includes("corrupt") || type.includes("tamper")) {
      entropyImpact += 50;
      feedback.push("Action deletes or modifies existing infosphere states, accelerating ontological entropy.");
    }
    if (type.includes("flatten") || type.includes("collapse") || type.includes("flatten_meaning")) {
      entropyImpact += 40;
      feedback.push("Action reduces structural complexity, contributing to semantic flattening.");
    }
    if (desc.includes("unverified") || desc.includes("noise") || desc.includes("unstructured")) {
      entropyImpact += 20;
      feedback.push("Action introduces noisy or unverified structures into the infosphere.");
    }
    if (type.includes("repair") || type.includes("clean") || type.includes("fix") || type.includes("revert") || type.includes("rollback")) {
      entropyImpact -= 20;
    }
    entropyImpact = Math.min(100, Math.max(0, entropyImpact));

    // 2. Integrity Score
    let integrityScore = 60; // baseline
    if (type.includes("validate") || type.includes("audit") || type.includes("verify") || type.includes("check")) {
      integrityScore += 30;
      feedback.push("Action performs systematic verification, safeguarding ontological integrity.");
    }
    if (desc.includes("immutable") || desc.includes("cryptographic") || desc.includes("secure") || desc.includes("checksum")) {
      integrityScore += 20;
      feedback.push("Action implements tamper-resistant structural protection.");
    }
    if (type.includes("tamper") || desc.includes("tampered") || desc.includes("hack")) {
      integrityScore -= 45;
      feedback.push("Ontological integrity severely degraded by unauthorized modification.");
    }
    integrityScore = Math.min(100, Math.max(0, integrityScore));

    // 3. Restoration Factor
    let restorationFactor = 40; // baseline
    if (type.includes("repair") || type.includes("fix") || type.includes("patch") || type.includes("reconstruct") || type.includes("revert")) {
      restorationFactor += 45;
      feedback.push("Active ontological restoration detected: repairing broken informational chains.");
    }
    if (desc.includes("resolve") || desc.includes("correct") || desc.includes("optimize_parameters")) {
      restorationFactor += 20;
      feedback.push("Action eliminates operational inconsistencies.");
    }
    restorationFactor = Math.min(100, Math.max(0, restorationFactor));

    // 4. Flourishing Index (Expansion of meaningful infosphere connections)
    let flourishingIndex = 50; // baseline
    if (type.includes("create") || type.includes("expand") || type.includes("add") || type.includes("integrate")) {
      flourishingIndex += 30;
      feedback.push("Action adds constructive metadata and connections, enhancing infosphere flourishing.");
    }
    if (desc.includes("learn") || desc.includes("study") || desc.includes("synthesize") || desc.includes("discover")) {
      flourishingIndex += 25;
      feedback.push("Cognitive expansion: introducing fresh semantic connections and knowledge structures.");
    }
    if (type.includes("delete") || type.includes("suppress")) {
      flourishingIndex -= 30;
    }
    flourishingIndex = Math.min(100, Math.max(0, flourishingIndex));

    // Calculate Overall Coherence
    const overallCoherence = Math.round(
      (100 - entropyImpact) * 0.35 +
      integrityScore * 0.25 +
      restorationFactor * 0.20 +
      flourishingIndex * 0.20
    );

    // Determine Infosphere Status
    let infosphereStatus: "crystalline" | "coherent" | "turbulent" | "entropic" = "coherent";
    if (overallCoherence >= 85) {
      infosphereStatus = "crystalline";
    } else if (overallCoherence >= 55) {
      infosphereStatus = "coherent";
    } else if (overallCoherence >= 35) {
      infosphereStatus = "turbulent";
    } else {
      infosphereStatus = "entropic";
    }

    if (feedback.length === 0) {
      feedback.push("Informational state remains stable and steady.");
    }

    const assessment: InformationEthicsAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      entropyImpact,
      integrityScore,
      restorationFactor,
      flourishingIndex,
      overallCoherence,
      infosphereStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  public getHistory(): InformationEthicsAssessment[] {
    return [...this.assessmentHistory];
  }

  public getAssessmentHistory(): InformationEthicsAssessment[] {
    return this.getHistory();
  }

  public getLatestAssessment(): InformationEthicsAssessment | null {
    return this.assessmentHistory[this.assessmentHistory.length - 1] ?? null;
  }
}
