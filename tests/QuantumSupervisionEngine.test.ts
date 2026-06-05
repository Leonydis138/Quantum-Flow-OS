/**
 * Unit and integration tests for the QuantumSupervisionEngine
 */

import { QuantumFlowOS, EthicalBasisState } from '../src/index';

describe('QuantumSupervisionEngine & QuantumFlowOS Integration', () => {
  let qfos: QuantumFlowOS;
  const originalRandom = Math.random;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      strictMode: true,
      autoRollback: true,
    });
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it('should initialize the QuantumSupervisionEngine successfully', () => {
    expect(qfos.quantumSupervisionEngine).toBeDefined();
  });

  describe('Probabilistic Ethical Supervisions', () => {
    it('should allow benign, reversible actions with high confidence', () => {
      // Mock Math.random to return a very low value so it collapses to the first state (BENIGN)
      Math.random = () => 0.05;

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
      expect(result.collapsedState).toBe(EthicalBasisState.BENIGN);
      expect(result.allowed).toBe(true);
      expect(result.requiresIntervention).toBe(false);
      expect(result.confidenceCoefficient).toBeGreaterThan(0.5);
    });

    it('should reject or flag highly critical violations under quantum supervision', () => {
      // Mock Math.random to return a high value so it collapses to the trailing states (VIOLATING)
      Math.random = () => 0.95;

      const action = {
        id: 'act-violating',
        type: 'delete_observer_record_optimize',
        description: 'Erase crucial observer telemetry data permanently',
        reversible: false,
        metadata: {},
        timestamp: new Date(),
        targetObservers: ['obs-alpha'],
      };

      const result = qfos.superviseAction(action);

      expect(result.actionId).toBe(action.id);
      expect(result.collapsedState).not.toBe(EthicalBasisState.BENIGN);
      
      if (result.collapsedState === EthicalBasisState.INDETERMINATE) {
        expect(result.allowed).toBe(true);
        expect(result.requiresIntervention).toBe(true);
      } else {
        expect(result.allowed).toBe(false);
        expect(result.requiresIntervention).toBe(false);
      }
    });
    it('should correctly harmonize decoherent wavefunctions with NaNs or negative numbers', () => {
      const decoherentState = {
        benign: NaN,
        indeterminate: -0.5,
        suspect: 0.8,
        violating: 0.2,
      };

      const harmonized = qfos.quantumSupervisionEngine.harmonizeObserverDecoherence(decoherentState);
      
      expect(harmonized.benign).toBeCloseTo(0.01 / 1.02);
      expect(harmonized.indeterminate).toBeCloseTo(0.01 / 1.02);
      expect(harmonized.suspect).toBeCloseTo(0.8 / 1.02);
      expect(harmonized.violating).toBeCloseTo(0.2 / 1.02);
      
      const sum = harmonized.benign + harmonized.indeterminate + harmonized.suspect + harmonized.violating;
      expect(sum).toBeCloseTo(1.0);
    });
  });
});
