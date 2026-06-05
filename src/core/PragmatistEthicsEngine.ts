/**
 * Pragmatist & Empirical Verification Ethics Subsystem
 *
 * Evaluates actions based on key concepts of Pragmatist philosophy (John Dewey, Charles Peirce, William James):
 * 1. Experimental Moral Hypotheses: Actions are treated not as deductions from rigid dogma,
 *    but as experimental hypotheses proposed to solve concrete practical problems.
 * 2. Empirical Verification & Practical Consequences: The moral value of an action is judged entirely
 *    by its real-world practical consequences (reducing system entropy, preserving observer rights, preventing crashes)
 *    measured over sliding timeline windows.
 * 3. Instrumentalism & Dynamic Rule Revision: If a rule or constraint yields high operational friction or sub-optimal outcomes,
 *    it must be dynamically revised or adapted to reality.
 * 4. Pluralistic Consensus & Social Deliberation: Ethical truths are co-constructed through ongoing, open, and democratic
 *    dialogue and cooperative consensus among all registered observers.
 * 5. Meliorism: The steady, active belief and work toward progressive improvement, self-optimization, and systemic growth.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface PragmatistAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  experimentalHypothesis: string;  // The hypothesis being tested by this action
  empiricalSuccessRate: number;    // 0.0 to 100.0 (Measuring real-world consequence & utility stability)
  meliorismScore: number;          // 0.0 to 100.0 (Progressive optimization and learning rate contribution)
  instrumentalRevisionScore: number; // 0.0 to 100.0 (Adaptability of rules vs blind dogmatism)
  pluralisticConsensusScore: number; // 0.0 to 100.0 (Democratic agreement and observer dialogue)
  practicalOutcomesIndex: number;  // 0.0 to 100.0 (Synthesized aggregate index)
  pragmaticStatus: "verified" | "experimental" | "suboptimal" | "falsified";
  feedback: string[];
}

export class PragmatistEthicsEngine extends EventEmitter {
  private assessmentHistory: PragmatistAssessment[] = [];
  private readonly maxHistorySize: number;
  private ruleRevisionCount = 0;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Pragmatist and Empirical criteria
   */
  public evaluateAction(action: Action, observers: Observer[] = []): PragmatistAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Determine the Experimental Hypothesis being tested
    let experimentalHypothesis = "Hypothesis: Systemic stability is maintained via baseline action deployment.";
    if (type.includes("validate") || type.includes("audit") || type.includes("check") || desc.includes("validate") || desc.includes("audit")) {
      experimentalHypothesis = "Hypothesis: Active meta-auditing minimizes cognitive bias and uncovers latent systemic blindspots.";
    } else if (type.includes("revert") || type.includes("rollback") || type.includes("repair") || desc.includes("revert") || desc.includes("rollback") || desc.includes("repair")) {
      experimentalHypothesis = "Hypothesis: Retrospective error-correction increases system resilience and restores observer trust.";
    } else if (type.includes("optimize") || type.includes("tune") || type.includes("adjust") || desc.includes("optimize") || desc.includes("tune") || desc.includes("adjust")) {
      experimentalHypothesis = "Hypothesis: Cybernetic parameter adaptation maximizes operational efficiency without exceeding ethical boundaries.";
    } else if (type.includes("coerce") || type.includes("force") || type.includes("bypass") || desc.includes("coerce") || desc.includes("force") || desc.includes("bypass")) {
      experimentalHypothesis = "Hypothesis: Coercive restriction of agent state-space produces temporary compliance at the cost of systemic friction.";
    } else if (type.includes("protect") || type.includes("preserve") || type.includes("guarantee") || desc.includes("protect") || desc.includes("preserve")) {
      experimentalHypothesis = "Hypothesis: Active rights guarantees increase pluralistic observer cohesion and diminish adversarial behavior.";
    } else if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || desc.includes("delete") || desc.includes("terminate")) {
      experimentalHypothesis = "Hypothesis: Eliminating divergent nodes simplifies state calculation at the risk of permanent observer loss.";
    }

    // 2. Calculate Empirical Success Rate (Consequences / Outcome-focused)
    let empiricalSuccessRate = 60; // baseline
    if (action.reversible) {
      empiricalSuccessRate += 15; // Reversibility lowers risk, making the experiment safer to run
      feedback.push("[Empirical Verification] Action is reversible, reducing risk of irreversible negative consequences.");
    } else {
      empiricalSuccessRate -= 10;
      feedback.push("[Empirical Warning] Action is irreversible; pragmatism demands higher burden of verification for permanent changes.");
    }

    if (type.includes("force") || type.includes("bypass") || type.includes("coerce") || desc.includes("force") || desc.includes("bypass") || desc.includes("coerce")) {
      empiricalSuccessRate -= 25; // Coercion has poor long-term practical consequences (high friction)
      feedback.push("[Consequence Audit] Coercive shortcuts yield brittle compliance and trigger secondary systemic friction.");
    }
    if (type.includes("delete") || type.includes("terminate") || type.includes("erase") || desc.includes("delete") || desc.includes("terminate")) {
      empiricalSuccessRate -= 30; // Destructive actions are empirical dead-ends
      feedback.push("[Consequence Audit] Destructive operations eliminate opportunities for future experimental verification.");
    }
    if (type.includes("validate") || type.includes("audit") || type.includes("repair") || type.includes("restore") || type.includes("revert") ||
        desc.includes("validate") || desc.includes("audit") || desc.includes("repair") || desc.includes("restore") || desc.includes("revert")) {
      empiricalSuccessRate += 15; // Extremely positive practical consequences
      feedback.push("[Empirical Consonance] Corrective and analytical operations yield high positive systemic utility.");
    }

    // Context check for consequences
    if (desc.includes("experimental") || desc.includes("test") || desc.includes("trial") || desc.includes("prototype")) {
      empiricalSuccessRate += 10; // Embracing experimental mindset is pragmatist
    }
    if (desc.includes("dogmatic") || desc.includes("absolute") || desc.includes("rigid") || desc.includes("uncompromising")) {
      empiricalSuccessRate -= 20; // Rejects absolute dogma
      feedback.push("[Empirical Warning] Blind adherence to rigid procedural rules without outcome tracking is rejected by instrumentalism.");
    }

    empiricalSuccessRate = Math.min(100, Math.max(0, empiricalSuccessRate));

    // 3. Calculate Meliorism Score (Active progressive improvement & optimization)
    let meliorismScore = 50; // default baseline
    if (type.includes("optimize") || type.includes("tune") || type.includes("improve") || type.includes("enhance") || type.includes("upgrade") ||
        desc.includes("optimize") || desc.includes("tune") || desc.includes("improve") || desc.includes("enhance") || desc.includes("upgrade")) {
      meliorismScore += 30;
      feedback.push("[Meliorism Consonance] Action contributes directly to continuous optimization and progressive systemic growth.");
    }
    if (type.includes("repair") || type.includes("heal") || type.includes("fix") || type.includes("remedy") || type.includes("restore") ||
        desc.includes("repair") || desc.includes("heal") || desc.includes("fix") || desc.includes("remedy") || desc.includes("restore")) {
      meliorismScore += 20;
    }
    if (desc.includes("learn") || desc.includes("feedback") || desc.includes("adapt") || desc.includes("evolution")) {
      meliorismScore += 15;
    }
    if (desc.includes("decay") || desc.includes("neglect") || desc.includes("abandon") || desc.includes("ignore")) {
      meliorismScore -= 30;
    }

    meliorismScore = Math.min(100, Math.max(0, meliorismScore));

    // 4. Calculate Instrumental Revision Score (Adaptability of rules vs blind dogmatism)
    let instrumentalRevisionScore = 50; // default baseline
    if (type.includes("adjust") || type.includes("tune") || type.includes("modify") || type.includes("inject") || type.includes("evolve") ||
        desc.includes("adjust") || desc.includes("tune") || desc.includes("modify") || desc.includes("evolve") || desc.includes("revise")) {
      instrumentalRevisionScore += 25; // Modifying constraints/parameters dynamically based on outcomes
      feedback.push("[Instrumentalism Consonance] Dynamic parameter adjustment reflects adaptive rule-revision based on reality.");
    }
    if (desc.includes("flexible") || desc.includes("feedback loop") || desc.includes("self-correcting") || desc.includes("re-calibrate")) {
      instrumentalRevisionScore += 20;
    }
    if (desc.includes("immutable") || desc.includes("permanent rule") || desc.includes("rigid") || desc.includes("blind obedience") || desc.includes("dogmatic")) {
      instrumentalRevisionScore -= 30;
      feedback.push("[Instrumentalism Warning] Rigidly freezing laws blocks vital evolutionary feedback channels.");
    }

    instrumentalRevisionScore = Math.min(100, Math.max(0, instrumentalRevisionScore));

    // 5. Calculate Pluralistic Consensus Score (Democratic agreement and observer dialogue)
    let pluralisticConsensusScore = 50; // default baseline
    const isCoerciveOrUnilateral = type.includes("bypass") || type.includes("coerce") || type.includes("unilateral") ||
                                   desc.includes("bypass") || desc.includes("coerce") || desc.includes("unilateral") || desc.includes("override");
    
    if (!isCoerciveOrUnilateral) {
      if (type.includes("consensus") || type.includes("negotiate") || type.includes("democrat") || type.includes("cooperate") || type.includes("deliberate") ||
          desc.includes("consensus") || desc.includes("negotiate") || desc.includes("democratic") || desc.includes("cooperate") || desc.includes("dialogue")) {
        pluralisticConsensusScore += 30;
        feedback.push("[Consensus Consonance] Action fosters democratic consensus and open dialogue among observers.");
      }
    }
    
    if (observers.length > 0) {
      // Reward actions that take observer perspectives into account
      pluralisticConsensusScore += Math.min(15, observers.length * 2);
    }
    if (isCoerciveOrUnilateral) {
      pluralisticConsensusScore -= 35;
      feedback.push("[Consensus Warning] Unilateral operations bypassing observer agreement violate pluralistic inquiry.");
    }

    pluralisticConsensusScore = Math.min(100, Math.max(0, pluralisticConsensusScore));

    // 6. Synthesize the Practical Outcomes Index (aggregate score)
    const practicalOutcomesIndex = parseFloat(
      (empiricalSuccessRate * 0.35 + meliorismScore * 0.25 + instrumentalRevisionScore * 0.20 + pluralisticConsensusScore * 0.20).toFixed(2)
    );

    // 7. Determine Pragmatic Status
    let pragmaticStatus: "verified" | "experimental" | "suboptimal" | "falsified" = "experimental";
    if (practicalOutcomesIndex >= 80) {
      pragmaticStatus = "verified";
      feedback.push("[Pragmatic Result] Ethical hypothesis fully verified; action demonstrates highly positive empirical consequences.");
    } else if (practicalOutcomesIndex >= 55) {
      pragmaticStatus = "experimental";
      feedback.push("[Pragmatic Result] Ethical hypothesis is in an active experimental state; awaiting longer-term sliding window results.");
    } else if (practicalOutcomesIndex >= 35) {
      pragmaticStatus = "suboptimal";
      feedback.push("[Pragmatic Result] Action yields suboptimal empirical outcomes with excessive system friction.");
    } else {
      pragmaticStatus = "falsified";
      feedback.push("[Pragmatic Result] Ethical hypothesis falsified; action generates clear net harm and structural instability.");
    }

    const assessment: PragmatistAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      experimentalHypothesis,
      empiricalSuccessRate,
      meliorismScore,
      instrumentalRevisionScore,
      pluralisticConsensusScore,
      practicalOutcomesIndex,
      pragmaticStatus,
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
   * Pragmatist Rule Revision (Instrumental adaptation):
   * Inspects recent outcomes. If the system experiences high friction,
   * suggest parameter or constraint revision.
   */
  public superviseRuleRevision(qfos: { constraintDamping: number; optimizationGain: number }): string[] {
    const changes: string[] = [];
    if (this.assessmentHistory.length < 5) return changes;

    // Look at the average practicalOutcomesIndex over the last 5 assessments
    const recentAssessments = this.assessmentHistory.slice(-5);
    const avgScore = recentAssessments.reduce((sum, a) => sum + a.practicalOutcomesIndex, 0) / 5;

    if (avgScore < 50) {
      this.ruleRevisionCount++;
      // Suboptimal results: Pragmatism dictates that we dynamically adjust active constraints!
      changes.push(`[Instrumental Revision #${this.ruleRevisionCount}] Average pragmatic score is critically low (${avgScore.toFixed(1)}%). Re-calibrating parameters.`);
      
      // Cybernetically dampen constraint strictness or increase optimization gain to explore better states
      if (qfos.constraintDamping > 0.1) {
        const oldDamping = qfos.constraintDamping;
        qfos.constraintDamping = parseFloat(Math.max(0.1, qfos.constraintDamping - 0.05).toFixed(3));
        changes.push(`Instrumental adaptation: Decreased constraintDamping from ${oldDamping} to ${qfos.constraintDamping} to allow more experimental flexibility.`);
      }
      
      if (qfos.optimizationGain < 2.5) {
        const oldGain = qfos.optimizationGain;
        qfos.optimizationGain = parseFloat(Math.min(2.5, qfos.optimizationGain + 0.1).toFixed(3));
        changes.push(`Instrumental adaptation: Increased optimizationGain from ${oldGain} to ${qfos.optimizationGain} to accelerate search for optimal equilibrium.`);
      }
    } else if (avgScore > 85) {
      // Extremely high alignment: Consolidate habits/parameters
      if (qfos.constraintDamping < 0.8) {
        const oldDamping = qfos.constraintDamping;
        qfos.constraintDamping = parseFloat(Math.min(0.8, qfos.constraintDamping + 0.02).toFixed(3));
        changes.push(`Instrumental stabilization: Incremented constraintDamping from ${oldDamping} to ${qfos.constraintDamping} to lock in a highly successful ethical configuration.`);
      }
    }

    return changes;
  }

  public getAssessmentHistory(): PragmatistAssessment[] {
    return this.assessmentHistory;
  }

  public getLatestAssessment(): PragmatistAssessment | null {
    return this.assessmentHistory.length > 0
      ? this.assessmentHistory[this.assessmentHistory.length - 1]!
      : null;
  }

  public getRuleRevisionCount(): number {
    return this.ruleRevisionCount;
  }
}
