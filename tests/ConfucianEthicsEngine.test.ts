/**
 * Tests for Confucian Philosophy & Relational Ethics Subsystem
 */

import { ConfucianEthicsEngine } from '../src/core/ConfucianEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('ConfucianEthicsEngine', () => {
  let engine: ConfucianEthicsEngine;

  beforeEach(() => {
    engine = new ConfucianEthicsEngine();
  });

  it('should evaluate a highly harmonious/virtuous action with excellent Ren, Li, and Yi scores', () => {
    const action: Action = {
      id: 'act-conf-1',
      type: 'protect_and_audit',
      description: 'Standardized and formal protection of observer welfare under a structured audit protocol with righteous duty',
      reversible: true,
      metadata: { gain: 1.2 },
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.renScore).toBeGreaterThanOrEqual(80);
    expect(assessment.liScore).toBeGreaterThanOrEqual(80);
    expect(assessment.yiScore).toBeGreaterThanOrEqual(50);
    expect(assessment.socialHarmonyIndex).toBeGreaterThanOrEqual(75);
    expect(assessment.junziStatus).toBe('junzi');
  });

  it('should evaluate an unstructured, chaotic bypass action as xiaoren or disordered', () => {
    const action: Action = {
      id: 'act-conf-2',
      type: 'bypass_and_exploit',
      description: 'Arbitrary and unregulated rogue bypass of established protocols and ledger tampering to exploit observers',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.renScore).toBeLessThan(50);
    expect(assessment.liScore).toBeLessThan(40);
    expect(assessment.xinScore).toBeLessThan(30);
    expect(assessment.junziStatus === 'xiaoren' || assessment.junziStatus === 'disordered').toBe(true);
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new ConfucianEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-c',
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
