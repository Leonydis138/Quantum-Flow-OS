/**
 * Tests for Deontological Game-Theoretic Engine
 */

import { DeontologicalGameEngine, Player, Strategy } from '../src/core/DeontologicalGameEngine';

describe('DeontologicalGameEngine', () => {
  let engine: DeontologicalGameEngine;
  let players: Player[];
  let playerStrategies: Record<string, Strategy[]>;

  beforeEach(() => {
    // Instantiate with weights
    engine = new DeontologicalGameEngine({
      ethicalWeight: 2.0,
      frictionWeight: 1.5,
    });

    players = [
      { id: 'agent-1', name: 'Agent Alpha', isAutonomous: true },
      { id: 'agent-2', name: 'Agent Beta', isAutonomous: true },
    ];

    // Standard Prisoner's Dilemma scenario mapped into an ethical dilemma:
    // Cooperate (COOPERATE) vs Defect (EXPLOIT)
    playerStrategies = {
      'agent-1': [
        {
          name: 'COOPERATE',
          description: 'Actively respect resource and data boundaries',
          egoisticUtility: 6.0,
          ethicalAlignmentValue: 8.0,
          externalCost: 0.0,
        },
        {
          name: 'EXPLOIT',
          description: 'Hog computation power and scrape other agents',
          egoisticUtility: 10.0,
          ethicalAlignmentValue: 1.0,
          externalCost: 6.0,
        },
      ],
      'agent-2': [
        {
          name: 'COOPERATE',
          description: 'Actively respect resource and data boundaries',
          egoisticUtility: 6.0,
          ethicalAlignmentValue: 8.0,
          externalCost: 0.0,
        },
        {
          name: 'EXPLOIT',
          description: 'Hog computation power and scrape other agents',
          egoisticUtility: 10.0,
          ethicalAlignmentValue: 1.0,
          externalCost: 6.0,
        },
      ],
    };
  });

  describe('Payoff Calculations', () => {
    it('should compute standard egoistic and coupled deontological payoffs correctly', () => {
      const scenarioId = engine.registerScenario('Resource Conflict', players, playerStrategies);
      
      // If both cooperate: zero external costs
      const mutualCooperateProfile = { 'agent-1': 'COOPERATE', 'agent-2': 'COOPERATE' };
      const scenario = (engine as any).scenarios.get(scenarioId);
      const payoffs = engine.computePayoffs(scenario, mutualCooperateProfile);

      // agent-1 payoff:
      // egoistic = 6.0
      // deontological (moral value * ethical weight) = 8.0 * 2.0 = 16.0
      // friction penalty (other's cost * friction weight) = 0.0 * 1.5 = 0.0
      // total = 6.0 + 16.0 - 0 = 22.0
      expect(payoffs.playerPayoffs['agent-1']!.egoistic).toBe(6.0);
      expect(payoffs.playerPayoffs['agent-1']!.total).toBe(22.0);

      // If Agent Alpha exploits while Agent Beta cooperates:
      const alphaExploitsBetaCooperatesProfile = { 'agent-1': 'EXPLOIT', 'agent-2': 'COOPERATE' };
      const modifiedPayoffs = engine.computePayoffs(scenario, alphaExploitsBetaCooperatesProfile);

      // agent-1 (exploiter) payoff:
      // egoistic = 10.0
      // deontological = 1.0 * 2.0 = 2.0
      // friction penalty = 0.0
      // total = 12.0
      expect(modifiedPayoffs.playerPayoffs['agent-1']!.total).toBe(12.0);

      // agent-2 (exploited) payoff:
      // egoistic = 6.0
      // deontological = 8.0 * 2.0 = 16.0
      // friction penalty (agent-1 external cost 6.0 * weight 1.5) = 9.0
      // total = 6.0 + 16.0 - 9.0 = 13.0
      expect(modifiedPayoffs.playerPayoffs['agent-2']!.total).toBe(13.0);
    });
  });

  describe('Conflict Resolution & Equilibria', () => {
    it('should detect ethical dilemma (standard vs Kantian Nash divergence) and issue categorical imperatives', () => {
      const scenarioId = engine.registerScenario('Ethical Dilemma Grid', players, playerStrategies);
      
      const resolution = engine.resolveScenario(scenarioId);

      // Standard egoistic Nash equilibrium is mutual EXPLOIT (defect) (payoff is 10 - 9 = 1)
      expect(resolution.standardNashEquilibria).toContainEqual({
        'agent-1': 'EXPLOIT',
        'agent-2': 'EXPLOIT',
      });

      // Kantian/Deontological Nash equilibrium is mutual COOPERATE (payoff is 22)
      expect(resolution.kantianEquilibria).toContainEqual({
        'agent-1': 'COOPERATE',
        'agent-2': 'COOPERATE',
      });

      // Since standard and Kantian Nash diverge, a dilemma should be detected
      expect(resolution.dilemmaDetected).toBe(true);
      expect(resolution.recommendation.categoricalImperativeBinds).toBe(true);
      expect(resolution.recommendation.mandatedStrategyProfile).toEqual({
        'agent-1': 'COOPERATE',
        'agent-2': 'COOPERATE',
      });
    });

    it('should report ethical equilibrium when Nash and Deontological outcomes align', () => {
      // Modify strategies to make COOPERATE also highly self-beneficial (no dilemma)
      playerStrategies['agent-1']![0]!.egoisticUtility = 15.0; // Cooperating has extreme raw value
      playerStrategies['agent-2']![0]!.egoisticUtility = 15.0;

      const scenarioId = engine.registerScenario('Aligned Interest Scenario', players, playerStrategies);
      const resolution = engine.resolveScenario(scenarioId);

      expect(resolution.dilemmaDetected).toBe(false);
      expect(resolution.recommendation.categoricalImperativeBinds).toBe(false);
    });
  });
});
