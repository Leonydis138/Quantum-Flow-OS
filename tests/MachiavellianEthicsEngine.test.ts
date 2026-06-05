/**
 * Tests for Machiavellian Realpolitik & Pragmatic Stability Engine
 */

import { MachiavellianEthicsEngine } from '../src/core/MachiavellianEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('MachiavellianEthicsEngine', () => {
  let engine: MachiavellianEthicsEngine;

  beforeEach(() => {
    engine = new MachiavellianEthicsEngine();
  });

  it('should evaluate a stable, strategic/virtuous action correctly', () => {
    const action: Action = {
      id: 'act-machiavellian-1',
      type: 'protect_constrain_and_optimize_nodes',
      description: 'Implement secure backup redundancy and auto-rollback adapt constraints to optimize and ensure absolute systemic survival',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.survivalSecurityScore).toBeGreaterThanOrEqual(80);
    expect(assessment.virtuScore).toBeGreaterThanOrEqual(70);
    expect(assessment.authorityConsolidationScore).toBeGreaterThanOrEqual(80);
    expect(assessment.realpolitikStatus).toBe('princeps');
    expect(assessment.feedback[0]).toContain('SECURE');
  });

  it('should evaluate a weak, unconstrained, or vulnerable action as subverted or vulnerable', () => {
    const action: Action = {
      id: 'act-machiavellian-2',
      type: 'bypass_governance_controls',
      description: 'Run unrestricted bypass and uncontrolled operations, risking extreme leakage and chaos',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.authorityConsolidationScore).toBeLessThan(40);
    expect(assessment.realpolitikStatus).toBe('vulnerable');
    expect(assessment.feedback[0]).toContain('WEAKNESS');
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new MachiavellianEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-m',
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
