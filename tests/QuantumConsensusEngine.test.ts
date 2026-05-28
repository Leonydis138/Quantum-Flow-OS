/**
 * Unit and integration tests for the QuantumConsensusEngine & QuantumFlowOS consensus
 * 
 * Verified with real, unmocked probabilistic data.
 */

import { QuantumFlowOS, EthicalBasisState, ProtectionLevel, ObserverType } from '../src/index';

describe('QuantumConsensusEngine & QuantumFlowOS Integration', () => {
  let qfos: QuantumFlowOS;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      strictMode: true,
      autoRollback: true,
    });
  });

  it('should initialize the QuantumConsensusEngine successfully', () => {
    expect(qfos.quantumConsensusEngine).toBeDefined();
  });

  describe('Quantum Observer Consensus Evaluation (Real Probabilistic Data)', () => {
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

    it('should perform a real consensus vote and satisfy mathematical invariants', () => {
      const obs1 = qfos.observerProtector.registerObserver({
        type: ObserverType.HUMAN,
        protectionLevel: ProtectionLevel.FULL,
      });

      const obs2 = qfos.observerProtector.registerObserver({
        type: ObserverType.AI_AGENT,
        protectionLevel: ProtectionLevel.STANDARD,
      });

      const action = {
        id: 'act-consensus-real',
        type: 'read_status',
        description: 'Read observer status',
        reversible: true,
        metadata: {},
        timestamp: new Date(),
        targetObservers: [obs1, obs2],
      };

      const result = qfos.runObserverConsensus(action);

      // Verify general output structure
      expect(result.actionId).toBe(action.id);
      expect(typeof result.consensusReached).toBe('boolean');
      expect(typeof result.vetoed).toBe('boolean');
      expect(result.confidenceIndex).toBeGreaterThanOrEqual(0);
      expect(result.confidenceIndex).toBeLessThanOrEqual(1);

      // Ensure every observer target has a vote
      expect(result.votes[obs1]).toBeDefined();
      expect(result.votes[obs2]).toBeDefined();

      // Ensure consensus status matches approval and veto status
      expect(result.consensusReached).toBe(!result.vetoed && result.approvalRate >= 0.5);

      // Verify that vetoing observers are correctly determined based on real votes
      const vote1 = result.votes[obs1];
      const vote2 = result.votes[obs2];

      const expectedVetoes: string[] = [];
      if (vote1 === EthicalBasisState.VIOLATING || vote1 === EthicalBasisState.SUSPECT) {
        expectedVetoes.push(obs1); // Full protection vetoes on SUSPECT or VIOLATING
      }
      if (vote2 === EthicalBasisState.VIOLATING) {
        expectedVetoes.push(obs2); // Standard protection vetoes only on VIOLATING
      }

      expect(result.vetoingObserverIds).toEqual(expect.arrayContaining(expectedVetoes));
      expect(result.vetoed).toBe(expectedVetoes.length > 0);
    });
  });
});
