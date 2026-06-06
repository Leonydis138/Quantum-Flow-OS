/**
 * Quantum Flow OS - Master Autonomous Self-Driving Launcher
 *
 * Deploys the entire ecosystem as a unified background service:
 * 1. Instantiates the QuantumFlowOS Kernel.
 * 2. Starts the real-time Telemetry Dashboard Server.
 * 3. Launches the Autonomous Flow Daemon (orchestrating agents, self-audits, and cognitive model assistant updates).
 */

import { QuantumFlowOS, DashboardServer, AutonomousFlowDaemon, DaemonState } from "./index";

const port = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 8080;
const tickIntervalMs = process.env["DAEMON_INTERVAL"] ? parseInt(process.env["DAEMON_INTERVAL"], 10) : 5000;

console.log(`
======================================================================
     🌌 QUANTUM FLOW OS - MASTER AUTONOMOUS SELF-DRIVING MODULE 🌌
======================================================================
  [Status] Loading recursive ethical governance frameworks...
  [Status] Activating cryptographic multi-agent ledger systems...
`);

// 1. Initialize the Core Kernel
const qfos = new QuantumFlowOS();
const systemHealth = qfos.getSystemHealth();

console.log(`  [Kernel] Status: ${systemHealth.systemStatus.toUpperCase()}`);
console.log(`  [Kernel] Compliance: ${systemHealth.ethicalCompliance}%`);
console.log(`  [Kernel] Constraints Loaded: ${systemHealth.activeConstraints}`);

// 2. Start the Telemetry Dashboard Server (so operators can audit progress in real-time)
const server = new DashboardServer(port);
server
  .start()
  .then(() => {
    console.log(`  [Server] Live dashboard server active at http://localhost:${port}`);
  })
  .catch((err) => {
    console.error(`  [Server Error] Failed to initialize live dashboard:`, err);
  });

// 3. Deploy the Background Autonomous Daemon
const daemon = new AutonomousFlowDaemon(qfos, { intervalMs: tickIntervalMs });

// Register Event listeners for beautiful daemon telemetry
daemon.on("started", () => {
  console.log(`\n  🟢 [Daemon] Background orchestrator successfully deployed and active.`);
  console.log(`  🟢 [Daemon] Operating interval set to ${tickIntervalMs}ms.\n`);
});

daemon.on("tick_completed", (state: DaemonState) => {
  console.log(`  [Autonomous Pulse] Tick #${state.tickCount} | Homeostasis: ${state.homeostasisScore}% | Anomalies: ${state.anomaliesCount} | Gain: ${state.optimizationGain.toFixed(2)} | Damping: ${state.constraintDamping.toFixed(2)}`);
  if (state.lastCognitiveReflection) {
    console.log(`  [Cognitive Assistant Insight] "${state.lastCognitiveReflection.substring(0, 100)}..."`);
  }
});

daemon.on("error", (error: any) => {
  console.error(`  🔴 [Daemon Exception]`, error);
});

// Trigger the start
daemon.start();

// Handle termination gracefully
process.on("SIGINT", () => {
  console.log("\n  [Shutdown] Halted by operator signal (SIGINT). Terminating background daemon...");
  daemon.stop();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n  [Shutdown] Halted by system signal (SIGTERM). Terminating background daemon...");
  daemon.stop();
  process.exit(0);
});
