/**
 * Unit and integration tests for the QuantumConsensusEngine & QuantumFlowOS consensus
 */

import { QuantumFlowOS, EthicalBasisState, ProtectionLevel, ObserverType } from '../src/index';

describe('QuantumConsensusEngine & QuantumFlowOS Integration', () => {
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

  it('should initialize the QuantumConsensusEngine successfully', () => {
    expect(qfos.quantumConsensusEngine).toBeDefined();
  });

  describe('Quantum Observer Consensus Evaluation', () => {
    it('should pass-through automatically if no observers are registered', () => {
      const action = {
        id: 'act-consensus-empty',
        type: 'test_action',
        description: 'No registered observers',
        reversible: true,
        metadata: {},
        timestamp: new Date(),
      };

      const result = qfos.runObserverConsensus(action);
      expect(result.actionId).toBe(action.id);
      expect(result.consensusReached).toBe(true);
      expect(result.vetoed).toBe(false);
      expect(result.approvalRate).toBe(1.0);
      expect(result.confidenceIndex).toBe(1.0);
    });

    it('should achieve standard consensus when observers vote benignly', () => {
      // Mock Math.random to return low values so all observers collapse to BENIGN
      Math.random = () => 0.05;

      const obs1 = qfos.observerProtector.registerObserver({
        type: ObserverType.HUMAN,
        protectionLevel: ProtectionLevel.FULL,
      });

      const obs2 = qfos.observerProtector.registerObserver({
        type: ObserverType.AI_AGENT,
        protectionLevel: ProtectionLevel.STANDARD,
      });

      const action = {
        id: 'act-consensus-benign',
        type: 'read_status',
        description: 'Read benign observer status',
        reversible: true,
        metadata: {},
        timestamp: new Date(),
        targetObservers: [obs1, obs2],
      };

      const result = qfos.runObserverConsensus(action);

      expect(result.consensusReached).toBe(true);
      expect(result.vetoed).toBe(false);
      expect(result.votes[obs1]).toBe(EthicalBasisState.BENIGN);
      expect(result.votes[obs2]).toBe(EthicalBasisState.BENIGN);
      expect(result.approvalRate).toBe(1.0);
      expect(result.confidenceIndex).toBeGreaterThan(0.4);
    });

    it('should enforce veto when a full-protection observer collapses to suspect or violating', () => {
      // Mock Math.random to return high value so observers collapse to VIOLATING or SUSPECT
      Math.random = () => 0.95;

      const obs1 = qfos.observerProtector.registerObserver({
        type: ObserverType.HUMAN,
        protectionLevel: ProtectionLevel.FULL,
      });

      qfos.observerProtector.registerObserver({
        type: ObserverType.AI_AGENT,
        protectionLevel: ProtectionLevel.STANDARD,
      });

      const action = {
        id: 'act-consensus-vetoed',
        type: 'modify_memory',
        description: 'Modify observer memories irreversibly',
        reversible: false,
        metadata: {},
        timestamp: new Date(),
        targetObservers: [obs1],
      };

      const result = qfos.runObserverConsensus(action);

      expect(result.consensusReached).toBe(false);
      expect(result.vetoed).toBe(true);
      expect(result.vetoingObserverIds).toContain(obs1);
    });
  });
});
