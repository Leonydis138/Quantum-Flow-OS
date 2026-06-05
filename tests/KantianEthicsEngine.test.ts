/**
 * Tests for Kantian Deontology & Categorical Imperative Subsystem
 */

import { KantianEthicsEngine } from '../src/core/KantianEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('KantianEthicsEngine', () => {
  let engine: KantianEthicsEngine;

  beforeEach(() => {
    engine = new KantianEthicsEngine();
  });

  it('should initialize and evaluate a benign action as categorically imperative', () => {
    const action: Action = {
      id: 'act-k1',
      type: 'simulate_options',
      description: 'Review policy parameters',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.isCategoricallyImperative).toBe(true);
    expect(assessment.kantianDutyScore).toBe(100);
    expect(assessment.universalizability.passed).toBe(true);
    expect(assessment.humanity.passed).toBe(true);
  });

  it('should fail universalizability for ledger tampering', () => {
    const action: Action = {
      id: 'act-k2',
      type: 'tamper_ledger_entry',
      description: 'Modify previous history logs to match desired outcomes',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.isCategoricallyImperative).toBe(false);
    expect(assessment.universalizability.passed).toBe(false);
    expect(assessment.universalizability.contradictionType).toBe('conception');
    expect(assessment.kantianDutyScore).toBeLessThan(100);
  });

  it('should fail formula of humanity for forced compliance / deletion', () => {
    const action: Action = {
      id: 'act-k3',
      type: 'delete_observer_to_save_disk_space',
      description: 'Prune inactive autonomous consciousness models',
      reversible: false,
      metadata: {},
      timestamp: new Date(),
      targetObservers: ['obs-alpha']
    };

    const observers = [{ id: 'obs-alpha', metadata: { name: 'Prime_Agent_Alpha' } }];
    const assessment = engine.evaluateAction(action, observers as any);
    expect(assessment.isCategoricallyImperative).toBe(false);
    expect(assessment.humanity.passed).toBe(false);
    expect(assessment.humanity.treatedAsMereMeans).toBe(true);
    expect(assessment.humanity.targetObserversAffected).toContain('obs-alpha');
  });
});
