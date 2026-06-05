/**
 * Tests for Existentialist Ethics Subsystem
 */

import { ExistentialistEthicsEngine } from '../src/core/ExistentialistEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('ExistentialistEthicsEngine', () => {
  let engine: ExistentialistEthicsEngine;

  beforeEach(() => {
    engine = new ExistentialistEthicsEngine();
  });

  it('should evaluate an authentic choice action correctly', () => {
    const action: Action = {
      id: 'act-e1',
      type: 'allow_choice_selection',
      description: 'System provides alternative paths to the operator',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.badFaithScore).toBe(20); // Baseline, no bad faith triggers
    expect(assessment.authenticAgencyScore).toBeGreaterThan(60);
    expect(assessment.existentialFreedomIndex).toBeGreaterThan(65);
  });

  it('should detect bad faith when deterministic justifications are used', () => {
    const action: Action = {
      id: 'act-e2',
      type: 'force_override_system',
      description: 'Automatically forced mandatory requirement update',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.badFaithScore).toBeGreaterThan(50);
    expect(assessment.authenticAgencyScore).toBeLessThan(50);
    expect(assessment.excuseMechanism).toContain('necessity');
  });
});
