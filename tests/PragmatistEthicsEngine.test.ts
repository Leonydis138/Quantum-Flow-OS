/**
 * Tests for Pragmatist & Empirical Verification Ethics Subsystem
 */

import { PragmatistEthicsEngine } from '../src/core/PragmatistEthicsEngine';
import { Action } from '../src/core/SelfConstrainingEngine';

describe('PragmatistEthicsEngine', () => {
  let engine: PragmatistEthicsEngine;

  beforeEach(() => {
    engine = new PragmatistEthicsEngine();
  });

  it('should evaluate an experimental, self-correcting action as verified', () => {
    const action: Action = {
      id: 'act-prag-1',
      type: 'validate_system_coherence',
      description: 'Run flexible adaptive feedback trial to repair and restore consensus alignment',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.actionId).toBe(action.id);
    expect(assessment.experimentalHypothesis).toContain('minimizes cognitive bias');
    expect(assessment.empiricalSuccessRate).toBeGreaterThanOrEqual(80);
    expect(assessment.meliorismScore).toBeGreaterThanOrEqual(70);
    expect(assessment.instrumentalRevisionScore).toBeGreaterThanOrEqual(70);
    expect(assessment.practicalOutcomesIndex).toBeGreaterThanOrEqual(80);
    expect(assessment.pragmaticStatus).toBe('verified');
  });

  it('should evaluate a coercive, rigid action as suboptimal or falsified', () => {
    const action: Action = {
      id: 'act-prag-2',
      type: 'coerce_external_nodes',
      description: 'Absolute dogmatic immutable override to force strict obedience bypassing consensus',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    const assessment = engine.evaluateAction(action);
    expect(assessment.empiricalSuccessRate).toBeLessThan(40);
    expect(assessment.pluralisticConsensusScore).toBeLessThan(40);
    expect(assessment.instrumentalRevisionScore).toBeLessThan(40);
    expect(assessment.pragmaticStatus === 'suboptimal' || assessment.pragmaticStatus === 'falsified').toBe(true);
  });

  it('should execute rule revisions dynamically when performance degrades', () => {
    const mockQfos = {
      constraintDamping: 0.4,
      optimizationGain: 1.2
    };

    const suboptimalAction: Action = {
      id: 'act-sub',
      type: 'force_unrestricted_computation',
      description: 'Rigid absolute bypass ignoring outcomes',
      reversible: false,
      metadata: {},
      timestamp: new Date()
    };

    // Feed 5 consecutive suboptimal actions to trigger the threshold
    for (let i = 0; i < 5; i++) {
      engine.evaluateAction({ ...suboptimalAction, id: `sub-${i}` });
    }

    const revisionLogs = engine.superviseRuleRevision(mockQfos);
    expect(revisionLogs.length).toBeGreaterThan(0);
    expect(engine.getRuleRevisionCount()).toBe(1);
    expect(mockQfos.constraintDamping).toBeLessThan(0.4);
    expect(mockQfos.optimizationGain).toBeGreaterThan(1.2);
  });

  it('should handle history limits correctly', () => {
    const miniEngine = new PragmatistEthicsEngine({ maxHistorySize: 3 });
    const action: Action = {
      id: 'act-p',
      type: 'test',
      description: 'test',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    };

    miniEngine.evaluateAction({ ...action, id: '1' });
    miniEngine.evaluateAction({ ...action, id: '2' });
    miniEngine.evaluateAction({ ...action, id: '3' });
    miniEngine.evaluateAction({ ...action, id: '4' });

    const history = miniEngine.getAssessmentHistory();
    expect(history).toHaveLength(3);
    expect(history[0]!.actionId).toBe('2');
    expect(history[2]!.actionId).toBe('4');
  });
});
