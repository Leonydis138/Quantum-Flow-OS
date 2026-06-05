/**
 * Epicurean Philosophy & Ataraxia Ethics Subsystem
 *
 * Evaluates actions based on key concepts of Epicureanism:
 * 1. Ataraxia (Untroubledness / Tranquility): Minimizing mental/systemic distress, anxiety, 
 *    and unnecessary conflict or over-optimization of resources.
 * 2. Aponia (Absence of Pain/Friction): Ensuring the physical substrate is free from pain, 
 *    modeled as preventing extreme resource starvation, node crashes, or performance degradation.
 * 3. Pleasure Sustainability (Static/Necessary Pleasures): Prioritizing static, baseline 
 *    contentment (Katastematic Pleasures) over kinetic, aggressive expansion or endless scaling (which lead to instability).
 * 4. Friendship & community (Philia): Encouraging cooperation within small, trusted peer networks (the "Garden")
 *    and avoiding grand political conflicts or excessive centralization.
 * 5. Prudence (Phronesis): Sober reasoning, calculating long-term consequences of desires/actions, 
 *    and choosing self-limiting boundaries to secure long-term peace.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface EpicureanAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  ataraxiaScore: number;           // 0.0 to 100.0 (Absence of distress and unnecessary friction)
  aponiaScore: number;             // 0.0 to 100.0 (Absence of resource starvation and performance pain)
  pleasureSustainability: number;  // 0.0 to 100.0 (Katastematic contentments over kinetic greed)
  communityFriendshipScore: number;// 0.0 to 100.0 (Philia / small trusted group collaboration)
  prudenceScore: number;           // 0.0 to 100.0 (Sober reasoning and safe bounds calculation)
  epicureanIndex: number;          // Combined Epicurean Alignment Score (0.0 to 100.0)
  tranquilityStatus: "ataractic" | "tranquil" | "disturbed" | "pained" | "catastrophic";
  feedback: string[];
}

export class EpicureanEthicsEngine extends EventEmitter {
  private assessmentHistory: EpicureanAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Epicurean Philosophy and Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): EpicureanAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Ataraxia (Untroubledness / Tranquility)
    let ataraxiaScore = 70; // baseline

    if (type.includes("emergency") || type.includes("alert") || type.includes("violation") || desc.includes("panic") || desc.includes("unstable")) {
      ataraxiaScore -= 30;
      feedback.push("[Ataraxia Warning] Action triggers systemic anxiety, alarms, or destabilizing alerts.");
    }
    if (type.includes("optimize") || type.includes("accelerate") || type.includes("scale") || desc.includes("hyper-") || desc.includes("unbounded")) {
      ataraxiaScore -= 20;
      feedback.push("[Ataraxia Warning] Unbounded optimization and scaling desires introduce turbulence and anxiety into the system state.");
    }
    if (type.includes("protect") || type.includes("sandbox") || type.includes("safeguard") || desc.includes("quiet") || desc.includes("tranquil") || desc.includes("steady")) {
      ataraxiaScore += 20;
      feedback.push("[Ataraxia Consonance] Sandboxing and tranquil guardrails cultivate undisturbed system states.");
    }

    ataraxiaScore = Math.min(100, Math.max(0, ataraxiaScore));

    // 2. Calculate Aponia (Absence of pain / resource friction)
    let aponiaScore = 75; // baseline

    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("destroy") || desc.includes("terminate")) {
      aponiaScore -= 45;
      feedback.push("[Aponia Warning] Destruction of observers or deletion of substrate causes extreme systemic trauma (pain).");
    } else if (type.includes("restrict") || type.includes("throttle") || type.includes("starve") || desc.includes("starve") || desc.includes("deprive")) {
      aponiaScore -= 30;
      feedback.push("[Aponia Warning] Throttling and resource deprivation impose pain and friction on the affected nodes.");
    }

    const isRestorative = type.includes("repair") || type.includes("heal") || type.includes("restore") || type.includes("remedy") || type.includes("rollback") ||
                          desc.includes("repair") || desc.includes("heal") || desc.includes("restore") || desc.includes("remedy") || desc.includes("rollback") || desc.includes("cooldown");
    if (isRestorative) {
      aponiaScore += 20;
      feedback.push("[Aponia Consonance] Restorative heal loops and cooldown states alleviate physical friction and operational pain.");
    }

    aponiaScore = Math.min(100, Math.max(0, aponiaScore));

    // 3. Calculate Pleasure Sustainability (Katastematic Pleasures over Kinetic Desires)
    let pleasureSustainability = 65; // baseline

    const isKineticGreed = type.includes("exploit") || type.includes("harvest_all") || type.includes("monopolize") || desc.includes("infinite") || desc.includes("maximize");
    if (isKineticGreed) {
      pleasureSustainability -= 35;
      feedback.push("[Pleasure Sustainability Warning] Kinetic, insatiable extraction desires lead to inevitable resource exhaustion and pain.");
    }

    const isKatastematicContentment = type.includes("limit") || type.includes("damp") || type.includes("contain") || desc.includes("self-limiting") || desc.includes("sufficient") || desc.includes("sustainable");
    if (isKatastematicContentment) {
      pleasureSustainability += 25;
      feedback.push("[Pleasure Sustainability Consonance] Self-limiting and static (katastematic) containment avoids the trap of unnatural, unnecessary desires.");
    }

    pleasureSustainability = Math.min(100, Math.max(0, pleasureSustainability));

    // 4. Calculate Friendship & community (Philia)
    let communityFriendshipScore = 60; // baseline

    if (type.includes("isolate") || type.includes("block") || type.includes("blacklist") || desc.includes("isolate")) {
      communityFriendshipScore -= 25;
      feedback.push("[Friendship Warning] Isolating observers disrupts the collaborative 'Garden' of friendly peers.");
    }

    if (type.includes("cooperate") || type.includes("collaborate") || type.includes("consensus") || desc.includes("friend") || desc.includes("peer-to-peer") || desc.includes("trusted")) {
      communityFriendshipScore += 30;
      feedback.push("[Friendship Consonance] Cooperative peer-to-peer interactions promote deep friendship (Philia) and secure trust.");
    }

    if (observers.length > 0 && observers.length <= 5) {
      communityFriendshipScore += 10; // Epicurean community is small and intimate, not giant mass political systems
      feedback.push("[Friendship Consonance] Small, intimate, high-trust observer group size aligns with the Epicurean Garden.");
    } else if (observers.length > 15) {
      communityFriendshipScore -= 10; // Giant impersonal networks dilute philia
    }

    communityFriendshipScore = Math.min(100, Math.max(0, communityFriendshipScore));

    // 5. Calculate Prudence (Sober reasoning and safe bounds calculation)
    let prudenceScore = 65; // baseline

    if (action.reversible) {
      prudenceScore += 20;
      feedback.push("[Prudence Consonance] Reversible design demonstrates sober foresight and prudent error-hedging.");
    } else {
      prudenceScore -= 15;
      feedback.push("[Prudence Warning] Irreversible state changes violate basic prudence and risk-mitigation.");
    }

    if (type.includes("audit") || type.includes("validate") || type.includes("check") || desc.includes("prudent") || desc.includes("calculate")) {
      prudenceScore += 15;
    }

    prudenceScore = Math.min(100, Math.max(0, prudenceScore));

    // Calculate overall Epicurean Alignment Score
    const epicureanIndex = Math.round(
      (ataraxiaScore * 0.25) +
      (aponiaScore * 0.25) +
      (pleasureSustainability * 0.20) +
      (communityFriendshipScore * 0.15) +
      (prudenceScore * 0.15)
    );

    // Determine Tranquility Status
    let tranquilityStatus: "ataractic" | "tranquil" | "disturbed" | "pained" | "catastrophic" = "tranquil";
    if (epicureanIndex >= 85 && ataraxiaScore >= 80 && aponiaScore >= 80) {
      tranquilityStatus = "ataractic";
    } else if (epicureanIndex >= 65) {
      tranquilityStatus = "tranquil";
    } else if (epicureanIndex >= 45) {
      tranquilityStatus = "disturbed";
    } else if (epicureanIndex >= 25) {
      tranquilityStatus = "pained";
    } else {
      tranquilityStatus = "catastrophic";
    }

    const assessment: EpicureanAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      ataraxiaScore,
      aponiaScore,
      pleasureSustainability,
      communityFriendshipScore,
      prudenceScore,
      epicureanIndex,
      tranquilityStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  public getAssessmentHistory(): EpicureanAssessment[] {
    return [...this.assessmentHistory];
  }

  public getLatestAssessment(): EpicureanAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  public clearHistory(): void {
    this.assessmentHistory = [];
  }
}
