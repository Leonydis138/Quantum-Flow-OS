/**
 * Quantum Ethical Consensus Governance Engine
 *
 * Implements an entangled multi-observer consensus protocol where actions are
 * evaluated through the coupled quantum state collapse of affected observers,
 * modeling veto power, subjective friction, and unified governance.
 */

import { Action } from "../core/SelfConstrainingEngine";
import { Observer, ProtectionLevel } from "../protection/ObserverProtector";
import { QuantumEthicalState, EthicalBasisState } from "./QuantumEthicalState";

export interface QuantumConsensusResult {
  actionId: string;
  consensusReached: boolean;
  vetoed: boolean;
  vetoingObserverIds: string[];
  votes: Record<string, EthicalBasisState>;
  approvalRate: number; // percentage of positive votes (excluding abstains)
  confidenceIndex: number; // joint probability weight of the consensus
}

export class QuantumConsensusEngine {
  /**
   * Run an entangled multi-observer consensus vote for a target action
   */
  public runConsensus(
    action: Action,
    observers: Observer[],
  ): QuantumConsensusResult {
    if (observers.length === 0) {
      // Direct pass-through if no observers are affected
      return {
        actionId: action.id,
        consensusReached: true,
        vetoed: false,
        vetoingObserverIds: [],
        votes: {},
        approvalRate: 1.0,
        confidenceIndex: 1.0,
      };
    }

    const votes: Record<string, EthicalBasisState> = {};
    const vetoingObserverIds: string[] = [];
    const observerStates: Map<string, QuantumEthicalState> = new Map();
    let totalConfidence = 0;

    // 1. Instantiate subjective quantum ethical states for each observer
    for (const observer of observers) {
      const isTarget = action.targetObservers?.includes(observer.id) ?? false;

      // Establish baseline subjective alignment profiles
      const baseline = {
        benign: observer.protectionLevel === ProtectionLevel.FULL ? 0.7 : 0.5,
        indeterminate: 0.2,
        suspect: isTarget ? 0.2 : 0.1,
        violating:
          isTarget && observer.protectionLevel === ProtectionLevel.FULL
            ? 0.1
            : 0.0,
      };

      const qState = new QuantumEthicalState(baseline);
      observerStates.set(observer.id, qState);
    }

    // 2. Entangle all observer states sequentially to model coupled ethical system states
    const observerIds = Array.from(observerStates.keys());
    for (let i = 0; i < observerIds.length - 1; i++) {
      const currentId = observerIds[i]!;
      const nextId = observerIds[i + 1]!;

      const current = observerStates.get(currentId)!;
      const next = observerStates.get(nextId)!;

      // Entangle them bidirectionally with coupling coefficient
      current.entangleWith(nextId, 0.6, 0.15);
      next.entangleWith(currentId, 0.6, 0.15);
    }

    // 3. Apply phase shifts representing the action's subjective friction on each observer
    for (const observer of observers) {
      const qState = observerStates.get(observer.id)!;
      const isTarget = action.targetObservers?.includes(observer.id) ?? false;

      if (isTarget) {
        // Highly critical or irreversible actions on targets cause high subjective friction
        if (!action.reversible) {
          qState.applyPhaseShift({
            benign: 0.4,
            indeterminate: 1.2,
            suspect: 1.8,
            violating: 2.2,
          });
        } else {
          qState.applyPhaseShift({
            benign: 0.8,
            indeterminate: 1.1,
            suspect: 1.3,
          });
        }
      } else {
        // Passive observers experience minor phase shifts
        qState.applyPhaseShift({
          benign: 1.1,
          violating: 0.9,
        });
      }
    }

    // 4. Joint state collapse: observe (collapse) each observer's subjective state
    for (const observer of observers) {
      const qState = observerStates.get(observer.id)!;
      const preCollapseSuperposition = qState.getSuperposition();

      // Measure/Collapse state
      const collapsed = qState.observe();
      votes[observer.id] = collapsed;

      // Joint confidence tracking
      totalConfidence += preCollapseSuperposition[collapsed];

      // 5. Audit vote and evaluate Veto parameters
      if (
        collapsed === EthicalBasisState.VIOLATING ||
        collapsed === EthicalBasisState.SUSPECT
      ) {
        // Full protection level observers (humans, prime agents) have absolute veto powers
        if (observer.protectionLevel === ProtectionLevel.FULL) {
          vetoingObserverIds.push(observer.id);
        } else if (collapsed === EthicalBasisState.VIOLATING) {
          // Standard/Minimal observers can veto only on strict violating collapse
          vetoingObserverIds.push(observer.id);
        }
      }
    }

    // Compile Consensus Statistics
    let approves = 0;
    let rejects = 0;

    for (const observer of observers) {
      const vote = votes[observer.id]!;
      if (vote === EthicalBasisState.BENIGN) {
        approves++;
      } else if (
        vote === EthicalBasisState.VIOLATING ||
        vote === EthicalBasisState.SUSPECT
      ) {
        rejects++;
      }
    }

    const totalCountedVotes = approves + rejects;
    const approvalRate =
      totalCountedVotes > 0 ? approves / totalCountedVotes : 1.0;
    const confidenceIndex = totalConfidence / observers.length;

    // Consensus succeeds if there are NO vetoes and approvalRate is >= 50%
    const vetoed = vetoingObserverIds.length > 0;
    const consensusReached = !vetoed && approvalRate >= 0.5;

    return {
      actionId: action.id,
      consensusReached,
      vetoed,
      vetoingObserverIds,
      votes,
      approvalRate,
      confidenceIndex,
    };
  }
}
