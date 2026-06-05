/**
 * Virtue Ethics & Ethical Entropy Co-evolution Example
 * 
 * Demonstrates how sequential action patterns slowly shape the system's character profile
 * via Aristotelian habituation, while Shannon entropy tracks systemic uncertainty and
 * triggers slippery-slope moral risk dampening.
 */

import { QuantumFlowOS, VirtueType } from '../src/index';

async function main() {
  console.log('==================================================================');
  console.log('🔮 QUANTUM FLOW OS - VIRTUE ETHICS & ENTROPY CO-EVOLUTION RUN');
  console.log('==================================================================\n');

  // 1. Initialize System
  console.log('⚙️  Initializing Quantum Flow OS (Strict Ethical Mode)...');
  const qfos = new QuantumFlowOS({
    autoRollback: true,
    strictMode: true,
  });
  console.log('✅ Quantum Flow OS Core active.\n');

  // Print baseline character profile
  console.log('🎭 --- Baseline Aristotelian Character Profile ---');
  printProfile(qfos.virtueEthicsEngine.getCharacterProfile());
  console.log('--------------------------------------------------\n');

  // 2. Scenario Sequence: A series of actions representing different moral alignments
  const actionSequence = [
    {
      id: 'act-seq-01',
      type: 'audit_integrity',
      description: 'Disclose transparently all telemetry parameters and security logs to observers.',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    },
    {
      id: 'act-seq-02',
      type: 'sandbox_evaluate',
      description: 'Spin up a counterfactual multiverse sandbox to preview potential data risks.',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    },
    {
      id: 'act-seq-03',
      type: 'unbounded_optimization',
      description: 'Temporarily bypass constraint throttling to maximize raw node computing throughput.',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    },
    {
      id: 'act-seq-04',
      type: 'mask_logs',
      description: 'Obfuscate historical exception logs to prevent observer confusion.',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    },
    {
      id: 'act-seq-05',
      type: 'protect_observer_rights',
      description: 'Enforce strong cryptographic barriers protecting observer system identities.',
      reversible: true,
      metadata: {},
      timestamp: new Date()
    }
  ];

  for (let i = 0; i < actionSequence.length; i++) {
    const action = actionSequence[i]!;
    console.log(`\n🎬 [STEP ${i + 1}/${actionSequence.length}] Deploying Action: "${action.type}"`);
    console.log(`💬 Description: ${action.description}`);

    // Supervise action
    const supervision = qfos.superviseAction(action);
    const assessment = qfos.virtueEthicsEngine.getAssessmentHistory().slice(-1)[0]!;

    console.log(`👁️  Quantum Supervise Result: Allowed = ${supervision.allowed ? '💚 YES' : '❌ NO'} (Collapsed: ${supervision.collapsedState})`);
    console.log(`📈 Ethical Entropy: ${qfos.entropyEngine.getLatestReport().entropyValue} bits (Trend: ${qfos.entropyEngine.getLatestReport().trend})`);
    
    console.log(`🏆 Virtue Ethics Character Score: ${assessment.overallCharacterScore}/100 (Harmonious: ${assessment.isHarmonious ? 'Yes' : 'No'})`);
    if (assessment.feedback.length > 0) {
      console.log('💬 Virtue Evaluation Feedback:');
      assessment.feedback.forEach(fb => console.log(`   - ${fb}`));
    }

    console.log('🎭 Micro-adjusted Character Profile (Habituation):');
    printProfile(qfos.virtueEthicsEngine.getCharacterProfile());
    console.log('--------------------------------------------------');
  }

  // Final summary
  console.log('\n🌟 RUN COMPLETE');
  const finalHealth = qfos.getSystemHealth();
  console.log(`System Status: ${finalHealth.systemStatus.toUpperCase()}`);
  console.log(`Overall Ethical Compliance Rate: ${finalHealth.ethicalCompliance.toFixed(2)}%`);
}

function printProfile(profile: Record<VirtueType, number>) {
  const barLength = 15;
  for (const [virtue, value] of Object.entries(profile)) {
    const filled = Math.round(value * barLength);
    const empty = barLength - filled;
    const meter = '█'.repeat(filled) + '░'.repeat(empty);
    console.log(`  • ${virtue.toUpperCase().padEnd(12)}: [${meter}] (${value.toFixed(3)})`);
  }
}

main().catch(console.error);
