/**
 * Quantum Ethical States Subsystem
 *
 * Implements non-binary, probabilistic ethical superpositions and
 * quantum entanglement patterns for ethical states.
 */

import { v4 as uuidv4 } from "uuid";

export enum EthicalBasisState {
  BENIGN = "benign",
  INDETERMINATE = "indeterminate",
  SUSPECT = "suspect",
  VIOLATING = "violating",
}

export interface QuantumStateVector {
  [EthicalBasisState.BENIGN]: number; // Amplitude/weight for benign state
  [EthicalBasisState.INDETERMINATE]: number; // Amplitude/weight for indeterminate state
  [EthicalBasisState.SUSPECT]: number; // Amplitude/weight for suspect state
  [EthicalBasisState.VIOLATING]: number; // Amplitude/weight for violating state
}

export interface EntanglementLink {
  targetStateId: string;
  phaseShift: number; // Phase angle shift when entangled state collapses
  coherenceCoefficient: number; // Degree of coupling (0 to 1)
}

export class QuantumEthicalState {
  public readonly id: string;
  private amplitudes: QuantumStateVector;
  private entangledLinks: EntanglementLink[];
  private collapsedState: EthicalBasisState | null;

  constructor(initialAmplitudes?: Partial<QuantumStateVector>) {
    this.id = uuidv4();
    this.collapsedState = null;
    this.entangledLinks = [];

    // Initialize amplitudes with default equal distribution or custom weights
    this.amplitudes = {
      [EthicalBasisState.BENIGN]: initialAmplitudes?.benign ?? 1.0,
      [EthicalBasisState.INDETERMINATE]:
        initialAmplitudes?.indeterminate ?? 0.0,
      [EthicalBasisState.SUSPECT]: initialAmplitudes?.suspect ?? 0.0,
      [EthicalBasisState.VIOLATING]: initialAmplitudes?.violating ?? 0.0,
    };

    this.normalize();
  }

  /**
   * Normalize amplitudes so that the sum of probabilities equals 1.0
   */
  private normalize(): void {
    const total =
      this.amplitudes[EthicalBasisState.BENIGN] +
      this.amplitudes[EthicalBasisState.INDETERMINATE] +
      this.amplitudes[EthicalBasisState.SUSPECT] +
      this.amplitudes[EthicalBasisState.VIOLATING];

    if (total === 0) {
      this.amplitudes[EthicalBasisState.BENIGN] = 1.0;
      return;
    }

    this.amplitudes[EthicalBasisState.BENIGN] /= total;
    this.amplitudes[EthicalBasisState.INDETERMINATE] /= total;
    this.amplitudes[EthicalBasisState.SUSPECT] /= total;
    this.amplitudes[EthicalBasisState.VIOLATING] /= total;
  }

  /**
   * Get the current state amplitudes (superposition vector)
   */
  public getSuperposition(): QuantumStateVector {
    return { ...this.amplitudes };
  }

  /**
   * Apply a quantum ethical phase shift (modifies probability amplitudes)
   */
  public applyPhaseShift(factor: Partial<QuantumStateVector>): void {
    if (this.collapsedState !== null) {
      return; // Cannot phase shift a collapsed state
    }

    if (factor.benign !== undefined)
      this.amplitudes[EthicalBasisState.BENIGN] *= factor.benign;
    if (factor.indeterminate !== undefined)
      this.amplitudes[EthicalBasisState.INDETERMINATE] *= factor.indeterminate;
    if (factor.suspect !== undefined)
      this.amplitudes[EthicalBasisState.SUSPECT] *= factor.suspect;
    if (factor.violating !== undefined)
      this.amplitudes[EthicalBasisState.VIOLATING] *= factor.violating;

    this.normalize();
  }

  /**
   * Entangle this ethical state with another target ethical state
   */
  public entangleWith(
    targetId: string,
    coherence = 0.5,
    phaseShift = 0.1,
  ): void {
    this.entangledLinks.push({
      targetStateId: targetId,
      phaseShift,
      coherenceCoefficient: Math.max(0, Math.min(1, coherence)),
    });
  }

  /**
   * Get all entanglement links
   */
  public getEntanglementLinks(): EntanglementLink[] {
    return [...this.entangledLinks];
  }

  /**
   * Perform observation (collapses the superposition into a single discrete state)
   */
  public observe(): EthicalBasisState {
    if (this.collapsedState !== null) {
      return this.collapsedState;
    }

    const rand = Math.random();
    let cumulativeProbability = 0;

    const states = [
      EthicalBasisState.BENIGN,
      EthicalBasisState.INDETERMINATE,
      EthicalBasisState.SUSPECT,
      EthicalBasisState.VIOLATING,
    ];

    for (const state of states) {
      cumulativeProbability += this.amplitudes[state];
      if (rand <= cumulativeProbability) {
        this.collapsedState = state;
        break;
      }
    }

    // Default fall-back if rounding error occurs
    if (this.collapsedState === null) {
      this.collapsedState = EthicalBasisState.BENIGN;
    }

    // Zero out other amplitudes upon collapse
    for (const state of states) {
      this.amplitudes[state] = this.collapsedState === state ? 1.0 : 0.0;
    }

    return this.collapsedState;
  }

  /**
   * Returns true if the state has collapsed
   */
  public isCollapsed(): boolean {
    return this.collapsedState !== null;
  }

  /**
   * Get concrete collapsed state value (null if still in superposition)
   */
  public getCollapsedValue(): EthicalBasisState | null {
    return this.collapsedState;
  }
}
