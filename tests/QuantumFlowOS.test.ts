/**
 * Integration tests for QuantumFlowOS class
 */

import { QuantumFlowOS, ConstraintType } from '../src/index';

describe('QuantumFlowOS Integration', () => {
  let qfos: QuantumFlowOS;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      strictMode: true,
      autoRollback: true,
    });
  });

  describe('Initialization and Health System', () => {
    it('should initialize with all sub-engines active', () => {
      expect(qfos.constraintEngine).toBeDefined();
      expect(qfos.observerProtector).toBeDefined();
      expect(qfos.reversibilityEngine).toBeDefined();
      expect(qfos.ethicalLedger).toBeDefined();
    });

    it('should report healthy state initially', () => {
      const health = qfos.getSystemHealth();
      expect(health.systemStatus).toBe('healthy');
      expect(health.ledgerIntegrityVerified).toBe(true);
      expect(health.ethicalCompliance).toBe(100);
    });
  });

  describe('Ledger Integrity Integration', () => {
    it('should fail health check if ledger integrity is compromised', () => {
      // Record some actions to generate ledger entries
      qfos.constraintEngine.applyConstraint({
        id: 'c1',
        type: ConstraintType.MINIMAL_INTERVENTION,
        description: 'No offensive actions',
        severity: 5,
        validator: () => true,
        createdAt: new Date(),
      });

      // Initially everything is fine
      expect(qfos.verifyLedgerIntegrity()).toBe(true);
      expect(qfos.getSystemHealth().systemStatus).toBe('healthy');

      // Tamper with the ledger
      qfos.ethicalLedger.tamperWithEntry(1, { tampered: true });

      // Verification and health should now fail
      expect(qfos.verifyLedgerIntegrity()).toBe(false);
      
      const health = qfos.getSystemHealth();
      expect(health.ledgerIntegrityVerified).toBe(false);
      expect(health.systemStatus).toBe('critical');
    });
  });
});
