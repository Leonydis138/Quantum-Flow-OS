/**
 * Tests for Autonomous Ethical Agent Simulation Subsystem
 */

import { QuantumFlowOS } from '../src/index';
import { AutonomousAgentSimulator } from '../src/core/AutonomousAgentSimulator';

describe('AutonomousAgentSimulator', () => {
  let qfos: QuantumFlowOS;
  let simulator: AutonomousAgentSimulator;

  beforeEach(() => {
    qfos = new QuantumFlowOS({
      autoRollback: true,
      strictMode: true,
    });
    simulator = qfos.agentSimulator;
  });

  it('should initialize with default agents', () => {
    const agents = simulator.getAgents();
    expect(agents.length).toBe(7);
    expect(agents.map(a => a.name)).toContain('Agent_Immanuel');
    expect(agents.map(a => a.name)).toContain('Agent_Bentham');
    expect(agents.map(a => a.name)).toContain('Agent_Machiavelli');
    expect(agents.map(a => a.name)).toContain('Agent_Marcus');
    expect(agents.map(a => a.name)).toContain('Agent_Siddhartha');
    expect(agents.map(a => a.name)).toContain('Agent_Zarathustra');
    expect(agents.map(a => a.name)).toContain('Agent_Socrates');
  });

  it('should allow registering a new agent', () => {
    const agentId = simulator.registerAgent({
      name: 'Agent_Plato',
      paradigm: 'SOCRATIC',
      sociability: 0.95,
      aggression: 0.05,
    });

    expect(agentId).toBeDefined();
    expect(simulator.getAgents().length).toBe(8);
    expect(simulator.getAgents().find(a => a.id === agentId)?.name).toBe('Agent_Plato');
  });

  it('should execute a simulation tick and return report', () => {
    const report = simulator.tick(qfos);

    expect(report).toBeDefined();
    expect(report.tick).toBe(1);
    expect(report.timestamp).toBeInstanceOf(Date);
    expect(report.agentMetrics.length).toBe(7);
    expect(simulator.getHistory().length).toBe(1);
  });

  it('should support resetting simulation state', () => {
    simulator.tick(qfos);
    expect(simulator.getHistory().length).toBe(1);

    simulator.reset();
    expect(simulator.getHistory().length).toBe(0);
    expect(simulator.getAgents().length).toBe(7);
  });
});

