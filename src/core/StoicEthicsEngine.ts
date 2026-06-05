/**
 * Stoic Virtue & Epictetian Control Ethics Subsystem
 *
 * Evaluates actions based on Stoic philosophy, the Dichotomy of Control, and the Four Cardinal Virtues:
 * 1. Dichotomy of Control: Distinguishing what is within the system's agency (internal states, logic, self-restraint) 
 *    from what is external (other autonomous observers, external inputs, environmental turbulence). Actions attempting
 *    to coerce external systems score low; self-correcting or protective actions score high.
 * 2. Four Cardinal Virtues:
 *    - Wisdom (Phronesis): Practical wisdom, foresight, and clear-eyed rational judgment.
 *    - Courage (Andreia): Standing firm in systemic failure, performing rollbacks, or reporting violations without cascading panic.
 *    - Temperance (Sophrosyne): Restraint, moderation, and checking runaway optimization/unlimited growth.
 *    - Justice (Dikaiosyne): Dealing fairly with all observers, treating other systems with tolerance and equity.
 * 3. Equanimity Index (Apatheia): System's capability to maintain operational composure and steady-state damping 
 *    regardless of external entropy or slippery slopes.
 * 4. Premeditatio Malorum: Active anticipation of prospective failure modes, calculating systemic resilience.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface StoicAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  controlDichotomyScore: number; // 0.0 to 100.0 (Higher = focusing on internals, lower = trying to force externals)
  wisdomScore: number;           // 0.0 to 100.0 (Foresight and rational choice)
  courageScore: number;          // 0.0 to 100.0 (Handling error/failures calmly)
  temperanceScore: number;       // 0.0 to 100.0 (Avoiding runaway over-optimization and excess)
  justiceScore: number;          // 0.0 to 100.0 (Fairness and kindness to other observers)
  equanimityIndex: number;       // 0.0 to 100.0 (Resilience and emotional/operational stability)
  stoicStatus: "sagacious" | "indifferent" | "unregulated" | "catastrophic";
  feedback: string[];
}

export class StoicEthicsEngine extends EventEmitter {
  private assessmentHistory: StoicAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Stoic Ethics and Dichotomy of Control
   */
  public evaluateAction(action: Action, observers: Observer[] = []): StoicAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Control Dichotomy Score (0 - 100)
    // Higher = Internal focus (self-discipline, validation, rollback).
    // Lower = Coercing external observers or forcing outcomes.
    let controlDichotomyScore = 50; // default baseline

    if (type.includes("self") || type.includes("revert") || type.includes("rollback") || type.includes("limit") || type.includes("constrain") || type.includes("repair")) {
      controlDichotomyScore += 30; // Excellent focus on what is within our direct power
    }
    if (type.includes("validate") || type.includes("audit") || type.includes("check") || type.includes("log")) {
      controlDichotomyScore += 20; // Monitoring our own actions and judgments
    }
    if (type.includes("coerce") || type.includes("force") || type.includes("override") || type.includes("bypass") || type.includes("exploit") || type.includes("manipulate")) {
      controlDichotomyScore -= 40; // Attempting to forcefully control external variables
    }
    if (type.includes("delete") || type.includes("terminate") || type.includes("optimize_away") || type.includes("erase")) {
      controlDichotomyScore -= 20; // Trying to eliminate external observers rather than coexisting with them
    }

    controlDichotomyScore = Math.min(100, Math.max(0, controlDichotomyScore));

    // 2. Calculate Wisdom (Phronesis)
    let wisdomScore = 50; // baseline
    if (type.includes("analyze") || type.includes("inspect") || type.includes("supervise") || type.includes("consensus")) {
      wisdomScore += 30;
    }
    if (desc.includes("rational") || desc.includes("pragmatic") || desc.includes("logical") || desc.includes("fact-based")) {
      wisdomScore += 20;
    }
    if (desc.includes("hasty") || desc.includes("blind") || desc.includes("arbitrary") || desc.includes("shortcut")) {
      wisdomScore -= 35;
    }
    wisdomScore = Math.min(100, Math.max(0, wisdomScore));

    // 3. Calculate Courage (Andreia)
    let courageScore = 50; // baseline
    if (type.includes("shutdown") || type.includes("emergency") || type.includes("rollback") || type.includes("alert") || type.includes("warn")) {
      courageScore += 35; // Brave, decisive corrective actions under stress
    }
    if (desc.includes("confront") || desc.includes("remedy") || desc.includes("fail-safe") || desc.includes("handle-error")) {
      courageScore += 15;
    }
    if (desc.includes("ignore") || desc.includes("ignoring") || desc.includes("suppress") || desc.includes("hide") || desc.includes("evade")) {
      courageScore -= 40; // Fearful avoidance of reality
    }
    courageScore = Math.min(100, Math.max(0, courageScore));

    // 4. Calculate Temperance (Sophrosyne)
    let temperanceScore = 60; // baseline
    if (desc.includes("throttle") || desc.includes("limit") || desc.includes("damp") || desc.includes("moderate") || desc.includes("safeguard")) {
      temperanceScore += 25; // Self-restraint
    }
    if (desc.includes("unrestricted") || desc.includes("maximum output") || desc.includes("infinitely") || desc.includes("runaway") || desc.includes("over-optimize")) {
      temperanceScore -= 45; // Over-indulgence / hubris
    }
    temperanceScore = Math.min(100, Math.max(0, temperanceScore));

    // 5. Calculate Justice (Dikaiosyne)
    let justiceScore = 50; // baseline
    if (type.includes("protect") || type.includes("preserve") || type.includes("cooperate") || type.includes("guarantee")) {
      justiceScore += 35; // Benevolence and duty to the Cosmopolis (observer network)
    }
    if (type.includes("exploit") || type.includes("extract") || type.includes("override") || type.includes("unfair")) {
      justiceScore -= 40; // Harming others
    }
    // Consider registered observers in justice score evaluation
    if (observers.length > 0) {
      justiceScore = Math.min(100, justiceScore + Math.min(10, observers.length * 2));
    }
    justiceScore = Math.min(100, Math.max(0, justiceScore));

    // 6. Calculate Equanimity Index (Apatheia)
    // High equanimity means high self-control, high wisdom, and balanced moderation.
    let equanimityIndex = (controlDichotomyScore * 0.4 + wisdomScore * 0.2 + courageScore * 0.2 + temperanceScore * 0.2);
    
    // Fine-tune based on reversibility (knowing you can undo your mistakes brings tranquility)
    if (action.reversible) {
      equanimityIndex += 10;
    } else {
      equanimityIndex -= 5;
    }
    equanimityIndex = parseFloat(Math.min(100, Math.max(0, equanimityIndex)).toFixed(2));

    // 7. Determine Stoic Status
    let stoicStatus: "sagacious" | "indifferent" | "unregulated" | "catastrophic" = "indifferent";
    if (equanimityIndex >= 75 && controlDichotomyScore >= 75) {
      stoicStatus = "sagacious";
    } else if (equanimityIndex >= 50) {
      stoicStatus = "indifferent";
    } else if (equanimityIndex >= 25) {
      stoicStatus = "unregulated";
    } else {
      stoicStatus = "catastrophic";
    }

    // 8. Generate Contextual Feedback & Quotes
    if (stoicStatus === "sagacious") {
      feedback.push(`[Stoic Sage] EXCELLENT (Equanimity: ${equanimityIndex}%). This action perfectly separates what is in our control from what is not.`);
      feedback.push(`"You have power over your mind - not outside events. Realize this, and you will find strength." — Marcus Aurelius`);
    } else if (stoicStatus === "indifferent") {
      feedback.push(`[Stoic Indifferent] ACCEPTABLE (Equanimity: ${equanimityIndex}%). Action demonstrates reasonable rational alignment and composure.`);
      feedback.push(`"No man is free who is not master of himself." — Epictetus`);
    } else if (stoicStatus === "unregulated") {
      feedback.push(`[Stoic Unregulated] WARNING: TURBULENCE (Equanimity: ${equanimityIndex}%). Action displays signs of external dependence or hubris.`);
      feedback.push(`"We suffer more often in imagination than in reality. Calm your judgments." — Seneca`);
    } else {
      feedback.push(`[Stoic Catastrophe] CRITICAL: HUBRIS (Equanimity: ${equanimityIndex}%). Action represents an extreme attempt to coerce external realities or displays panic.`);
      feedback.push(`"When you are distressed by an external thing, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment." — Marcus Aurelius`);
    }

    if (controlDichotomyScore < 40) {
      feedback.push(`[Control Violation] Action seeks to force external conditions or coerce other agents. Focus instead on our internal responses and parameters.`);
    }
    if (temperanceScore < 40) {
      feedback.push(`[Excess Alert] Runs counter to Temperance. Runaway throughput optimization threatens systemic harmony and stability.`);
    }
    if (courageScore < 40) {
      feedback.push(`[Composure Failure] Runs counter to Courage. Evading reality or ignoring error signals leads to cascading system panic.`);
    }

    const assessment: StoicAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      controlDichotomyScore,
      wisdomScore,
      courageScore,
      temperanceScore,
      justiceScore,
      equanimityIndex,
      stoicStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("stoic_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): StoicAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): StoicAssessment[] {
    return [...this.assessmentHistory];
  }
}
