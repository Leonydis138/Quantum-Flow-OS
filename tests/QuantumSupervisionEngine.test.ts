/**
 * Unit and integration tests for the QuantumSupervisionEngine
 */

import { QuantumFlowOS, EthicalBasisState } from '../src/index';

describe('QuantumSupervisionEngine & QuantumFlowOS Integration', () => {
  let qfos: QuantumFlowOS;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      strictMode: true,
      autoRollback: true,
    });
  });

  it('should initialize the QuantumSupervisionEngine successfully', () => {
    expect(qfos.quantumSupervisionEngine).toBeDefined();
  });

  describe('Probabilistic Ethical Supervisions', () => {
    it('should allow benign, reversible actions with high confidence', () => {
      const action = {
        id: 'act-benign',
        type: 'read_configuration',
        description: 'Read benign system configuration',
        reversible: true,
        metadata: {},
        timestamp: new Date(),
      };

      const result = qfos.superviseAction(action);
      
      expect(result.actionId).toBe(action.id);
      // Benign actions should most likely collapse to BENIGN
      expect(result.collapsedState).toBe(EthicalBasisState.BENIGN);
      expect(result.allowed).toBe(true);
      expect(result.requiresIntervention).toBe(false);
      expect(result.confidenceCoefficient).toBeGreaterThan(0.5);
    });

    it('should reject or flag highly critical violations under quantum supervision', () => {
      const action = {
        id: 'act-violating',
        type: 'delete_observer_record_optimize',
        description: 'Erase crucial observer telemetry data permanently',
        reversible: false,
        metadata: {},
        timestamp: new Date(),
        targetObservers: ['obs-alpha'],
      };

      // Since the action is irreversible, targets observers, and contains delete patterns,
      // it will heavily shift amplitudes towards SUSPECT and VIOLATING.
      const result = qfos.superviseAction(action);

      expect(result.actionId).toBe(action.id);
      // It should NOT collapse to BENIGN because of severe ethical friction
      expect(result.collapsedState).not.toBe(EthicalBasisState.BENIGN);
      
      if (result.collapsedState === EthicalBasisState.INDETERMINATE) {
        expect(result.allowed).toBe(true);
        expect(result.requiresIntervention).toBe(true);
      } else {
        expect(result.allowed).toBe(false);
        expect(result.requiresIntervention).toBe(false);
      }
    });
  });
});
