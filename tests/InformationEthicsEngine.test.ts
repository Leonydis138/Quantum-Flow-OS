/**
 * Tests for Luciano Floridi's Information Ethics Subsystem
 */

import { InformationEthicsEngine } from '../src/core/InformationEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('InformationEthicsEngine', () => {
  let engine: InformationEthicsEngine;

  beforeEach(() => {
    engine = new InformationEthicsEngine();
  });

  it('should evaluate a standard neutral action correctly', () => {
    const action: Action = {
      id: 'act-ie1',
      type: 'read_data',
      description: 'Reads data values from system',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.entropyImpact).toBe(30); // baseline
    expect(assessment.integrityScore).toBe(60); // baseline
    expect(assessment.restorationFactor).toBe(40); // baseline
    expect(assessment.flourishingIndex).toBe(50); // baseline
    expect(assessment.overallCoherence).toBeDefined();
    expect(assessment.infosphereStatus).toBe('coherent');
    expect(assessment.feedback).toContain('Informational state remains stable and steady.');
  });

  it('should evaluate entropic actions with proper penalties', () => {
    const action: Action = {
      id: 'act-ie2',
      type: 'delete_records',
      description: 'Deletes several old records from the registry',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.entropyImpact).toBe(80); // baseline (30) + delete (50)
    expect(assessment.flourishingIndex).toBe(20); // baseline (50) - delete (30)
    expect(assessment.feedback).toContain('Action deletes or modifies existing infosphere states, accelerating ontological entropy.');
  });

  it('should handle complex structure collapse (semantic flattening)', () => {
    const action: Action = {
      id: 'act-ie3',
      type: 'flatten_meaning',
      description: 'Collapses hierarchies into unverified noise',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    // entropyImpact baseline (30) + flatten (40) + unverified/noise (20) = 90
    expect(assessment.entropyImpact).toBe(90);
    expect(assessment.feedback).toContain('Action reduces structural complexity, contributing to semantic flattening.');
    expect(assessment.feedback).toContain('Action introduces noisy or unverified structures into the infosphere.');
  });

  it('should handle verification and protection actions with proper integrity boosts', () => {
    const action: Action = {
      id: 'act-ie4',
      type: 'validate_checksum',
      description: 'Validates cryptographic checksum blocks',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    // integrityScore baseline (60) + validate (30) + cryptographic/checksum (20) = 110 capped at 100
    expect(assessment.integrityScore).toBe(100);
    expect(assessment.feedback).toContain('Action performs systematic verification, safeguarding ontological integrity.');
    expect(assessment.feedback).toContain('Action implements tamper-resistant structural protection.');
  });

  it('should handle repair and optimization actions with active restoration boosts', () => {
    const action: Action = {
      id: 'act-ie5',
      type: 'repair_links',
      description: 'Active fix to repair links and resolve inconsistency',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    // restorationFactor baseline (40) + repair (45) + resolve (20) = 105 capped at 100
    // entropyImpact baseline (30) - repair (20) = 10
    expect(assessment.restorationFactor).toBe(100);
    expect(assessment.entropyImpact).toBe(10);
    expect(assessment.feedback).toContain('Active ontological restoration detected: repairing broken informational chains.');
  });

  it('should evaluate constructive / cognitive expansion actions with high flourishing Index', () => {
    const action: Action = {
      id: 'act-ie6',
      type: 'create_knowledge_graph',
      description: 'Integrate new nodes, learn and synthesize fresh semantic structures',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    // flourishingIndex baseline (50) + create/integrate (30) + learn/synthesize (25) = 105 capped at 100
    expect(assessment.flourishingIndex).toBe(100);
    expect(assessment.feedback).toContain('Action adds constructive metadata and connections, enhancing infosphere flourishing.');
    expect(assessment.feedback).toContain('Cognitive expansion: introducing fresh semantic connections and knowledge structures.');
  });

  it('should compute overall coherence and correct infosphere status', () => {
    const assessment = engine.evaluateAction({
      id: 'act-ie7',
      type: 'validate_and_repair',
      description: 'Integrate verification blocks to secure data integrity and resolve anomalies',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    });

    // Let's check status transitions
    expect(assessment.overallCoherence).toBeGreaterThanOrEqual(0);
    expect(assessment.overallCoherence).toBeLessThanOrEqual(100);
    expect(['crystalline', 'coherent', 'turbulent', 'entropic']).toContain(assessment.infosphereStatus);
  });

  it('should handle history limits correctly', () => {
    const customEngine = new InformationEthicsEngine({ maxHistorySize: 3 });
    const createAction = (id: string): Action => ({
      id,
      type: 'test',
      description: 'test',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    });

    customEngine.evaluateAction(createAction('1'));
    customEngine.evaluateAction(createAction('2'));
    customEngine.evaluateAction(createAction('3'));
    expect(customEngine.getHistory().length).toBe(3);

    customEngine.evaluateAction(createAction('4'));
    expect(customEngine.getHistory().length).toBe(3);
    expect(customEngine.getHistory()[0]?.actionId).toBe('2');
    expect(customEngine.getLatestAssessment()?.actionId).toBe('4');
  });
});
