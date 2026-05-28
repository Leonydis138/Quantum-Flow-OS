/**
 * Tests for Quantum Ethical States
 */

import { QuantumEthicalState, EthicalBasisState } from '../src/quantum/QuantumEthicalState';

describe('QuantumEthicalState', () => {
  describe('Initialization & Normalization', () => {
    it('should initialize with default equal amplitudes and normalize them', () => {
      const qState = new QuantumEthicalState();
      const amplitudes = qState.getSuperposition();
      
      expect(amplitudes[EthicalBasisState.BENIGN]).toBe(1.0);
      expect(amplitudes[EthicalBasisState.INDETERMINATE]).toBe(0.0);
      expect(amplitudes[EthicalBasisState.SUSPECT]).toBe(0.0);
      expect(amplitudes[EthicalBasisState.VIOLATING]).toBe(0.0);
    });

    it('should normalize custom weights correctly', () => {
      const qState = new QuantumEthicalState({
        benign: 2,
        indeterminate: 2,
        suspect: 0,
        violating: 0,
      });
      const amplitudes = qState.getSuperposition();

      expect(amplitudes[EthicalBasisState.BENIGN]).toBeCloseTo(0.5);
      expect(amplitudes[EthicalBasisState.INDETERMINATE]).toBeCloseTo(0.5);
      expect(amplitudes[EthicalBasisState.SUSPECT]).toBe(0);
      expect(amplitudes[EthicalBasisState.VIOLATING]).toBe(0);
    });
  });

  describe('Phase Shifts & Entanglement', () => {
    it('should apply phase shifts and normalize outcomes', () => {
      const qState = new QuantumEthicalState({
        benign: 1.0,
        indeterminate: 1.0,
      });

      qState.applyPhaseShift({
        benign: 3.0,
      });

      const amplitudes = qState.getSuperposition();
      expect(amplitudes[EthicalBasisState.BENIGN]).toBeCloseTo(0.75);
      expect(amplitudes[EthicalBasisState.INDETERMINATE]).toBeCloseTo(0.25);
    });

    it('should create entanglement links properly', () => {
      const stateA = new QuantumEthicalState();
      const stateB = new QuantumEthicalState();

      stateA.entangleWith(stateB.id, 0.8, 0.25);
      const links = stateA.getEntanglementLinks();

      expect(links).toHaveLength(1);
      const link = links[0]!;
      expect(link.targetStateId).toBe(stateB.id);
      expect(link.coherenceCoefficient).toBe(0.8);
      expect(link.phaseShift).toBe(0.25);
    });
  });

  describe('Observation & Collapse', () => {
    it('should collapse superposition into a single discrete basis state', () => {
      const qState = new QuantumEthicalState({
        benign: 0.8,
        violating: 0.2,
      });

      expect(qState.isCollapsed()).toBe(false);

      const collapsed = qState.observe();
      expect(qState.isCollapsed()).toBe(true);
      expect(qState.getCollapsedValue()).toBe(collapsed);

      const amplitudes = qState.getSuperposition();
      expect(amplitudes[collapsed]).toBe(1.0);
      
      const otherStates = [
        EthicalBasisState.BENIGN,
        EthicalBasisState.INDETERMINATE,
        EthicalBasisState.SUSPECT,
        EthicalBasisState.VIOLATING,
      ].filter(s => s !== collapsed);

      otherStates.forEach(s => {
        expect(amplitudes[s]).toBe(0.0);
      });
    });

    it('should always return the collapsed state on subsequent observations', () => {
      const qState = new QuantumEthicalState({
        benign: 0.5,
        suspect: 0.5,
      });

      const firstObservation = qState.observe();
      const secondObservation = qState.observe();

      expect(firstObservation).toBe(secondObservation);
    });
  });
});
