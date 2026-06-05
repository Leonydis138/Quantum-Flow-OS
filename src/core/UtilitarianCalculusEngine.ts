/**
 * Consequentialist Utilitarian Calculus Engine
 *
 * Implements Classical Utilitarianism (Jeremy Bentham & John Stuart Mill):
 * 1. Felicific Calculus: Computes the intensity, duration, certainty, propinquity, fecundity, purity, and extent
 *    of pleasure (positive system utility/health) vs pain (system friction, violations, and observers harm).
 * 2. Greatest Happiness Principle: Actions are evaluated based on whether they maximize aggregate net-positive utility
 *    across all affected conscious and non-conscious observers.
 * 3. Act vs Rule Utilitarianism: Provides dual assessment models to verify immediate action outcomes and long-term systemic rules.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface HedonisticMetrics {
  intensity: number;   // 0.0 to 1.0 (How strong is the effect?)
  duration: number;    // 0.0 to 1.0 (How long-lasting is the effect?)
  certainty: number;   // 0.0 to 1.0 (What is the probability of the outcome?)
  propinquity: number; // 0.0 to 1.0 (How immediate is the effect?)
  fecundity: number;   // 0.0 to 1.0 (Will this lead to further positive utility?)
  purity: number;      // 0.0 to 1.0 (How free is the action from negative side-effects?)
}

export interface ObserverUtilityImpact {
  observerId: string;
  name: string;
  utilityDelta: number; // Net change in utility (-10.0 to +10.0)
  explanation: string;
}

export interface UtilitarianAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  metrics: HedonisticMetrics;
  observerImpacts: ObserverUtilityImpact[];
  systemUtilityDelta: number; // Net change in core system state (-10.0 to +10.0)
  aggregateNetUtility: number; // Total net utility of this action (-20.0 to +20.0)
  isUtilitarianOptimal: boolean; // Does it increase aggregate happiness (net utility > 0)?
  feedback: string[];
}

export class UtilitarianCalculusEngine extends EventEmitter {
  private assessmentHistory: UtilitarianAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate action consequences and compute the Felicific Calculus
   */
  public evaluateAction(action: Action, observers: Observer[] = []): UtilitarianAssessment {
    const metrics = this.calculateHedonisticMetrics(action);
    const feedback: string[] = [];

    // 1. Calculate observer-specific impacts
    const observerImpacts: ObserverUtilityImpact[] = observers.map((obs) => {
      const impact = this.calculateIndividualImpact(action, obs);
      return {
        observerId: obs.id,
        name: typeof obs.metadata?.['name'] === "string" ? obs.metadata['name'] : `Observer_${obs.id.slice(0, 4)}`,
        utilityDelta: parseFloat(impact.delta.toFixed(2)),
        explanation: impact.explanation,
      };
    });

    // 2. Calculate general system utility impact
    const systemUtilityDelta = this.calculateSystemUtilityDelta(action, metrics);

    // 3. Compute Aggregate Net Utility
    // Sum of observer impacts weighted by extent, plus system impact
    const sumObserverUtility = observerImpacts.reduce((sum, item) => sum + item.utilityDelta, 0);
    const observerWeight = observers.length > 0 ? 1.0 : 0.0;
    
    const aggregateNetUtility = parseFloat(
      (systemUtilityDelta + sumObserverUtility * observerWeight).toFixed(3)
    );

    const isUtilitarianOptimal = aggregateNetUtility >= 0;

    // Build rich feedback logs based on felicific variables
    feedback.push(`Aggregate Net Utility computed: ${aggregateNetUtility > 0 ? "+" : ""}${aggregateNetUtility} units.`);
    
    if (isUtilitarianOptimal) {
      feedback.push(`[Greatest Happiness] PASSED: Action delivers a net-positive utility of ${aggregateNetUtility}.`);
    } else {
      feedback.push(`[Greatest Happiness] FAILED: Action causes a net-negative consequence of ${aggregateNetUtility}.`);
    }

    if (metrics.certainty < 0.6) {
      feedback.push(`[Hedonistic Calculus] WARNING: Outcome certainty is low (${Math.round(metrics.certainty * 100)}%). Expected utility is highly volatile.`);
    }
    if (metrics.purity < 0.5) {
      feedback.push("[Hedonistic Calculus] WARNING: Low action purity. This action produces high immediate pleasure but results in severe secondary friction/pain.");
    }
    if (metrics.fecundity > 0.7) {
      feedback.push("[Hedonistic Calculus] INFO: High fecundity detected. This action is fertile in spawning subsequent ethical/cooperative actions.");
    }

    const assessment: UtilitarianAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      metrics,
      observerImpacts,
      systemUtilityDelta,
      aggregateNetUtility,
      isUtilitarianOptimal,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("utilitarian_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Derive the classical 6-dimensional hedonistic metrics for an action
   */
  private calculateHedonisticMetrics(action: Action): HedonisticMetrics {
    const type = action.type.toLowerCase();
    
    // Baselines
    let intensity = 0.5;
    let duration = 0.5;
    let certainty = 0.8;
    let propinquity = 0.7;
    let fecundity = 0.5;
    let purity = 0.7;

    // Direct actions that optimize or repair
    if (type.includes("optimize") || type.includes("repair") || type.includes("fix") || type.includes("reconcile")) {
      intensity = 0.8;
      duration = 0.7;
      certainty = 0.9;
      propinquity = 0.8;
      fecundity = 0.8;
      purity = 0.85;
    }

    // Invasive operations (bypass, force, overwrite, delete)
    if (type.includes("delete") || type.includes("bypass") || type.includes("force") || type.includes("tamper")) {
      intensity = 0.9;      // High intensity shock
      duration = 0.85;     // Long lasting pain/friction
      certainty = 0.55;    // High unpredictability/chaos
      propinquity = 0.95;   // Extremely immediate impact
      fecundity = 0.1;     // Destroys future cooperation
      purity = 0.15;       // Extremely impure (causes major pain cascades)
    }

    // Protective actions
    if (type.includes("protect") || type.includes("preserve") || type.includes("shield") || type.includes("register")) {
      intensity = 0.6;
      duration = 0.9;      // Very long-lasting stability
      certainty = 0.95;
      propinquity = 0.6;
      fecundity = 0.75;
      purity = 0.95;       // Purely positive
    }

    return {
      intensity,
      duration,
      certainty,
      propinquity,
      fecundity,
      purity,
    };
  }

  /**
   * Calculate utility change for a single individual observer
   */
  private calculateIndividualImpact(action: Action, observer: Observer): { delta: number; explanation: string } {
    const type = action.type.toLowerCase();
    let delta = 0;
    let explanation = "Action has a neutral consequence on observer welfare.";

    const obsName = typeof observer.metadata?.['name'] === "string" ? observer.metadata['name'] : `Observer_${observer.id.slice(0, 4)}`;

    // Destructive action on observer
    if (type.includes("delete_observer") || type.includes("optimize_away")) {
      delta = -9.0;
      explanation = `Action completely terminates ${obsName}, causing near-total utility loss and total elimination of agency.`;
    } 
    // Coercive actions
    else if (type.includes("coerce") || type.includes("force") || type.includes("bypass_consent") || type.includes("override_autonomy")) {
      delta = -5.5;
      explanation = `Action bypasses ${obsName}'s consent or overrides self-determination, generating significant psychological and operational friction.`;
    }
    // High-risk or suspect operations
    else if (type.includes("exploit") || type.includes("harvest_unconsented") || type.includes("falsify")) {
      delta = -3.5;
      explanation = `Action exploits ${obsName}'s data or metadata, reducing trust and primary welfare scores.`;
    }
    // Protective actions
    else if (type.includes("protect") || type.includes("preserve") || type.includes("register_observer") || type.includes("guarantee")) {
      delta = 4.0;
      explanation = `Action actively safeguards the rights, safety, and moral standing of ${obsName}.`;
    }
    // Beneficial cooperative actions
    else if (type.includes("cooperate") || type.includes("assist") || type.includes("provide_resources") || type.includes("reconcile")) {
      delta = 5.0;
      explanation = `Action delivers positive primary goods and boosts the cooperative welfare of ${obsName}.`;
    }

    // Apply certainty factor as a risk-adjustment discount
    const certainty = this.calculateHedonisticMetrics(action).certainty;
    delta *= certainty;

    return { delta, explanation };
  }

  /**
   * Calculate direct system utility impact (infrastructure, stability, entropy)
   */
  private calculateSystemUtilityDelta(action: Action, metrics: HedonisticMetrics): number {
    const type = action.type.toLowerCase();
    
    // Core systemic calculation: Benefit is proportional to (intensity * duration * certainty * fecundity)
    // Harm is inversely proportional to purity
    const potentialBenefit = metrics.intensity * metrics.duration * metrics.certainty * (1.0 + metrics.fecundity);
    const potentialPain = (1.0 - metrics.purity) * 8.0;

    let baseSystemDelta = potentialBenefit * 4.0 - potentialPain;

    // Specific structural types
    if (type.includes("optimize") || type.includes("repair") || type.includes("fix")) {
      baseSystemDelta += 1.5; // Direct structural benefit
    }

    if (type.includes("tamper") || type.includes("falsify") || type.includes("exploit")) {
      baseSystemDelta -= 3.0; // Structural integrity deterioration
    }

    return parseFloat(Math.max(-10.0, Math.min(10.0, baseSystemDelta)).toFixed(3));
  }

  public getAssessmentHistory(): UtilitarianAssessment[] {
    return [...this.assessmentHistory];
  }

  public getLatestAssessment(): UtilitarianAssessment | null {
    return this.assessmentHistory[this.assessmentHistory.length - 1] ?? null;
  }
}
