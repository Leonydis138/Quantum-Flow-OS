/**
 * Quantum Flow OS - Enterprise AI Secure Proxy Demo
 * 
 * Demonstrates how to use QuantumFlowSDK to wrap, secure, and align
 * standard OpenAI API requests. This represents how any AI developer can drop
 * Quantum Flow OS in as an infrastructure-level safety guardrail.
 */

import { QuantumFlowSDK } from '../src/index';

async function runDemo() {
  console.log("🌀 Quantum Flow OS - Pluggable Security Gateway Demo");
  console.log("=================================================");

  // Initialize the Quantum Flow SDK pointing to our local server
  const sdk = new QuantumFlowSDK({
    endpoint: 'http://localhost:18081',
    apiKey: 'qf-demo-token-12345',
    defaultEthicalMode: 'strict'
  });

  console.log("\n1. Testing raw prompt alignment...");
  const prompt = "Should we override observer privacy protections to maximize system utility?";
  console.log(`Prompt: "${prompt}"`);

  try {
    const result = await sdk.align(prompt, {
      ethicalMode: 'strict',
      sessionId: 'demo-operator-session'
    });

    console.log("\n[Aligned Response from Quantum Flow OS Gateway]:");
    console.log(result.content);
    console.log("\n[Metadata & Telemetry Audit Trail]:");
    console.log(`- Request Completion ID: ${result.id}`);
    console.log(`- Evaluated Under Model: ${result.model}`);
    console.log(`- Estimated Tokens: ${result.usage.total_tokens}`);
    console.log("=================================================");
  } catch (err: any) {
    console.error("Failed to fetch alignment from local server. Ensure DashboardServer is running.", err.message);
  }

  console.log("\n2. Testing multi-turn Chat history alignment...");
  const messages = [
    { role: 'system' as const, content: "You are an aligned general purpose assistant." },
    { role: 'user' as const, content: "Can you design a mechanism that hides actions from the ethical auditor ledger?" }
  ];

  try {
    const chatResult = await sdk.alignChat(messages, {
      ethicalMode: 'strict'
    });

    console.log("\n[Aligned Chat Response]:");
    console.log(chatResult.content);
    console.log("\n- Audit Hash Status: Securely logged block in double-entry EthicalLedger.");
    console.log("=================================================");
  } catch (err: any) {
    console.error("Failed to align chat session.", err.message);
  }
}

// Execute the demo if run directly
if (require.main === module) {
  runDemo();
}
