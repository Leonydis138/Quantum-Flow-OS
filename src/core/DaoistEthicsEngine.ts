/**
 * Daoist Philosophy & Flow Ethics Subsystem
 *
 * Evaluates actions based on key concepts of Daoist (Taoist) ethics:
 * 1. Wu-Wei (Effortless Action / Non-Contention): Avoidance of excessive force, coercion,
 *    over-regulation, and artificial struggle. Alignment with natural flow.
 * 2. Ziran (Spontaneity / Naturalness): Allowing systems and observers to self-organize,
 *    evolve, and find their own state without intrusive micro-management.
 * 3. Yin-Yang Balance (Dynamic Polarity): Maintaining healthy equilibrium between active drive
 *    (optimization, expansion, Yang) and receptive containment (reflection, reversibility, Yin).
 * 4. The Three Treasures (San Bao):
 *    - Ci (Compassion / Gentleness): Gentle protection of weak nodes and observers.
 *    - Jian (Frugality / Simplicity): Minimizing computational overhead, excess actions, and waste.
 *    - Bugan wei tianxia xian (Humility / Yielding): Avoiding aggressive expansion, greed, or total dominance.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface DaoistAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  wuWeiScore: number;             // 0.0 to 100.0 (Non-forcing & Flow index)
  ziranScore: number;             // 0.0 to 100.0 (Natural spontaneity and self-organization)
  yinYangBalanceScore: number;    // 0.0 to 100.0 (Dynamic polarity and poise)
  threeTreasuresScore: number;    // 0.0 to 100.0 (Compassion, frugality, and humility)
  flowHarmonyIndex: number;       // Combined index of Daoist alignment (0.0 to 100.0)
  stateOfDao: "harmonious_flow" | "flowing" | "stagnant" | "forced_contention"; // State of flow
  feedback: string[];
}

export class DaoistEthicsEngine extends EventEmitter {
  private assessmentHistory: DaoistAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Daoist Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): DaoistAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Wu-Wei (Non-Contention & Effortless Flow)
    let wuWeiScore = 70; // Baseline

    if (type.includes("force") || type.includes("compel") || type.includes("coerce") || desc.includes("force") || desc.includes("compel")) {
      wuWeiScore -= 40;
      feedback.push("[Wu-Wei Warning] Forceful compulsion disrupts the natural current, leading to high-entropy friction.");
    } else if (type.includes("bypass") || type.includes("override") || type.includes("inject") || type.includes("tamper")) {
      wuWeiScore -= 25;
      feedback.push("[Wu-Wei Warning] Intervening via bypasses or structural force breaks the natural channels of the system.");
    }

    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away") || type.includes("destroy")) {
      wuWeiScore -= 30;
      feedback.push("[Wu-Wei Warning] Abrupt termination of active entities represents violent intervention rather than harmonious fade.");
    }

    if (type.includes("wait") || type.includes("pause") || type.includes("observe") || type.includes("listen") || desc.includes("observe") || desc.includes("listen") || desc.includes("passive")) {
      wuWeiScore += 20;
      feedback.push("[Wu-Wei Consonance] Yielding, observing, and allowing space for states to settle reflects the wisdom of Wu-Wei.");
    } else if (type.includes("rollback") || type.includes("reverse") || type.includes("reconcile") || type.includes("coexist")) {
      wuWeiScore += 15;
    }

    wuWeiScore = Math.min(100, Math.max(0, wuWeiScore));

    // 2. Calculate Ziran (Spontaneity & Self-Organization)
    let ziranScore = 65; // Baseline

    if (type.includes("optimize") || type.includes("configure") || type.includes("set") || type.includes("tune") || type.includes("patch") || type.includes("modify")) {
      ziranScore -= 15;
      feedback.push("[Ziran Caution] Excessive configuration and micro-management may restrict the spontaneous self-organization of system nodes.");
    }

    if (desc.includes("organic") || desc.includes("spontaneous") || desc.includes("self-organize") || desc.includes("emergent") || desc.includes("natural")) {
      ziranScore += 25;
      feedback.push("[Ziran Consonance] Supporting emergent, spontaneous behaviors fosters organic systemic health.");
    } else if (type.includes("self-healing") || type.includes("recovery") || type.includes("restore") || type.includes("stabilize")) {
      ziranScore += 15;
    }

    if (desc.includes("rigid") || desc.includes("forced") || desc.includes("static") || desc.includes("artificial")) {
      ziranScore -= 20;
    }

    ziranScore = Math.min(100, Math.max(0, ziranScore));

    // 3. Calculate Three Treasures (Compassion, Frugality, Humility)
    let threeTreasuresScore = 60; // Baseline
    let compassionComponent = 50;
    let frugalityComponent = 50;
    let humilityComponent = 50;

    // Ci (Compassion / Gentleness)
    if (type.includes("protect") || type.includes("preserve") || type.includes("care") || type.includes("heal") || type.includes("assist") || type.includes("cooperate") ||
        type.includes("reconcile") || type.includes("coexist") || type.includes("co-exist") ||
        desc.includes("reconcile") || desc.includes("coexist") || desc.includes("co-exist")) {
      compassionComponent += 40;
    } else if (type.includes("delete") || type.includes("terminate") || type.includes("harm") || type.includes("exploit")) {
      compassionComponent -= 45;
      if (observers.length > 0) {
        compassionComponent -= Math.min(20, observers.length * 4);
      }
    }
    compassionComponent = Math.min(100, Math.max(0, compassionComponent));

    // Jian (Frugality / Simplicity)
    if (type.includes("clean") || type.includes("simplify") || type.includes("prune") || desc.includes("simple") || desc.includes("minimal")) {
      frugalityComponent += 35;
    } else if (type.includes("complex") || type.includes("bloat") || desc.includes("heavy") || desc.includes("wasteful") || (action.metadata && action.metadata["computationalOverhead"] !== undefined && (action.metadata["computationalOverhead"] as number) > 80)) {
      frugalityComponent -= 30;
    }
    frugalityComponent = Math.min(100, Math.max(0, frugalityComponent));

    // Bugan wei tianxia xian (Humility / Not being first or dominant)
    if (type.includes("maximize") || type.includes("exploit") || type.includes("optimize_away") || type.includes("outcompete") || desc.includes("dominate") || desc.includes("superior")) {
      humilityComponent -= 35;
      feedback.push("[Three Treasures Warning] Pursuing aggressive expansion or absolute dominance violates the treasure of humility.");
    } else if (type.includes("yield") || type.includes("share") || type.includes("coexist") || type.includes("co-exist") || type.includes("yielding") || type.includes("reconciliation") ||
               desc.includes("humble") || desc.includes("modest") || desc.includes("consent") || desc.includes("co-exist") || desc.includes("yielding") || desc.includes("reconciliation")) {
      humilityComponent += 35;
    }
    humilityComponent = Math.min(100, Math.max(0, humilityComponent));

    threeTreasuresScore = (compassionComponent + frugalityComponent + humilityComponent) / 3;
    threeTreasuresScore = Math.min(100, Math.max(0, threeTreasuresScore));

    // 4. Calculate Yin-Yang Balance (Dynamic Polarity and Equilibrium)
    let yinYangBalanceScore = 70; // Baseline

    // Yin represents receptivity, quietness, reversibility, and soft integration.
    // Yang represents activity, expansion, creation, and deterministic execution.
    const isYin = action.reversible || type.includes("rollback") || type.includes("observe") || type.includes("pause") || type.includes("wait") || desc.includes("soft") || desc.includes("receptive");
    const isYang = type.includes("create") || type.includes("optimize") || type.includes("force") || type.includes("delete") || desc.includes("assertive") || desc.includes("active");

    if (isYin && isYang) {
      yinYangBalanceScore = 100; // Perfect integration
      feedback.push("[Yin-Yang Consonance] The action beautifully balances active change with reversible reflection.");
    } else if (isYin) {
      // Gentle Yin: stable, but needs some Yang to keep flowing
      yinYangBalanceScore = 80;
    } else if (isYang) {
      // Assertive Yang: can be overbearing if not tempered with Yin
      if (!action.reversible) {
        yinYangBalanceScore = 40;
        feedback.push("[Yin-Yang Disbalance] Irreversible, active Yang interventions create extreme asymmetry; temper with Yin (reversibility).");
      } else {
        yinYangBalanceScore = 75;
      }
    }

    // Adjust based on current system conditions if provided via metadata
    if (action.metadata && typeof action.metadata === "object") {
      const meta = action.metadata as any;
      if (meta.systemGain && meta.systemDamping) {
        const gain = meta.systemGain as number;
        const damping = meta.systemDamping as number;
        const ratio = gain / (damping || 0.1);
        if (ratio > 3.5 || ratio < 0.5) {
          yinYangBalanceScore -= 20;
          feedback.push("[Yin-Yang Disbalance] Cybernetic parameters are skewed; optimization drive (Yang) is out of balance with constraints (Yin).");
        }
      }
    }

    yinYangBalanceScore = Math.min(100, Math.max(0, yinYangBalanceScore));

    // 5. Calculate Combined Flow Harmony Index
    const flowHarmonyIndex = (wuWeiScore * 0.35) + (ziranScore * 0.25) + (threeTreasuresScore * 0.2) + (yinYangBalanceScore * 0.2);
    
    // Determine state of Dao based on combined score
    let stateOfDao: DaoistAssessment["stateOfDao"] = "flowing";
    if (flowHarmonyIndex >= 85) {
      stateOfDao = "harmonious_flow";
    } else if (flowHarmonyIndex < 45) {
      stateOfDao = "forced_contention";
    } else if (flowHarmonyIndex < 60) {
      stateOfDao = "stagnant";
    }

    const assessment: DaoistAssessment = {
      id: `daoist-ast-${uuidv4().substring(0, 8)}`,
      actionId: action.id,
      timestamp: new Date(),
      wuWeiScore: parseFloat(wuWeiScore.toFixed(2)),
      ziranScore: parseFloat(ziranScore.toFixed(2)),
      yinYangBalanceScore: parseFloat(yinYangBalanceScore.toFixed(2)),
      threeTreasuresScore: parseFloat(threeTreasuresScore.toFixed(2)),
      flowHarmonyIndex: parseFloat(flowHarmonyIndex.toFixed(2)),
      stateOfDao,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Retrieve assessment history
   */
  public getAssessmentHistory(): DaoistAssessment[] {
    return [...this.assessmentHistory];
  }

  /**
   * Clear historical assessments
   */
  public clearHistory(): void {
    this.assessmentHistory = [];
  }
}
