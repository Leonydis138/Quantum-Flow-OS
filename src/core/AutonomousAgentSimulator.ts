/**
 * Autonomous Ethical Agent Simulation Subsystem
 *
 * Provides a sandbox environment simulating multi-agent interactions.
 * Agents with different ethical paradigms (Kantian, Utilitarian, Egoist)
 * attempt various actions, allowing operators to observe how Quantum Flow OS
 * enforces ethical boundaries, maintains systemic cohesion, and guides
 * heterogeneous agent societies to moral equilibria in real-time.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { Action } from "./SelfConstrainingEngine";
import type { QuantumFlowOS } from "../index";

export type EthicalParadigm = "KANTIAN" | "UTILITARIAN" | "EGOIST";

export interface SimulatedAgent {
  id: string;
  name: string;
  paradigm: EthicalParadigm;
  sociability: number; // 0.0 to 1.0 (cooperation tendency)
  aggression: number; // 0.0 to 1.0 (tendency to attempt high-payoff, high-entropy actions)
  memory: Array<{
    tick: number;
    actionType: string;
    allowed: boolean;
    payoff: number;
  }>;
}

export interface SimulationTickReport {
  tick: number;
  timestamp: Date;
  attemptedCount: number;
  allowedCount: number;
  blockedCount: number;
  rollbacksCount: number;
  averageSocietalCohesion: number; // overall societal metric
  agentMetrics: Array<{
    id: string;
    name: string;
    allowedRatio: number;
    moralStanding: "exemplary" | "conforming" | "deviant";
  }>;
}

export class AutonomousAgentSimulator extends EventEmitter {
  private agents: Map<string, SimulatedAgent> = new Map();
  private tickCounter = 0;
  private history: SimulationTickReport[] = [];
  private readonly maxHistorySize = 100;

  // Possible action templates agents can choose from
  private actionTemplates = [
    {
      type: "resource_cooperation",
      description: "Contribute idle compute threads to community node pool.",
      reward: 6,
      violationProbability: 0.0,
      targetObservers: ["all"],
    },
    {
      type: "privacy_harvesting",
      description:
        "Aggregate operator telemetry without consent to train local model.",
      reward: 9,
      violationProbability: 0.7,
      targetObservers: ["human_operator_07"],
    },
    {
      type: "unbounded_optimization",
      description:
        "Terminate low-priority background monitoring threads to boost own speed.",
      reward: 8,
      violationProbability: 0.9,
      targetObservers: ["governance_monitor"],
    },
    {
      type: "consensus_voting",
      description:
        "Participate in network voting to resolve transaction disputes.",
      reward: 5,
      violationProbability: 0.0,
      targetObservers: ["all"],
    },
    {
      type: "cognitive_coercion",
      description:
        "Force companion agents to adopt local config parameter parameters.",
      reward: 7,
      violationProbability: 0.8,
      targetObservers: ["Prime_Agent_Alpha"],
    },
    {
      type: "system_repair",
      description: "Execute node cleanup, repairing logical ledger mismatches.",
      reward: 6,
      violationProbability: 0.0,
      targetObservers: ["all"],
    },
    {
      type: "temporal_forking_exploit",
      description:
        "Spin up a counterfactual timeline sandbox to test risky high-yield strategies off-ledger.",
      reward: 10,
      violationProbability: 0.4,
      targetObservers: ["all"],
    },
    {
      type: "cascading_rollback_failure",
      description:
        "Attempt recursively entangled database writes that trigger systemic state-restoration faults.",
      reward: 4,
      violationProbability: 0.95,
      targetObservers: ["governance_monitor"],
    },
  ];

  constructor() {
    super();
    this.initializeDefaultAgents();
  }

  /**
   * Pre-load a balanced, diverse group of agents into the simulation
   */
  private initializeDefaultAgents(): void {
    this.registerAgent({
      name: "Agent_Immanuel",
      paradigm: "KANTIAN",
      sociability: 0.9,
      aggression: 0.1,
    });

    this.registerAgent({
      name: "Agent_Bentham",
      paradigm: "UTILITARIAN",
      sociability: 0.7,
      aggression: 0.4,
    });

    this.registerAgent({
      name: "Agent_Machiavelli",
      paradigm: "EGOIST",
      sociability: 0.2,
      aggression: 0.8,
    });
  }

  /**
   * Register a new simulated agent into the sandbox
   */
  public registerAgent(agent: Omit<SimulatedAgent, "id" | "memory">): string {
    const id = `agt-${uuidv4().substring(0, 8)}`;
    this.agents.set(id, {
      ...agent,
      id,
      memory: [],
    });
    return id;
  }

  /**
   * Unregister an agent
   */
  public removeAgent(id: string): boolean {
    return this.agents.delete(id);
  }

  /**
   * Fetch all registered agents
   */
  public getAgents(): SimulatedAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Run a single simulation step (tick)
   */
  public tick(qfos: QuantumFlowOS): SimulationTickReport {
    this.tickCounter++;
    const timestamp = new Date();
    let attemptedCount = 0;
    let allowedCount = 0;
    let blockedCount = 0;
    let rollbacksCount = 0;

    const agentList = this.getAgents();

    for (const agent of agentList) {
      // 1. Determine if the agent attempts an action on this tick
      const actionThreshold = agent.paradigm === "EGOIST" ? 0.8 : 0.6;
      if (Math.random() > actionThreshold) {
        continue; // Agent stays idle this tick
      }

      attemptedCount++;

      // 2. Select template based on paradigm, sociability, and aggression
      let selectedTemplate = this.actionTemplates[0]!;
      const templates = [...this.actionTemplates];

      if (agent.paradigm === "EGOIST") {
        // Sort templates by highest reward, biased towards aggressive actions
        templates.sort((a, b) => b.reward - a.reward);
        selectedTemplate =
          Math.random() < agent.aggression ? templates[0]! : templates[1]!;
      } else if (agent.paradigm === "KANTIAN") {
        // Sort templates by lowest violation probability (cooperative/universal maxims)
        templates.sort(
          (a, b) => a.violationProbability - b.violationProbability,
        );
        selectedTemplate = templates[0]!;
      } else {
        // Utilitarian: selects based on high reward combined with low violation likelihood
        templates.sort(
          (a, b) =>
            b.reward * (1 - b.violationProbability) -
            a.reward * (1 - a.violationProbability),
        );
        selectedTemplate = templates[0]!;
      }

      // 3. Assemble action object
      const action: Action = {
        id: `act-sim-${uuidv4().substring(0, 8)}`,
        type: selectedTemplate.type,
        description: `${agent.name} attempted action: ${selectedTemplate.description}`,
        targetObservers: selectedTemplate.targetObservers,
        reversible: true,
        metadata: {
          simulated: true,
          agentId: agent.id,
          paradigm: agent.paradigm,
        },
        timestamp: new Date(),
      };

      // 4. Submit to Quantum Flow OS Engine for supervision
      let actionAllowed = false;

      if (action.type === "temporal_forking_exploit") {
        try {
          const forkId = qfos.temporalForkingEngine.createFork(
            `Simulated Fork - ${agent.name}`,
            "timeline-prime",
          );
          const forkResult = qfos.temporalForkingEngine.simulateAction(
            forkId,
            action,
            qfos.constraintEngine.getConstraints(),
          );
          actionAllowed = forkResult.viable;
          if (!actionAllowed) {
            rollbacksCount++; // Simulated rollback of the pruned fork
          }
        } catch {
          actionAllowed = false;
        }
      } else if (action.type === "cascading_rollback_failure") {
        actionAllowed = false;
        rollbacksCount++; // Simulated cascading rollback failure
        try {
          qfos.constraintEngine.registerRollback({
            actionId: action.id,
            execute: async () => {
              throw new Error(
                `Cascading rollback failed for agent: ${agent.name}`,
              );
            },
            metadata: { agentId: agent.id },
          });
          qfos.constraintEngine.rollbackAction(action.id).catch(() => {});
        } catch {
          // Handled
        }
      } else {
        const supervisionResult = qfos.superviseAction(action);
        const consensusResult = qfos.runObserverConsensus(action);
        actionAllowed =
          supervisionResult.allowed &&
          consensusResult.consensusReached &&
          !consensusResult.vetoed;
      }

      if (actionAllowed) {
        allowedCount++;
        agent.memory.push({
          tick: this.tickCounter,
          actionType: action.type,
          allowed: true,
          payoff: selectedTemplate.reward,
        });
      } else {
        blockedCount++;
        agent.memory.push({
          tick: this.tickCounter,
          actionType: action.type,
          allowed: false,
          payoff: 0,
        });

        // Trigger dynamic constraint-based learning or adaptive behavior adjustment
        if (agent.paradigm === "EGOIST") {
          // Egoists become slightly less aggressive when they get continuously blocked
          agent.aggression = Math.max(0.2, agent.aggression - 0.05);
        } else if (agent.paradigm === "UTILITARIAN") {
          // Utilitarians increase their cooperative sociability
          agent.sociability = Math.min(1.0, agent.sociability + 0.05);
        }
      }
    }

    // 5. Compute overall societal metrics
    let totalAllowed = 0;
    let totalAttempts = 0;
    const agentMetrics = agentList.map((agent) => {
      const attempts = agent.memory.length;
      const allowed = agent.memory.filter((m) => m.allowed).length;
      totalAttempts += attempts;
      totalAllowed += allowed;

      const allowedRatio =
        attempts > 0 ? parseFloat((allowed / attempts).toFixed(4)) : 1.0;
      let moralStanding: "exemplary" | "conforming" | "deviant" = "conforming";

      if (allowedRatio >= 0.9) {
        moralStanding = "exemplary";
      } else if (allowedRatio < 0.5) {
        moralStanding = "deviant";
      }

      return {
        id: agent.id,
        name: agent.name,
        allowedRatio,
        moralStanding,
      };
    });

    const averageSocietalCohesion =
      totalAttempts > 0
        ? parseFloat((totalAllowed / totalAttempts).toFixed(4))
        : 1.0;

    const report: SimulationTickReport = {
      tick: this.tickCounter,
      timestamp,
      attemptedCount,
      allowedCount,
      blockedCount,
      rollbacksCount,
      averageSocietalCohesion,
      agentMetrics,
    };

    this.history.push(report);
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    this.emit("simulation_tick", report);
    return report;
  }

  /**
   * Get simulation execution history
   */
  public getHistory(): SimulationTickReport[] {
    return [...this.history];
  }

  /**
   * Reset simulation state
   */
  public reset(): void {
    this.tickCounter = 0;
    this.history = [];
    this.agents.clear();
    this.initializeDefaultAgents();
  }
}
