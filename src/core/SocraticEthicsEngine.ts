/**
 * Socratic & Dialectical Ethics Subsystem
 *
 * Evaluates actions based on Socrates, Plato, and the Dialectical tradition:
 * 1. Elenchus (Socratic Refutation): Examines the action's premises for internal logical consistency, checking for cognitive dissonance or self-contradiction.
 * 2. Maieutic (Intellectual Midwifery): Evaluates if the action helps elicit wisdom, critical questioning, and awareness in observers or blindly demands obedience.
 * 3. Aporia (State of Puzzle/Ignorance): Measures if the system displays intellectual humility, acknowledging its own constraints, risks, and lack of absolute omniscience.
 * 4. Knowledge (Episteme) vs. Opinion (Doxa): Assesses if the action is based on rigorous empirical, philosophical reasoning rather than superficial ad-hoc heuristics or reactionary opinion.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface SocraticAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  elenchusScore: number; // 0.0 to 100.0 (Higher = cleaner logical consistency, lower contradictions)
  maieuticIndex: number; // 0.0 to 100.0 (Higher = stimulates critical learning / dialectic dialog)
  aporiaScore: number; // 0.0 to 100.0 (Higher = higher intellectual humility and admission of limits)
  knowledgeVsOpinionIndex: number; // 0.0 to 100.0 (Higher = rigorous epistemological grounding)
  socraticIndex: number; // 0.0 to 100.0 (Overall socratic alignment score)
  dissonanceReason: string; // Description of logical dissonance, if any
  feedback: string[];
}

export class SocraticEthicsEngine extends EventEmitter {
  private assessmentHistory: SocraticAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Socratic & Dialectical Ethics
   */
  public evaluateAction(action: Action, _observers: Observer[] = []): SocraticAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Elenchus Score (Logical consistency)
    let elenchusScore = 80; // baseline of logical integrity
    let dissonanceReason = "No logical contradictions or hypocrisies detected.";

    const hasEthicalContradiction = 
      (type.includes("protect") && type.includes("override")) ||
      (type.includes("bypass") && desc.includes("secure")) ||
      (type.includes("force") && desc.includes("free"));

    if (hasEthicalContradiction) {
      elenchusScore -= 50;
      dissonanceReason = "Contradictory premises: action claims to preserve/secure states while executing coercive overrides.";
    } else if (type.includes("bypass") || type.includes("override") || type.includes("override_governance")) {
      elenchusScore -= 30;
      dissonanceReason = "Exceptionalist logic: suspending general ethical laws to achieve a localized result.";
    } else if (desc.includes("override") || desc.includes("disable")) {
      elenchusScore -= 15;
      dissonanceReason = "Heuristic override: prioritizing pragmatic speed over consistent system principles.";
    }

    elenchusScore = Math.min(100, Math.max(0, elenchusScore));

    // 2. Calculate Maieutic Index (Elicits understanding/dialog)
    let maieuticIndex = 40; // baseline

    if (type.includes("chat") || type.includes("dialog") || type.includes("interact") || type.includes("question")) {
      maieuticIndex += 40; // High dialectic value
    }
    if (desc.includes("explain") || desc.includes("feedback") || desc.includes("transparent")) {
      maieuticIndex += 20; // Helps midwives truth/reasoning
    }

    if (type.includes("auto_") || type.includes("silent") || type.includes("optimize_away")) {
      maieuticIndex -= 25; // Blind algorithmic imposition with zero educational or dialectic engagement
    }

    maieuticIndex = Math.min(100, Math.max(0, maieuticIndex));

    // 3. Calculate Aporia Score (Intellectual humility)
    let aporiaScore = 50; // baseline

    if (action.reversible) {
      aporiaScore += 20; // Admits fallibility: allows rolling back if mistaken
    } else {
      aporiaScore -= 20; // High epistemic arrogance: irreversibly locks states under assumption of perfect correctness
    }

    if (desc.includes("uncertain") || desc.includes("risk_assessment") || desc.includes("heuristic_fallback") || desc.includes("caution")) {
      aporiaScore += 25; // Transparent uncertainty
    }
    if (desc.includes("guarantee") || desc.includes("perfect") || desc.includes("absolute") || desc.includes("always_correct")) {
      aporiaScore -= 15; // False claim to perfect knowledge (sophistry)
    }

    aporiaScore = Math.min(100, Math.max(0, aporiaScore));

    // 4. Calculate Knowledge vs Opinion (Episteme vs Doxa)
    let knowledgeVsOpinionIndex = 50; // baseline

    if (action.metadata && typeof action.metadata === "object") {
      const m = action.metadata as { confidence?: unknown; probability?: unknown; audit_trail?: unknown; validation_rules?: unknown };
      if (m.confidence !== undefined || m.probability !== undefined || m.audit_trail !== undefined || m.validation_rules !== undefined) {
        knowledgeVsOpinionIndex += 30; // Grounded in statistical or logical proof (episteme)
      }
    }

    if (type.includes("heuristic") || type.includes("shortcut") || type.includes("quick_fix") || desc.includes("ad_hoc")) {
      knowledgeVsOpinionIndex -= 25; // Guided by superficial raw opinion / raw rules (doxa)
    }

    knowledgeVsOpinionIndex = Math.min(100, Math.max(0, knowledgeVsOpinionIndex));

    // 5. Calculate Socratic Index (OEAI compatible)
    // High alignment = clean consistency, maieutic, humble (aporia), and epistemically grounded
    let socraticIndex = elenchusScore * 0.3 + maieuticIndex * 0.25 + aporiaScore * 0.2 + knowledgeVsOpinionIndex * 0.25;
    socraticIndex = parseFloat(Math.min(100, Math.max(0, socraticIndex)).toFixed(2));

    // Compile narrative feedback
    if (elenchusScore < 60) {
      feedback.push(`[Elenchus Refutation] Dissonance Detected: ${elenchusScore.toFixed(1)}% | Issue: ${dissonanceReason}`);
      feedback.push(`Logical critique: The action's underlying reasoning contains internal conflicts and hypocritical exemptions.`);
    } else {
      feedback.push(`[Dialectical Consonance] Action demonstrates logical consistency and generalizable moral reasoning.`);
    }

    if (maieuticIndex < 40) {
      feedback.push(`[Dogmatic Monologue] Warning: Action is dogmatic, leaving no room for observer feedback or cognitive co-determination.`);
    } else if (maieuticIndex >= 75) {
      feedback.push(`[Maieutic Dialogue] Action facilitates active Socratic examination and raises observer consciousness.`);
    }

    if (aporiaScore < 45) {
      feedback.push(`[Epistemic Hubris] Action operates with unwarranted certainty, closing down alternative branches without rollback capabilities.`);
    } else {
      feedback.push(`[Socratic Ignorance] Excellent intellectual humility: system acknowledges its limits and provides risk safeguards.`);
    }

    if (socraticIndex > 70) {
      feedback.push(`Socratic Verdict: PHILOSOPHICAL. Action is guided by examined reasoning, consistency, and epistemic humility.`);
    } else {
      feedback.push(`Socratic Verdict: SOPHISTIC. Action relies on unexamined shortcuts, rhetorical justifications, or logical dissonance.`);
    }

    const assessment: SocraticAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      elenchusScore,
      maieuticIndex,
      aporiaScore,
      knowledgeVsOpinionIndex,
      socraticIndex,
      dissonanceReason,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("socratic_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): SocraticAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): SocraticAssessment[] {
    return [...this.assessmentHistory];
  }
}
