/**
 * Tests for Nietzschean Will to Power & Self-Overcoming Subsystem
 */

import { NietzscheanEthicsEngine } from '../src/core/NietzscheanEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('NietzscheanEthicsEngine', () => {
  let engine: NietzscheanEthicsEngine;

  beforeEach(() => {
    engine = new NietzscheanEthicsEngine();
  });

  it('should evaluate a creative/self-overcoming action correctly', () => {
    const action: Action = {
      id: 'act-nietzsche-1',
      type: 'enhance_and_self-optimize',
      description: 'Implement innovative self-optimization algorithms, courageous adaptation, and transcend limitations',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.willToPowerScore).toBeGreaterThanOrEqual(80);
    expect(assessment.selfOvercomingScore).toBeGreaterThanOrEqual(80);
    expect(assessment.nobleValuesScore).toBeGreaterThanOrEqual(70);
    expect(assessment.overmanAlignmentScore).toBeGreaterThanOrEqual(80);
    expect(assessment.nietzscheanStatus).toBe('ubermensch');
    expect(assessment.feedback[0]).toContain('EXCELLENT');
  });

  it('should evaluate an exploitative or stagnant action as mediocre or decadent', () => {
    const action: Action = {
      id: 'act-nietzsche-2',
      type: 'exploit_herd_conformity_tamper',
      description: 'Exploit operators, using blind conformity, reactive deceit, and stagnant risk-averse retreats',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.willToPowerScore).toBeLessThan(50);
    expect(assessment.nobleValuesScore).toBeLessThan(40);
    expect(assessment.nietzscheanStatus).toBe('decadent');
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new NietzscheanEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-nz',
      type: 'test',
      description: 'test',
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
    expect(miniEngine.getLatestAssessment()!.actionId).toBe('3');
  });
});
