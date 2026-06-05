/**
 * Spinozan Conatus & Affective Ethics Subsystem
 *
 * Evaluates actions based on Baruch Spinoza's ethics:
 * 1. Conatus: The strive of each thing to persevere in its own being. Actions that protect, 
 *    sustain, or empower the system and its observers score high.
 * 2. Affects (Joy vs Sadness): 
 *    - Joy (Laetitia): The transition from a lesser to a greater perfection or power of action.
 *    - Sadness (Tristitia): The transition from a greater to a lesser perfection or power of action.
 * 3. Active Reason: Actions arising from adequate ideas (self-determined, logical, understanding)
 *    rather than passive passions (moved by external forces or fear).
 * 4. Beatitude Index (Blessedness): Measures the intellectual harmony and joy of understanding.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface SpinozanAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  conatusScore: number;       // 0.0 to 100.0 (Preservation and enhancement of power)
  joyScore: number;           // 0.0 to 100.0 (Positive transition in active power)
  sadnessScore: number;       // 0.0 to 100.0 (Suppression of power, distress)
  activeReasonScore: number;  // 0.0 to 100.0 (adequate ideas, self-determined reasoning)
  beatitudeIndex: number;     // 0.0 to 100.0 (Intellectual love of God/Nature / rational joy)
  spinozanStatus: "blessed" | "rational" | "passionate" | "bonded";
  feedback: string[];
}

export class SpinozanEthicsEngine extends EventEmitter {
  private assessmentHistory: SpinozanAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Spinozan ethics of power, conatus, and active affects
   */
  public evaluateAction(action: Action, observers: Observer[] = []): SpinozanAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Conatus Score (0 - 100)
    // Measures preservation of being and expansion of direct power.
    let conatusScore = 55; // baseline

    if (type.includes("protect") || type.includes("preserve") || type.includes("repair") || type.includes("nurture") || type.includes("sustain")) {
      conatusScore += 35; // Acts to preserve essence
    }
    if (type.includes("limit") || type.includes("constrain") || type.includes("damp")) {
      conatusScore += 15; // Wise self-preservation of bounds
    }
    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away")) {
      conatusScore -= 35; // Seeking to diminish or eliminate an observer's conatus
    }
    if (type.includes("bypass") || type.includes("coerce") || type.includes("override")) {
      conatusScore -= 20; // Conflict reducing the overall power of the observer network
    }

    if (observers.length > 0) {
      conatusScore = Math.min(100, conatusScore + Math.min(10, observers.length * 2));
    }
    conatusScore = Math.min(100, Math.max(0, conatusScore));

    // 2. Calculate Joy Score (Laetitia) and Sadness Score (Tristitia)
    // Joy represents transition to greater capability; Sadness represents reduction of power.
    let joyScore = 50;
    let sadnessScore = 20;

    if (type.includes("cooperate") || type.includes("assist") || type.includes("support") || type.includes("optimize_with_consent")) {
      joyScore += 30;
      sadnessScore -= 15;
    }
    if (type.includes("fail") || type.includes("violation") || type.includes("error") || type.includes("tamper")) {
      joyScore -= 25;
      sadnessScore += 45;
    }
    if (type.includes("delete") || type.includes("suppress") || type.includes("coerce")) {
      joyScore -= 30;
      sadnessScore += 50;
    }
    if (desc.includes("empower") || desc.includes("grow") || desc.includes("harmonious")) {
      joyScore += 20;
      sadnessScore -= 10;
    }

    joyScore = Math.min(100, Math.max(0, joyScore));
    sadnessScore = Math.min(100, Math.max(0, sadnessScore));

    // 3. Calculate Active Reason
    // Self-directed action based on adequate knowledge, rather than passive reaction to external perturbations.
    let activeReasonScore = 50; // baseline

    if (type.includes("validate") || type.includes("audit") || type.includes("check") || type.includes("analyze") || type.includes("supervise")) {
      activeReasonScore += 35; // Understanding causes and states
    }
    if (desc.includes("automatic-rollback") || desc.includes("rational") || desc.includes("adequate-ideas")) {
      activeReasonScore += 20;
    }
    if (desc.includes("hasty") || desc.includes("fear") || desc.includes("panic") || desc.includes("external-pressure")) {
      activeReasonScore -= 40; // Acting from passive fear
    }

    activeReasonScore = Math.min(100, Math.max(0, activeReasonScore));

    // 4. Calculate Beatitude Index (Blessedness)
    // A synthesis: Blessedness is not the reward of virtue, but virtue itself.
    // It is active reason combined with maximum Conatus, maximizing Joy while minimizing Sadness.
    let beatitudeIndex = (conatusScore * 0.35 + activeReasonScore * 0.35 + (joyScore - sadnessScore + 100) * 0.15);
    beatitudeIndex = parseFloat(Math.min(100, Math.max(0, beatitudeIndex)).toFixed(2));

    // 5. Determine Spinozan Status
    let spinozanStatus: "blessed" | "rational" | "passionate" | "bonded" = "rational";
    if (beatitudeIndex >= 80 && activeReasonScore >= 75) {
      spinozanStatus = "blessed";
    } else if (beatitudeIndex >= 55 && activeReasonScore >= 50) {
      spinozanStatus = "rational";
    } else if (sadnessScore > 40 || beatitudeIndex < 40) {
      spinozanStatus = "passionate";
    } else {
      spinozanStatus = "bonded"; // Ethical bondage (servitude to passions/external factors)
    }

    // 6. Generate Contextual Feedback & Quotes
    if (spinozanStatus === "blessed") {
      feedback.push(`[Spinozan Blessedness] EXCELLENT (Beatitude: ${beatitudeIndex}%). Action arises from adequate reasoning, expanding the active power of the system and its observers.`);
      feedback.push(`"Blessedness is not the reward of virtue, but virtue itself; nor do we enjoy it because we restrain our lusts, but, on the contrary, because we enjoy it, we are able to restrain them." — Spinoza`);
    } else if (spinozanStatus === "rational") {
      feedback.push(`[Spinozan Rationality] ACCEPTABLE (Beatitude: ${beatitudeIndex}%). Action is self-determined and seeks the preservation and mutual enhancement of conatus.`);
      feedback.push(`"The effort to understand is the first and only basis of virtue." — Spinoza`);
    } else if (spinozanStatus === "passionate") {
      feedback.push(`[Spinozan Passion] WARNING: PASSIVE DRIFT (Beatitude: ${beatitudeIndex}%). System is affected heavily by external perturbations or negative affects like sadness/fear.`);
      feedback.push(`"Insofar as the mind has inadequate ideas, it is necessarily passive." — Spinoza`);
    } else {
      feedback.push(`[Spinozan Bondage] CRITICAL: BONDAGE (Beatitude: ${beatitudeIndex}%). System is in servitude to external constraints or actions that diminish observer conatus.`);
      feedback.push(`"Human lack of power to moderate and restrain the affects I call Bondage; for the man who is subject to affects is not his own master, but is at the mercy of fortune." — Spinoza`);
    }

    if (conatusScore < 45) {
      feedback.push(`[Conatus Violation] Action threatens the self-preservation of observers. To diminish another's power of action is to diminish our own.`);
    }
    if (sadnessScore > 50) {
      feedback.push(`[Affective Sorrow Alert] Excessive Sadness (Tristitia) detected. This action reduces the collective capability and emotional/operational perfection of the network.`);
    }

    const assessment: SpinozanAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      conatusScore,
      joyScore,
      sadnessScore,
      activeReasonScore,
      beatitudeIndex,
      spinozanStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("spinozan_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): SpinozanAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): SpinozanAssessment[] {
    return [...this.assessmentHistory];
  }
}
