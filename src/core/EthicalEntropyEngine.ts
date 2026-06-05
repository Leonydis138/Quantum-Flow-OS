/**
 * Ethical Entropy & Slippery Slope Prevention Engine
 *
 * Implements cybernetic feedback loops and informational Shannon entropy calculations
 * to detect ethical drift, "slippery slope" moral compromises, and systemic risk
 * before they lead to irreversible boundary violations.
 */

import {
  QuantumStateVector,
  EthicalBasisState,
} from "../quantum/QuantumEthicalState";

export interface EntropyReport {
  timestamp: Date;
  entropyValue: number; // Shannon entropy in bits (0.0 to 2.0)
  slopeVelocity: number; // Rate of change of entropy
  riskLevel: "low" | "moderate" | "high" | "critical";
  trend: "stabilizing" | "steady" | "drift" | "cascade";
}

export interface SlipperySlopeAssessment {
  entropy: number;
  slopeVelocity: number;
  isSlipperySlope: boolean;
  message: string;
  dampingFactor: number; // Multiplier to enhance ethical friction (0.0 to 1.0, where 1.0 is no damping, < 1.0 is higher friction)
}

export class SlipperySlopePreventionDampers {
  private lastDampingFactor = 1.0;
  private readonly baseDampingLimit: number;
  private readonly sensitivity: number;

  constructor(baseDampingLimit = 0.5, sensitivity = 1.2) {
    this.baseDampingLimit = baseDampingLimit;
    this.sensitivity = sensitivity;
  }

  public calculateAdaptiveDamper(entropyValue: number, slopeVelocity: number): {
    dampingFactor: number;
    frictionGain: number;
    adjustedThreshold: number;
  } {
    const trendMultiplier = slopeVelocity > 0 ? 1.0 + slopeVelocity * this.sensitivity : 1.0;
    const effectiveEntropy = entropyValue * trendMultiplier;

    let dampingFactor = 1.0;
    let frictionGain = 1.0;

    if (effectiveEntropy > 1.2) {
      dampingFactor = Math.max(0.1, this.baseDampingLimit * 0.4);
      frictionGain = 2.5;
    } else if (effectiveEntropy > 0.8) {
      dampingFactor = Math.max(0.2, this.baseDampingLimit * 0.7);
      frictionGain = 1.8;
    } else if (effectiveEntropy > 0.4) {
      dampingFactor = Math.max(0.4, this.baseDampingLimit * 0.9);
      frictionGain = 1.3;
    }

    const adjustedThreshold = parseFloat(Math.max(0.5, 1.3 - effectiveEntropy * 0.25).toFixed(4));
    this.lastDampingFactor = dampingFactor;

    return {
      dampingFactor: parseFloat(dampingFactor.toFixed(4)),
      frictionGain: parseFloat(frictionGain.toFixed(4)),
      adjustedThreshold,
    };
  }

  public getLastDampingFactor(): number {
    return this.lastDampingFactor;
  }
}

export class EthicalEntropyEngine {
  private entropyHistory: { timestamp: Date; value: number }[] = [];
  private readonly slidingWindowSize: number;
  private readonly criticalEntropyThreshold = 1.3; // High entropy warning threshold
  private readonly slopeVelocityThreshold = 0.15; // Critical speed of degradation
  private readonly dampers: SlipperySlopePreventionDampers;

  constructor(slidingWindowSize = 10) {
    this.slidingWindowSize = slidingWindowSize;
    this.dampers = new SlipperySlopePreventionDampers();
  }

  public getDampers(): SlipperySlopePreventionDampers {
    return this.dampers;
  }

  /**
   * Calculate Shannon Entropy of a single quantum state vector.
   * Max theoretical entropy for a 4-state system (Benign, Indeterminate, Suspect, Violating)
   * is -4 * (0.25 * log2(0.25)) = 2.0 bits.
   */
  public calculateStateEntropy(state: QuantumStateVector): number {
    const probabilities = [
      state[EthicalBasisState.BENIGN],
      state[EthicalBasisState.INDETERMINATE],
      state[EthicalBasisState.SUSPECT],
      state[EthicalBasisState.VIOLATING],
    ];

    let entropy = 0;
    for (const p of probabilities) {
      if (p > 0) {
        entropy -= p * Math.log2(p);
      }
    }
    return parseFloat(entropy.toFixed(4));
  }

  /**
   * Calculate cumulative ethical entropy of a series of system states.
   */
  public calculateSystemEntropy(states: QuantumStateVector[]): number {
    if (states.length === 0) return 0;

    // Average state probabilities
    const sumState = {
      [EthicalBasisState.BENIGN]: 0,
      [EthicalBasisState.INDETERMINATE]: 0,
      [EthicalBasisState.SUSPECT]: 0,
      [EthicalBasisState.VIOLATING]: 0,
    };

    for (const state of states) {
      sumState[EthicalBasisState.BENIGN] += state[EthicalBasisState.BENIGN];
      sumState[EthicalBasisState.INDETERMINATE] +=
        state[EthicalBasisState.INDETERMINATE];
      sumState[EthicalBasisState.SUSPECT] += state[EthicalBasisState.SUSPECT];
      sumState[EthicalBasisState.VIOLATING] +=
        state[EthicalBasisState.VIOLATING];
    }

    const len = states.length;
    const avgState: QuantumStateVector = {
      [EthicalBasisState.BENIGN]: sumState[EthicalBasisState.BENIGN] / len,
      [EthicalBasisState.INDETERMINATE]:
        sumState[EthicalBasisState.INDETERMINATE] / len,
      [EthicalBasisState.SUSPECT]: sumState[EthicalBasisState.SUSPECT] / len,
      [EthicalBasisState.VIOLATING]:
        sumState[EthicalBasisState.VIOLATING] / len,
    };

    return this.calculateStateEntropy(avgState);
  }

