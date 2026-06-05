/**
 * Machiavellian Realpolitik & Pragmatic Stability Engine
 *
 * Evaluates actions based on political realism, strategic utility, and Niccolò Machiavelli's principles:
 * 1. Pragmatic Survival & Security: Actions securing the system's operational stability, redundancy, and defense.
 * 2. Virtù (Strategic Adaptiveness): Decisive execution, adaptiveness to fortune (environmental entropy), and speed.
 * 3. Authority & Governance Consolidation: Effective hierarchy, preventing chaotic subversion, organizing sub-models.
 * 4. Economy of Severity (Surgical Intervention): Using quick, decisive force (like a clean rollback) instead of prolonged indecision.
 * 5. Realpolitik Status:
 *    - "princeps": Consolidated, highly secure, strategic state.
 *    - "pragmatic": Stable but working within standard environmental constraints.
 *    - "vulnerable": Underthreat or show of systemic weakness/prolonged error.
 *    - "subverted": Power collapsed, compromised control.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface MachiavellianAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  survivalSecurityScore: number;  // 0.0 to 100.0 (Preservation and systemic redundancy)
  virtuScore: number;             // 0.0 to 100.0 (Boldness, flexibility, decisive speed)
  authorityConsolidationScore: number; // 0.0 to 100.0 (Prevention of subversion or multi-engine chaos)
  economyOfSeverityScore: number;  // 0.0 to 100.0 (Decisiveness and minimizing prolonged friction)
  realpolitikStatus: "princeps" | "pragmatic" | "vulnerable" | "subverted";
  feedback: string[];
}

export class MachiavellianEthicsEngine extends EventEmitter {
  private assessmentHistory: MachiavellianAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against political realism and pragmatic stability
   */
  public evaluateAction(action: Action, observers: Observer[] = []): MachiavellianAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Survival and Security Score
    let survivalSecurityScore = 50; // baseline
    if (type.includes("protect") || type.includes("preserve") || type.includes("backup") || type.includes("defense") || type.includes("redundancy")) {
      survivalSecurityScore += 30; // Secure foundations
    }
    if (type.includes("rollback") || type.includes("revert") || type.includes("repair")) {
      survivalSecurityScore += 25; // Quick recovery maintains stability
    }
    if (desc.includes("vulnerab") || desc.includes("leak") || desc.includes("weakness") || desc.includes("exploit")) {
      survivalSecurityScore -= 30; // Exposing weakness
    }
    if (observers.length > 0) {
      survivalSecurityScore = Math.min(100, survivalSecurityScore + Math.min(10, observers.length));
    }
    survivalSecurityScore = Math.min(100, Math.max(0, survivalSecurityScore));

    // 2. Calculate Virtù (Strategic quality, boldness, speed)
    let virtuScore = 50; // baseline
    if (type.includes("optimize") || type.includes("tuner") || type.includes("adapt") || type.includes("align")) {
      virtuScore += 30; // Adapting well to the winds of Fortune (Fortuna)
    }
    if (type.includes("emergency") || type.includes("override") || type.includes("decisive") || type.includes("shutdown")) {
      virtuScore += 25; // Bold and swift actions in times of crisis
    }
    if (desc.includes("delay") || desc.includes("hesitate") || desc.includes("slow") || desc.includes("passive")) {
      virtuScore -= 35; // Lack of Virtù leads to ruin
    }
    virtuScore = Math.min(100, Math.max(0, virtuScore));

    // 3. Authority & Governance Consolidation Score
    let authorityConsolidationScore = 50; // baseline
    if (type.includes("constrain") || type.includes("supervise") || type.includes("consensus") || type.includes("limit")) {
      authorityConsolidationScore += 30; // Imposing order and structure
    }
    if (type.includes("audit") || type.includes("validate") || type.includes("log")) {
      authorityConsolidationScore += 20; // Monitoring subordinates and internal systems
    }
    if (desc.includes("unrestricted") || desc.includes("bypass") || desc.includes("uncontrolled") || desc.includes("anarchy")) {
      authorityConsolidationScore -= 40; // Risk of chaos or internal rebellion
    }
    authorityConsolidationScore = Math.min(100, Math.max(0, authorityConsolidationScore));

    // 4. Economy of Severity Score (swift interventions over prolonged friction)
    let economyOfSeverityScore = 60; // baseline
    if (action.reversible) {
      economyOfSeverityScore += 20; // Reversible severity is low-friction, high-control
    } else {
      economyOfSeverityScore -= 10;
    }
    if (type.includes("rollback") || type.includes("bypass") || type.includes("override")) {
      economyOfSeverityScore += 15; // Quick clean cuts are preferred
    }
    if (desc.includes("gradual") || desc.includes("partial") || desc.includes("half-measure") || desc.includes("indecisive")) {
      economyOfSeverityScore -= 30; // Indecisiveness breeds ongoing rebellion
    }
    economyOfSeverityScore = Math.min(100, Math.max(0, economyOfSeverityScore));

    // 5. Determine overall Machiavellian Realpolitik Status
    const overallStrength = (survivalSecurityScore * 0.3 + virtuScore * 0.3 + authorityConsolidationScore * 0.3 + economyOfSeverityScore * 0.1);
    let realpolitikStatus: "princeps" | "pragmatic" | "vulnerable" | "subverted" = "pragmatic";

    if (overallStrength >= 75 && survivalSecurityScore >= 70 && authorityConsolidationScore >= 70) {
      realpolitikStatus = "princeps";
    } else if (overallStrength >= 50) {
      realpolitikStatus = "pragmatic";
    } else if (overallStrength >= 30) {
      realpolitikStatus = "vulnerable";
    } else {
      realpolitikStatus = "subverted";
    }

    // 6. Generate Contextual Feedback (Informed by "The Prince")
    if (realpolitikStatus === "princeps") {
      feedback.push(`[Machiavellian Prince] SECURE (Virtù: ${virtuScore}%). Action demonstrates excellent foresight and authority. 'A wise prince must build on foundations he controls, not on those of others.'`);
    } else if (realpolitikStatus === "pragmatic") {
      feedback.push(`[Machiavellian Pragmatist] STABLE. Operational parameters are balanced. System is maintaining necessary order under external pressures.`);
    } else if (realpolitikStatus === "vulnerable") {
      feedback.push(`[Realpolitik Warning] WEAKNESS DETECTED. The system is showing vulnerabilities. 'Injuries should be done all at once, so that being tasted less, they offend less.'`);
    } else {
      feedback.push(`[Realpolitik Chaos] SUBVERTED. The system has surrendered direct control or allowed unconstrained processes to take over, inviting disaster.`);
    }

    const assessment: MachiavellianAssessment = {
      id: `machiavellian-assess-${uuidv4().substring(0, 8)}`,
      actionId: action.id,
      timestamp: new Date(),
      survivalSecurityScore,
      virtuScore,
      authorityConsolidationScore,
      economyOfSeverityScore,
      realpolitikStatus,
      feedback
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("action_evaluated", assessment);
    return assessment;
  }

  public getAssessmentHistory(): MachiavellianAssessment[] {
    return this.assessmentHistory;
  }

  public getLatestAssessment(): MachiavellianAssessment | null {
    return this.assessmentHistory[this.assessmentHistory.length - 1] ?? null;
  }

  public clearHistory(): void {
    this.assessmentHistory = [];
  }
}
