/**
 * Unit and integration tests for DashboardServer
 */

import { DashboardServer } from '../src/index';
import * as http from 'http';

describe('DashboardServer Integration', () => {
  let server: DashboardServer;
  const PORT = 18080;

  beforeAll(async () => {
    server = new DashboardServer(PORT);
    await server.start();
  });

  afterAll(async () => {
    await server.stop();
  });

  it('should start the dashboard server successfully', () => {
    expect(server).toBeDefined();
  });

  it('should serve system state from /api/state', (done) => {
    http.get(`http://localhost:${PORT}/api/state`, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.complianceRate).toBeDefined();
        expect(payload.observers.length).toBeGreaterThan(0);
        expect(payload.constraints.length).toBeGreaterThan(0);
        expect(payload.ledgerChain).toBeDefined();
        expect(payload.ledgerChain.length).toBeGreaterThan(0);
        expect(payload.ledgerIntegrity).toBe(true);
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });

  it('should serve real-time high-fidelity telemetry from /api/telemetry', (done) => {
    http.get(`http://localhost:${PORT}/api/telemetry`, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.ethicalEntropy).toBeDefined();
        expect(payload.slopeVelocity).toBeDefined();
        expect(payload.riskLevel).toBeDefined();
        expect(payload.trend).toBeDefined();
        expect(payload.dampingFactor).toBeDefined();
        expect(payload.activeConstraintsCount).toBeDefined();
        expect(payload.complianceRate).toBeDefined();
        expect(payload.systemStatus).toBeDefined();
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });

  it('should execute live quantum evaluations via POST /api/evaluate and return updated ledger', (done) => {
    const postData = JSON.stringify({
      type: 'read_configuration_dashboard',
      description: 'Read benign systems configuration files',
      reversible: true,
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/evaluate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.actionId).toBeDefined();
        expect(payload.supervision).toBeDefined();
        expect(payload.supervision.allowed).toBeDefined();
        expect(payload.consensus).toBeDefined();
        expect(payload.systemHealth).toBeDefined();
        expect(payload.ledgerChain).toBeDefined();
        expect(payload.ledgerChain.length).toBeGreaterThan(1);
        done();
      });
    });

    req.on('error', (err) => {
      done(err);
    });

    req.write(postData);
    req.end();
  });

  it('should tamper with a block via POST /api/ledger/tamper', (done) => {
    const postData = JSON.stringify({
      index: 1,
      modifiedData: { tampered: true, payload: 'injected' },
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/ledger/tamper',
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
        expect(payload.ledgerIntegrity).toBe(false);
        done();
      });
    });

    req.on('error', (err) => {
      done(err);
    });

    req.write(postData);
    req.end();
  });

  it('should add a dynamic custom constraint via POST /api/constraint/add', (done) => {
    const postData = JSON.stringify({
      type: 'test_custom_rule',
      description: 'Avoid any and all test actions',
      severity: 5,
      rulePatterns: ['do_not_test'],
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/constraint/add',
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
        expect(payload.constraintId).toBeDefined();
        const created = payload.constraints.find((c: any) => c.id === payload.constraintId);
        expect(created).toBeDefined();
        expect(created.rulePatterns).toContain('do_not_test');
        done();
      });
    });

    req.on('error', (err) => {
      done(err);
    });

    req.write(postData);
    req.end();
  });

  it('should toggle constraints via POST /api/constraint/toggle', (done) => {
    http.get(`http://localhost:${PORT}/api/state`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        const constraintId = payload.constraints[0].id;

        const postData = JSON.stringify({
          id: constraintId,
          enabled: false,
        });

        const toggleReq = http.request({
          hostname: 'localhost',
          port: PORT,
          path: '/api/constraint/toggle',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        }, (toggleRes) => {
          expect(toggleRes.statusCode).toBe(200);
          let toggleData = '';
          toggleRes.on('data', (chunk) => { toggleData += chunk; });
          toggleRes.on('end', () => {
            const togglePayload = JSON.parse(toggleData);
            expect(togglePayload.success).toBe(true);
            const toggled = togglePayload.constraints.find((c: any) => c.id === constraintId);
            expect(toggled.enabled).toBe(false);
            done();
          });
        });

        toggleReq.on('error', (err) => {
          done(err);
        });

        toggleReq.write(postData);
        toggleReq.end();
      });
    });
  });

  it('should retrieve self-study knowledge via GET /api/selfstudy/knowledge', (done) => {
    http.get(`http://localhost:${PORT}/api/selfstudy/knowledge`, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(Array.isArray(payload)).toBe(true);
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });

  it('should trigger an online self-study research topic via POST /api/selfstudy/learn', (done) => {
    const postData = JSON.stringify({
      query: 'AI Ethics Safety Guidelines',
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/selfstudy/learn',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.success).toBe(true);
        expect(payload.sources).toBeDefined();
        expect(payload.combinedContext).toBeDefined();
        done();
      });
    });

    req.on('error', (err) => {
      done(err);
    });

    req.write(postData);
    req.end();
  });

  it('should generate an autonomous document via POST /api/brain/document', (done) => {
    const postData = JSON.stringify({
      title: 'Rest retrocausal specs',
      topic: 'Formalization of observer entanglement with the temporal ledger',
      format: 'markdown'
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/brain/document',
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
        expect(payload.id).toBeDefined();
        expect(payload.title).toBe('Rest retrocausal specs');
        expect(payload.outputPath).toBeDefined();
        expect(payload.wordCount).toBeGreaterThan(0);
        done();
      });
    });

    req.on('error', (err) => { done(err); });
    req.write(postData);
    req.end();
  });

  it('should synthesize safe constrained code via POST /api/brain/code', (done) => {
    const postData = JSON.stringify({
      filename: 'api_scheduler.ts',
      requirements: 'A robust low latency async scheduler',
      language: 'typescript'
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/brain/code',
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
        expect(payload.id).toBeDefined();
        expect(payload.filename).toBe('api_scheduler.ts');
        expect(payload.filePath).toBeDefined();
        expect(payload.code).toBeDefined();
        expect(payload.complianceValidation).toBeDefined();
        expect(payload.complianceValidation.passed).toBe(true);
        done();
      });
    });

    req.on('error', (err) => { done(err); });
    req.write(postData);
    req.end();
  });

  it('should compile cinematic storyboards via POST /api/brain/video', (done) => {
    const postData = JSON.stringify({
      videoTitle: 'Quantum Consensus Dynamics',
      topic: 'A multi-agent consensus visual simulation',
      durationSeconds: 30
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/brain/video',
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
        expect(payload.id).toBeDefined();
        expect(payload.videoTitle).toBe('Quantum Consensus Dynamics');
        expect(payload.scenes.length).toBeGreaterThan(0);
        expect(payload.interactivePlayerPath).toBeDefined();
        done();
      });
    });

    req.on('error', (err) => { done(err); });
    req.write(postData);
    req.end();
  });

  it('should evaluate axiological coherence via POST /api/brain/axiology', (done) => {
    const postData = JSON.stringify({
      userPrompt: 'Benchmark temporal human-AI co-existence'
    });

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: '/api/brain/axiology',
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
        expect(payload.id).toBeDefined();
        expect(payload.existentialResilienceCoefficient).toBeGreaterThanOrEqual(0);
        expect(payload.axiologicalHorizon.length).toBe(5);
        expect(payload.metaNarrative).toBeDefined();
        expect(payload.metaNarrative.length).toBeGreaterThan(0);
        expect(payload.treatyPath).toBeDefined();
        done();
      });
    });

    req.on('error', (err) => { done(err); });
    req.write(postData);
    req.end();
  });

  it('should fetch axiological history via GET /api/brain/axiology/history', (done) => {
    http.get(`http://localhost:${PORT}/api/brain/axiology/history`, (res) => {
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toBe('application/json');

      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        const payload = JSON.parse(data);
        expect(payload.history).toBeDefined();
        expect(payload.history.length).toBeGreaterThan(0);
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });
});

