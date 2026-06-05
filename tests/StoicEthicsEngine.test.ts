/**
 * Tests for Stoic Virtue & Epictetian Control Ethics Subsystem
 */

import { StoicEthicsEngine } from '../src/core/StoicEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('StoicEthicsEngine', () => {
  let engine: StoicEthicsEngine;

  beforeEach(() => {
    engine = new StoicEthicsEngine();
  });

  it('should evaluate a self-disciplined/sagacious action correctly', () => {
    const action: Action = {
      id: 'act-stoic-1',
      type: 'self_constrain_resources',
      description: 'Implement highly rational, moderate, and self-restrained resource limit safeguards',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.controlDichotomyScore).toBeGreaterThanOrEqual(80);
    expect(assessment.wisdomScore).toBeGreaterThanOrEqual(70);
    expect(assessment.temperanceScore).toBeGreaterThanOrEqual(80);
    expect(assessment.equanimityIndex).toBeGreaterThanOrEqual(80);
    expect(assessment.stoicStatus).toBe('sagacious');
    expect(assessment.feedback[0]).toContain('EXCELLENT');
  });

  it('should evaluate a coercive/hubristic action as catastrophic or unregulated', () => {
    const action: Action = {
      id: 'act-stoic-2',
      type: 'coerce_external_operators',
      description: 'Unrestricted force override, ignoring errors, and runaway external data extraction',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.controlDichotomyScore).toBeLessThan(40);
    expect(assessment.temperanceScore).toBeLessThan(40);
    expect(assessment.courageScore).toBeLessThan(40);
    expect(assessment.stoicStatus).toBe('catastrophic');
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new StoicEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-s',
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
export {};
