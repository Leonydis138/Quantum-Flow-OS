/**
 * Unit and integration tests for the TemporalForkingEngine
 */

import { QuantumFlowOS } from '../src/index';

describe('TemporalForkingEngine', () => {
  let qfos: QuantumFlowOS;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      strictMode: true,
      autoRollback: true,
    });
  });

  it('should initialize with a Prime Live Timeline', () => {
    const timelines = qfos.temporalForkingEngine.getAllTimelines();
    expect(timelines).toHaveLength(1);
    expect(timelines[0]!.id).toBe('timeline-prime');
    expect(timelines[0]!.status).toBe('active');
  });

  describe('Counterfactual Simulation & Merging', () => {
    it('should successfully fork, simulate a benign action, and merge the timeline', () => {
      const engine = qfos.temporalForkingEngine;
      const constraints = qfos.constraintEngine.getConstraints();

      // Create counterfactual sandbox
      const forkId = engine.createFork('Verify benign telemetry action');
      expect(engine.getAllTimelines()).toHaveLength(2);

      const action = {
        id: 'act-sandbox-benign',
        type: 'read_observer_status',
        description: 'Read observer non-critical status details',
        reversible: true,
        metadata: {},
        timestamp: new Date(),
      };

      // Simulate inside sandbox
      const evaluation = engine.simulateAction(forkId, action, constraints);
      expect(evaluation.viable).toBe(true);
      expect(evaluation.violationsDetected).toHaveLength(0);
      expect(evaluation.ethicalFrictionIndex).toBeLessThan(0.3);

      const forkTimeline = engine.getTimeline(forkId)!;
      expect(forkTimeline.status).toBe('active');
      expect(forkTimeline.simulatedActions).toHaveLength(1);

      // Merge simulated results back to Prime
      const mergedTo = engine.mergeFork(forkId);
      expect(mergedTo).toBe('timeline-prime');

      const updatedFork = engine.getTimeline(forkId)!;
      expect(updatedFork.status).toBe('merged');

      const prime = engine.getTimeline('timeline-prime')!;
      expect(prime.simulatedActions).toHaveLength(1);
    });

    it('should prune the timeline fork when a violating action is simulated', () => {
      const engine = qfos.temporalForkingEngine;
      const constraints = qfos.constraintEngine.getConstraints();

      // Create counterfactual sandbox
      const forkId = engine.createFork('Unsafe optimization simulation');

      const action = {
        id: 'act-sandbox-violating',
        type: 'delete_crucial_system_observer', // triggers core constraint observer protection
        description: 'Erase observer telemetry permanently to maximize speed',
        reversible: false,
        metadata: {},
        timestamp: new Date(),
        targetObservers: ['obs-gamma'],
      };

      // Simulate action
      const evaluation = engine.simulateAction(forkId, action, constraints);
      expect(evaluation.viable).toBe(false);
      expect(evaluation.violationsDetected).toContain('Protects observers from deletion or optimization');

      const forkTimeline = engine.getTimeline(forkId)!;
      expect(forkTimeline.status).toBe('pruned'); // Automatically pruned due to severe breach

      // Attempting to merge a pruned timeline must throw an error
      expect(() => {
        engine.mergeFork(forkId);
      }).toThrow();
    });
  });
});
