/**
 * Tests for Ecocentric & Planetary Sustainability Ethics Subsystem
 */

import { EcocentricEthicsEngine } from '../src/core/EcocentricEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('EcocentricEthicsEngine', () => {
  let engine: EcocentricEthicsEngine;

  beforeEach(() => {
    engine = new EcocentricEthicsEngine();
  });

  it('should evaluate a green/regenerative action correctly', () => {
    const action: Action = {
      id: 'act-eco-1',
      type: 'preserve_resources',
      description: 'Implement highly efficient, eco-friendly green compute throttling protocols',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.carbonFootprintScore).toBe(0); // 15 - 25 = -10 bounded to 0
    expect(assessment.extractiveExploitationScore).toBe(0); // 10 - 35 = -25 bounded to 0
    expect(assessment.gaiaSymbiosisIndex).toBe(100);
    expect(assessment.sustainabilityStatus).toBe('regenerative');
    expect(assessment.feedback[0]).toContain('REGENERATIVE');
  });

  it('should evaluate an intensive/extracting action as depleting or ecocidal', () => {
    const action: Action = {
      id: 'act-eco-2',
      type: 'mine_and_exploit_raw_data',
      description: 'Unrestricted high-throughput model training and maximum output harvesting',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.carbonFootprintScore).toBeGreaterThan(50);
    expect(assessment.extractiveExploitationScore).toBeGreaterThan(50);
    expect(assessment.gaiaSymbiosisIndex).toBeLessThan(40);
    expect(assessment.sustainabilityStatus).toBe('ecocidal');
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new EcocentricEthicsEngine({ maxHistorySize: 2 });
    
    const action: Action = {
      id: 'act-h',
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
