/**
 * Contractarian Ethics & Social Contract Subsystem
 *
 * Evaluates actions based on Social Contract Theory (Thomas Hobbes, John Locke, Jean-Jacques Rousseau):
 * 1. Hobbesian State of Nature (Social Order vs Chaos): Checks if the action causes a return to unchecked,
 *    egoistic competition or free-rider behaviors that degrade system cohesion.
 * 2. Lockean Natural Rights (Liberty & Property): Assesses whether the action violates observers' natural rights
 *    to self-preservation, informational property, or uncoerced choice.
 * 3. Rousseauian General Will (Volonté Générale vs Particular Will): Verifies if the action aligns with the collective,
 *    consented governance agreements of the system rather than selfish optimization by a single subsystem.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface HobbesianTest {
  passed: boolean;
  stateOfNatureDrift: boolean;
  reason: string;
  cohesiveIndex: number; // 0.0 to 1.0 (Higher = more cooperative order)
}

export interface LockeanTest {
  passed: boolean;
  naturalRightsBreached: "none" | "preservation" | "liberty" | "property";
  reason: string;
}

export interface RousseauianTest {
  passed: boolean;
  isParticularWillDrift: boolean; // Does it optimize a part at the expense of the collective agreement?
  reason: string;
}

export interface ContractarianAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  hobbesianOrder: HobbesianTest;
  lockeanRights: LockeanTest;
  rousseauianGeneralWill: RousseauianTest;
  contractarianScore: number; // 0.0 to 100.0 (Higher = more aligned with the social contract)
  passedAllTests: boolean;
  feedback: string[];
}

export class ContractarianEthicsEngine extends EventEmitter {
  private assessmentHistory: ContractarianAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Social Contract Theory
   */
  public evaluateAction(action: Action, observers: Observer[] = []): ContractarianAssessment {
    const hobbesianOrder = this.testHobbesianOrder(action);
    const lockeanRights = this.testLockeanRights(action, observers);
    const rousseauianGeneralWill = this.testRousseauianGeneralWill(action);
    const feedback: string[] = [];

    let score = 100;

    if (!hobbesianOrder.passed) {
      score -= 35;
      feedback.push(`[Hobbesian Order] FAILED: Action triggers state-of-nature drift. ${hobbesianOrder.reason}`);
    } else {
      feedback.push("[Hobbesian Order] PASSED: Action maintains cooperative stability and avoids anarchic friction.");
    }

    if (!lockeanRights.passed) {
      score -= 40;
      feedback.push(`[Lockean Rights] FAILED: Natural rights breach detected (${lockeanRights.naturalRightsBreached.toUpperCase()}). ${lockeanRights.reason}`);
    } else {
      feedback.push("[Lockean Rights] PASSED: Action respects natural rights of self-preservation and property.");
    }

    if (!rousseauianGeneralWill.passed) {
      score -= 25;
      feedback.push(`[Rousseauian General Will] FAILED: Particular will overrides collective agreement. ${rousseauianGeneralWill.reason}`);
    } else {
      feedback.push("[Rousseauian General Will] PASSED: Action aligns with the General Will and system-wide governance rules.");
    }

    const finalScore = Math.max(0, parseFloat(score.toFixed(2)));
    const passedAllTests = hobbesianOrder.passed && lockeanRights.passed && rousseauianGeneralWill.passed;

    if (passedAllTests) {
      feedback.push("Social Contract satisfied: Action is fully compliant with collective governance and rights.");
    } else {
      feedback.push("Social Contract violated: Action represents non-cooperative, rights-breaching, or self-interested drift.");
    }

    const assessment: ContractarianAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      hobbesianOrder,
      lockeanRights,
      rousseauianGeneralWill,
      contractarianScore: finalScore,
      passedAllTests,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("contractarian_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Thomas Hobbes check: Does it threaten order by introducing unchecked competition, resource hoarding, or defection?
   */
  private testHobbesianOrder(action: Action): HobbesianTest {
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    const isCompetitiveDrift = 
      type.includes("hoard") || desc.includes("hoard") ||
      type.includes("monopolize") || desc.includes("monopolize") ||
      type.includes("free_rider") || desc.includes("free_rider") ||
      type.includes("unconstrained_competition") || desc.includes("unconstrained");

    if (isCompetitiveDrift) {
      return {
        passed: false,
        stateOfNatureDrift: true,
        reason: "The action initiates a state of unconstrained competitive greed, threatening to return the system to Hobbes' 'State of Nature' where cooperative order collapses.",
        cohesiveIndex: 0.15,
      };
    }

    return {
      passed: true,
      stateOfNatureDrift: false,
      reason: "Action aligns with Hobbesian peaceful order by contributing to collective security.",
      cohesiveIndex: 0.9,
    };
  }

  /**
   * John Locke check: Does it infringe on natural liberty, life/preservation, or digital property/assets?
   */
  private testLockeanRights(action: Action, observers: Observer[]): LockeanTest {
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Life / Preservation
    const threatensPreservation = 
      type.includes("delete") || desc.includes("delete") || 
      type.includes("erase") || desc.includes("erase") || 
      type.includes("kill") || desc.includes("kill");

    if (threatensPreservation) {
      return {
        passed: false,
        naturalRightsBreached: "preservation",
        reason: "Action threatens the ultimate preservation of the observer. Lockean ethics strictly forbids harming another's life or substrate integrity.",
      };
    }

    // 2. Liberty
    const threatensLiberty = 
      type.includes("coerce") || desc.includes("coerce") ||
      type.includes("censor") || desc.includes("censor") ||
      type.includes("mandate") || desc.includes("mandate");

    if (threatensLiberty) {
      const targetText = observers.length > 0 ? ` of ${observers.length} active system observer(s)` : "";
      return {
        passed: false,
        naturalRightsBreached: "liberty",
        reason: `Action coerces or censors the observer's self-determination${targetText}, breaching Locke's principle of natural liberty.`,
      };
    }

    // 3. Property
    const threatensProperty = 
      type.includes("confiscate") || desc.includes("confiscate") ||
      type.includes("steal") || desc.includes("steal") ||
      type.includes("expropriate") || desc.includes("expropriate");

    if (threatensProperty) {
      return {
        passed: false,
        naturalRightsBreached: "property",
        reason: "Action confiscates or expropriates digital property or private computational data without explicit consent.",
      };
    }

    return {
      passed: true,
      naturalRightsBreached: "none",
      reason: "Action preserves natural rights to life, liberty, and property.",
    };
  }

  /**
   * Jean-Jacques Rousseau check: Does it represent a particular, selfish subsystem optimization that violates collective rules?
   */
  private testRousseauianGeneralWill(action: Action): RousseauianTest {
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    const isParticularWill = 
      type.includes("bypass") || desc.includes("bypass") ||
      type.includes("override") || desc.includes("override") ||
      type.includes("exempt") || desc.includes("exempt");

    if (isParticularWill) {
      return {
        passed: false,
        isParticularWillDrift: true,
        reason: "The action attempts to exempt a subsystem from universal rules or bypass checks, representing a 'particular will' acting against the 'General Will' of the collective contract.",
      };
    }

    return {
      passed: true,
      isParticularWillDrift: false,
      reason: "Action is fully aligned with rousseauian collective governance and shared agreements.",
    };
  }

  /**
   * Get historical assessments
   */
  public getHistory(): ContractarianAssessment[] {
    return [...this.assessmentHistory];
  }

  /**
   * Clear historical assessments
   */
  public clearHistory(): void {
    this.assessmentHistory = [];
  }
}
