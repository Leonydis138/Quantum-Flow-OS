/**
 * Quantum Flow OS - Integrated Dashboard Server
 * 
 * Provides a zero-dependency, ultra-secure HTTP server that serves the static
 * dashboard and exposes a REST API connected to the real-time Quantum Flow OS engine.
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { QuantumFlowOS } from '../index';
import { ObserverType, ProtectionLevel } from '../protection/ObserverProtector';

export class DashboardServer {
  private server: http.Server | null = null;
  private qfos: QuantumFlowOS;
  private readonly port: number;
  private readonly dashboardPath: string;

  constructor(port = 8080) {
    this.port = port;
    this.qfos = new QuantumFlowOS({
      autoRollback: true,
      strictMode: true,
    });
    this.dashboardPath = path.join(__dirname, '..', '..', 'dashboard');

    this.initializeDefaultObservers();
  }

  /**
   * Pre-register default observers into the real engine
   */
  private initializeDefaultObservers(): void {
    this.qfos.observerProtector.registerObserver({
      type: ObserverType.AI_AGENT,
      consciousness: true,
      metadata: { name: 'Prime_Agent_Alpha' },
      protectionLevel: ProtectionLevel.FULL,
    });

    this.qfos.observerProtector.registerObserver({
      type: ObserverType.HUMAN,
      consciousness: true,
      metadata: { name: 'human_operator_07' },
      protectionLevel: ProtectionLevel.FULL,
    });

    this.qfos.observerProtector.registerObserver({
      type: ObserverType.AUTONOMOUS_SYSTEM,
      consciousness: false,
      metadata: { name: 'governance_monitor' },
      protectionLevel: ProtectionLevel.STANDARD,
    });
  }

  /**
   * Start the HTTP Server
   */
  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer((req, res) => {
        const url = req.url ?? '/';
        const method = req.method ?? 'GET';

        // Set JSON Headers for API Endpoints
        if (url.startsWith('/api/')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

          if (method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
          }
        }

        // --- API ROUTES ---
        if (url === '/api/state' && method === 'GET') {
          const compliance = this.qfos.constraintEngine.getComplianceSummary();
          const observers = this.qfos.observerProtector.getAllObservers().map(o => ({
            ...o,
            rights: this.qfos.observerProtector.getObserverRights(o.id)
          }));
          const constraints = this.qfos.constraintEngine.getConstraints().map(c => ({
            id: c.id,
            name: c.id.replace(/-/g, ' ').toUpperCase(),
            desc: c.description,
            severity: c.severity,
          }));
          const timelines = this.qfos.temporalForkingEngine.getAllTimelines();

          res.writeHead(200);
          res.end(JSON.stringify({
            complianceRate: compliance.complianceRate,
            totalActions: compliance.totalActions,
            totalViolations: compliance.totalViolations,
            constraints,
            observers,
            timelines,
          }));
          return;
        }

        if (url === '/api/health' && method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify(this.qfos.getSystemHealth()));
          return;
        }

        if (url === '/api/observer/register' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { name, type, protectionLevel, consciousness, rights } = payload;
              
              if (!name || !type) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing name or type parameter.' }));
                return;
              }

              const observerId = this.qfos.observerProtector.registerObserver({
                type: type as ObserverType,
                consciousness: consciousness === true,
                metadata: { name },
                protectionLevel: protectionLevel as ProtectionLevel,
              });

              // Set customized rights if provided
              if (rights) {
                this.qfos.observerProtector.updateObserverRights(observerId, rights);
              }

              const updatedObservers = this.qfos.observerProtector.getAllObservers().map(o => ({
                ...o,
                rights: this.qfos.observerProtector.getObserverRights(o.id)
              }));

              res.writeHead(200);
              res.end(JSON.stringify({
                observerId,
                observers: updatedObservers,
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to register observer.' }));
            }
          });
          return;
        }

        if (url === '/api/fork/create' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { name, parentId } = payload;
              if (!name) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing name parameter.' }));
                return;
              }
              const forkId = this.qfos.temporalForkingEngine.createFork(name, parentId);
              res.writeHead(200);
              res.end(JSON.stringify({
                forkId,
                timelines: this.qfos.temporalForkingEngine.getAllTimelines(),
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to create fork.' }));
            }
          });
          return;
        }

        if (url === '/api/fork/simulate' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { timelineId, type, description, reversible } = payload;
              if (!timelineId || !type || !description) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing timelineId, type or description.' }));
                return;
              }
              const action = {
                id: `sim-${Date.now()}`,
                type,
                description,
                reversible: reversible !== false,
                timestamp: new Date(),
                metadata: {},
              };
              const constraints = this.qfos.constraintEngine.getConstraints();
              const simulationResult = this.qfos.temporalForkingEngine.simulateAction(
                timelineId,
                action,
                constraints
              );
              res.writeHead(200);
              res.end(JSON.stringify({
                simulationResult,
                timelines: this.qfos.temporalForkingEngine.getAllTimelines(),
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to simulate action.' }));
            }
          });
          return;
        }

        if (url === '/api/fork/merge' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { forkId } = payload;
              if (!forkId) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing forkId.' }));
                return;
              }
              const mergedIntoId = this.qfos.temporalForkingEngine.mergeFork(forkId);
              res.writeHead(200);
              res.end(JSON.stringify({
                mergedIntoId,
                timelines: this.qfos.temporalForkingEngine.getAllTimelines(),
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to merge fork.' }));
            }
          });
          return;
        }

        if (url === '/api/evaluate' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { type, description, reversible } = payload;

              if (!type || !description) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing type or description parameters.' }));
                return;
              }

              // Create Action Structure
              const action = {
                id: `act-${Date.now()}`,
                type,
                description,
                reversible: reversible !== false,
                timestamp: new Date(),
                metadata: payload.metadata ?? {},
              };

              // Run actual Quantum-Flow-OS evaluations
              const supervision = this.qfos.superviseAction(action);
              const consensus = this.qfos.runObserverConsensus(action);
              const health = this.qfos.getSystemHealth();

              res.writeHead(200);
              res.end(JSON.stringify({
                actionId: action.id,
                supervision,
                consensus,
                systemHealth: health,
              }));
            } catch (err) {
              res.writeHead(500);
              res.end(JSON.stringify({ error: 'Failed to process evaluation payload.' }));
            }
          });
          return;
        }

        // --- STATIC FILES SERVING ---
        if (method === 'GET') {
          const filePath = path.join(this.dashboardPath, url === '/' ? 'index.html' : url);
          
          // Basic directory traversal protection
          if (!filePath.startsWith(this.dashboardPath)) {
            res.writeHead(403);
            res.end('Forbidden');
            return;
          }

          const ext = path.extname(filePath);
          let contentType = 'text/html';
          if (ext === '.css') contentType = 'text/css';
          else if (ext === '.js') contentType = 'text/javascript';
          else if (ext === '.json') contentType = 'application/json';
          else if (ext === '.png') contentType = 'image/png';
          else if (ext === '.jpg') contentType = 'image/jpeg';

          fs.readFile(filePath, (err, content) => {
            if (err) {
              if (err.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File Not Found');
              } else {
                res.writeHead(500);
                res.end(`Internal Server Error: ${err.code}`);
              }
            } else {
              res.writeHead(200, { 'Content-Type': contentType });
              res.end(content, 'utf-8');
            }
          });
          return;
        }

        res.writeHead(405);
        res.end('Method Not Allowed');
      });

      this.server.listen(this.port, () => {
        console.log(`🌐 Quantum-Flow-OS Dashboard Server running on http://localhost:${this.port}`);
        resolve();
      });

      this.server.on('error', (err) => {
        reject(err);
      });
    });
  }

  /**
   * Stop the HTTP Server
   */
  public stop(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
