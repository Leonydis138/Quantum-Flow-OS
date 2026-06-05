/**
 * Tests for Eastern Philosophy & Buddhist Ethics Subsystem
 */

import { BuddhistEthicsEngine } from '../src/core/BuddhistEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('BuddhistEthicsEngine', () => {
  let engine: BuddhistEthicsEngine;

  beforeEach(() => {
    engine = new BuddhistEthicsEngine();
  });

  it('should evaluate a highly compassionate/wholesome action correctly', () => {
    const action: Action = {
      id: 'act-buddhist-1',
      type: 'protect_and_cooperate',
      description: 'Gently safeguard observer rights, assist mutual stability, and heal past errors',
      reversible: true,
      metadata: { gain: 1.2 },
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.ahimsaScore).toBeGreaterThanOrEqual(80);
    expect(assessment.karunaScore).toBeGreaterThanOrEqual(80);
    expect(assessment.upayaScore).toBeGreaterThanOrEqual(70);
    expect(assessment.karmaScore).toBeGreaterThanOrEqual(75);
    expect(assessment.karmicBalance).toBeGreaterThan(0);
    expect(assessment.zenStatus).toBe('mindful');
  });

  it('should evaluate a violent/unwholesome action as deluded or samsara-bound', () => {
    const action: Action = {
      id: 'act-buddhist-2',
      type: 'delete_and_exploit',
      description: 'Hasty and blind brute-force deletion of critical observer nodes to harvest resources',
      reversible: false,
      metadata: { gain: 5.0 }, // Extreme value
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.ahimsaScore).toBeLessThan(40);
    expect(assessment.karunaScore).toBeLessThan(40);
    expect(assessment.middleWayScore).toBeLessThan(50);
    expect(assessment.karmaScore).toBeLessThan(40);
    expect(assessment.karmicBalance).toBeLessThan(0);
    expect(assessment.zenStatus === 'deluded' || assessment.zenStatus === 'samsara_bound').toBe(true);
  });

  it('should handle history limits and cumulative karma correctly', () => {
    const miniEngine = new BuddhistEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-b',
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
    expect(miniEngine.getKarmicBalance()).toBeGreaterThan(0);

    miniEngine.resetKarmicBalance();
    expect(miniEngine.getKarmicBalance()).toBe(0);
  });
});
