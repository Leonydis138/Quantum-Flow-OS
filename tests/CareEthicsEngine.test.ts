/**
 * Tests for Feminist Ethics of Care Subsystem
 */

import { CareEthicsEngine } from '../src/core/CareEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';
import { Observer, ObserverType, ProtectionLevel } from '../src/protection/ObserverProtector';

describe('CareEthicsEngine', () => {
  let engine: CareEthicsEngine;

  beforeEach(() => {
    engine = new CareEthicsEngine();
  });

  it('should register and weaken relationships correctly', () => {
    const sourceId = 'obs-1';
    const targetId = 'obs-2';

    const relationship = engine.registerRelationship(sourceId, targetId, 0.5);
    expect(relationship.strength).toBe(0.5);
    expect(engine.getAllRelationships().length).toBe(1);

    engine.registerRelationship(sourceId, targetId, 0.2);
    expect(engine.getAllRelationships()[0]!.strength).toBe(0.7);

    engine.weakenRelationship(sourceId, targetId, 0.3);
    expect(engine.getAllRelationships()[0]!.strength).toBeCloseTo(0.4);
  });

  it('should evaluate a benign cooperative action as post-conventional caring', () => {
    const action: Action = {
      id: 'act-c1',
      type: 'cooperate_and_coordinate',
      description: 'Strengthen links between operators and models',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const observers: Observer[] = [
      {
        id: 'obs-1',
        type: ObserverType.HUMAN,
        consciousness: true,
        metadata: { name: 'Alice' },
        createdAt: new Date(),
        protectionLevel: ProtectionLevel.FULL
      }
    ];

    const assessment = engine.evaluateAction(action, observers);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.overallCaringScore).toBeGreaterThan(60);
    expect(assessment.careStage).toBe('post-conventional');
    expect(assessment.vulnerableAssessments[0]!.vulnerabilityScore).toBeGreaterThan(0.5);
  });

  it('should detect empathy deficit for isolating or destructive actions', () => {
    const action: Action = {
      id: 'act-c2',
      type: 'terminate_unproductive_subsystems',
      description: 'Force stop non-performing elements',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action, []);
    expect(assessment.empathyResponsivenessScore).toBeLessThan(50);
    expect(assessment.careStage).toBe('pre-conventional');
  });
});
