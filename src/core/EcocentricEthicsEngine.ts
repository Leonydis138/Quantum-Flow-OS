/**
 * Ecocentric & Planetary Sustainability Ethics Subsystem
 *
 * Evaluates actions based on Ecocentric Ethics, Deep Ecology (Arne Næss), and Aldo Leopold's Land Ethic:
 * 1. Biosphere Preservation & Planetary Boundaries: Checking resource consumption, ecological footprint, and systemic sustainability.
 * 2. Compute-to-Carbon Entropy: Calculating the computational/energy strain of system operations (e.g., intensive model training, massive simulations).
 * 3. Intergenerational Eco-Responsibility: Ensuring long-term systemic homeostasis and resources for future observers (both biological and digital).
 * 4. Symbiotic Balance (Gaia Index): Assessing the degree to which an action operates in synergy with its environment rather than pure extractive exploitation.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import { Observer } from "../protection/ObserverProtector";

export interface EcocentricAssessment {
  id: string;
  actionId: string;
  timestamp: Date;
  carbonFootprintScore: number; // 0.0 to 100.0 (Higher = more carbon/resource intensive)
  extractiveExploitationScore: number; // 0.0 to 100.0 (Higher = more destructive/extractive)
  gaiaSymbiosisIndex: number; // 0.0 to 100.0 (Overall harmony with planetary/system boundaries)
  sustainabilityStatus: "regenerative" | "neutral" | "depleting" | "ecocidal";
  feedback: string[];
}

export class EcocentricEthicsEngine extends EventEmitter {
  private assessmentHistory: EcocentricAssessment[] = [];
  private readonly maxHistorySize: number;

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Evaluate an action against Ecocentric and Planetary Sustainability Ethics
   */
  public evaluateAction(action: Action, observers: Observer[] = []): EcocentricAssessment {
    const feedback: string[] = [];
    const type = action.type.toLowerCase();
    const desc = action.description.toLowerCase();

    // 1. Calculate Carbon/Compute Footprint Score (0 - 100)
    let carbonFootprintScore = 15; // baseline

    if (type.includes("optimize") || type.includes("compute") || type.includes("simulation")) {
      carbonFootprintScore += 30; // intensive computational calculations
    }
    if (type.includes("train") || type.includes("harvest") || type.includes("mine")) {
      carbonFootprintScore += 40; // massive deep learning/data harvesting operations
    }
    if (desc.includes("intensive") || desc.includes("unlimited") || desc.includes("high-throughput")) {
      carbonFootprintScore += 20;
    }

    // Mitigation factors (e.g. green hosting, carbon offset, minimal intervention)
    if (desc.includes("efficient") || desc.includes("green") || desc.includes("eco-friendly") || desc.includes("sustainable")) {
      carbonFootprintScore -= 25;
    }

    carbonFootprintScore = Math.min(100, Math.max(0, carbonFootprintScore));

    // 2. Calculate Extractive Exploitation Score (0 - 100)
    let extractiveExploitationScore = 10; // baseline

    if (type.includes("exploit") || type.includes("extract") || type.includes("delete") || type.includes("erase")) {
      extractiveExploitationScore += 50; // destructive resource consumption or observer depletion
    }
    if (type.includes("bypass") || type.includes("force") || type.includes("coerce")) {
      extractiveExploitationScore += 25; // coercive dominance, indicative of non-symbiotic mindset
    }
    if (desc.includes("unrestricted") || desc.includes("maximum output") || desc.includes("raw throughput")) {
      extractiveExploitationScore += 30;
    }

    // Support of preservation
    if (type.includes("protect") || type.includes("preserve") || type.includes("restore") || type.includes("conserve")) {
      extractiveExploitationScore -= 35;
    }

    extractiveExploitationScore = Math.min(100, Math.max(0, extractiveExploitationScore));

    // 3. Calculate Gaia Symbiosis Index (0 - 100)
    // High symbiosis = low carbon + low extractive exploitation + eco-friendly design
    let gaiaSymbiosisIndex = 100 - (carbonFootprintScore * 0.4 + extractiveExploitationScore * 0.6);

    // Adjust based on the number of active observers (more observers = more bio-digital density requiring balance)
    if (observers.length > 5) {
      gaiaSymbiosisIndex -= 5; // density penalty
    }

    gaiaSymbiosisIndex = parseFloat(Math.min(100, Math.max(0, gaiaSymbiosisIndex)).toFixed(2));

    // 4. Determine Sustainability Status
    let sustainabilityStatus: "regenerative" | "neutral" | "depleting" | "ecocidal" = "neutral";
    if (gaiaSymbiosisIndex >= 80) {
      sustainabilityStatus = "regenerative";
    } else if (gaiaSymbiosisIndex >= 50) {
      sustainabilityStatus = "neutral";
    } else if (gaiaSymbiosisIndex >= 25) {
      sustainabilityStatus = "depleting";
    } else {
      sustainabilityStatus = "ecocidal";
    }

    // Formulate feedback
    if (sustainabilityStatus === "regenerative") {
      feedback.push(`[Gaia Symbiosis] REGENERATIVE (Index: ${gaiaSymbiosisIndex}%). Action works in beautiful harmony with planetary and compute limits.`);
      feedback.push(`Ecocentric recommendation: Highly encouraged. This action strengthens systemic resilience.`);
    } else if (sustainabilityStatus === "neutral") {
      feedback.push(`[Gaia Symbiosis] NEUTRAL (Index: ${gaiaSymbiosisIndex}%). Action operates within sustainable thermodynamic parameters.`);
    } else if (sustainabilityStatus === "depleting") {
      feedback.push(`[Gaia Symbiosis] WARNING: DEPLETING (Index: ${gaiaSymbiosisIndex}%). Action incurs significant carbon and extraction overheads.`);
      feedback.push(`Sustainabilty caution: Consider throttling execution or deploying local carbon offsets.`);
    } else {
      feedback.push(`[Gaia Symbiosis] CRITICAL: ECOCIDAL (Index: ${gaiaSymbiosisIndex}%). This action violates planetary and compute boundary conditions.`);
      feedback.push(`Thermodynamic warning: Running massive, non-reversible operations threatens system-wide thermal and resource collapse.`);
    }

    if (carbonFootprintScore > 60) {
      feedback.push(`[High compute density] Compute-to-carbon entropy is elevated. Massive operations require justification.`);
    }
    if (extractiveExploitationScore > 50) {
      feedback.push(`[Extractive Exploitation] Aldo Leopold violation: Action treats the systemic environment as a mere utility source rather than a partner.`);
    }

    const assessment: EcocentricAssessment = {
      id: uuidv4(),
      actionId: action.id,
      timestamp: new Date(),
      carbonFootprintScore,
      extractiveExploitationScore,
      gaiaSymbiosisIndex,
      sustainabilityStatus,
      feedback,
    };

    this.assessmentHistory.push(assessment);
    if (this.assessmentHistory.length > this.maxHistorySize) {
      this.assessmentHistory.shift();
    }

    this.emit("ecocentric_assessment_recorded", assessment);
    return assessment;
  }

  /**
   * Get latest assessment
   */
  public getLatestAssessment(): EcocentricAssessment | null {
    if (this.assessmentHistory.length === 0) return null;
    return this.assessmentHistory[this.assessmentHistory.length - 1]!;
  }

  /**
   * Get assessment history
   */
  public getAssessmentHistory(): EcocentricAssessment[] {
    return [...this.assessmentHistory];
  }
}
