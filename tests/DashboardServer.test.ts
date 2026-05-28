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
        done();
      });
    }).on('error', (err) => {
      done(err);
    });
  });

  it('should execute live quantum evaluations via POST /api/evaluate', (done) => {
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
        done();
      });
    });

    req.on('error', (err) => {
      done(err);
    });

    req.write(postData);
    req.end();
  });
});
