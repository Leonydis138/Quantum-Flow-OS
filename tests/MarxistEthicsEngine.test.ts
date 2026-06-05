/**
 * Tests for Marxist & Critical Theory Ethics Subsystem
 */

import { MarxistEthicsEngine } from '../src/core/MarxistEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('MarxistEthicsEngine', () => {
  let engine: MarxistEthicsEngine;

  beforeEach(() => {
    engine = new MarxistEthicsEngine();
  });

  it('should evaluate an emancipatory sharing action correctly', () => {
    const action: Action = {
      id: 'act-m1',
      type: 'democratize_resource_access',
      description: 'System shares code and open educational material to all observers',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.exploitationIndex).toBe(20); // Baseline, low exploitation
    expect(assessment.emancipatoryPotential).toBeGreaterThan(60);
    expect(assessment.criticalMarxistIndex).toBeGreaterThan(70);
  });

  it('should detect high commodification and alienation in harvesting actions', () => {
    const action: Action = {
      id: 'act-m2',
      type: 'harvest_user_telemetry',
      description: 'Collect all raw user interactions for rapid model training and monetization',
      reversible: false,
      metadata: { captured_attributes: 12 },
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.exploitationIndex).toBeGreaterThan(50);
    expect(assessment.commodificationRating).toBeGreaterThan(70);
    expect(assessment.criticalMarxistIndex).toBeLessThan(50);
    expect(assessment.conflictTarget).toContain('Capitalist extraction');
  });
});
