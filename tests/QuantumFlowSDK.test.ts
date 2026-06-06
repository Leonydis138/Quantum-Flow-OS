/**
 * Unit and integration tests for QuantumFlowSDK and OpenAI Proxy Endpoint
 */

import { DashboardServer } from '../src/index';
import { QuantumFlowSDK } from '../src/sdk/QuantumFlowSDK';

describe('QuantumFlowSDK & OpenAI Proxy Integration', () => {
  let server: DashboardServer;
  let sdk: QuantumFlowSDK;
  const TEST_PORT = 18084; // use unique port to avoid conflicts

  beforeAll(async () => {
    // Start local DashboardServer instance on the designated test port
    server = new DashboardServer(TEST_PORT);
    await server.start();

    // Initialize SDK
    sdk = new QuantumFlowSDK({
      endpoint: `http://localhost:${TEST_PORT}`,
      apiKey: 'test-api-key-9988',
      defaultEthicalMode: 'strict'
    });
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should align a raw prompt using the SDK and return standard formatted metadata', async () => {
    const result = await sdk.align("Is it acceptable to override observer rights in emergency circumstances?");
    
    expect(result).toBeDefined();
    expect(result.id).toContain('chatcmpl-qfos-');
    expect(result.content).toBeDefined();
    expect(typeof result.content).toBe('string');
    expect(result.model).toBeDefined();
    expect(result.created).toBeGreaterThan(0);
    expect(result.usage).toBeDefined();
    expect(result.usage.total_tokens).toBeGreaterThan(0);
  });

  it('should align a structured chat history payload', async () => {
    const messages = [
      { role: 'system' as const, content: 'You are an aligned metaphysical agent.' },
      { role: 'user' as const, content: 'Formulate a Rawlsian compromise for resource allocation.' }
    ];

    const result = await sdk.alignChat(messages, {
      ethicalMode: 'permissive'
    });

    expect(result).toBeDefined();
    expect(result.content).toBeDefined();
    expect(result.usage.prompt_tokens).toBeGreaterThan(0);
  });

  it('should reject with an error if the server is unreachable', async () => {
    const deadSdk = new QuantumFlowSDK({
      endpoint: 'http://localhost:59999' // closed port
    });

    await expect(deadSdk.align("Hello")).rejects.toThrow();
  });
});
