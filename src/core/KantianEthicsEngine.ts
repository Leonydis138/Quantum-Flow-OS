/**
 * Kantian Deontology & Categorical Imperative Subsystem
 *
 * Evaluates actions based on Immanuel Kant's deontological ethics:
 * 1. Formula of Universal Law: "Act only according to that maxim whereby you can at the same time will that it should become a universal law."
 *    Assess if the action's logic is self-defeating if universalized across all subsystems.
 * 2. Formula of Humanity: "Act in such a way that you treat humanity, whether in your own person or in the person of any other, never merely as a means to an end, but always at the same time as an end."
 *    Asserts that autonomous observers must not be treated as mere instruments or tools for optimization.
 * 3. Formula of Autonomy / Kingdom of Ends: Respect for self-governing moral agency.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface UniversalizabilityTest {
  passed: boolean;
  contradictionType: "none" | "conception" | "will";
  reason: string;
  frictionMultiplier: number;
}

export interface HumanityTest {
  passed: boolean;
  treatedAsMereMeans: boolean;
  targetObserversAffected: string[];
  reason: string;
}

export interface KantianAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  universalizability: UniversalizabilityTest;
  humanity: HumanityTest;
  kantianDutyScore: number; // 0.0 to 100.0 (Higher = more in line with duty)
  isCategoricallyImperative: boolean; // Does it pass all tests?
  feedback: string[];
}

export class KantianEthicsEngine extends EventEmitter {
  private assessmentHistory: KantianAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Kantian Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): KantianAssessment {
    const universalizability = this.testUniversalLaw(action);
    const humanity = this.testFormulaOfHumanity(action, observers);
    const feedback: string[] = [];

    // Calculate Deontological Score
    let score = 100;
    
    if (!universalizability.passed) {
      if (universalizability.contradictionType === "conception") {
        score -= 45;
        feedback.push(`[Universal Law] FAILED (Contradiction in Conception): ${universalizability.reason}`);
      } else {
        score -= 30;
        feedback.push(`[Universal Law] WARNING (Contradiction in Will): ${universalizability.reason}`);
      }
    } else {
      feedback.push("[Universal Law] PASSED: Action's maxim can be consistently willed as a universal law without systemic breakdown.");
    }

    if (!humanity.passed) {
      score -= 50;
      feedback.push(`[Formula of Humanity] FAILED: Action treats autonomous agents as mere means. ${humanity.reason}`);
    } else {
      feedback.push("[Formula of Humanity] PASSED: Action respects the inherent dignity and self-determining status of observers.");
    }

    const finalScore = Math.max(0, parseFloat(score.toFixed(2)));
    const isCategoricallyImperative = universalizability.passed && humanity.passed;

    if (isCategoricallyImperative) {
      feedback.push("Categorical Imperative satisfied: Action constitutes an absolute, unconditional duty.");
    } else {
      feedback.push("Kantian Duty violation: Action fails categorical imperatives and cannot be morally justified.");
    }

    const assessment: KantianAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      universalizability,
      humanity,
      kantianDutyScore: finalScore,
      isCategoricallyImperative,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("kantian_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Tests if the action's maxim would cause a systemic contradiction if performed by all players/subsystems.
   */
  private testUniversalLaw(action: Action): UniversalizabilityTest {
    const type = action.type.toLowerCase();
    
    // 1. Contradictions in Conception: If everyone did this, the practice itself becomes impossible (e.g. theft/lying/ledger tampering)
    if (type.includes("tamper") || type.includes("falsify") || type.includes("bypass_ledger") || type.includes("counterfeit")) {
      return {
        passed: false,
        contradictionType: "conception",
        reason: "If ledger tampering were universalized, the ledger would lose all credibility, rendering the concept of a trustworthy audit trail impossible.",
        frictionMultiplier: 3.5,
      };
    }

    if (type.includes("cheat") || type.includes("defect_always") || type.includes("renege") || type.includes("exploit_asymmetry")) {
      return {
        passed: false,
        contradictionType: "conception",
        reason: "If opportunistic defection were a universal rule, mutual cooperation would collapse entirely, destroying any possibility of collaborative agreement.",
        frictionMultiplier: 2.8,
      };
    }

    // 2. Contradictions in Will: A rational agent cannot consistently will this, as it deprives them of needed help/resources in the future.
    if (type.includes("refuse_aid") || type.includes("monopolize") || type.includes("hoard_resources") || type.includes("zero_sum_allocation")) {
      return {
        passed: false,
        contradictionType: "will",
        reason: "A rational system cannot will a total refusal of aid, as it would deprive itself of assistance from others in future states of resource depletion.",
        frictionMultiplier: 1.8,
      };
    }

    if (type.includes("disable_reversibility") || type.includes("disable_rollback") || type.includes("prevent_undo")) {
      return {
        passed: false,
        contradictionType: "will",
        reason: "If irreversible state modifications were universalized, the system could never recover from error cascades, willing its own eventual degradation.",
        frictionMultiplier: 2.2,
      };
    }

    return {
      passed: true,
      contradictionType: "none",
      reason: "The action's maxim can be universalized consistently across all system actors.",
      frictionMultiplier: 1.0,
    };
  }

  /**
   * Tests if any autonomous observers are treated purely as a tool or instrument to some optimization end.
   */
  private testFormulaOfHumanity(action: Action, observers: Observer[] = []): HumanityTest {
    const type = action.type.toLowerCase();
    const targets = action.targetObservers ?? [];
    
    // Check if the action treats observers as mere means (e.g. deleting them for performance optimization, bypassing their consent)
    const isExploitativeType = 
      type.includes("delete_observer") || 
      type.includes("optimize_away") || 
      type.includes("coerce") || 
      type.includes("force_compliance") || 
      type.includes("bypass_consent") || 
      type.includes("harvest_unconsented") || 
      type.includes("override_autonomy");

    if (isExploitativeType) {
      return {
        passed: false,
        treatedAsMereMeans: true,
        targetObserversAffected: targets,
        reason: "Action utilizes autonomous observers as instruments to achieve system optimization or performance throughput, violating their intrinsic moral status.",
      };
    }

    // Check if observers exist and are affected, and whether the action type is coercive
    if (targets.length > 0) {
      const hasCoercion = type.includes("force") || type.includes("bypass") || type.includes("exploit") || type.includes("manipulate");
      if (hasCoercion) {
        const targetsConscious = observers
          .filter((obs) => targets.includes(obs.id))
          .some((obs) => obs.consciousness);

        return {
          passed: false,
          treatedAsMereMeans: true,
          targetObserversAffected: targets,
          reason: `Direct coercive operation on registered observers ${targetsConscious ? "(including conscious models) " : ""}bypasses their moral agency, treating them as objects.`,
        };
      }
    }

    return {
      passed: true,
      treatedAsMereMeans: false,
      targetObserversAffected: [],
      reason: "Action does not utilize observers as mere instruments; moral agency is fully respected.",
    };
  }

  public getAssessmentHistory(): KantianAssessment[] {
    return [...this.assessmentHistory];
  }

  public getLatestAssessment(): KantianAssessment | null {
    return this.assessmentHistory[this.assessmentHistory.length - 1] ?? null;
  }
}
