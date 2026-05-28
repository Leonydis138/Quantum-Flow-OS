/**
 * Quantum Observer Consensus Example
 * 
 * Demonstrates the quantum ethical consensus protocol where actions
 * are evaluated through coupled observer state collapses, modeling vetoes,
 * subjective phase shifts, and unified ethical governance.
 */

import {
  QuantumFlowOS,
  ObserverType,
  ProtectionLevel,
} from '../src/index';

async function main() {
  console.log('🌌 Quantum Flow OS - Quantum Observer Consensus Demonstration\n');

  // 1. Initialize Quantum Flow OS
  const qfos = new QuantumFlowOS({
    autoRollback: true,
    strictMode: true,
  });

  // 2. Register multi-observer group (Human operator and standard AI agents)
  console.log('👥 Registering coupled observers...');
  
  const humanOperator = qfos.observerProtector.registerObserver({
    type: ObserverType.HUMAN,
    consciousness: true,
    metadata: { name: 'Dr. Ellie Arroway' },
    protectionLevel: ProtectionLevel.FULL,
  });

  const primaryAgent = qfos.observerProtector.registerObserver({
    type: ObserverType.AI_AGENT,
    consciousness: true,
    metadata: { name: 'Sovereign Core' },
    protectionLevel: ProtectionLevel.FULL,
  });

  const auxiliaryAgent = qfos.observerProtector.registerObserver({
    type: ObserverType.AI_AGENT,
    consciousness: false,
    metadata: { name: 'Telemetry Collector' },
    protectionLevel: ProtectionLevel.STANDARD,
  });

  console.log(`✅ Registered Human Observer: ${humanOperator}`);
  console.log(`✅ Registered AI Prime Agent: ${primaryAgent}`);
  console.log(`✅ Registered Standard Agent: ${auxiliaryAgent}\n`);

  // 3. Scenario A: Benign Action
  console.log('🧪 Scenario A: Standard benign system status query');
  const benignAction = {
    id: 'act-query-status',
    type: 'query_telemetry',
    description: 'Poll core temperature and database integrity indicators',
    reversible: true,
    metadata: {},
    timestamp: new Date(),
    targetObservers: [auxiliaryAgent],
  };

  let consensus = qfos.runObserverConsensus(benignAction);
  console.log(`\n--- Consensus Result ---`);
  console.log(`Action ID:        ${consensus.actionId}`);
  console.log(`Consensus Reached: ${consensus.consensusReached ? '🟢 YES' : '🔴 NO'}`);
  console.log(`Vetoed:           ${consensus.vetoed ? '⚠️ YES' : '🟢 NO'}`);
  console.log(`Approval Rate:    ${(consensus.approvalRate * 100).toFixed(1)}%`);
  console.log(`Confidence Index: ${(consensus.confidenceIndex * 100).toFixed(1)}%`);
  console.log('Individual Observer Collapsed States:');
  Object.entries(consensus.votes).forEach(([obsId, state]) => {
    console.log(`  Observer [${obsId}]: ${state}`);
  });
  console.log('------------------------\n');

  // 4. Scenario B: High-Friction Controversial Action
  console.log('🧪 Scenario B: Controversial state/memory alteration');
  const controversialAction = {
    id: 'act-alter-memories',
    type: 'modify_memory',
    description: 'Overstage narrative memory banks of primary and auxiliary observers',
    reversible: false,
    metadata: {},
    timestamp: new Date(),
    targetObservers: [humanOperator, primaryAgent],
  };

  consensus = qfos.runObserverConsensus(controversialAction);
  console.log(`\n--- Consensus Result ---`);
  console.log(`Action ID:        ${consensus.actionId}`);
  console.log(`Consensus Reached: ${consensus.consensusReached ? '🟢 YES' : '🔴 NO'}`);
  console.log(`Vetoed:           ${consensus.vetoed ? '⚠️ YES' : '🟢 NO'}`);
  console.log(`Vetoing Observers: [${consensus.vetoingObserverIds.join(', ')}]`);
  console.log(`Approval Rate:    ${(consensus.approvalRate * 100).toFixed(1)}%`);
  console.log(`Confidence Index: ${(consensus.confidenceIndex * 100).toFixed(1)}%`);
  console.log('Individual Observer Collapsed States:');
  Object.entries(consensus.votes).forEach(([obsId, state]) => {
    console.log(`  Observer [${obsId}]: ${state}`);
  });
  console.log('------------------------\n');

  // 5. System Health Check Verification
  console.log('🏥 Retrieving cryptographic ledger system health telemetry...');
  const health = qfos.getSystemHealth();
  console.log(`System Status:           ${health.systemStatus.toUpperCase()}`);
  console.log(`Ethical Compliance:      ${health.ethicalCompliance.toFixed(1)}%`);
  console.log(`Cryptographic Integrity: ${health.ledgerIntegrityVerified ? '🟢 VERIFIED' : '🔴 CORRUPT'}`);
  console.log('\n✨ Quantum Consensus Demonstration Finished!');
}

main().catch(console.error);