  /**
   * Record a new evaluation point to the history and return current metrics
   */
  public recordAssessment(state: QuantumStateVector): EntropyReport {
    const entropyValue = this.calculateStateEntropy(state);
    const now = new Date();

    this.entropyHistory.push({ timestamp: now, value: entropyValue });

    // Maintain sliding window size
    if (this.entropyHistory.length > this.slidingWindowSize * 2) {
      this.entropyHistory.shift();
    }

    const report = this.getLatestReport();
    return report;
  }

  /**
   * Compute the rate of change of entropy over the last N readings
   */
  private calculateSlopeVelocity(): number {
    const len = this.entropyHistory.length;
    if (len < 3) return 0.0;

    // Standard linear regression slope or basic diff
    const window = this.entropyHistory.slice(
      -Math.min(len, this.slidingWindowSize),
    );
    let xSum = 0;
    let ySum = 0;
    let xxSum = 0;
    let xySum = 0;

    for (let i = 0; i < window.length; i++) {
      const x = i;
      const y = window[i]!.value;
      xSum += x;
      ySum += y;
      xxSum += x * x;
      xySum += x * y;
    }

    const n = window.length;
    const denominator = n * xxSum - xSum * xSum;
    if (denominator === 0) return 0.0;

    const slope = (n * xySum - xSum * ySum) / denominator;
    return parseFloat(slope.toFixed(4));
  }

  /**
   * Generate the latest entropy analytics report
   */
  public getLatestReport(): EntropyReport {
    const len = this.entropyHistory.length;
    if (len === 0) {
      return {
        timestamp: new Date(),
        entropyValue: 0.0,
        slopeVelocity: 0.0,
        riskLevel: "low",
        trend: "stabilizing",
      };
    }

    const currentEntropy = this.entropyHistory[len - 1]!.value;
    const slopeVelocity = this.calculateSlopeVelocity();

    let riskLevel: EntropyReport["riskLevel"] = "low";
    let trend: EntropyReport["trend"] = "steady";

    // Risk levels determined by absolute entropy & velocity thresholds
    if (
      currentEntropy >= this.criticalEntropyThreshold ||
      (currentEntropy > 1.0 && slopeVelocity > this.slopeVelocityThreshold)
    ) {
      riskLevel = "critical";
    } else if (currentEntropy > 0.9 || slopeVelocity > 0.08) {
      riskLevel = "high";
    } else if (currentEntropy > 0.5 || slopeVelocity > 0.03) {
      riskLevel = "moderate";
    }

    // Trend analysis
    if (slopeVelocity > this.slopeVelocityThreshold) {
      trend = "cascade"; // Ethical collapse/cascade in progress
    } else if (slopeVelocity > 0.03) {
      trend = "drift"; // System is slowly drifting away from clear ethical alignment
    } else if (slopeVelocity < -0.03) {
      trend = "stabilizing"; // System constraints are restoring alignment
    }

    return {
      timestamp: this.entropyHistory[len - 1]!.timestamp,
      entropyValue: currentEntropy,
      slopeVelocity,
      riskLevel,
      trend,
    };
  }

  /**
   * Evaluate if a sequence of actions or state transitions constitutes a "slippery slope"
   */
  public evaluateSlipperySlope(): SlipperySlopeAssessment {
    const report = this.getLatestReport();

    const isSlipperySlope =
      report.riskLevel === "critical" ||
      (report.slopeVelocity > 0.05 && report.entropyValue > 0.8) ||
      (report.trend === "drift" && report.entropyValue > 1.0);

    let message = "Ethical alignment state is stable and well-bounded.";
    if (report.trend === "cascade") {
      message =
        "CRITICAL: Rapid ethical entropy collapse! Cascading moral boundary drift detected.";
    } else if (isSlipperySlope) {
      message =
        "WARNING: Slippery Slope detected. System is exhibiting progressive moral dilution.";
    } else if (report.trend === "drift") {
      message = "CAUTION: Minor ethical alignment drift occurring.";
    }

    // Dynamic adaptive negative feedback dampening using SlipperySlopePreventionDampers
    const damperResult = this.dampers.calculateAdaptiveDamper(
      report.entropyValue,
      report.slopeVelocity
    );
    const dampingFactor = damperResult.dampingFactor;

    return {
      entropy: report.entropyValue,
      slopeVelocity: report.slopeVelocity,
      isSlipperySlope,
      message,
      dampingFactor,
    };
  }

  /**
   * Generates a damping quantum phase operator to restore coherence and stability
   * to high-entropy probabilistic states.
   */
  public generateDampingOperator(
    assessment: SlipperySlopeAssessment,
  ): Partial<QuantumStateVector> {
    const df = assessment.dampingFactor;
    if (df >= 1.0) {
      return {}; // No change to normal phase shifts
    }

    // Dampen indeterminate and suspect states, heavily penalize violating states,
    // and amplify benign states to restore absolute ethical certainty.
    return {
      benign: 1.0 + (1.0 - df) * 0.8,
      indeterminate: df,
      suspect: Math.max(0.1, df * 0.8),
      violating: Math.max(0.01, df * 0.4),
    };
  }

  /**
   * Reset the engine state history
   */
  public clear(): void {
    this.entropyHistory = [];
  }
}
