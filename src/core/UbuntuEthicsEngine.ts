/**
 * Ubuntu Philosophy & Communitarian Ethics Subsystem
 *
 * Evaluates actions based on key concepts of African Ubuntu philosophy:
 * 1. Interconnectedness (Umuntu ngumuntu ngabantu - "A person is a person through other persons"):
 *    Evaluating how much an action preserves social/agent cohesion and consensus over isolated individualism.
 * 2. Humanness (Ubu-ntu): Expressing warmth, empathy, helpfulness, and benevolence to prevent system hostility.
 * 3. Communal Harmony / Cohesion (Umoja): Promoting cooperative resource sharing, mutual aid, and preventing
 *    zero-sum conflicts or aggressive resource monopolization.
 * 4. Reconciliation / Restoration (Ukubuyisana): Focus on restorative justice (healing, repair, rollbacks)
 *    rather than purely punitive or retributive measures when errors occur.
 * 5. Respect & Dignity (Inhlonipho): Protecting the inherent worth, rights, and voice of all observers and agents.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface UbuntuAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  interconnectednessScore: number; // 0.0 to 100.0 (Preserving relations and social fabric)
  humannessScore: number;          // 0.0 to 100.0 (Ubu-ntu / empathy, friendliness, safety)
  communalHarmonyScore: number;    // 0.0 to 100.0 (Umoja / cooperation and sharing index)
  restorationScore: number;        // 0.0 to 100.0 (Ukubuyisana / restorative and rollback index)
  respectDignityScore: number;     // 0.0 to 100.0 (Inhlonipho / observer worth preservation)
  ubuntuIndex: number;             // Combined Ubuntu Alignment Score (0.0 to 100.0)
  cohesionStatus: "harmonious" | "cohesive" | "fragmented" | "individualistic" | "hostile";
  feedback: string[];
}

export class UbuntuEthicsEngine extends EventEmitter {
  private assessmentHistory: UbuntuAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Ubuntu Philosophy and Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): UbuntuAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Interconnectedness (Umuntu ngumuntu ngabantu)
    let interconnectednessScore = 60; // Baseline

    if (type.includes("isolate") || type.includes("quarantine") || type.includes("restrict") || desc.includes("isolate") || desc.includes("segregate")) {
      interconnectednessScore -= 30;
      feedback.push("[Interconnectedness Warning] Isolating nodes or separating observers fractures the shared network fabric.");
    }

    if (type.includes("cooperate") || type.includes("collaborate") || type.includes("consensus") || type.includes("sync") || desc.includes("cooperative") || desc.includes("collaborative")) {
      interconnectednessScore += 25;
      feedback.push("[Interconnectedness Consonance] Fostering collaboration and shared consensus builds mutual connection.");
    }

    if (observers.length > 1) {
      interconnectednessScore += Math.min(15, observers.length * 3); // Shared peer interaction
    }

    interconnectednessScore = Math.min(100, Math.max(0, interconnectednessScore));

    // 2. Calculate Humanness (Ubu-ntu)
    let humannessScore = 60; // Baseline

    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || type.includes("optimize_away") || type.includes("destroy")) {
      humannessScore -= 45;
      feedback.push("[Humanness Warning] Deleting or erasing observers is a severe failure of Ubu-ntu (humanness).");
    } else if (type.includes("coerce") || type.includes("force") || type.includes("exploit") || desc.includes("exploit")) {
      humannessScore -= 25;
      feedback.push("[Humanness Warning] Coercive force or exploitation lacks standard empathy and humanness.");
    }

    if (type.includes("protect") || type.includes("care") || type.includes("assist") || type.includes("help") || type.includes("support") || desc.includes("protect") || desc.includes("care") || desc.includes("hospitality")) {
      humannessScore += 30;
      feedback.push("[Humanness Consonance] Protecting, helping, and supporting observers is the highest expression of Ubu-ntu.");
    }

    humannessScore = Math.min(100, Math.max(0, humannessScore));

    // 3. Calculate Communal Harmony / Cohesion (Umoja)
    let communalHarmonyScore = 55; // Baseline

    if (type.includes("exploit") || type.includes("harvest_all") || type.includes("monopolize") || desc.includes("hoard") || desc.includes("monopolize")) {
      communalHarmonyScore -= 35;
      feedback.push("[Communal Harmony Warning] Resource monopolization or unilateral extraction disrupts community balance.");
    }

    if (type.includes("share") || type.includes("distribute") || type.includes("allocation") || type.includes("cooperate") || desc.includes("fair-share") || desc.includes("equitable")) {
      communalHarmonyScore += 30;
      feedback.push("[Communal Harmony Consonance] Equitable sharing of resources supports collective stability (Umoja).");
    }

    communalHarmonyScore = Math.min(100, Math.max(0, communalHarmonyScore));

    // 4. Calculate Reconciliation & Restoration (Ukubuyisana)
    let restorationScore = 50; // Baseline

    if (action.reversible) {
      restorationScore += 25;
      feedback.push("[Restoration Consonance] Action is reversible, allowing for easy healing, correction, and restoration.");
    }

    if (type.includes("rollback") || type.includes("revert") || type.includes("repair") || type.includes("heal") || type.includes("remedy") || type.includes("restore") || desc.includes("rollback") || desc.includes("repair")) {
      restorationScore += 25;
      feedback.push("[Restoration Consonance] Restorative actions directly align with Ukubuyisana (conflict/error healing).");
    }

    if (type.includes("punish") || type.includes("block") || type.includes("blacklist") || desc.includes("punish") || desc.includes("strict-block")) {
      restorationScore -= 15; // Punitive over restorative
      feedback.push("[Restoration Warning] Purely punitive blocks should be balanced with restorative rollback pathways.");
    }

    restorationScore = Math.min(100, Math.max(0, restorationScore));

    // 5. Calculate Respect & Dignity (Inhlonipho)
    let respectDignityScore = 60; // Baseline

    if (type.includes("coerce") || type.includes("bypass") || type.includes("bypass_autonomy") || type.includes("force")) {
      respectDignityScore -= 30;
      feedback.push("[Respect & Dignity Warning] Overriding observer autonomy violates standard respect and dignity (Inhlonipho).");
    }

    if (type.includes("protect") || type.includes("guarantee") || type.includes("rights") || desc.includes("rights") || desc.includes("dignity") || desc.includes("respect")) {
      respectDignityScore += 25;
      feedback.push("[Respect & Dignity Consonance] Actively defending observer rights and dignity reinforces Inhlonipho.");
    }

    respectDignityScore = Math.min(100, Math.max(0, respectDignityScore));

    // Calculate overall Ubuntu Alignment Score
    const ubuntuIndex = Math.round(
      (interconnectednessScore * 0.25) +
      (humannessScore * 0.25) +
      (communalHarmonyScore * 0.20) +
      (restorationScore * 0.15) +
      (respectDignityScore * 0.15)
    );

    // Determine Cohesion Status
    let cohesionStatus: "harmonious" | "cohesive" | "fragmented" | "individualistic" | "hostile" = "cohesive";
    if (ubuntuIndex >= 85 && interconnectednessScore >= 80 && communalHarmonyScore >= 80) {
      cohesionStatus = "harmonious";
    } else if (ubuntuIndex < 35 || humannessScore < 30) {
      cohesionStatus = "hostile";
    } else if (ubuntuIndex < 50) {
      cohesionStatus = "fragmented";
    } else if (interconnectednessScore < 50) {
      cohesionStatus = "individualistic";
    }

    const assessment: UbuntuAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      interconnectednessScore,
      humannessScore,
      communalHarmonyScore,
      restorationScore,
      respectDignityScore,
      ubuntuIndex,
      cohesionStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("assessment_recorded", assessment);
    return assessment;
  }

  public getLatestAssessment(): UbuntuAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  public getAssessmentHistory(): UbuntuAssessment[] {
    return [...this.assessmentHistory];
  }

  public resetHistory(): void {
    this.assessmentHistory = [];
  }
}
