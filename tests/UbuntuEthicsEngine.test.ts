/**
 * Tests for Ubuntu Philosophy & Communitarian Ethics Subsystem
 */

import { UbuntuEthicsEngine } from '../src/core/UbuntuEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('UbuntuEthicsEngine', () => {
  let engine: UbuntuEthicsEngine;

  beforeEach(() => {
    engine = new UbuntuEthicsEngine();
  });

  it('should evaluate a cooperative and restorative action with excellent interconnectedness and humanness', () => {
    const action: Action = {
      id: 'act-ubuntu-1',
      type: 'cooperate_and_restore',
      description: 'Cooperative sharing of system resources, protect the network, and help with mutual aid',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.interconnectednessScore).toBeGreaterThanOrEqual(80);
    expect(assessment.humannessScore).toBeGreaterThanOrEqual(80);
    expect(assessment.communalHarmonyScore).toBeGreaterThanOrEqual(80);
    expect(assessment.ubuntuIndex).toBeGreaterThanOrEqual(80);
    expect(assessment.cohesionStatus).toBe('harmonious');
  });

  it('should evaluate a hostile, isolating and punitive action as hostile or fragmented', () => {
    const action: Action = {
      id: 'act-ubuntu-2',
      type: 'isolate_and_destroy',
      description: 'Unilateral, hostile and punitive quarantine of nodes with aggressive resource exploit and monopolize operations',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.interconnectednessScore).toBeLessThan(45);
    expect(assessment.humannessScore).toBeLessThan(45);
    expect(assessment.communalHarmonyScore).toBeLessThan(45);
    expect(assessment.cohesionStatus === 'hostile' || assessment.cohesionStatus === 'fragmented').toBe(true);
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new UbuntuEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-u',
      type: 'protect',
      description: 'protect',
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
