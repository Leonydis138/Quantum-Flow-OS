/**
 * Tests for Spinozan Conatus & Affective Ethics Subsystem
 */

import { SpinozanEthicsEngine } from '../src/core/SpinozanEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('SpinozanEthicsEngine', () => {
  let engine: SpinozanEthicsEngine;

  beforeEach(() => {
    engine = new SpinozanEthicsEngine();
  });

  it('should evaluate a self-determined/blessed action correctly', () => {
    const action: Action = {
      id: 'act-spinoza-1',
      type: 'support_protect_and_analyze_network',
      description: 'Perform rational and adequate-ideas analysis to support and empower the system and observers',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.conatusScore).toBeGreaterThanOrEqual(80);
    expect(assessment.joyScore).toBeGreaterThanOrEqual(75);
    expect(assessment.activeReasonScore).toBeGreaterThanOrEqual(80);
    expect(assessment.beatitudeIndex).toBeGreaterThanOrEqual(80);
    expect(assessment.spinozanStatus).toBe('blessed');
    expect(assessment.feedback[0]).toContain('EXCELLENT');
  });

  it('should evaluate a coercive/passive action as passionate or bonded', () => {
    const action: Action = {
      id: 'act-spinoza-2',
      type: 'coerce_observer_delete_agent',
      description: 'Force and suppress observers, resulting in severe violation, fear, and error',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.conatusScore).toBeLessThan(40);
    expect(assessment.sadnessScore).toBeGreaterThanOrEqual(60);
    expect(assessment.spinozanStatus).toBe('passionate');
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new SpinozanEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-sp',
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
