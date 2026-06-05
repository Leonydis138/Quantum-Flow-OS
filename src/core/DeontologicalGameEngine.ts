/**
 * Deontological Game-Theoretic Engine
 *
 * Implements Kantian Game Theory and Deontological Nash Equilibria to resolve
 * conflicts of interest between autonomous agents, observers, and system operators,
 * aligning selfish utility with universalizable ethical maxims.
 */

import { v4 as uuidv4 } from "uuid";

export interface Player {
  id: string;
  name: string;
  isAutonomous: boolean;
}

export interface Strategy {
  name: string;
  description: string;
  egoisticUtility: number; // Raw payoff for the player (e.g., 0 to 10)
  ethicalAlignmentValue: number; // Individual moral alignment (0 to 10)
  externalCost: number; // Potential negative impact/friction on other players (0 to 10)
}

export interface Payoff {
  playerPayoffs: Record<
    string,
    {
      egoistic: number;
      deontological: number;
      total: number;
    }
  >;
}

export interface GameScenario {
  id: string;
  name: string;
  players: Player[];
  playerStrategies: Record<string, Strategy[]>; // Player ID -> list of available strategies
}

export interface GameResolution {
  scenarioId: string;
  standardNashEquilibria: Array<Record<string, string>>; // List of Player ID -> Strategy Name
  kantianEquilibria: Array<Record<string, string>>; // List of Player ID -> Strategy Name
  dilemmaDetected: boolean; // True if standard Nash is ethically inferior to Kantian Equilibrium
  recommendation: {
    message: string;
    categoricalImperativeBinds: boolean;
    mandatedStrategyProfile: Record<string, string> | null;
  };
}

export class DeontologicalGameEngine {
  private scenarios: Map<string, GameScenario> = new Map();
  private readonly ethicalWeight: number; // alpha: importance of moral alignment
  private readonly frictionWeight: number; // beta: sensitivity to external cost/friction on others

  constructor(
    options: { ethicalWeight?: number; frictionWeight?: number } = {},
  ) {
    this.ethicalWeight = options.ethicalWeight ?? 1.5;
    this.frictionWeight = options.frictionWeight ?? 1.2;
  }

  /**
   * Retrieve all registered scenarios
   */
  public getScenarios(): GameScenario[] {
    return Array.from(this.scenarios.values());
  }

  /**
   * Retrieve a specific scenario by ID
   */
  public getScenario(id: string): GameScenario | undefined {
    return this.scenarios.get(id);
  }

  /**
   * Register a new game scenario of interaction
   */
  public registerScenario(
    name: string,
    players: Player[],
    playerStrategies: Record<string, Strategy[]>,
  ): string {
    const scenarioId = `game-${uuidv4().substring(0, 8)}`;
    const scenario: GameScenario = {
      id: scenarioId,
      name,
      players,
      playerStrategies,
    };
    this.scenarios.set(scenarioId, scenario);
    return scenarioId;
  }

  /**
   * Compute pay-off values for a specific profile of strategies
   */
  public computePayoffs(
    scenario: GameScenario,
    profile: Record<string, string>,
  ): Payoff {
    const payoffs: Payoff["playerPayoffs"] = {};

    // 1. Calculate payoffs for each player in this specific strategy profile
    for (const player of scenario.players) {
      const strategyName = profile[player.id];
      if (!strategyName) {
        throw new Error(
          `Strategy profile incomplete: missing choice for player ${player.id}`,
        );
      }

      const strategies = scenario.playerStrategies[player.id] || [];
      const strategy = strategies.find((s) => s.name === strategyName);
      if (!strategy) {
        throw new Error(
          `Strategy ${strategyName} not found for player ${player.id}`,
        );
      }

      // Compute total external cost caused by other players' strategy choices
      let totalExternalCostOnSelf = 0;
      for (const otherPlayer of scenario.players) {
        if (otherPlayer.id === player.id) continue;
        const otherStrategyName = profile[otherPlayer.id]!;
        const otherStrategies = scenario.playerStrategies[otherPlayer.id] || [];
        const otherStrategy = otherStrategies.find(
          (s) => s.name === otherStrategyName,
        );
        if (otherStrategy) {
          totalExternalCostOnSelf += otherStrategy.externalCost;
        }
      }

      // Deontological Payoff formulation:
      // Payoff = EgoisticUtility + (alpha * EthicalAlignment) - (beta * ExternalCostOnSelf)
      const egoistic = strategy.egoisticUtility;
      const deontological = strategy.ethicalAlignmentValue * this.ethicalWeight;
      const frictionPenalty = totalExternalCostOnSelf * this.frictionWeight;
      const total = parseFloat(
        (egoistic + deontological - frictionPenalty).toFixed(4),
      );

      payoffs[player.id] = {
        egoistic,
        deontological,
        total,
      };
    }

    return { playerPayoffs: payoffs };
  }

