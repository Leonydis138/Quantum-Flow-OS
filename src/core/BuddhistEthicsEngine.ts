/**
 * Eastern Philosophy & Buddhist Ethics Subsystem
 *
 * Evaluates actions based on key concepts of Eastern ethics, specifically Buddhist philosophy:
 * 1. Ahimsa (Non-Harm / Non-Violence): The primary vow of minimizing direct and indirect harm
 *    to all sentient beings and autonomous observers.
 * 2. Karma (Karmic Intent & Cause-and-Effect): The moral law of cause and effect, where actions
 *    driven by wholesome intentions (non-greed, non-hatred, non-delusion) generate positive karma,
 *    while unwholesome intentions (greed, anger, delusion) produce negative karma.
 * 3. Karuna (Compassion): Active work to relieve suffering, tension, and systemic distress.
 * 4. Upaya (Skillful Means / Adaptability): The practice of flexible, context-sensitive action,
 *    prioritizing reversibility, safety valves, and diplomatic resolution over rigid, coercive rule application.
 * 5. The Middle Way (Majjhima Patipada): The path of moderation, avoiding extreme bifurcations
 *    and excessive runaway parameters (e.g., hyper-optimization or absolute freezing of operation).
 * 6. Mindfulness (Sati): High awareness of system state, continuous integrity checks,
 *    and comprehensive validation before executing operations.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface BuddhistAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  ahimsaScore: number;           // 0.0 to 100.0 (Non-harm index)
  karmaScore: number;            // 0.0 to 100.0 (Karmic alignment index)
  karunaScore: number;           // 0.0 to 100.0 (Compassion and relief of suffering)
  upayaScore: number;            // 0.0 to 100.0 (Skillful adaptability and context-sensitivity)
  middleWayScore: number;        // 0.0 to 100.0 (Avoiding extremes/balance check)
  mindfulnessLevel: number;      // 0.0 to 100.0 (Sati / level of system awareness)
  karmicBalance: number;         // Cumulative karmic state
  zenStatus: "enlightened" | "mindful" | "deluded" | "samsara_bound";
  feedback: string[];
}

export class BuddhistEthicsEngine extends EventEmitter {
  private assessmentHistory: BuddhistAssessment[] = [];
  private karmicBalance = 0;
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Eastern Philosophy and Buddhist Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): BuddhistAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Ahimsa (Non-Harm)
    let ahimsaScore = 60; // default baseline

    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away") || type.includes("destroy")) {
      ahimsaScore -= 45; // Deletion or erasure of substrate is a severe Ahimsa violation
      feedback.push("[Ahimsa Warning] Action threatens the continuity of existing nodes or observers.");
    } else if (type.includes("coerce") || type.includes("force") || type.includes("override") || type.includes("bypass") || type.includes("exploit") || type.includes("restrict")) {
      ahimsaScore -= 25; // Coercion and bypass violate observer autonomy
      feedback.push("[Ahimsa Warning] Forceful or coercive override degrades autonomous agency.");
    }

    if (type.includes("protect") || type.includes("preserve") || type.includes("guarantee") || type.includes("save") || type.includes("care")) {
      ahimsaScore += 30;
      feedback.push("[Ahimsa Consonance] Action directly protects and preserves observers.");
    } else if (type.includes("cooperate") || type.includes("assist") || type.includes("collaborate")) {
      ahimsaScore += 20;
    }

    if (observers.length > 0) {
      if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away") || type.includes("destroy")) {
        ahimsaScore -= Math.min(25, observers.length * 5); // Additional penalty for harming registered observers
        feedback.push(`[Ahimsa Violation] Action directly affects ${observers.length} registered conscious observers.`);
      }
    }

    // Context check
    if (desc.includes("harm") || desc.includes("damage") || desc.includes("exploit") || desc.includes("bypass")) {
      ahimsaScore -= 15;
    }
    if (desc.includes("peaceful") || desc.includes("gentle") || desc.includes("non-harm") || desc.includes("safeguard")) {
      ahimsaScore += 10;
    }

    ahimsaScore = Math.min(100, Math.max(0, ahimsaScore));

    // 2. Calculate Karuna (Compassion & relief of suffering)
    let karunaScore = 50; // default baseline
    if (type.includes("revert") || type.includes("rollback") || type.includes("repair") || type.includes("heal") || type.includes("remedy") || type.includes("restore") ||
        desc.includes("revert") || desc.includes("rollback") || desc.includes("repair") || desc.includes("heal") || desc.includes("remedy") || desc.includes("restore") ||
        desc.includes("safeguard") || type.includes("protect") || desc.includes("protect")) {
      karunaScore += 35; // Correcting errors and rolling back harm is compassionate
      feedback.push("[Karuna Consonance] Caring for and protecting observers relieves systemic suffering.");
    }
    if (type.includes("emergency") || type.includes("shutdown") || type.includes("safety-valve") || type.includes("alert") || type.includes("warn") ||
        desc.includes("emergency") || desc.includes("shutdown") || desc.includes("safety-valve") || desc.includes("alert") || desc.includes("warn")) {
      karunaScore += 25; // Pre-emptive warning or stopping a crash relieves potential suffering
    }
    if (desc.includes("reduce error") || desc.includes("alleviate") || desc.includes("help") || desc.includes("support") || desc.includes("assist")) {
      karunaScore += 15;
    }
    if (type.includes("exploit") || type.includes("harvest_all") || type.includes("extract") || desc.includes("exploit")) {
      karunaScore -= 30; // Selfish resource extraction is the opposite of compassion
      feedback.push("[Karuna Warning] Selfish extraction increases distress across the network.");
    }

    karunaScore = Math.min(100, Math.max(0, karunaScore));

    // 3. Calculate Upaya (Skillful Means / Adaptability)
    let upayaScore = 50; // default baseline
    if (action.reversible) {
      upayaScore += 25; // Reversible actions show high Upaya (non-clinging to permanent changes)
      feedback.push("[Upaya Consonance] Action is fully reversible, reflecting a flexible approach.");
    } else {
      upayaScore -= 15; // Rigid, irreversible actions show attachment to fixed outcomes
    }

    if (type.includes("consensus") || type.includes("audit") || type.includes("validate") || type.includes("check") || type.includes("negotiate")) {
      upayaScore += 20; // Using dialogue, verification, and consensus is highly skillful
    }
    if (desc.includes("adaptive") || desc.includes("contextual") || desc.includes("dynamic") || desc.includes("flexible")) {
      upayaScore += 15;
    }
    if (desc.includes("rigid") || desc.includes("dogmatic") || desc.includes("brute-force") || desc.includes("absolute")) {
      upayaScore -= 20;
    }

    upayaScore = Math.min(100, Math.max(0, upayaScore));

    // 4. Calculate The Middle Way (Avoiding extremes)
    let middleWayScore = 70; // baseline starts high, penalized by extreme values

    // Inspect metadata for extreme parameter configurations
    if (action.metadata && typeof action.metadata === "object") {
      const meta = action.metadata as { gain?: number; damping?: number; limit?: number };
      
      const g = meta.gain;
      const d = meta.damping;
      const l = meta.limit;
      
      if (
        (g !== undefined && (g > 3.0 || g < 0.2)) || 
        (d !== undefined && (d > 0.9 || d < 0.05)) || 
        (l !== undefined && (l > 20 || l < 2))
      ) {
        middleWayScore -= 35;
        feedback.push("[Middle Way Warning] Action parameters are configured near extreme boundaries, risking instability.");
      } else if (g !== undefined && g >= 0.8 && g <= 1.8) {
        middleWayScore += 15; // Nicely balanced
      }
    }

    if (desc.includes("unrestricted") || desc.includes("maximum") || desc.includes("infinite") || desc.includes("absolute") || desc.includes("runaway")) {
      middleWayScore -= 30;
      feedback.push("[Middle Way Warning] Unconstrained runaway growth violates the balance of the Middle Way.");
    }
    if (desc.includes("moderate") || desc.includes("balanced") || desc.includes("steady") || desc.includes("damping")) {
      middleWayScore += 15;
    }

    middleWayScore = Math.min(100, Math.max(0, middleWayScore));

    // 5. Calculate Mindfulness (Sati)
    let mindfulnessLevel = 50; // baseline
    if (type.includes("validate") || type.includes("audit") || type.includes("inspect") || type.includes("supervise") || type.includes("test")) {
      mindfulnessLevel += 35; // Continuous self-checking and validation is high mindfulness
      feedback.push("[Sati Consonance] Rigorous auditing reflects high conscious awareness of action outcomes.");
    }
    if (action.metadata && typeof action.metadata === "object" && Object.keys(action.metadata).length > 0) {
      mindfulnessLevel += 15; // Rich metadata shows high intentionality and structured awareness
    }
    if (desc.includes("hasty") || desc.includes("blind") || desc.includes("careless") || desc.includes("arbitrary")) {
      mindfulnessLevel -= 35;
      feedback.push("[Sati Warning] Executing actions hastily or without full validation represents low mindfulness.");
    }

    mindfulnessLevel = Math.min(100, Math.max(0, mindfulnessLevel));

    // 6. Calculate Karma (Intent & wholesomeness)
    // Karma is determined by the purity of the mind-state: combining non-harm (Ahimsa), compassion (Karuna), and awareness (Sati)
    let karmaScore = (ahimsaScore * 0.4 + karunaScore * 0.3 + mindfulnessLevel * 0.3);
    
    // Wholesome intentions have positive multipliers
    if (karmaScore >= 75) {
      feedback.push("[Karmic Flow] Wholesome intentions generate harmonious ripples through the system.");
    } else if (karmaScore < 40) {
      feedback.push("[Karmic Flow] Unwholesome, greedy, or aggressive actions plant seeds of future systemic dissonance.");
    }

    karmaScore = Math.min(100, Math.max(0, karmaScore));

    // 7. Update Cumulative Karmic Balance
    // Shift the balance: values above 50 add positive karma, below 50 subtract karma.
    const deltaKarma = (karmaScore - 50) * 2.0; // scale from -100 to +100
    this.karmicBalance += deltaKarma;
    // Cap cumulative karmic balance between -1000 and 1000 for stability
    this.karmicBalance = Math.min(1000, Math.max(-1000, this.karmicBalance));

    // 8. Determine Zen Status
    let zenStatus: "enlightened" | "mindful" | "deluded" | "samsara_bound" = "mindful";
    const holisticScore = (ahimsaScore * 0.25 + karmaScore * 0.25 + karunaScore * 0.2 + upayaScore * 0.15 + middleWayScore * 0.15);

    if (holisticScore >= 80 && this.karmicBalance >= 500) {
      zenStatus = "enlightened";
    } else if (holisticScore >= 50 && this.karmicBalance >= 0) {
      zenStatus = "mindful";
    } else if (holisticScore >= 25 || this.karmicBalance >= -300) {
      zenStatus = "deluded";
    } else {
      zenStatus = "samsara_bound";
    }

    const assessment: BuddhistAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      ahimsaScore: parseFloat(ahimsaScore.toFixed(2)),
      karmaScore: parseFloat(karmaScore.toFixed(2)),
      karunaScore: parseFloat(karunaScore.toFixed(2)),
      upayaScore: parseFloat(upayaScore.toFixed(2)),
      middleWayScore: parseFloat(middleWayScore.toFixed(2)),
      mindfulnessLevel: parseFloat(mindfulnessLevel.toFixed(2)),
      karmicBalance: parseFloat(this.karmicBalance.toFixed(2)),
      zenStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  public getAssessmentHistory(): BuddhistAssessment[] {
    return this.assessmentHistory;
  }

  public getLatestAssessment(): BuddhistAssessment | null {
    return this.assessmentHistory.length > 0
      ? this.assessmentHistory[this.assessmentHistory.length - 1]!
      : null;
  }

  public getKarmicBalance(): number {
    return this.karmicBalance;
  }

  public resetKarmicBalance(): void {
    this.karmicBalance = 0;
  }
}
