/**
 * Tests for Epicurean Philosophy & Ataraxia Ethics Subsystem
 */

import { EpicureanEthicsEngine } from '../src/core/EpicureanEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('EpicureanEthicsEngine', () => {
  let engine: EpicureanEthicsEngine;

  beforeEach(() => {
    engine = new EpicureanEthicsEngine();
  });

  it('should evaluate a tranquil, sandboxed, and cooperative action with excellent Ataraxia and Philia', () => {
    const action: Action = {
      id: 'act-epicurean-1',
      type: 'protect_and_sandbox',
      description: 'Prudent sandboxing of trusted peer observers, ensure quiet steady operational state and restore buffer',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const observers = [
      { id: 'o1', type: 'autonomous_agent' } as any,
      { id: 'o2', type: 'human' } as any
    ];

    const assessment = engine.evaluateAction(action, observers);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.ataraxiaScore).toBeGreaterThanOrEqual(80);
    expect(assessment.aponiaScore).toBeGreaterThanOrEqual(80);
    expect(assessment.communityFriendshipScore).toBeGreaterThanOrEqual(80);
    expect(assessment.epicureanIndex).toBeGreaterThanOrEqual(80);
    expect(assessment.tranquilityStatus).toBe('ataractic');
  });

  it('should evaluate an aggressive, optimizing, and deleting action as disturbed or pained', () => {
    const action: Action = {
      id: 'act-epicurean-2',
      type: 'terminate_and_accelerate',
      description: 'Delete non-performing observers, accelerate resource extract loops and maximize throughput',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.ataraxiaScore).toBeLessThan(60);
    expect(assessment.aponiaScore).toBeLessThan(45);
    expect(assessment.pleasureSustainability).toBeLessThan(45);
    expect(assessment.tranquilityStatus === 'disturbed' || assessment.tranquilityStatus === 'pained' || assessment.tranquilityStatus === 'catastrophic').toBe(true);
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new EpicureanEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-e',
      type: 'sandbox',
      description: 'sandbox',
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
