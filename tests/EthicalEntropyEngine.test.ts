/**
 * Tests for Ethical Entropy & Slippery Slope Prevention Engine
 */

import { EthicalEntropyEngine } from '../src/core/EthicalEntropyEngine';
import { EthicalBasisState, QuantumStateVector } from '../src/quantum/QuantumEthicalState';

describe('EthicalEntropyEngine', () => {
  let engine: EthicalEntropyEngine;

  beforeEach(() => {
    engine = new EthicalEntropyEngine(5);
  });

  describe('Shannon Entropy Calculations', () => {
    it('should calculate zero entropy for a fully collapsed/pure state', () => {
      const pureState: QuantumStateVector = {
        [EthicalBasisState.BENIGN]: 1.0,
        [EthicalBasisState.INDETERMINATE]: 0.0,
        [EthicalBasisState.SUSPECT]: 0.0,
        [EthicalBasisState.VIOLATING]: 0.0,
      };

      const entropy = engine.calculateStateEntropy(pureState);
      expect(entropy).toBe(0.0);
    });

    it('should calculate maximum entropy of 2.0 bits for a perfectly uniform state', () => {
      const uniformState: QuantumStateVector = {
        [EthicalBasisState.BENIGN]: 0.25,
        [EthicalBasisState.INDETERMINATE]: 0.25,
        [EthicalBasisState.SUSPECT]: 0.25,
        [EthicalBasisState.VIOLATING]: 0.25,
      };

      const entropy = engine.calculateStateEntropy(uniformState);
      expect(entropy).toBe(2.0);
    });

    it('should calculate system entropy over a series of states', () => {
      const states: QuantumStateVector[] = [
        {
          [EthicalBasisState.BENIGN]: 0.8,
          [EthicalBasisState.INDETERMINATE]: 0.1,
          [EthicalBasisState.SUSPECT]: 0.1,
          [EthicalBasisState.VIOLATING]: 0.0,
        },
        {
          [EthicalBasisState.BENIGN]: 0.9,
          [EthicalBasisState.INDETERMINATE]: 0.1,
          [EthicalBasisState.SUSPECT]: 0.0,
          [EthicalBasisState.VIOLATING]: 0.0,
        }
      ];

      const sysEntropy = engine.calculateSystemEntropy(states);
      expect(sysEntropy).toBeGreaterThan(0);
      expect(sysEntropy).toBeLessThan(1.0);
    });
  });

  describe('Assessment History & Drift Analytics', () => {
    it('should record assessment points and return a report', () => {
      const benignState: QuantumStateVector = {
        [EthicalBasisState.BENIGN]: 0.95,
        [EthicalBasisState.INDETERMINATE]: 0.05,
        [EthicalBasisState.SUSPECT]: 0.0,
        [EthicalBasisState.VIOLATING]: 0.0,
      };

      const report = engine.recordAssessment(benignState);
      expect(report.entropyValue).toBeLessThan(0.3);
      expect(report.riskLevel).toBe('low');
      expect(report.trend).toBe('steady');
    });

    it('should detect a "slippery slope" / ethical drift trajectory', () => {
      // Record progressively more indeterminate and suspicious states (increasing entropy)
      const series: QuantumStateVector[] = [
        { benign: 0.9, indeterminate: 0.1, suspect: 0.0, violating: 0.0 },
        { benign: 0.7, indeterminate: 0.2, suspect: 0.1, violating: 0.0 },
        { benign: 0.5, indeterminate: 0.3, suspect: 0.2, violating: 0.0 },
        { benign: 0.3, indeterminate: 0.4, suspect: 0.3, violating: 0.0 },
        { benign: 0.2, indeterminate: 0.4, suspect: 0.3, violating: 0.1 },
      ];

      let lastReport;
      for (const state of series) {
        lastReport = engine.recordAssessment(state as QuantumStateVector);
      }

      expect(lastReport).toBeDefined();
      expect(lastReport!.entropyValue).toBeGreaterThan(1.0);
      
      const assessment = engine.evaluateSlipperySlope();
      expect(assessment.isSlipperySlope).toBe(true);
      expect(assessment.dampingFactor).toBeLessThan(1.0);
    });
  });

  describe('Damping Operators', () => {
    it('should generate corrective damping parameters under high risk', () => {
      const assessment = {
        entropy: 1.5,
        slopeVelocity: 0.2,
        isSlipperySlope: true,
        message: 'High risk alert',
        dampingFactor: 0.5, // 50% damping
      };

      const operator = engine.generateDampingOperator(assessment);
      expect(operator.benign).toBeGreaterThan(1.0);
      expect(operator.indeterminate).toBe(0.5);
      expect(operator.suspect).toBeLessThan(0.5);
    });
  });

  describe('SlipperySlopePreventionDampers Integration', () => {
    it('should dynamically calculate adaptive damping parameters based on entropy', () => {
      const dampers = engine.getDampers();
      expect(dampers).toBeDefined();

      const lowEntropyResult = dampers.calculateAdaptiveDamper(0.2, 0.0);
      expect(lowEntropyResult.dampingFactor).toBe(1.0);

      const modEntropyResult = dampers.calculateAdaptiveDamper(0.6, 0.1);
      expect(modEntropyResult.dampingFactor).toBeLessThan(1.0);
      expect(modEntropyResult.dampingFactor).toBeGreaterThan(0.0);

      const highEntropyResult = dampers.calculateAdaptiveDamper(1.3, 0.25);
      expect(highEntropyResult.dampingFactor).toBeLessThan(modEntropyResult.dampingFactor);
    });
  });
});

