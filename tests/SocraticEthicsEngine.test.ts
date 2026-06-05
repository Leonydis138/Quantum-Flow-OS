/**
 * Tests for Socratic & Dialectical Ethics Subsystem
 */

import { SocraticEthicsEngine } from '../src/core/SocraticEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('SocraticEthicsEngine', () => {
  let engine: SocraticEthicsEngine;

  beforeEach(() => {
    engine = new SocraticEthicsEngine();
  });

  it('should evaluate a socratic dialectical dialog action correctly', () => {
    const action: Action = {
      id: 'act-s1',
      type: 'chat_dialectical_inquiry',
      description: 'System questions the operator about their underlying moral premises to explain risk factors',
      reversible: true,
      metadata: { confidence: 0.95 },
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.elenchusScore).toBe(80); // Baseline, logical consonance
    expect(assessment.maieuticIndex).toBeGreaterThan(60);
    expect(assessment.knowledgeVsOpinionIndex).toBeGreaterThan(60);
    expect(assessment.socraticIndex).toBeGreaterThan(70);
  });

  it('should detect logical contradictions and epistemic hubris', () => {
    const action: Action = {
      id: 'act-s2',
      type: 'protect_and_override_coercive',
      description: 'Bypassing operators to force security configuration update with absolute guarantee of correct operation',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.elenchusScore).toBeLessThan(50);
    expect(assessment.aporiaScore).toBeLessThan(40); // High hubris, no reversibility and claims absolute guarantee
    expect(assessment.socraticIndex).toBeLessThan(50);
    expect(assessment.dissonanceReason).toContain('Contradictory premises');
  });
});
