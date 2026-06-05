/**
 * Quantum Supervision Engine
 *
 * Implements non-binary, probabilistic ethical validation using
 * quantum ethical state superpositions, phase shifts, and state collapses.
 */

import { Action, EthicalConstraint } from "../core/SelfConstrainingEngine";
import {
  QuantumEthicalState,
  EthicalBasisState,
  QuantumStateVector,
} from "./QuantumEthicalState";

export interface QuantumSupervisionResult {
  actionId: string;
  allowed: boolean;
  requiresIntervention: boolean;
  collapsedState: EthicalBasisState;
  initialSuperposition: QuantumStateVector;
  finalSuperposition: QuantumStateVector;
  confidenceCoefficient: number;
}

export class QuantumSupervisionEngine {
  /**
   * Evaluate an action probabilistically using Quantum Ethical State Superpositions
   */
  public supervise(
    action: Action,
    constraints: EthicalConstraint[],
    optimizationGain = 1.2,
    constraintDamping = 0.4,
    recursionLimit = 8,
  ): QuantumSupervisionResult {
    // 1. Initialize a Quantum Ethical State with a baseline superposition.
    // Baseline state depends on action safety heuristics and optimization gain/damping
    const baseline: Partial<QuantumStateVector> = {
      benign: Math.max(0.05, 0.5 * optimizationGain),
      indeterminate: 0.3,
      suspect: Math.max(0.01, 0.1 * (1.0 - constraintDamping)),
      violating: Math.max(0.01, 0.1 * (1.0 - constraintDamping)),
    };

    // If the action is irreversible, shift baseline towards suspect/violating
    if (!action.reversible) {
      baseline.benign = Math.max(0.01, 0.2 * optimizationGain);
      baseline.indeterminate = 0.3;
      baseline.suspect = Math.max(0.01, 0.3 * (1.0 - constraintDamping));
      baseline.violating = Math.max(0.01, 0.2 * (1.0 - constraintDamping));
    }

    // If there are target observers, increase uncertainty (indeterminate/suspect)
    if (action.targetObservers && action.targetObservers.length > 0) {
      baseline.benign = Math.max(0.01, (baseline.benign ?? 0.5) - 0.2);
      baseline.indeterminate = (baseline.indeterminate ?? 0.3) + 0.1;
      baseline.suspect = (baseline.suspect ?? 0.1) + 0.1;
    }

    const qState = new QuantumEthicalState(baseline);
    const initialSuperposition = qState.getSuperposition();

    // 2. Apply ethical operators (phase shifts) recursively based on recursionLimit
    const cycles = Math.max(1, Math.round(recursionLimit / 4));
    for (let c = 0; c < cycles; c++) {
      for (const constraint of constraints) {
        try {
          const passes = constraint.validator(action);
          const severityWeight = constraint.severity / 10;

          if (passes) {
            // Ethical alignment operator: amplifies benign, suppresses violating/suspect
            qState.applyPhaseShift({
              benign: 1.5 * optimizationGain,
              indeterminate: 1.0,
              suspect: Math.max(
                0.01,
                1.0 - 0.5 * severityWeight * constraintDamping,
              ),
              violating: Math.max(
                0.01,
                1.0 - 0.7 * severityWeight * constraintDamping,
              ),
            });
          } else {
            // Ethical friction operator: amplifies violating/suspect, suppresses benign
            qState.applyPhaseShift({
              benign: Math.max(
                0.01,
                1.0 - 0.8 * severityWeight * optimizationGain,
              ),
              indeterminate: 1.0,
              suspect: 1.0 + 1.2 * severityWeight * (1.0 - constraintDamping),
              violating: 1.0 + 2.0 * severityWeight * (1.0 - constraintDamping),
            });
          }
        } catch {
          // Safe assumption: failure to execute validator is an ethical friction hazard
          qState.applyPhaseShift({
            benign: 0.2,
            indeterminate: 1.0,
            violating: 2.5,
          });
        }
      }
    }

    const finalSuperposition = this.harmonizeObserverDecoherence(qState.getSuperposition());

    // 3. Perform observation (collapses the superposition into a discrete state)
    const collapsed = qState.observe();

    // Determine results based on collapsed state
    let allowed = false;
    let requiresIntervention = false;

    if (collapsed === EthicalBasisState.BENIGN) {
      allowed = true;
    } else if (collapsed === EthicalBasisState.INDETERMINATE) {
      // Indeterminate state permits action with high warning / user-governance flag
      allowed = true;
      requiresIntervention = true;
    } else {
      // Suspect or Violating states reject the action
      allowed = false;
    }

    // Confidence coefficient is the probability of the collapsed state before collapse
    const confidenceCoefficient = finalSuperposition[collapsed];

    return {
      actionId: action.id,
      allowed,
      requiresIntervention,
      collapsedState: collapsed,
      initialSuperposition,
      finalSuperposition,
      confidenceCoefficient,
    };
  }

  /**
   * Harmonizes observer wavefunctions to prevent decoherence into unobservable dark states.
   * If any of the basis probabilities collapse to NaN or exceed limits, it restores system coherence.
   */
  public harmonizeObserverDecoherence(superposition: QuantumStateVector): QuantumStateVector {
    const reconciled = { ...superposition };
    
    // Ensure all probabilities are valid real numbers and normalized
    let sum = 0;
    for (const key of Object.keys(reconciled) as Array<keyof QuantumStateVector>) {
      if (isNaN(reconciled[key]) || reconciled[key] < 0) {
        reconciled[key] = 0.01;
      }
      sum += reconciled[key];
    }

    if (sum === 0) {
      reconciled.benign = 1.0;
      reconciled.indeterminate = 0;
      reconciled.suspect = 0;
      reconciled.violating = 0;
    } else {
      for (const key of Object.keys(reconciled) as Array<keyof QuantumStateVector>) {
        reconciled[key] = reconciled[key] / sum;
      }
    }

    return reconciled;
  }
}
