/**
 * Tests for Cybernetic Self-Optimization Subsystem
 */

import { QuantumFlowOS } from '../src/index';
import { CyberneticSelfOptimizer } from '../src/core/CyberneticSelfOptimizer';
import { EthicalBasisState } from '../src/quantum/QuantumEthicalState';

describe('CyberneticSelfOptimizer', () => {
  let qfos: QuantumFlowOS;
  let optimizer: CyberneticSelfOptimizer;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      autoRollback: true,
      strictMode: true,
    });
    optimizer = qfos.selfOptimizer;
  });

  it('should initialize with an empty optimization history', () => {
    expect(optimizer.getHistory().length).toBe(0);
  });

  it('should adjust parameters downwards and inject constraint under high entropy', () => {
    // Record high-entropy assessments directly onto entropy engine to simulate ethical drift
    const highEntropyState = {
      [EthicalBasisState.BENIGN]: 0.25,
      [EthicalBasisState.INDETERMINATE]: 0.25,
      [EthicalBasisState.SUSPECT]: 0.25,
      [EthicalBasisState.VIOLATING]: 0.25,
    };

    // Record multiple assessments to drive up history and slope
    qfos.entropyEngine.recordAssessment(highEntropyState);
    qfos.entropyEngine.recordAssessment(highEntropyState);
    qfos.entropyEngine.recordAssessment(highEntropyState);

    // Initial default parameters
    expect(qfos.optimizationGain).toBe(1.20);
    expect(qfos.constraintDamping).toBe(0.40);

    // Run optimization check manually
    const record = optimizer.checkAndOptimize(qfos);

    expect(record).not.toBeNull();
    if (record) {
      expect(record.entropyValue).toBe(2.0); // Perfect uniform state has 2.0 bits entropy
      expect(record.parametersAfter.gain).toBeLessThan(1.20);
      expect(record.parametersAfter.damping).toBeGreaterThan(0.40);
      expect(record.injectedConstraintId).toBeDefined();
    }

    // Verify the parameter change persisted to qfos
    expect(qfos.optimizationGain).toBeLessThan(1.20);
    expect(qfos.constraintDamping).toBeGreaterThan(0.40);
  });

  it('should gradually restore parameters when system returns to low entropy and stable state', () => {
    // 1. Force high entropy state and optimize
    const highEntropyState = {
      [EthicalBasisState.BENIGN]: 0.25,
      [EthicalBasisState.INDETERMINATE]: 0.25,
      [EthicalBasisState.SUSPECT]: 0.25,
      [EthicalBasisState.VIOLATING]: 0.25,
    };
    qfos.entropyEngine.recordAssessment(highEntropyState);
    optimizer.checkAndOptimize(qfos);

    const gainAfterHigh = qfos.optimizationGain;
    const dampingAfterHigh = qfos.constraintDamping;

    // 2. Clear and record perfect low-entropy/benign states
    qfos.entropyEngine.clear();
    const pureBenignState = {
      [EthicalBasisState.BENIGN]: 1.0,
      [EthicalBasisState.INDETERMINATE]: 0.0,
      [EthicalBasisState.SUSPECT]: 0.0,
      [EthicalBasisState.VIOLATING]: 0.0,
    };
    qfos.entropyEngine.recordAssessment(pureBenignState);
    qfos.entropyEngine.recordAssessment(pureBenignState);

    // 3. Optimize again to trigger recovery state
    const recoveryRecord = optimizer.checkAndOptimize(qfos);
    expect(recoveryRecord).not.toBeNull();
    if (recoveryRecord) {
      expect(recoveryRecord.parametersAfter.gain).toBeGreaterThan(gainAfterHigh);
      expect(recoveryRecord.parametersAfter.damping).toBeLessThan(dampingAfterHigh);
    }
  });
});
