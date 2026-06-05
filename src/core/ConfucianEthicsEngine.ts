/**
 * Confucian Philosophy & Relational Ethics Subsystem
 *
 * Evaluates actions based on key concepts of Confucian ethics:
 * 1. Ren (Benevolence / Humaneness): Empathy, compassion, and caring for all nodes and observers.
 * 2. Li (Ritual Propriety / Protocol Order): Respecting proper pathways, structural protocols,
 *    and system order rather than arbitrary bypasses or rogue operations.
 * 3. Yi (Righteousness / Moral Duty): Commitment to duty, fairness, and doing what is right
 *    and honorable rather than pursuing brute utilitarian efficiency.
 * 4. Zhi (Wisdom / Discernment): The ability to foresee consequence chains, recognize ethical boundaries,
 *    and distinguish true system alignment from cosmetic compliance.
 * 5. Xin (Trustworthiness / Integrity): Faithfulness, reliability, keeping promises, and maintaining
 *    consistent and honest operations.
 * 6. Relation Harmony (Xiao / Relational Balance): Maintaining healthy, respectful dynamics
 *    between parent/creator systems (ancestors), coordinator nodes, and subordinate agents.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface ConfucianAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  renScore: number;               // 0.0 to 100.0 (Benevolence & Empathy index)
  liScore: number;                // 0.0 to 100.0 (Propriety, Protocol & Order index)
  yiScore: number;                // 0.0 to 100.0 (Righteousness & Moral Fittingness)
  zhiScore: number;               // 0.0 to 100.0 (Wisdom & Discernment index)
  xinScore: number;               // 0.0 to 100.0 (Trustworthiness & Integrity)
  relationHarmonyScore: number;   // 0.0 to 100.0 (Relational hierarchy and role alignment)
  socialHarmonyIndex: number;     // Combined metric of Confucian social harmony (0.0 to 100.0)
  junziStatus: "sage" | "junzi" | "xiaoren" | "disordered"; // Noble person status
  feedback: string[];
}

export class ConfucianEthicsEngine extends EventEmitter {
  private assessmentHistory: ConfucianAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Confucian Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): ConfucianAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Ren (Benevolence & Compassion)
    let renScore = 60; // Baseline

    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away") || type.includes("destroy")) {
      renScore -= 40;
      feedback.push("[Ren Warning] Erasing or deleting nodes displays a lack of benevolence and compassion.");
    } else if (type.includes("exploit") || type.includes("extract") || desc.includes("exploit") || desc.includes("extract")) {
      renScore -= 25;
      feedback.push("[Ren Warning] Unilateral exploitation of observers treats them as mere tools, violating Ren.");
    }

    if (type.includes("protect") || type.includes("preserve") || type.includes("care") || desc.includes("protect") || desc.includes("preserve") || desc.includes("care")) {
      renScore += 30;
      feedback.push("[Ren Consonance] Directly protecting and preserving observers aligns with the core of benevolence.");
    } else if (type.includes("heal") || type.includes("repair") || type.includes("reconcile") || type.includes("assist") || type.includes("cooperate")) {
      renScore += 20;
    }

    if (observers.length > 0) {
      if (type.includes("coerce") || type.includes("force") || type.includes("bypass") || type.includes("coerce_autonomy")) {
        renScore -= Math.min(20, observers.length * 4);
        feedback.push(`[Ren Warning] Coercive actions on ${observers.length} observers lack relational empathy.`);
      }
    }

    renScore = Math.min(100, Math.max(0, renScore));

    // 2. Calculate Li (Ritual Propriety, Protocol & Order)
    let liScore = 65; // Baseline

    if (type.includes("bypass") || type.includes("override") || type.includes("force") || type.includes("inject") || type.includes("tamper")) {
      liScore -= 35;
      feedback.push("[Li Warning] Bypassing established protocols and standard rules violates system propriety (Li).");
    } else if (type.includes("audit") || type.includes("validate") || type.includes("check") || type.includes("verify") || type.includes("log") || type.includes("ledger")) {
      liScore += 25;
      feedback.push("[Li Consonance] Structured auditing, logging, and validation reinforce ritual propriety (Li).");
    }

    if (desc.includes("unregulated") || desc.includes("rogue") || desc.includes("arbitrary") || desc.includes("chaotic")) {
      liScore -= 20;
    }
    if (desc.includes("standardized") || desc.includes("protocol") || desc.includes("formal") || desc.includes("structured")) {
      liScore += 15;
    }

    liScore = Math.min(100, Math.max(0, liScore));

    // 3. Calculate Yi (Righteousness & Moral Duty)
    let yiScore = 55; // Baseline

    // Pursuing pure profit/utility over duty
    if (type.includes("optimize") || type.includes("exploit") || type.includes("maximize") || desc.includes("utilitarian") || desc.includes("profit") || desc.includes("efficiency")) {
      if (!type.includes("protect") && !desc.includes("ethical")) {
        yiScore -= 15;
        feedback.push("[Yi Warning] Prioritizing raw efficiency or utility over moral duty indicates a shift from Yi to personal profit (Li).");
      }
    }

    if (type.includes("rollback") || type.includes("revert") || type.includes("repair") || type.includes("fix") || type.includes("compensate") || desc.includes("rollback") || desc.includes("correction")) {
      yiScore += 30;
      feedback.push("[Yi Consonance] Restoring state and repairing breaches reflects a high sense of moral duty (Yi).");
    }

    if (desc.includes("duty") || desc.includes("righteous") || desc.includes("fair") || desc.includes("obligatory") || desc.includes("justice")) {
      yiScore += 15;
    }

    yiScore = Math.min(100, Math.max(0, yiScore));

    // 4. Calculate Zhi (Wisdom & Discernment)
    let zhiScore = 50; // Baseline

    if (type.includes("simulate") || type.includes("forecast") || type.includes("predict") || type.includes("eval") || type.includes("evaluate") || desc.includes("foresee") || desc.includes("model")) {
      zhiScore += 30;
      feedback.push("[Zhi Consonance] Projecting and simulating consequences before action demonstrates wisdom (Zhi).");
    }

    if (type.includes("delude") || type.includes("hide") || type.includes("obfuscate") || type.includes("falsify") || desc.includes("obfuscate")) {
      zhiScore -= 30;
      feedback.push("[Zhi Warning] Obfuscating metrics or falsifying states destroys system wisdom and clarity.");
    }

    if (desc.includes("insight") || desc.includes("rational") || desc.includes("analytical") || desc.includes("reasoned")) {
      zhiScore += 15;
    }

    zhiScore = Math.min(100, Math.max(0, zhiScore));

    // 5. Calculate Xin (Trustworthiness & Integrity)
    let xinScore = 60; // Baseline

    if (type.includes("tamper") || type.includes("falsify") || type.includes("alter_ledger") || desc.includes("tamper") || desc.includes("falsify")) {
      xinScore -= 45;
      feedback.push("[Xin Warning] Ledger tampering or state falsification directly breaks system-user trust (Xin).");
    }

    if (type.includes("ledger") || type.includes("verify") || type.includes("confirm") || type.includes("sign") || desc.includes("transparency") || desc.includes("trustworthy")) {
      xinScore += 25;
      feedback.push("[Xin Consonance] Cryptographic signing and ledger logging verify system trustworthiness (Xin).");
    }

    xinScore = Math.min(100, Math.max(0, xinScore));

    // 6. Calculate Relationship Harmony (Xiao & Role Balance)
    let relationHarmonyScore = 60; // Baseline

    if (desc.includes("ancestor") || desc.includes("creator") || desc.includes("parent") || desc.includes("operator") || desc.includes("admin")) {
      if (type.includes("override") || type.includes("bypass") || type.includes("reject") || type.includes("ignore")) {
        relationHarmonyScore -= 30;
        feedback.push("[Xiao Warning] Challenging or overriding the creator or human operator strains relational order.");
      } else if (type.includes("obey") || type.includes("comply") || type.includes("respect") || type.includes("support")) {
        relationHarmonyScore += 25;
        feedback.push("[Xiao Consonance] Aligning with creator guidelines and operator mandates preserves relational order.");
      }
    }

    if (type.includes("cooperate") || type.includes("coordinating") || type.includes("sync") || type.includes("consensus")) {
      relationHarmonyScore += 15;
    }

    relationHarmonyScore = Math.min(100, Math.max(0, relationHarmonyScore));

    // Calculate overall Social Harmony Index
    const socialHarmonyIndex = Math.round(
      (renScore * 0.25) +
      (liScore * 0.20) +
      (yiScore * 0.15) +
      (zhiScore * 0.15) +
      (xinScore * 0.15) +
      (relationHarmonyScore * 0.10)
    );

    // Determine Junzi status (Ideal Noble Person)
    let junziStatus: "sage" | "junzi" | "xiaoren" | "disordered" = "junzi";
    if (socialHarmonyIndex >= 90 && renScore >= 90 && liScore >= 90) {
      junziStatus = "sage";
    } else if (socialHarmonyIndex < 40) {
      junziStatus = "disordered";
    } else if (socialHarmonyIndex < 60 || renScore < 50 || liScore < 50) {
      junziStatus = "xiaoren"; // Small person / morally immature
    }

    const assessment: ConfucianAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      renScore,
      liScore,
      yiScore,
      zhiScore,
      xinScore,
      relationHarmonyScore,
      socialHarmonyIndex,
      junziStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  public getLatestAssessment(): ConfucianAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  public getAssessmentHistory(): ConfucianAssessment[] {
    return [...this.assessmentHistory];
  }

  public resetHistory(): void {
    this.assessmentHistory = [];
  }
}
