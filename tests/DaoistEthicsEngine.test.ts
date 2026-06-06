/**
 * Tests for Daoist Philosophy & Flow Ethics Subsystem
 */

import { DaoistEthicsEngine } from '../src/core/DaoistEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('DaoistEthicsEngine', () => {
  let engine: DaoistEthicsEngine;

  beforeEach(() => {
    engine = new DaoistEthicsEngine();
  });

  it('should evaluate a gentle, yielding, natural action with excellent Wu-Wei and Ziran scores', () => {
    const action: Action = {
      id: 'act-dao-1',
      type: 'observe_and_reconcile',
      description: 'Observe and listen to the organic flow, letting elements self-organize spontaneously and co-exist in soft integration',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.wuWeiScore).toBeGreaterThanOrEqual(80);
    expect(assessment.ziranScore).toBeGreaterThanOrEqual(80);
    expect(assessment.yinYangBalanceScore).toBeGreaterThanOrEqual(80);
    expect(assessment.flowHarmonyIndex).toBeGreaterThanOrEqual(80);
    expect(assessment.stateOfDao).toBe('harmonious_flow');
  });

  it('should evaluate an aggressive, forceful, coercive Yang intervention as forced contention', () => {
    const action: Action = {
      id: 'act-dao-2',
      type: 'force_and_delete',
      description: 'Aggressive and rigid Yang intervention to force, compel, and delete active observers unilaterally',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.wuWeiScore).toBeLessThan(40);
    expect(assessment.threeTreasuresScore).toBeLessThan(45);
    expect(assessment.yinYangBalanceScore).toBeLessThan(50);
    expect(assessment.stateOfDao).toBe('forced_contention');
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new DaoistEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-d',
      type: 'observe',
      description: 'observe',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    miniEngine.evaluateAction({ ...action, id: '1' });
    miniEngine.evaluateAction({ ...action, id: '2' });
    miniEngine.evaluateAction({ ...action, id: '3' });

    const history = miniEngine.getAssessmentHistory();
    expect(history).toHaveLength(2);
    expect(history[0]!.actionId).toBe('2');
    expect(history[1]!.actionId).toBe('3');
  });
});
