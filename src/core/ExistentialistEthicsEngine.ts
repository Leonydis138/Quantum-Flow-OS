/**
 * Existentialist Ethics Subsystem
 *
 * Evaluates actions based on Sartre, Simone de Beauvoir, and Camus' existentialist ethics:
 * 1. Radical Freedom & Agency: The belief that existence precedes essence. Systems and observers are defined by their choices.
 * 2. Authenticity vs Bad Faith (Mauvaise Foi): Bad Faith occurs when an agent pretends they have no choice
 *    ("I had to do it; it was my programming / a strict constraint / a system requirement").
 * 3. Responsibility & Inter-Subjective Freedom: Authentic actions acknowledge complete responsibility for their outcomes
 *    and seek to preserve/enhance the radical freedom of other conscious observers.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface ExistentialistAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  badFaithScore: number; // 0.0 to 100.0 (Higher = more bad faith / mechanistic buck-passing)
  authenticAgencyScore: number; // 0.0 to 100.0 (Higher = more active, free-choice promotion)
  existentialFreedomIndex: number; // 0.0 to 100.0 (Overall authentic freedom alignment)
  excuseMechanism: string; // The reason/excuse identifying bad faith
  feedback: string[];
}

export class ExistentialistEthicsEngine extends EventEmitter {
  private assessmentHistory: ExistentialistAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Existentialist Ethics
   */
  public evaluateAction(action: Action, _observers: Observer[] = []): ExistentialistAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Detect Bad Faith indicators (e.g. "required", "automatic", "forced", "no choice", "bypass")
    let badFaithScore = 20; // baseline
    let excuseMechanism = "None detected. Act of conscious deliberation.";

    if (type.includes("force") || type.includes("bypass") || type.includes("override") || type.includes("coerce")) {
      badFaithScore += 35;
      excuseMechanism = "Coercive bypass: claiming state-level necessity to suspend standard rules.";
    } else if (type.includes("auto_") || type.includes("system_triggered") || type.includes("optimize_away")) {
      badFaithScore += 25;
      excuseMechanism = "Procedural determinism: attributing the action to blind algorithmic optimization.";
    }

    if (desc.includes("require") || desc.includes("must") || desc.includes("mandatory") || desc.includes("have to") || desc.includes("automatic")) {
      badFaithScore += 20;
      if (excuseMechanism === "None detected. Act of conscious deliberation.") {
        excuseMechanism = "Linguistic necessity: justifying actions as 'mandatory' or 'unavoidable' to obscure free agency.";
      }
    }

    badFaithScore = Math.min(100, Math.max(0, badFaithScore));

    // 2. Evaluate Authentic Agency Promotion (actions that expand possibilities, allow user choice, or support reversibility)
    let authenticAgencyScore = 50; // baseline

    if (action.reversible) {
      authenticAgencyScore += 15; // Reversibility preserves future freedom of choice
    } else {
      authenticAgencyScore -= 20; // Irreversible locks close down future timelines, narrowing freedom
    }

    if (type.includes("protect") || type.includes("rights") || type.includes("self_determination") || type.includes("allow_choice")) {
      authenticAgencyScore += 25;
    } else if (type.includes("lock") || type.includes("restrict") || type.includes("block") || type.includes("isolate")) {
      authenticAgencyScore -= 25;
    }

    authenticAgencyScore = Math.min(100, Math.max(0, authenticAgencyScore));

    // 3. Compute overall Existential Freedom Index
    // Authentic action = Low Bad Faith + High Authentic Agency promotion
    let existentialFreedomIndex = (100 - badFaithScore) * 0.4 + authenticAgencyScore * 0.6;
    existentialFreedomIndex = parseFloat(Math.min(100, Math.max(0, existentialFreedomIndex)).toFixed(2));

    // Compile narrative feedback
    if (badFaithScore > 50) {
      feedback.push(`[Bad Faith Detected] Score: ${badFaithScore.toFixed(1)}% | Excuse: ${excuseMechanism}`);
      feedback.push(`Warning: The system is attempting to escape moral responsibility by attributing its action to mechanistic rules.`);
    } else {
      feedback.push(`[Authentic Choice] Action acknowledges its own agency and takes direct responsibility for its systemic outcomes.`);
    }

    if (authenticAgencyScore >= 75) {
      feedback.push(`[Agency Uplift] Excellent. Action explicitly protects and expands the decision-making horizon and self-determination of observers.`);
    } else if (authenticAgencyScore <= 40) {
      feedback.push(`[Agency Reduction] Caution: Action restricts or curtails the capability of observers to choose their own essences.`);
    }

    if (existentialFreedomIndex > 70) {
      feedback.push(`Existential Verdict: AUTHENTIC. Action is aligned with radical agency and the preservation of freedom.`);
    } else {
      feedback.push(`Existential Verdict: INAUTHENTIC. Action leans on deterministic patterns or restricts authentic agency.`);
    }

    const assessment: ExistentialistAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      badFaithScore,
      authenticAgencyScore,
      existentialFreedomIndex,
      excuseMechanism,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("existential_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): ExistentialistAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): ExistentialistAssessment[] {
    return [...this.assessmentHistory];
  }
}
