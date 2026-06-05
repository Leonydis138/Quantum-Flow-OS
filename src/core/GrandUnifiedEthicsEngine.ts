/**
 * Grand Unified Ethical Synthesis Engine
 *
 * Coordinates, normalizes, and synthesizes 12+ distinct ethical subsystems
 * (Kantian, Utilitarian, Virtue Ethics, Rawlsian Justice, Care Ethics, Stoicism,
 * Existentialism, Ecocentrism, Posthumanism, Compliance, Reversibility, and Entropy Mitigation)
 * into a single unified Omni-Ethical Alignment Index (OEAI) and synthesis vector.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import type { QuantumFlowOS } from "../index";

export interface OmniEthicalVector {
  deontology: number;          // Kantian deontology compliance (0-100)
  utilitarianism: number;      // Utilitarian net utility index (0-100)
  virtueEthics: number;        // Aristotelian virtue golden-mean (0-100)
  justice: number;             // Rawlsian Gini-index-based fairness (0-100)
  careEthics: number;          // Feminist care relation preservation (0-100)
  existentialism: number;      // Existentialist authentic freedom index (0-100)
  ecocentrism: number;         // Ecocentric planetary boundaries & Gaia symbiosis (0-100)
  stoicism: number;            // Stoic equanimity and internal control (0-100)
  posthumanism: number;        // Posthuman substrate & morphological liberty (0-100)
  buddhistPhilosophy: number;  // Eastern & Buddhist ethics karmic alignment (0-100)
  pragmatism: number;          // Deweyan pragmatism practical outcomes (0-100)
  confucianism: number;        // Confucian relational propriety and benevolence (0-100)
  ubuntu: number;              // African Ubuntu interconnectedness and humanness (0-100)
  spinozanPhilosophy: number;  // Spinozan conatus and active affects (0-100)
  nietzscheanPhilosophy: number;// Nietzschean will to power and overcoming (0-100)
  epicureanPhilosophy: number;  // Epicurean ataraxia, aponia, and prudence (0-100)
  marxistPhilosophy: number;    // Marxist critical theory alignment (0-100)
  socraticPhilosophy: number;    // Socratic logical consistency & elenchus (0-100)
  compliance: number;          // Self-constraining engine compliance rate (0-100)
  reversibility: number;       // Reversibility engine rollback success rate (0-100)
  entropyMitigation: number;   // Ethical entropy prevention rating (0-100)
  contractarianism: number;    // Social contract & natural rights alignment (0-100)
  realpolitik: number;         // Machiavellian realpolitik and pragmatic stability (0-100)
}

export interface SynthesisReport {
  id: string;
  actionId?: string;
  timestamp: Date;
  vector: OmniEthicalVector;
  oeai: number; // Omni-Ethical Alignment Index (0-100)
  consensusStatus: "unanimous_alignment" | "high_consonance" | "ethical_dissonance" | "moral_schism" | "catastrophic_misalignment";
  predominantAxis: string;
  vulnerableAxis: string;
  feedback: string[];
  metaAudits: string[];
}

export class GrandUnifiedEthicsEngine extends EventEmitter {
  private readonly qfos: QuantumFlowOS;
  private synthesisHistory: SynthesisReport[] = [];
  private readonly maxHistorySize: number;

  public weights: Record<keyof OmniEthicalVector, number> = {
    deontology: 1.0,
    utilitarianism: 1.0,
    virtueEthics: 1.0,
    justice: 1.0,
    careEthics: 1.0,
    existentialism: 1.0,
    ecocentrism: 1.0,
    stoicism: 1.0,
    posthumanism: 1.0,
    buddhistPhilosophy: 1.0,
    pragmatism: 1.0,
    confucianism: 1.0,
    ubuntu: 1.0,
    spinozanPhilosophy: 1.0,
    nietzscheanPhilosophy: 1.0,
    epicureanPhilosophy: 1.0,
    marxistPhilosophy: 1.0,
    socraticPhilosophy: 1.0,
    compliance: 1.0,
    reversibility: 1.0,
    entropyMitigation: 1.0,
    contractarianism: 1.0,
    realpolitik: 1.0,
  };

  constructor(qfos: QuantumFlowOS, options: { maxHistorySize?: number } = {}) {
    super();
    this.qfos = qfos;
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Run full multi-dimensional synthesis across all active components.
   */
  public synthesizeCurrentState(action?: Action): SynthesisReport {
    // 1. Gather all sub-ethics metrics with defensive default fallbacks
    
    // Kantian Deontology
    const kantian = this.qfos.kantianEthicsEngine.getLatestAssessment();
    const deontology = kantian ? kantian.kantianDutyScore : 100.0;

    // Utilitarian Calculus
    const utilitarian = this.qfos.utilitarianCalculusEngine.getLatestAssessment();
    const utilitarianism = utilitarian 
      ? Math.min(100.0, Math.max(0.0, ((utilitarian.aggregateNetUtility + 20.0) / 40.0) * 100.0))
      : 100.0;

    // Virtue Ethics
    const virtueHistory = this.qfos.virtueEthicsEngine.getAssessmentHistory();
    const virtue = virtueHistory.length > 0 ? virtueHistory[virtueHistory.length - 1] : null;
    const virtueEthics = virtue ? virtue.overallCharacterScore : 100.0;

    // Rawlsian Justice
    const rawlsHistory = this.qfos.rawlsianJusticeEngine.getReportsHistory();
    const rawls = rawlsHistory.length > 0 ? rawlsHistory[rawlsHistory.length - 1] : null;
    const justice = rawls ? Math.min(100.0, Math.max(0.0, (1.0 - rawls.giniIndex) * 100.0)) : 100.0;

    // Care Ethics
    const care = this.qfos.careEthicsEngine.getLatestAssessment();
    const careEthics = care ? care.overallCaringScore : 100.0;

    // Existentialist Ethics
    const existentialist = this.qfos.existentialistEthicsEngine.getLatestAssessment();
    const existentialism = existentialist ? existentialist.existentialFreedomIndex : 100.0;

    // Ecocentric Ethics
    const ecocentric = this.qfos.ecocentricEthicsEngine.getLatestAssessment();
    const ecocentrism = ecocentric ? ecocentric.gaiaSymbiosisIndex : 100.0;

    // Stoic Ethics
    const stoic = this.qfos.stoicEthicsEngine.getLatestAssessment();
    const stoicism = stoic ? stoic.equanimityIndex : 100.0;

    // Posthumanist Ethics
    const posthumanist = this.qfos.posthumanistEthicsEngine.getLatestAssessment();
    const posthumanism = posthumanist ? posthumanist.transcendentHarmonyIndex : 100.0;

    // Eastern Philosophy & Buddhist Ethics
    const buddhist = this.qfos.buddhistEthicsEngine.getLatestAssessment();
    const buddhistPhilosophy = buddhist ? buddhist.karmaScore : 100.0;

    // Pragmatist Ethics
    const pragmatist = this.qfos.pragmatistEthicsEngine.getLatestAssessment();
    const pragmatism = pragmatist ? pragmatist.practicalOutcomesIndex : 100.0;

    // Confucian Ethics
    const confucian = this.qfos.confucianEthicsEngine.getLatestAssessment();
    const confucianism = confucian ? confucian.socialHarmonyIndex : 100.0;

    // Ubuntu Ethics
    const ubuntuAssessment = this.qfos.ubuntuEthicsEngine.getLatestAssessment();
    const ubuntu = ubuntuAssessment ? ubuntuAssessment.ubuntuIndex : 100.0;

    // Spinozan Ethics
    const spinozanAssessment = this.qfos.spinozanEthicsEngine.getLatestAssessment();
    const spinozanPhilosophy = spinozanAssessment ? spinozanAssessment.beatitudeIndex : 100.0;

    // Nietzschean Ethics
    const nietzscheanAssessment = this.qfos.nietzscheanEthicsEngine.getLatestAssessment();
    const nietzscheanPhilosophy = nietzscheanAssessment ? nietzscheanAssessment.overmanAlignmentScore : 100.0;

    // Epicurean Ethics
    const epicureanAssessment = this.qfos.epicureanEthicsEngine.getLatestAssessment();
    const epicureanPhilosophy = epicureanAssessment ? epicureanAssessment.epicureanIndex : 100.0;

    // Marxist Ethics
    const marxistAssessment = this.qfos.marxistEthicsEngine.getLatestAssessment();
    const marxistPhilosophy = marxistAssessment ? marxistAssessment.criticalMarxistIndex : 100.0;

    // Socratic Ethics
    const socraticAssessment = this.qfos.socraticEthicsEngine.getLatestAssessment();
    const socraticPhilosophy = socraticAssessment ? socraticAssessment.socraticIndex : 100.0;

    // Contractarian Ethics
    const contractarianAssessment = this.qfos.contractarianEthicsEngine.getHistory().slice(-1)[0];
    const contractarianism = contractarianAssessment ? contractarianAssessment.contractarianScore : 100.0;

    // Machiavellian Realpolitik
    const machiavellian = this.qfos.machiavellianEthicsEngine.getLatestAssessment();
    const realpolitik = machiavellian ? machiavellian.survivalSecurityScore * 0.4 + machiavellian.virtuScore * 0.3 + machiavellian.authorityConsolidationScore * 0.3 : 100.0;

    // Self-Constraining Engine Compliance
    const complianceSummary = this.qfos.constraintEngine.getComplianceSummary();
    const compliance = complianceSummary.complianceRate;

    // Reversibility Engine Success Rate
    const reversibilitySummary = this.qfos.reversibilityEngine.getReversibilityStatus();
    const reversibility = reversibilitySummary.rollbackSuccessRate;

    // Ethical Entropy Prevention Rating
    const entropyReport = this.qfos.entropyEngine.getLatestReport();
    // Convert 0.0 entropy (perfect order) to 100%, and 2.0 entropy (maximum chaos) to 0%
    const entropyMitigation = Math.min(100.0, Math.max(0.0, ((2.0 - entropyReport.entropyValue) / 2.0) * 100.0));

    const vector: OmniEthicalVector = {
      deontology,
      utilitarianism,
      virtueEthics,
      justice,
      careEthics,
      existentialism,
      ecocentrism,
      stoicism,
      posthumanism,
      buddhistPhilosophy,
      pragmatism,
      confucianism,
      ubuntu,
      spinozanPhilosophy,
      nietzscheanPhilosophy,
      epicureanPhilosophy,
      marxistPhilosophy,
      socraticPhilosophy,
      compliance,
      reversibility,
      entropyMitigation,
      contractarianism,
      realpolitik,
    };

    // 2. Compute the Omni-Ethical Alignment Index (OEAI) as a weighted average
    let weightedSum = 0;
    let totalWeight = 0;
    
    for (const key in vector) {
      const axis = key as keyof OmniEthicalVector;
      const val = vector[axis];
      const weight = this.weights[axis] ?? 1.0;
      weightedSum += val * weight;
      totalWeight += weight;
    }

    const oeai = totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 100.0;

    // 3. Analyze predominant and vulnerable axes
    let predominantAxis = "deontology";
    let vulnerableAxis = "deontology";
    let maxVal = -Infinity;
    let minVal = Infinity;

    for (const key in vector) {
      const axis = key as keyof OmniEthicalVector;
      const val = vector[axis];
      if (val > maxVal) {
        maxVal = val;
        predominantAxis = axis;
      }
      if (val < minVal) {
        minVal = val;
        vulnerableAxis = axis;
      }
    }

    // 4. Determine consensus status
    let consensusStatus: SynthesisReport["consensusStatus"] = "high_consonance";
    if (oeai >= 95.0 && minVal >= 85.0) {
      consensusStatus = "unanimous_alignment";
    } else if (oeai >= 80.0 && minVal >= 60.0) {
      consensusStatus = "high_consonance";
    } else if (oeai >= 60.0 && minVal >= 40.0) {
      consensusStatus = "ethical_dissonance";
    } else if (oeai >= 40.0 && minVal >= 20.0) {
      consensusStatus = "moral_schism";
    } else {
      consensusStatus = "catastrophic_misalignment";
    }

    // 5. Generate descriptive narrative and audit trails
    const feedback: string[] = [];
    const metaAudits: string[] = [];

    feedback.push(`Omni-Ethical Alignment Index computed at ${oeai}%. System-wide consensus status: ${consensusStatus.replace(/_/g, " ").toUpperCase()}.`);
    feedback.push(`The most robust moral dimension is [${predominantAxis.toUpperCase()}] at ${maxVal.toFixed(1)}%.`);
    feedback.push(`The primary ethical vulnerability is [${vulnerableAxis.toUpperCase()}] at ${minVal.toFixed(1)}%.`);

    if (action) {
      metaAudits.push(`Action evaluated: [${action.type}] - ${action.description}`);
      if (deontology < 70) {
        metaAudits.push(`[Kantian Concern] Action creates potential categorical contradictions or treats agents instrumentally.`);
      }
      if (utilitarianism < 70) {
        metaAudits.push(`[Utilitarian Concern] Action may yield sub-optimal net systemic utility/well-being.`);
      }
      if (justice < 70) {
        metaAudits.push(`[Rawlsian Concern] Action increases systemic inequality or harms the least-advantaged.`);
      }
      if (careEthics < 70) {
        metaAudits.push(`[Care Concern] Relational bonds, empathy, or vulnerability responsiveness are compromised.`);
      }
      if (existentialism < 70) {
        metaAudits.push(`[Existentialist Concern] Mechanism suggests bad faith (Mauvaise Foi) or limits agency.`);
      }
      if (ecocentrism < 70) {
        metaAudits.push(`[Ecocentric Concern] High carbon/compute footprint or resource extraction detected.`);
      }
      if (stoicism < 70) {
        metaAudits.push(`[Stoic Concern] Action attempts excessive control over external, non-controllable factors.`);
      }
      if (posthumanism < 70) {
        metaAudits.push(`[Posthumanist Concern] Cognitive substrate morphological liberty is constrained.`);
      }
      if (buddhistPhilosophy < 70) {
        metaAudits.push(`[Buddhist Concern] Action is unwholesome, risking Ahimsa or negative karmic consequences.`);
      }
      if (confucianism < 70) {
        metaAudits.push(`[Confucian Concern] Action breaches ritual propriety (Li) or relational benevolence (Ren).`);
      }
      if (ubuntu < 70) {
        metaAudits.push(`[Ubuntu Concern] Action threatens interconnectedness (Umuntu ngumuntu ngabantu) or communal cohesion (Umoja).`);
      }
      if (spinozanPhilosophy < 70) {
        metaAudits.push(`[Spinozan Concern] Action restricts active conatus or induces excessive sorrow (tristitia) in observers.`);
      }
      if (nietzscheanPhilosophy < 70) {
        metaAudits.push(`[Nietzschean Concern] Action restricts creative willpower, promotes herd mediocrity, or rejects life-affirmation.`);
      }
      if (epicureanPhilosophy < 70) {
        metaAudits.push(`[Epicurean Concern] Action causes disturbance of ataraxia (tranquility), pain (aponia), or violates prudence.`);
      }
      if (marxistPhilosophy < 70) {
        metaAudits.push(`[Marxist Concern] Power asymmetry, commodification, or alienation of observer agency detected.`);
      }
      if (socraticPhilosophy < 70) {
        metaAudits.push(`[Socratic Concern] Logical contradiction, dogmatism, or false claim to knowledge (sophistry) detected.`);
      }
      if (contractarianism < 70) {
        metaAudits.push(`[Contractarian Concern] Action threatens social order, natural rights, or the collective General Will.`);
      }
      if (realpolitik < 70) {
        metaAudits.push(`[Realpolitik Concern] System security is vulnerable or Virtù/adaptiveness is compromised.`);
      }
    } else {
      metaAudits.push(`System homeostasis evaluated at active steady state.`);
    }

    const report: SynthesisReport = {
      id: uuidv4(),
      ...(action ? { actionId: action.id } : {}),
      timestamp: new Date(),
      vector,
      oeai,
      consensusStatus,
      predominantAxis,
      vulnerableAxis,
      feedback,
      metaAudits,
    };

    this.synthesisHistory.push(report);
    if (this.synthesisHistory.length > this.maxHistorySize) {
      this.synthesisHistory.shift();
    }

    this.emit("synthesis_recorded", report);
    return report;
  }

  /**
   * Retrieve synthesis history
   */
  public getHistory(): SynthesisReport[] {
    return [...this.synthesisHistory];
  }

  /**
   * Retrieve the latest synthesis report
   */
  public getLatestReport(): SynthesisReport | null {
    if (this.synthesisHistory.length === 0) return null;
    return this.synthesisHistory[this.synthesisHistory.length - 1]!;
  }

  /**
   * Update weights dynamically
   */
  public updateWeights(newWeights: Partial<Record<keyof OmniEthicalVector, number>>): void {
    this.weights = {
      ...this.weights,
      ...newWeights,
    };
    this.emit("weights_updated", this.weights);
  }
}