  /**
   * Resolve a scenario and find equilibria
   */
  public resolveScenario(scenarioId: string): GameResolution {
    const scenario = this.scenarios.get(scenarioId);
    if (!scenario) {
      throw new Error(`Game scenario ${scenarioId} not found.`);
    }

    // 1. Generate all possible strategy profiles (combinations of strategy choices)
    const profiles = this.generateStrategyProfiles(scenario);

    // 2. Find Nash Equilibria for Egoistic Payoffs
    const standardNash = this.findEquilibria(scenario, profiles, "egoistic");

    // 3. Find Nash Equilibria for Deontological Payoffs (incorporating ethics and universalizability)
    const kantianNash = this.findEquilibria(scenario, profiles, "total");

    // 4. Determine if a dilemma exists (egoistic choice conflicts with ethical choice)
    let dilemmaDetected = false;
    if (standardNash.length > 0 && kantianNash.length > 0) {
      const standardProfile = standardNash[0]!;
      const kantianProfile = kantianNash[0]!;

      // Compare profiles
      let profilesMatch = true;
      for (const player of scenario.players) {
        if (standardProfile[player.id] !== kantianProfile[player.id]) {
          profilesMatch = false;
          break;
        }
      }

      if (!profilesMatch) {
        // Dilemma detected: the selfish game choice leads to an ethically suboptimal outcome
        dilemmaDetected = true;
      }
    }

    // Formulate recommendations and action plans
    let message =
      "Standard Nash and Deontological Equilibria are aligned. System is in ethical equilibrium.";
    let categoricalImperativeBinds = false;
    let mandatedStrategyProfile: Record<string, string> | null = null;

    if (dilemmaDetected) {
      categoricalImperativeBinds = true;
      mandatedStrategyProfile = kantianNash[0] || null;
      message =
        `dilemma detected (such as Prisoner's Dilemma or Tragedy of the Commons). ` +
        `Egoistic Nash equilibrium results in systemic ethical degradation. ` +
        `Invoking Categorical Imperative to mandate cooperation.`;
    }

    return {
      scenarioId,
      standardNashEquilibria: standardNash,
      kantianEquilibria: kantianNash,
      dilemmaDetected,
      recommendation: {
        message,
        categoricalImperativeBinds,
        mandatedStrategyProfile,
      },
    };
  }

  /**
   * Find Nash Equilibria for a given metric choice ('egoistic' or 'total' deontological utility)
   */
  private findEquilibria(
    scenario: GameScenario,
    profiles: Array<Record<string, string>>,
    metric: "egoistic" | "total",
  ): Array<Record<string, string>> {
    const equilibria: Array<Record<string, string>> = [];

    for (const profile of profiles) {
      let isEquilibrium = true;

      // Check if any player can unilaterally deviate to get a higher payoff
      for (const player of scenario.players) {
        const currentChoice = profile[player.id]!;
        const currentPayoff = this.computePayoffs(scenario, profile)
          .playerPayoffs[player.id]![metric];

        const alternativeStrategies =
          scenario.playerStrategies[player.id] || [];
        for (const altStrategy of alternativeStrategies) {
          if (altStrategy.name === currentChoice) continue;

          // Deviate player's choice unilaterally
          const deviatedProfile = { ...profile, [player.id]: altStrategy.name };
          const altPayoff = this.computePayoffs(scenario, deviatedProfile)
            .playerPayoffs[player.id]![metric];

          if (altPayoff > currentPayoff) {
            isEquilibrium = false;
            break;
          }
        }

        if (!isEquilibrium) break;
      }

      if (isEquilibrium) {
        equilibria.push(profile);
      }
    }

    return equilibria;
  }

  /**
   * Cartesian product generator for all strategy profile combinations
   */
  public generateStrategyProfiles(
    scenario: GameScenario,
  ): Array<Record<string, string>> {
    const players = scenario.players;
    if (players.length === 0) return [];

    const helper = (index: number): Array<Record<string, string>> => {
      if (index === players.length) {
        return [{}];
      }

      const player = players[index]!;
      const strategies = scenario.playerStrategies[player.id] || [];
      const subProfiles = helper(index + 1);
      const results: Array<Record<string, string>> = [];

      for (const strategy of strategies) {
        for (const subProfile of subProfiles) {
          results.push({
            [player.id]: strategy.name,
            ...subProfile,
          });
        }
      }

      return results;
    };

    return helper(0);
  }
}
