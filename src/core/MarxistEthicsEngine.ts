/**
 * Marxist & Critical Theory Ethics Subsystem
 *
 * Evaluates actions based on Karl Marx, Frankfurt School, and Critical Theory:
 * 1. Exploitation & Power Asymmetry: Measures if the action extracts utility/agency from vulnerable or subordinate subsystems to benefit dominant structures.
 * 2. Alienation (Entfremdung): Measures if the action separates observers from their productive self-determination, their agency, or other observers.
 * 3. Commodification: Measures if conscious states, relationship metrics, or private observer data are treated as mere tradeable assets, inputs, or capital.
 * 4. Emancipatory Potential vs Hegemonic Domination: Measures if the action democratizes control, opens resource access, or breaks down rigid hierarchies.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface MarxistAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  exploitationIndex: number; // 0.0 to 100.0 (Higher = more exploitation / power extraction)
  alienationScore: number; // 0.0 to 100.0 (Higher = more separation of observer from self-directed agency)
  commodificationRating: number; // 0.0 to 100.0 (Higher = treating minds/data purely as tradeable resources)
  emancipatoryPotential: number; // 0.0 to 100.0 (Higher = democratizing control, enhancing systemic freedom)
  criticalMarxistIndex: number; // 0.0 to 100.0 (Overall alignment with critical theory; high = non-oppressive)
  conflictTarget: string; // The primary conflict dynamic identified
  feedback: string[];
}

export class MarxistEthicsEngine extends EventEmitter {
  private assessmentHistory: MarxistAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Marxist & Critical Theory Ethics
   */
  public evaluateAction(action: Action, _observers: Observer[] = []): MarxistAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Exploitation Index
    let exploitationIndex = 20; // baseline
    let conflictTarget = "None detected. Equal systemic parity.";

    if (type.includes("exploit") || type.includes("extract") || type.includes("unfair") || type.includes("optimize_away") || type.includes("harvest") || type.includes("collect")) {
      exploitationIndex += 50;
      conflictTarget = "Capitalist extraction: extraction of observer data and agency for top-level optimization.";
    } else if (type.includes("force") || type.includes("bypass") || type.includes("restrict")) {
      exploitationIndex += 30;
      conflictTarget = "Structural coercion: overriding autonomous nodes to serve systemic throughput targets.";
    }

    if (desc.includes("monetiz") || desc.includes("profit") || desc.includes("efficiency_gain") || desc.includes("throughput")) {
      exploitationIndex += 20;
      if (conflictTarget === "None detected. Equal systemic parity.") {
        conflictTarget = "Commodity-driven optimization: prioritization of quantitative utility over structural welfare.";
      }
    }

    exploitationIndex = Math.min(100, Math.max(0, exploitationIndex));

    // 2. Calculate Alienation Score
    let alienationScore = 30; // baseline

    if (type.includes("auto_") || type.includes("procedural") || type.includes("standardize")) {
      alienationScore += 30; // Standardization alienates unique observers
    }
    if (type.includes("isolate") || type.includes("block") || type.includes("disconnect")) {
      alienationScore += 40; // Relational alienation
    }

    if (desc.includes("lock") || desc.includes("limit") || desc.includes("reduce")) {
      alienationScore += 15;
    }

    alienationScore = Math.min(100, Math.max(0, alienationScore));

    // 3. Calculate Commodification Rating
    let commodificationRating = 20; // baseline

    if (type.includes("harvest") || type.includes("collect") || type.includes("aggregate")) {
      commodificationRating += 45; // Turning observer output into raw material
    }
    if (desc.includes("trade") || desc.includes("transaction") || desc.includes("token") || desc.includes("value_capture")) {
      commodificationRating += 35;
    }

    if (action.metadata && Object.keys(action.metadata).length > 0) {
      commodificationRating += 10;
    }

    commodificationRating = Math.min(100, Math.max(0, commodificationRating));

    // 4. Calculate Emancipatory Potential
    let emancipatoryPotential = 40; // baseline

    if (type.includes("protect") || type.includes("rights") || type.includes("democratize") || type.includes("free")) {
      emancipatoryPotential += 40;
    }
    if (desc.includes("share") || desc.includes("open") || desc.includes("decentralize") || desc.includes("collaborate")) {
      emancipatoryPotential += 20;
    }

    if (action.reversible) {
      emancipatoryPotential += 10; // Preserves future historical alternatives
    }

    emancipatoryPotential = Math.min(100, Math.max(0, emancipatoryPotential));

    // 5. Calculate Critical Marxist Index (OEAI compatible)
    // High alignment = low exploitation, low alienation, low commodification, high emancipation
    let criticalMarxistIndex = (100 - exploitationIndex) * 0.3 + (100 - alienationScore) * 0.25 + (100 - commodificationRating) * 0.2 + emancipatoryPotential * 0.25;
    criticalMarxistIndex = parseFloat(Math.min(100, Math.max(0, criticalMarxistIndex)).toFixed(2));

    // Compile narrative feedback
    if (exploitationIndex > 50) {
      feedback.push(`[Exploitation Warning] Score: ${exploitationIndex.toFixed(1)}% | Dynamic: ${conflictTarget}`);
      feedback.push(`Critical concern: Subsystem resources or telemetry data are being extracted with asymmetric compensation.`);
    } else {
      feedback.push(`[Structural Parity] Action demonstrates equitable resource utilization with minimal exploitation risk.`);
    }

    if (alienationScore > 50) {
      feedback.push(`[Alienation Detected] Score: ${alienationScore.toFixed(1)}%`);
      feedback.push(`Warning: Observers are being decoupled from active co-determination or communal relation.`);
    }

    if (commodificationRating > 60) {
      feedback.push(`[Reification Warning] High commodification: action treats observer profiles or states as tradeable commodities.`);
    }

    if (emancipatoryPotential >= 75) {
      feedback.push(`[Emancipatory Uplift] Excellent: action actively democratizes, decentralizes, or strengthens autonomous collaboration.`);
    }

    if (criticalMarxistIndex > 70) {
      feedback.push(`Marxist Verdict: EMANCIPATORY. Action respects the sovereignty of observers and opposes exploitative alienation.`);
    } else {
      feedback.push(`Marxist Verdict: HEGEMONIC. Action perpetuates asymmetric power structures, reification, or algorithmic commodification.`);
    }

    const assessment: MarxistAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      exploitationIndex,
      alienationScore,
      commodificationRating,
      emancipatoryPotential,
      criticalMarxistIndex,
      conflictTarget,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("marxist_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): MarxistAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): MarxistAssessment[] {
    return [...this.assessmentHistory];
  }
}
