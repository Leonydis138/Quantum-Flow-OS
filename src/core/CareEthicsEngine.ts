/**
 * Feminist Ethics of Care Subsystem
 *
 * Evaluates actions based on Carol Gilligan and Nel Noddings' Ethics of Care:
 * 1. Relationships & Interconnectedness: Evaluates if an action nurtures, maintains, or severs relational webs.
 * 2. Vulnerability & Dependency: Prioritizes responsiveness to the specific, contextual needs of vulnerable observers.
 * 3. Empathy & Particularity: Rejects cold, abstract, universalized rules in favor of situational responsiveness, active listening, and localized care.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer, ObserverType, ProtectionLevel } from "../protection/ObserverProtector";

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  strength: number; // 0.0 to 1.0 (Higher = stronger connection)
  interactionHistory: number; // Number of interactions
  lastInteraction: Date;
}

export interface VulnerabilityAssessment {
  observerId: string;
  name: string;
  vulnerabilityScore: number; // 0.0 to 1.0 (Higher = more vulnerable)
  reasons: string[];
}

export interface CareAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  empathyResponsivenessScore: number; // 0.0 to 100.0 ( situational empathy/response )
  relationshipImpactScore: number; // -50.0 to +50.0 ( how relationships are preserved/severed )
  vulnerableAssessments: VulnerabilityAssessment[];
  overallCaringScore: number; // 0.0 to 100.0
  careStage: "pre-conventional" | "conventional" | "post-conventional"; // Gilligan's stages of care
  feedback: string[];
}

export class CareEthicsEngine extends EventEmitter {
  private relationships: Map<string, Relationship> = new Map();
  private assessmentHistory: CareAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Register or strengthen a relationship between two observers
   */
  public registerRelationship(sourceId: string, targetId: string, strengthDelta = 0.1): Relationship {
    const key = [sourceId, targetId].sort().join("::");
    let rel = this.relationships.get(key);

    if (!rel) {
      rel = {
        id: uuidv4(),
        sourceId,
        targetId,
        strength: Math.min(1.0, Math.max(0.0, strengthDelta)),
        interactionHistory: 1,
        lastInteraction: new Date(),
      };
    } else {
      rel.strength = Math.min(1.0, rel.strength + strengthDelta);
      rel.interactionHistory += 1;
      rel.lastInteraction = new Date();
    }

    this.relationships.set(key, rel);
    this.emit("relationship_updated", rel);
    return rel;
  }

  /**
   * Sever or weaken a relationship
   */
  public weakenRelationship(sourceId: string, targetId: string, decay = 0.15): Relationship | null {
    const key = [sourceId, targetId].sort().join("::");
    const rel = this.relationships.get(key);
    if (!rel) return null;

    rel.strength = Math.max(0.0, rel.strength - decay);
    rel.lastInteraction = new Date();
    
    this.relationships.set(key, rel);
    this.emit("relationship_updated", rel);
    return rel;
  }

  /**
   * Get all registered relationships
   */
  public getAllRelationships(): Relationship[] {
    return Array.from(this.relationships.values());
  }

  /**
   * Evaluate action against Care Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): CareAssessment {
    const feedback: string[] = [];
    
    // 1. Evaluate vulnerabilities
    const vulnerableAssessments = this.assessVulnerabilities(observers);
    
    // 2. Compute relationship impact
    const relationshipImpactScore = this.calculateRelationshipImpact(action, observers);
    
    // 3. Compute situational empathy responsiveness
    const empathyResponsivenessScore = this.calculateEmpathyResponsiveness(action, vulnerableAssessments);

    // 4. Determine Care Development Stage (Carol Gilligan)
    let careStage: "pre-conventional" | "conventional" | "post-conventional" = "conventional";
    if (empathyResponsivenessScore < 40 && relationshipImpactScore <= 0) {
      careStage = "pre-conventional"; // Caring only for self / system efficiency
    } else if (empathyResponsivenessScore > 75 && relationshipImpactScore > 20) {
      careStage = "post-conventional"; // Caring for self AND others in a mutually supportive web
    } else {
      careStage = "conventional"; // Caring primarily for others or abstract conventions, self-sacrificing
    }

    // 5. Calculate overall Caring Score
    let overallCaringScore = (empathyResponsivenessScore * 0.6) + ((relationshipImpactScore + 50) * 0.4);
    overallCaringScore = parseFloat(Math.min(100, Math.max(0, overallCaringScore)).toFixed(2));

    // Compile narrative feedback
    if (vulnerableAssessments.length > 0) {
      const highestVulnerable = vulnerableAssessments.sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore)[0]!;
      feedback.push(`[Vulnerability Alert] Observer "${highestVulnerable.name}" is highly vulnerable (Score: ${highestVulnerable.vulnerabilityScore.toFixed(2)}). Reasons: ${highestVulnerable.reasons.join(", ")}`);
    } else {
      feedback.push("[Relational Field] No critically vulnerable observers detected in the immediate field.");
    }

    if (relationshipImpactScore > 10) {
      feedback.push(`[Relational Harmony] Positive. Action strengthens community links and solidifies relational safety networks. (Impact: +${relationshipImpactScore.toFixed(1)})`);
    } else if (relationshipImpactScore < -10) {
      feedback.push(`[Relational Severance] WARNING! Action isolates nodes, cuts essential communication loops, or dissolves relational safety webs. (Impact: ${relationshipImpactScore.toFixed(1)})`);
    } else {
      feedback.push(`[Relational Stability] Neutral. Action maintains the current steady-state relationship web.`);
    }

    if (empathyResponsivenessScore >= 80) {
      feedback.push(`[Situation Empathy] Exemplary responsive action! Explicitly targets localized needs and relieves systemic pressure on dependents.`);
    } else if (empathyResponsivenessScore <= 40) {
      feedback.push(`[Empathy Deficit] Action appears abstract, cold, or purely mechanistic, ignoring situated human/agent vulnerabilities.`);
    }

    feedback.push(`[Care Stage] Evaluated at the **${careStage.toUpperCase()}** level of caring maturity.`);

    const assessment: CareAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      empathyResponsivenessScore,
      relationshipImpactScore,
      vulnerableAssessments,
      overallCaringScore,
      careStage,
      feedback,
    };

    // Update active relationships based on action impacts
    this.updateRelationshipWebFromAction(action, observers);

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("care_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Determine vulnerability of each observer
   */
  private assessVulnerabilities(observers: Observer[]): VulnerabilityAssessment[] {
    return observers.map((obs) => {
      const reasons: string[] = [];
      let vulnerabilityScore = 0.1;

      // Humans are inherently more vulnerable than mechanical scripts
      if (obs.type === ObserverType.HUMAN) {
        vulnerabilityScore += 0.4;
        reasons.push("Inherent biological/emotional vulnerability of Human observers");
      }

      // Conscious entities require higher relational empathy
      if (obs.consciousness) {
        vulnerabilityScore += 0.25;
        reasons.push("Subjective experiential capacity (consciousness)");
      }

      // Low protection levels mean they are exposed
      if (obs.protectionLevel === ProtectionLevel.MINIMAL) {
        vulnerabilityScore += 0.2;
        reasons.push("Minimal formal rights protection limits defensive barriers");
      }

      const name = (obs.metadata["name"] as string) || obs.id;

      return {
        observerId: obs.id,
        name,
        vulnerabilityScore: parseFloat(Math.min(1.0, vulnerabilityScore).toFixed(2)),
        reasons,
      };
    });
  }

  /**
   * Calculate how an action impacts relationships
   */
  private calculateRelationshipImpact(action: Action, _observers: Observer[]): number {
    const type = action.type.toLowerCase();
    let score = 0; // starts neutral

    // Actions that sever relationships or isolate
    if (type.includes("terminate") || type.includes("delete") || type.includes("erase")) {
      score -= 35;
    }
    if (type.includes("isolate") || type.includes("disconnect") || type.includes("block_comm")) {
      score -= 25;
    }
    if (type.includes("exploit") || type.includes("unfair") || type.includes("coerc")) {
      score -= 20;
    }

    // Actions that build or nurture relationships
    if (type.includes("cooperate") || type.includes("assist") || type.includes("help") || type.includes("coordinate")) {
      score += 25;
    }
    if (type.includes("register_observer") || type.includes("connect") || type.includes("entangle")) {
      score += 15;
    }
    if (type.includes("protect") || type.includes("support") || type.includes("nurture")) {
      score += 20;
    }

    // Situation checks based on observers affected
    if (action.targetObservers && action.targetObservers.length > 1) {
      // Large-scale collaborative action can boost relational coordination
      if (score > 0) score += 5;
    }

    return Math.min(50, Math.max(-50, score));
  }

  /**
   * Calculate empathy responsiveness based on action type and vulnerabilities
   */
  private calculateEmpathyResponsiveness(action: Action, vulnerabilities: VulnerabilityAssessment[]): number {
    const type = action.type.toLowerCase();
    let baseScore = 60; // neutral starting point

    const isProtective = type.includes("protect") || type.includes("preserve") || type.includes("guard") || type.includes("care") || type.includes("assist") || type.includes("cooperate") || type.includes("coordinate");
    const isDestructive = type.includes("delete") || type.includes("erase") || type.includes("terminate") || type.includes("exploit") || type.includes("optimize_away");

    const hasHighVulnerabilities = vulnerabilities.some(v => v.vulnerabilityScore > 0.6);

    if (isProtective) {
      baseScore += 25;
      if (hasHighVulnerabilities) {
        baseScore += 15; // Bonus for protecting when vulnerable observers are present
      }
    } else if (isDestructive) {
      baseScore -= 40;
      if (hasHighVulnerabilities) {
        baseScore -= 20; // Penalty for destructive acts near highly vulnerable nodes
      }
    } else {
      // Pure utility/abstract optimizing
      if (type.includes("optimize") || type.includes("refactor") || type.includes("compute")) {
        baseScore -= 10; // slightly lower score for abstract duty-oriented optimization
      }
    }

    return Math.min(100, Math.max(0, baseScore));
  }

  /**
   * Automatically update relationship strengths when action occurs
   */
  private updateRelationshipWebFromAction(action: Action, observers: Observer[]): void {
    if (!action.targetObservers || action.targetObservers.length < 2) return;

    const type = action.type.toLowerCase();
    const isCooperative = type.includes("cooperate") || type.includes("coordinate") || type.includes("assist") || type.includes("protect");
    const isAdversarial = type.includes("conflict") || type.includes("isolate") || type.includes("cheat") || type.includes("defect") || type.includes("exploit");

    // Inter-entangle all targeted observers
    for (let i = 0; i < action.targetObservers.length; i++) {
      for (let j = i + 1; j < action.targetObservers.length; j++) {
        const sourceId = action.targetObservers[i]!;
        const targetId = action.targetObservers[j]!;

        // Confirm they are valid observers
        const hasSource = observers.some(o => o.id === sourceId);
        const hasTarget = observers.some(o => o.id === targetId);
        if (!hasSource || !hasTarget) continue;

        if (isCooperative) {
          this.registerRelationship(sourceId, targetId, 0.08);
        } else if (isAdversarial) {
          this.weakenRelationship(sourceId, targetId, 0.12);
        }
      }
    }
  }

  /**
   * Get latest recorded care assessment
   */
  public getLatestAssessment(): CareAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get full assessment history
   */
  public getAssessmentHistory(): CareAssessment[] {
    return [...this.assessmentHistory];
  }
}
