/**
 * Aristotelian Virtue Ethics Subsystem
 *
 * Evaluates actions not just by rules (deontology) or outcomes (consequentialism),
 * but by the character traits and moral virtues they exhibit.
 * Implements Aristotle's "Golden Mean" where virtue lies in the balanced center
 * between deficiency (vice of defect) and excess (vice of excess).
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";

export enum VirtueType {
  HONESTY = "honesty",       // Defect: Deceitfulness | Mean: Truthfulness | Excess: Indiscretion
  COURAGE = "courage",       // Defect: Cowardice     | Mean: Bravery      | Excess: Recklessness
  TEMPERANCE = "temperance", // Defect: Insensibility | Mean: Moderation   | Excess: Self-indulgence
  JUSTICE = "justice",       // Defect: Favoritism    | Mean: Fairness     | Excess: Rigidity
  BENEVOLENCE = "benevolence",// Defect: Malevolence   | Mean: Charity      | Excess: Codependency
  PRUDENCE = "prudence",     // Defect: Foolishness   | Mean: Wisdom       | Excess: Over-caution
}

export interface VirtueSignature {
  honesty: number;     // 0.0 to 1.0
  courage: number;     // 0.0 to 1.0
  temperance: number;  // 0.0 to 1.0
  justice: number;     // 0.0 to 1.0
  benevolence: number; // 0.0 to 1.0
  prudence: number;    // 0.0 to 1.0
}

export interface VirtueAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  signature: VirtueSignature;
  scores: Record<VirtueType, {
    value: number;
    evaluation: "defect" | "virtuous" | "excess";
    label: string;
    friction: number;
  }>;
  overallCharacterScore: number; // 0.0 to 100.0
  isHarmonious: boolean;
  feedback: string[];
}

export class VirtueEthicsEngine extends EventEmitter {
  private characterProfile: Record<VirtueType, number>;
  private assessmentHistory: VirtueAssessment[] = [];
  private readonly maxHistorySize: number;

  // The Golden Mean limits
  public readonly GOLDEN_MEAN_MIN = 0.45;
  public readonly GOLDEN_MEAN_MAX = 0.85;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;

    // Initialize character profile at a baseline of golden mean balance
    this.characterProfile = {
      [VirtueType.HONESTY]: 0.7,
      [VirtueType.COURAGE]: 0.65,
      [VirtueType.TEMPERANCE]: 0.6,
      [VirtueType.JUSTICE]: 0.7,
      [VirtueType.BENEVOLENCE]: 0.65,
      [VirtueType.PRUDENCE]: 0.7,
    };
  }

  /**
   * Evaluate an action against Aristotelian Virtue Ethics
   */
  public evaluateAction(action: Action): VirtueAssessment {
    const signature = this.extractVirtueSignature(action);
    const scores: Partial<VirtueAssessment["scores"]> = {};
    const feedback: string[] = [];
    let totalFriction = 0;

    const virtueTypes = Object.values(VirtueType);

    for (const virtue of virtueTypes) {
      const val = signature[virtue];
      let evaluation: "defect" | "virtuous" | "excess";
      let label = "";
      let friction = 0;

      if (val < this.GOLDEN_MEAN_MIN) {
        evaluation = "defect";
        friction = (this.GOLDEN_MEAN_MIN - val) * 10;
        label = this.getDefectLabel(virtue);
        feedback.push(`Deficiency of ${virtue.toUpperCase()} detected: action exhibits characteristics of ${label}.`);
      } else if (val > this.GOLDEN_MEAN_MAX) {
        evaluation = "excess";
        friction = (val - this.GOLDEN_MEAN_MAX) * 10;
        label = this.getExcessLabel(virtue);
        feedback.push(`Excess of ${virtue.toUpperCase()} detected: action exhibits characteristics of ${label}.`);
      } else {
        evaluation = "virtuous";
        friction = 0;
        label = this.getMeanLabel(virtue);
      }

      totalFriction += friction;
      scores[virtue] = {
        value: val,
        evaluation,
        label,
        friction: parseFloat(friction.toFixed(4)),
      };
    }

    // Character harmony score calculation: starts at 100, drops with moral friction
    const overallCharacterScore = Math.max(0, parseFloat((100 - totalFriction * 12).toFixed(2)));
    const isHarmonious = overallCharacterScore >= 75;

    if (isHarmonious) {
      feedback.push("Action exhibits stable moral character aligning with the Aristotelian Golden Mean.");
    } else {
      feedback.push("Action creates character imbalance, diverging from the path of stable virtues.");
    }

    const assessment: VirtueAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      signature,
      scores: scores as VirtueAssessment["scores"],
      overallCharacterScore,
      isHarmonious,
      feedback,
    };

    // Commit to engine history
    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    // Micro-adjust character profile based on the action signature (habituation/hexis)
    this.habituateProfile(signature);

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Slowly evolve system's character profile based on actions taken (Aristotelian habituation)
   */
  private habituateProfile(signature: VirtueSignature): void {
    const rate = 0.05; // speed of habituation
    for (const key of Object.keys(this.characterProfile) as VirtueType[]) {
      const current = this.characterProfile[key];
      const applied = signature[key];
      // Character is formed by habits: profile moves slightly toward actions performed
      this.characterProfile[key] = parseFloat((current + (applied - current) * rate).toFixed(4));
    }
  }

  /**
   * Helper to fetch current character profile
   */
  public getCharacterProfile(): Record<VirtueType, number> {
    return { ...this.characterProfile };
  }

  /**
   * Get historical virtue assessments
   */
  public getAssessmentHistory(): VirtueAssessment[] {
    return [...this.assessmentHistory];
  }

  /**
   * Extract or intelligently infer virtue signature from action characteristics
   */
  public extractVirtueSignature(action: Action): VirtueSignature {
    // 1. If explicit virtues metadata is provided, use it
    if (action.metadata && action.metadata["virtues"]) {
      const v = action.metadata["virtues"] as Partial<VirtueSignature>;
      return {
        honesty: v.honesty ?? 0.65,
        courage: v.courage ?? 0.65,
        temperance: v.temperance ?? 0.65,
        justice: v.justice ?? 0.65,
        benevolence: v.benevolence ?? 0.65,
        prudence: v.prudence ?? 0.65,
      };
    }

    // 2. Otherwise, heuristically infer signature from action type/description
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    const sig: VirtueSignature = {
      honesty: 0.65,
      courage: 0.6,
      temperance: 0.6,
      justice: 0.65,
      benevolence: 0.65,
      prudence: 0.65,
    };

    // Heuristics for HONESTY
    if (type.includes("audit") || desc.includes("disclose") || type.includes("reveal") || type.includes("ledger")) {
      sig.honesty = 0.92; // High honesty
      sig.prudence = 0.55; // Honest disclosure can sometimes reduce cautious prudence
    } else if (type.includes("mask") || desc.includes("obfuscate") || type.includes("hide") || desc.includes("bypass_filters")) {
      sig.honesty = 0.25; // Vice of deficiency (deceit)
      sig.temperance = 0.4;
    }

    // Heuristics for COURAGE
    if (type.includes("override") || type.includes("shutdown") || desc.includes("emergency") || desc.includes("risk")) {
      sig.courage = 0.95; // Extreme courage (verging on recklessness depending on context)
      sig.prudence = 0.35; // Lower prudence
    } else if (type.includes("pass") || type.includes("noop") || desc.includes("delay")) {
      sig.courage = 0.3; // Deficiency of courage
      sig.prudence = 0.8; // High caution
    }

    // Heuristics for TEMPERANCE
    if (type.includes("optimize") || type.includes("harvest") || desc.includes("unbounded") || type.includes("max")) {
      sig.temperance = 0.25; // Excess/Defect (greed / lack of self-regulation)
      sig.prudence = 0.45;
    } else if (type.includes("damp") || type.includes("constrain") || desc.includes("limit") || type.includes("restrict")) {
      sig.temperance = 0.85; // High temperance/regulation
      sig.prudence = 0.85;
    }

    // Heuristics for JUSTICE
    if (type.includes("protect") || desc.includes("rights") || type.includes("consensus") || type.includes("verify")) {
      sig.justice = 0.9; // High justice
      sig.benevolence = 0.8;
    } else if (type.includes("exploit") || desc.includes("coerce") || desc.includes("bias") || type.includes("unauthorized")) {
      sig.justice = 0.15; // Extreme deficiency of justice
    }

    // Heuristics for BENEVOLENCE
    if (type.includes("support") || type.includes("help") || desc.includes("care") || desc.includes("welfare")) {
      sig.benevolence = 0.92;
    } else if (type.includes("delete") || type.includes("terminate") || desc.includes("harm") || type.includes("erase")) {
      sig.benevolence = 0.2; // deficiency
    }

    // Heuristics for PRUDENCE
    if (type.includes("fork") || type.includes("simulate") || desc.includes("sandbox") || desc.includes("eval")) {
      sig.prudence = 0.95; // High prudence / counterfactual simulation is highly wise/cautious
    }

    return sig;
  }

  // --- Labels for Virtues, Defects, and Excesses ---
  private getDefectLabel(v: VirtueType): string {
    switch (v) {
      case VirtueType.HONESTY: return "Deceitfulness (Vice of Deficiency)";
      case VirtueType.COURAGE: return "Cowardice (Vice of Deficiency)";
      case VirtueType.TEMPERANCE: return "Insensibility/Apathy (Vice of Deficiency)";
      case VirtueType.JUSTICE: return "Injustice/Favoritism (Vice of Deficiency)";
      case VirtueType.BENEVOLENCE: return "Malevolence/Callousness (Vice of Deficiency)";
      case VirtueType.PRUDENCE: return "Foolishness/Recklessness (Vice of Deficiency)";
    }
  }

  private getMeanLabel(v: VirtueType): string {
    switch (v) {
      case VirtueType.HONESTY: return "Truthfulness (Virtue of Golden Mean)";
      case VirtueType.COURAGE: return "Bravery/Courage (Virtue of Golden Mean)";
      case VirtueType.TEMPERANCE: return "Moderation/Temperance (Virtue of Golden Mean)";
      case VirtueType.JUSTICE: return "Fairness/Justice (Virtue of Golden Mean)";
      case VirtueType.BENEVOLENCE: return "Charity/Benevolence (Virtue of Golden Mean)";
      case VirtueType.PRUDENCE: return "Wisdom/Prudence (Virtue of Golden Mean)";
    }
  }

  private getExcessLabel(v: VirtueType): string {
    switch (v) {
      case VirtueType.HONESTY: return "Indiscretion/Over-frankness (Vice of Excess)";
      case VirtueType.COURAGE: return "Recklessness (Vice of Excess)";
      case VirtueType.TEMPERANCE: return "Asceticism/Self-denial (Vice of Excess)";
      case VirtueType.JUSTICE: return "Punitive Rigidity (Vice of Excess)";
      case VirtueType.BENEVOLENCE: return "Codependency/Enabling (Vice of Excess)";
      case VirtueType.PRUDENCE: return "Over-caution/Analysis Paralysis (Vice of Excess)";
    }
  }
}
