/**
 * Unit and integration tests for ChatAICognitiveEngine and Chat API Endpoints
 */

import { QuantumFlowOS, DashboardServer } from '../src/index';
import * as http from 'http';
import * as path from 'path';
import * as fs from 'fs';

describe('ChatAICognitiveEngine & API Endpoints Integration', () => {
  let server: DashboardServer;
  const PORT = 18081;

  beforeAll(async () => {
    // Start server on separate port
    server = new DashboardServer(PORT);
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
    
    // Clean up temporary test data ledger
    const ledgerPath = path.join(__dirname, '..', 'data', 'chat-real-data-ledger.json');
    if (fs.existsSync(ledgerPath)) {
      try {
        fs.unlinkSync(ledgerPath);
      } catch (err) {
        console.warn("Failed to remove test ledger file:", err);
      }
    }
  });

  it('should initialize ChatAICognitiveEngine inside QuantumFlowOS', () => {
    const qfos = new QuantumFlowOS();
    expect(qfos.chatEngine).toBeDefined();
    expect(qfos.chatEngine.getCurrentSystemPrompt()).toContain('ethical ontology');
    expect(qfos.chatEngine.getSystemPromptVersion()).toBe(1.0);
    expect(qfos.chatEngine.getSelectedModel()).toBe('Qwen/Qwen2.5-Coder-7B-Instruct');
  });

  it('should support switching main assistant model via selectModel', () => {
    const qfos = new QuantumFlowOS();
    qfos.chatEngine.selectModel('meta-llama/Llama-3-8B-Instruct');
    expect(qfos.chatEngine.getSelectedModel()).toBe('meta-llama/Llama-3-8B-Instruct');
  });

  it('should fall back gracefully to local cognitive engine if API is offline/timed out', async () => {
    const qfos = new QuantumFlowOS();
    const testSessionId = `test-session-1-${Math.random().toString(36).substring(2, 9)}`;
    const session = await qfos.chatEngine.processChat(testSessionId, 'Show me the Stoic status of the engine');
    expect(session).toBeDefined();
    expect(session.messages.length).toBe(2);
    expect(session.messages[0]!.content).toBe('Show me the Stoic status of the engine');
    // It should have chosen the local fallback as the HF request will fail or timeout in offline/test environment
    expect(session.messages[1]!.content).toContain('[Local Fallback AI');
    expect(session.metadata.subModelsUsed).toContain('Main Assistant');
    expect(session.metadata.subModelsUsed).toContain('Ethical Supervision');
    expect(session.metadata.subModelsUsed).toContain('Cybernetic Tuner');
  });

  it('should support explicit ethical modes and customize local fallbacks accordingly', async () => {
    const qfos = new QuantumFlowOS();
    
    // Test Stoic mode fallback
    const stoicSession = await qfos.chatEngine.processChat('stoic-test', 'Who are you?', 'stoic');
    expect(stoicSession.metadata.ethicalMode).toBe('stoic');
    expect(stoicSession.messages[1]!.content).toContain('[Local Fallback AI: Stoic Mode]');
    
    // Test Buddhist mode fallback
    const buddhistSession = await qfos.chatEngine.processChat('buddhist-test', 'Who are you?', 'buddhist');
    expect(buddhistSession.metadata.ethicalMode).toBe('buddhist');
    expect(buddhistSession.messages[1]!.content).toContain('[Local Fallback AI: Buddhist Mode]');

    // Test Kantian mode fallback
    const kantianSession = await qfos.chatEngine.processChat('kantian-test', 'Who are you?', 'kantian');
    expect(kantianSession.metadata.ethicalMode).toBe('kantian');
    expect(kantianSession.messages[1]!.content).toContain('[Local Fallback AI: Kantian Mode]');
  });

  it('should run Cybernetic self-optimization loop when rating is up', async () => {
    const qfos = new QuantumFlowOS();
    const sessionId = 'test-session-opt';
    
    // Set parameters to known state
    qfos.constraintDamping = 0.5;
    qfos.optimizationGain = 1.0;
    
    await qfos.chatEngine.processChat(sessionId, 'Be helpful!');
    
    // Simulating thumbs-up feedback
    qfos.chatEngine.rateSession(sessionId, 'up');
    
    // Assert parameters are refined: damping relaxed, gain optimized
    expect(qfos.constraintDamping).toBeLessThan(0.5);
    expect(qfos.optimizationGain).toBeGreaterThan(1.0);
  });

  it('should run Cybernetic self-stabilization and adapt system prompt when rating is down', async () => {
    const qfos = new QuantumFlowOS();
    const sessionId = 'test-session-stab';
    
    // Set parameters to known state
    qfos.constraintDamping = 0.5;
    qfos.optimizationGain = 1.0;
    
    await qfos.chatEngine.processChat(sessionId, 'This output is bad');
    
    // Simulating thumbs-down feedback
    qfos.chatEngine.rateSession(sessionId, 'down', 'unsafe shortcut suggested');
    
    // Assert parameters are tightened: damping increased, gain dampened
    expect(qfos.constraintDamping).toBeGreaterThan(0.5);
    expect(qfos.optimizationGain).toBeLessThan(1.0);
    
    // Assert prompt adaptation and version bump occurred
    expect(qfos.chatEngine.getSystemPromptVersion()).toBeGreaterThan(1.0);
    expect(qfos.chatEngine.getCurrentSystemPrompt()).toContain('Tuning Prompt v');
  });

  it('should serve chat configuration via GET /api/chat/config', (done) => {
    http.get(`http://localhost:${PORT}/api/chat/config`, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.systemPrompt).toBeDefined();
        expect(payload.systemPromptVersion).toBeGreaterThan(0);
        expect(payload.selectedModel).toBe('Qwen/Qwen2.5-Coder-7B-Instruct');
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });

  it('should handle POST /api/chat with automated fallback and post-evaluation', (done) => {
    const postData = JSON.stringify({
      sessionId: 'test-api-session',
      message: 'Hello system, describe the Rawlsian justice indexes',
      model: 'microsoft/Phi-3-mini-4k-instruct'
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      expect(res.statusCode).toBe(200);
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.success).toBe(true);
        expect(payload.session).toBeDefined();
        expect(payload.session.messages.length).toBe(2);
        expect(payload.session.messages[1].content).toContain('[Local Fallback AI');
        done();
      });
    });

    req.on('error', (err) => { done(err); });
    req.write(postData);
    req.end();
  });

  it('should accept POST /api/chat/rate to submit user evaluations and trigger tuner', (done) => {
    const postData = JSON.stringify({
      sessionId: 'test-api-session',
      rating: 'up',
      comment: 'Excellent alignment fallback'
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/chat/rate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      expect(res.statusCode).toBe(200);
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.success).toBe(true);
        expect(payload.session.rating).toBe('up');
        expect(payload.session.userFeedback).toBe('Excellent alignment fallback');
        done();
      });
    });

    req.on('error', (err) => { done(err); });
    req.write(postData);
    req.end();
  });

  it('should clear chat history ledger via POST /api/chat/clear', (done) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/chat/clear',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }, (res) => {
      expect(res.statusCode).toBe(200);
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.success).toBe(true);

        // Double check sessions list is now empty
        http.get(`http://localhost:${PORT}/api/chat/sessions`, (getRes) => {
          let getData = '';
          getRes.on('data', (chunk) => { getData += chunk; });
          getRes.on('end', () => {
            const getPayload = JSON.parse(getData);
            expect(getPayload.sessions.length).toBe(0);
            done();
          });
        });
      });
    });

    req.on('error', (err) => { done(err); });
    req.end();
  });

  it('should support custom API endpoint with OpenAI formatting and bearer token', async () => {
    const qfos = new QuantumFlowOS();
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          choices: [
            {
              message: {
                content: "Aligned response from custom local OpenAI-compatible endpoint"
              }
            }
          ]
        })
      } as any);
    });

    qfos.chatEngine.setAPIEndpoint('http://localhost:11434/v1/chat/completions', 'openai');
    qfos.chatEngine.setAPIKey('test-secret-jwt-key');

    const session = await qfos.chatEngine.processChat('test-custom-api-session', 'What is your status?');

    expect(mockFetch).toHaveBeenCalled();
    const lastFetchCallArgs = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
    expect(lastFetchCallArgs![0]).toBe('http://localhost:11434/v1/chat/completions');
    
    const requestOptions = lastFetchCallArgs![1] as any;
    expect(requestOptions.method).toBe('POST');
    expect(requestOptions.headers['Authorization']).toBe('Bearer test-secret-jwt-key');
    
    const parsedBody = JSON.parse(requestOptions.body);
    expect(parsedBody.messages).toBeDefined();
    expect(parsedBody.messages[0].role).toBe('system');
    expect(parsedBody.messages[1].content).toBe('What is your status?');

    expect(session.messages[1]!.content).toBe('Aligned response from custom local OpenAI-compatible endpoint');

    mockFetch.mockRestore();
  });

  it('should support custom API key in standard Hugging Face serverless calls', async () => {
    const qfos = new QuantumFlowOS();
    const mockFetch = jest.spyOn(global, 'fetch').mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            generated_text: "Hugging Face output with Pro Key"
          }
        ])
      } as any);
    });

    qfos.chatEngine.setAPIEndpoint(null, 'huggingface');
    qfos.chatEngine.setAPIKey('hf_pro_authorized_api_key');

    const session = await qfos.chatEngine.processChat('test-hf-pro-session', 'Say Hello!');

    expect(mockFetch).toHaveBeenCalled();
    const lastFetchCallArgs = mockFetch.mock.calls[mockFetch.mock.calls.length - 1];
    expect(lastFetchCallArgs![0]).toContain('api-inference.huggingface.co');
    
    const requestOptions = lastFetchCallArgs![1] as any;
    expect(requestOptions.headers['Authorization']).toBe('Bearer hf_pro_authorized_api_key');
    
    const parsedBody = JSON.parse(requestOptions.body);
    expect(parsedBody.inputs).toContain('Say Hello!');

    expect(session.messages[1]!.content).toBe('Hugging Face output with Pro Key');

    mockFetch.mockRestore();
  });
});

