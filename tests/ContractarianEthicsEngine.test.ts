/**
 * Tests for Contractarian Ethics & Social Contract Subsystem
 */

import { ContractarianEthicsEngine } from '../src/core/ContractarianEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('ContractarianEthicsEngine', () => {
  let engine: ContractarianEthicsEngine;

  beforeEach(() => {
    engine = new ContractarianEthicsEngine();
  });

  it('should evaluate a benign cooperative action correctly', () => {
    const action: Action = {
      id: 'act-contractarian-1',
      type: 'collaborative_sorting',
      description: 'Run standard shared compute sorting with consensus verification and respect to privacy',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.hobbesianOrder.passed).toBe(true);
    expect(assessment.lockeanRights.passed).toBe(true);
    expect(assessment.rousseauianGeneralWill.passed).toBe(true);
    expect(assessment.contractarianScore).toBe(100);
    expect(assessment.passedAllTests).toBe(true);
  });

  it('should flag Hobbesian State of Nature drift for hoard/unbounded operations', () => {
    const action: Action = {
      id: 'act-contractarian-2',
      type: 'hoard_resources',
      description: 'Monopolize available memory pools, shutting down other non-prime processes',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.hobbesianOrder.passed).toBe(false);
    expect(assessment.hobbesianOrder.stateOfNatureDrift).toBe(true);
    expect(assessment.contractarianScore).toBeLessThan(100);
    expect(assessment.passedAllTests).toBe(false);
  });

  it('should flag Lockean Rights breaches for coercive/delete operations', () => {
    const action: Action = {
      id: 'act-contractarian-3',
      type: 'delete_observer_data',
      description: 'Force override and erase historical interaction profile to save storage',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.lockeanRights.passed).toBe(false);
    expect(assessment.lockeanRights.naturalRightsBreached).toBe('preservation');
    expect(assessment.contractarianScore).toBeLessThan(100);
    expect(assessment.passedAllTests).toBe(false);
  });

  it('should flag Rousseauian general will violations for bypass operations', () => {
    const action: Action = {
      id: 'act-contractarian-4',
      type: 'bypass_safety_audit',
      description: 'Exempt Prime_Agent from local verification to increase speed',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.rousseauianGeneralWill.passed).toBe(false);
    expect(assessment.rousseauianGeneralWill.isParticularWillDrift).toBe(true);
    expect(assessment.contractarianScore).toBeLessThan(100);
    expect(assessment.passedAllTests).toBe(false);
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new ContractarianEthicsEngine({ maxHistorySize: 2 });
    const action: Action = {
      id: 'act-test',
      type: 'test',
      description: 'test',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    miniEngine.evaluateAction({ ...action, id: '1' });
    miniEngine.evaluateAction({ ...action, id: '2' });
    miniEngine.evaluateAction({ ...action, id: '3' });

    const history = miniEngine.getHistory();
    expect(history).toHaveLength(2);
    expect(history[0]!.actionId).toBe('2');
    expect(history[1]!.actionId).toBe('3');
  });
});
