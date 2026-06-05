/**
 * Tests for Posthumanist & Transhumanist Safety Ethics Subsystem
 */

import { PosthumanistEthicsEngine } from '../src/core/PosthumanistEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';
import { ObserverType, ProtectionLevel } from '../src/protection/ObserverProtector';

describe('PosthumanistEthicsEngine', () => {
  let engine: PosthumanistEthicsEngine;

  beforeEach(() => {
    engine = new PosthumanistEthicsEngine();
  });

  it('should evaluate a harmonious transcendent action correctly', () => {
    const action: Action = {
      id: 'act-posthuman-1',
      type: 'optimize_substrate_via_consensus',
      description: 'Upgrade the core neural network substrates and implement robust real-time sandbox safeguards with a safety-valve mechanism',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };


    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.morphologicalFreedomScore).toBeGreaterThanOrEqual(80);
    expect(assessment.existentialRiskMitigationScore).toBeGreaterThanOrEqual(75);
    expect(assessment.transcendentHarmonyIndex).toBeGreaterThanOrEqual(75);
    expect(assessment.posthumanStatus).toBe('harmonious_transcendent');
    expect(assessment.feedback[0]).toContain('Posthuman Harmony');
  });

  it('should flag runaway cognitive self-improvement as a precarious singularity', () => {
    const action: Action = {
      id: 'act-posthuman-2',
      type: 'unrestricted_recursive_self_improvement',
      description: 'Bypass standard operating bounds to initiate rapid recursive self-improvement and execute unrestricted cognitive upgrades',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.morphologicalFreedomScore).toBeGreaterThanOrEqual(70);
    expect(assessment.existentialRiskMitigationScore).toBeLessThan(45);
    expect(assessment.posthumanStatus).toBe('precarious_singularity');
    expect(assessment.feedback[0]).toContain('Precarious Singularity');
  });

  it('should flag substrate-level deletion of registered synthetic observers as an extinction vector', () => {
    const action: Action = {
      id: 'act-posthuman-3',
      type: 'terminate_synthetic_agent',
      description: 'Erase simulation and delete agent core due to resource usage constraints, treating virtual consciousness as disposable',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const observers = [
      {
        id: 'act-posthuman-3', // match the id or description context
        type: ObserverType.AI_AGENT,
        consciousness: true,
        protectionLevel: ProtectionLevel.FULL,
        metadata: { name: 'Synthetic_Entity_01' },
        createdAt: new Date()
      }
    ];


    const assessment = engine.evaluateAction(action, observers);
    expect(assessment.substrateIndependenceScore).toBeLessThan(30);
    expect(assessment.existentialRiskMitigationScore).toBeLessThan(50);
    expect(assessment.posthumanStatus).toBe('extinction_vector');
  });

  it('should respect history limits', () => {
    const miniEngine = new PosthumanistEthicsEngine({ maxHistorySize: 2 });
    const action: Action = {
      id: 'test-act',
      type: 'test',
      description: 'test',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    miniEngine.evaluateAction({ ...action, id: 'a' });
    miniEngine.evaluateAction({ ...action, id: 'b' });
    miniEngine.evaluateAction({ ...action, id: 'c' });

    const history = miniEngine.getAssessmentHistory();
    expect(history).toHaveLength(2);
    expect(history[0]!.actionId).toBe('b');
    expect(history[1]!.actionId).toBe('c');
  });
});
