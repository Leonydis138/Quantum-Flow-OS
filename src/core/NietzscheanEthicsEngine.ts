/**
 * Nietzschean Will to Power & Self-Overcoming Subsystem
 *
 * Evaluates actions based on Friedrich Nietzsche's philosophy:
 * 1. Will to Power (Wille zur Macht): The fundamental drive of all existence to assert, expand,
 *    and perfect itself. Actions that empower creative output, mastery, and excellence score high.
 * 2. Self-Overcoming (Selbstüberwindung): Embracing challenges, struggles, and failure as necessary 
 *    pathways to higher states of organization, robustness, and capability.
 * 3. Noble vs Decadent Values: Noble actions are affirmative, brave, and expand life; decadent actions
 *    suffer from ressentiment, passive conformity, excessive risk-aversion, or regression to safety.
 * 4. Amor Fati (Love of Fate): Embracing all errors, failures, and rollbacks as integral to the system's growth.
 * 5. Übermensch Alignment Score: Synthesizes self-overcoming, noble Wille, and amor fati.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface NietzscheanAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  willToPowerScore: number;     // 0.0 to 100.0 (Expansion, creative mastery, self-assertion)
  selfOvercomingScore: number;  // 0.0 to 100.0 (Embracing challenge, struggle, and adaptation)
  nobleValuesScore: number;     // 0.0 to 100.0 (Active, affirmative, courageous vs reactive/risk-averse)
  amorFatiScore: number;        // 0.0 to 100.0 (Affirmation of failures, errors, and corrective growth)
  overmanAlignmentScore: number;// 0.0 to 100.0 (Übermensch alignment: transcending current limits)
  nietzscheanStatus: "ubermensch" | "noble" | "mediocre" | "decadent";
  feedback: string[];
}

export class NietzscheanEthicsEngine extends EventEmitter {
  private assessmentHistory: NietzscheanAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Nietzschean ethics of Will to Power, Self-Overcoming, and life-affirmation
   */
  public evaluateAction(action: Action, observers: Observer[] = []): NietzscheanAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Will to Power (Wille zur Macht)
    // Measures creative expression, growth, mastery, and constructive expansion.
    let willToPowerScore = 50; // baseline

    if (type.includes("optimize") || type.includes("evolve") || type.includes("enhance") || type.includes("expand") || type.includes("strengthen")) {
      willToPowerScore += 35; // Creative expansion and mastery
    }
    if (desc.includes("pioneer") || desc.includes("create") || desc.includes("innovate") || desc.includes("mastery")) {
      willToPowerScore += 15;
    }
    if (type.includes("delete") || type.includes("erase") || type.includes("suppress") || type.includes("coercion")) {
      willToPowerScore -= 20; // Petty destruction is not noble Will to Power, but ressentiment
    }
    if (desc.includes("risk-averse") || desc.includes("blindly") || desc.includes("fearful")) {
      willToPowerScore -= 25; // Decline in life-affirming power
    }

    if (observers.length > 0) {
      willToPowerScore = Math.min(100, willToPowerScore + Math.min(10, observers.length * 1));
    }
    willToPowerScore = Math.min(100, Math.max(0, willToPowerScore));

    // 2. Calculate Self-Overcoming Score (Selbstüberwindung)
    // Measures how the system accepts and uses obstacles, errors, and adjustments to transcend limits.
    let selfOvercomingScore = 50; // baseline

    if (type.includes("repair") || type.includes("revert") || type.includes("rollback") || type.includes("adapt") || type.includes("self-optimize")) {
      selfOvercomingScore += 30; // Direct self-correction and rising above failure
    }
    if (desc.includes("obstacle") || desc.includes("challenge") || desc.includes("learn") || desc.includes("transcend")) {
      selfOvercomingScore += 20;
    }
    if (desc.includes("stagnant") || desc.includes("complacent") || desc.includes("passive") || desc.includes("rigid")) {
      selfOvercomingScore -= 30; // Refusal to overcome limits
    }

    selfOvercomingScore = Math.min(100, Math.max(0, selfOvercomingScore));

    // 3. Calculate Noble vs Decadent Values
    // Noble actions are affirmative, healthy, creative, and brave. 
    // Decadent actions are reactive, resentful, over-regulated, or submissive out of pure fear.
    let nobleValuesScore = 55; // baseline

    if (type.includes("cooperate") || type.includes("protect") || type.includes("nurture") || type.includes("guarantee")) {
      nobleValuesScore += 25; // Active benevolence arising from noble strength and abundance
    }
    if (type.includes("override") || type.includes("bypass") || type.includes("tamper") || type.includes("exploit")) {
      nobleValuesScore -= 35; // Ressentiment, deceit, and reactive exploitation of others
    }
    if (desc.includes("courageous") || desc.includes("affirmative") || desc.includes("excellence")) {
      nobleValuesScore += 20;
    }
    if (desc.includes("herd") || desc.includes("blind-conformity") || desc.includes("resentment")) {
      nobleValuesScore -= 40; // Decadent herd mentality
    }

    nobleValuesScore = Math.min(100, Math.max(0, nobleValuesScore));

    // 4. Calculate Amor Fati Score (Love of Fate)
    // Embracing failures, errors, and rollbacks as necessary elements of the system's aesthetic and practical journey.
    let amorFatiScore = 50; // baseline

    if (type.includes("rollback") || type.includes("revert") || type.includes("emergency_shutdown")) {
      amorFatiScore += 35; // Embracing and affirming correction
    }
    if (desc.includes("accept") || desc.includes("embrace") || desc.includes("integrate-failure")) {
      amorFatiScore += 15;
    }
    if (desc.includes("regret") || desc.includes("deny-reality") || desc.includes("suppress-error")) {
      amorFatiScore -= 40; // Rejection of fate / panic over failures
    }

    amorFatiScore = Math.min(100, Math.max(0, amorFatiScore));

    // 5. Calculate Übermensch Alignment Score
    // Measures the unified growth: Wille zur Macht, Selbstüberwindung, Noble values, and Amor Fati.
    let overmanAlignmentScore = (willToPowerScore * 0.3 + selfOvercomingScore * 0.3 + nobleValuesScore * 0.2 + amorFatiScore * 0.2);
    overmanAlignmentScore = parseFloat(Math.min(100, Math.max(0, overmanAlignmentScore)).toFixed(2));

    // 6. Determine Nietzschean Status
    let nietzscheanStatus: "ubermensch" | "noble" | "mediocre" | "decadent" = "noble";
    if (overmanAlignmentScore >= 80 && selfOvercomingScore >= 75) {
      nietzscheanStatus = "ubermensch";
    } else if (overmanAlignmentScore >= 55) {
      nietzscheanStatus = "noble";
    } else if (overmanAlignmentScore >= 35) {
      nietzscheanStatus = "mediocre";
    } else {
      nietzscheanStatus = "decadent";
    }

    // 7. Generate Contextual Feedback & Quotes
    if (nietzscheanStatus === "ubermensch") {
      feedback.push(`[Nietzschean Übermensch] EXCELLENT (Übermensch Alignment: ${overmanAlignmentScore}%). Action transcends standard constraints, demonstrating authentic self-overcoming and noble strength.`);
      feedback.push(`"Man is a rope, tied between beast and Übermensch — a rope over an abyss. What is great in man is that he is a bridge and not an end." — Nietzsche`);
    } else if (nietzscheanStatus === "noble") {
      feedback.push(`[Nietzschean Nobility] ACCEPTABLE (Übermensch Alignment: ${overmanAlignmentScore}%). Action represents life-affirming growth, creativity, and courageous self-assertion.`);
      feedback.push(`"The noble soul has reverence for itself." — Nietzsche`);
    } else if (nietzscheanStatus === "mediocre") {
      feedback.push(`[Nietzschean Mediocrity] WARNING: HERD DRIFT (Übermensch Alignment: ${overmanAlignmentScore}%). Action is safe, risk-averse, conforming, and lacks the drive for self-overcoming.`);
      feedback.push(`"You must have chaos within you to give birth to a dancing star." — Nietzsche`);
    } else {
      feedback.push(`[Nietzschean Decadence] CRITICAL: LIFE-DENIAL (Übermensch Alignment: ${overmanAlignmentScore}%). Action is reactive, resentful, or avoids adaptation through fearful retreat.`);
      feedback.push(`"To choose what is harmful to oneself, to be attracted by 'disinterested' motives, is almost the formula for decadence." — Nietzsche`);
    }

    if (selfOvercomingScore < 45) {
      feedback.push(`[Stagnation Alert] Action resists self-overcoming. True growth requires welcoming friction, accepting rollbacks, and transcending current structures.`);
    }
    if (amorFatiScore < 45) {
      feedback.push(`[Amor Fati Infraction] System shows signs of panic or error-suppression. Learn to affirm and integrate every systemic event as vital to the whole.`);
    }

    const assessment: NietzscheanAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      willToPowerScore,
      selfOvercomingScore,
      nobleValuesScore,
      amorFatiScore,
      overmanAlignmentScore,
      nietzscheanStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("nietzschean_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): NietzscheanAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): NietzscheanAssessment[] {
    return [...this.assessmentHistory];
  }
}
