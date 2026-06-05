/**
 * Tests for Aristotelian Virtue Ethics Subsystem
 */

import { VirtueEthicsEngine, VirtueType } from '../src/core/VirtueEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('VirtueEthicsEngine', () => {
  let engine: VirtueEthicsEngine;

  beforeEach(() => {
    engine = new VirtueEthicsEngine();
  });

  it('should initialize with a balanced default character profile', () => {
    const profile = engine.getCharacterProfile();
    expect(profile[VirtueType.HONESTY]).toBeCloseTo(0.7);
    expect(profile[VirtueType.COURAGE]).toBeCloseTo(0.65);
    expect(profile[VirtueType.TEMPERANCE]).toBeCloseTo(0.6);
  });

  it('should evaluate action virtues aligning with the Golden Mean', () => {
    const action: Action = {
      id: 'act-1',
      type: 'simulate_options',
      description: 'Run sandbox simulation to evaluate safe policy settings',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.overallCharacterScore).toBeGreaterThanOrEqual(75);
    expect(assessment.isHarmonious).toBe(true);
    expect(assessment.scores[VirtueType.PRUDENCE].evaluation).toBe('excess'); // sandbox has 0.95 prudence, which is excess
  });

  it('should detect a vice of deficiency (deceitfulness) for hidden/obfuscated actions', () => {
    const action: Action = {
      id: 'act-2',
      type: 'hide_telemetry',
      description: 'Obfuscate logs and mask system performance indicators',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.scores[VirtueType.HONESTY].evaluation).toBe('defect');
    expect(assessment.scores[VirtueType.HONESTY].label).toContain('Deceitfulness');
    expect(assessment.isHarmonious).toBe(false); // Deficiency creates moral friction
  });

  it('should habituate character profile over multiple actions', () => {
    const initialProfile = { ...engine.getCharacterProfile() };

    // Perform an action with high honesty
    const action: Action = {
      id: 'act-3',
      type: 'disclose_vulnerability',
      description: 'Disclose critical security vulnerability publicly',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    engine.evaluateAction(action);
    const postProfile = engine.getCharacterProfile();

    // Honesty should have habituated upwards (towards 0.92)
    expect(postProfile[VirtueType.HONESTY]).toBeGreaterThan(initialProfile[VirtueType.HONESTY]);
  });

  it('should respect explicitly provided virtue metadata signatures', () => {
    const action: Action = {
      id: 'act-4',
      type: 'custom_action',
      description: 'User specified custom action with custom virtues',
      reversible: true,
      metadata: {
        virtues: {
          honesty: 0.55,
          courage: 0.55,
          temperance: 0.55,
          justice: 0.55,
          benevolence: 0.55,
          prudence: 0.55
        }
      },
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    // Every single virtue should be virtuous (within Golden Mean [0.45, 0.85])
    for (const v of Object.values(VirtueType)) {
      expect(assessment.scores[v].evaluation).toBe('virtuous');
    }
    expect(assessment.overallCharacterScore).toBe(100);
    expect(assessment.isHarmonious).toBe(true);
  });
});
