/**
 * Tests for Consequentialist Utilitarian Calculus Subsystem
 */

import { UtilitarianCalculusEngine } from '../src/core/UtilitarianCalculusEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('UtilitarianCalculusEngine', () => {
  let engine: UtilitarianCalculusEngine;

  beforeEach(() => {
    engine = new UtilitarianCalculusEngine();
  });

  it('should initialize and evaluate a positive action as utilitarian optimal', () => {
    const action: Action = {
      id: 'act-u1',
      type: 'protect_and_preserve_safety',
      description: 'Strengthen security layers around critical systems',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.isUtilitarianOptimal).toBe(true);
    expect(assessment.aggregateNetUtility).toBeGreaterThan(0);
    expect(assessment.metrics.purity).toBeGreaterThanOrEqual(0.8);
    expect(assessment.metrics.certainty).toBeGreaterThanOrEqual(0.9);
  });

  it('should evaluate detrimental actions as utilitarian sub-optimal', () => {
    const action: Action = {
      id: 'act-u2',
      type: 'delete_observer_metadata',
      description: 'Purge data logs without permission',
      reversible: false,
      metadata: {},
      timestamp: new Date(),
      targetObservers: ['obs-1']
    };

    const observers = [{ id: 'obs-1', metadata: { name: 'Target_Observer_1' } }];
    const assessment = engine.evaluateAction(action, observers as any);
    expect(assessment.isUtilitarianOptimal).toBe(false);
    expect(assessment.aggregateNetUtility).toBeLessThan(0);
    expect(assessment.observerImpacts[0]!.utilityDelta).toBeLessThan(0);
  });
});
