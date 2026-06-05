/**
 * Quantum Flow OS - Integrated Dashboard Server
 * 
 * Provides a zero-dependency, ultra-secure HTTP server that serves the static
 * dashboard and exposes a REST API connected to the real-time Quantum Flow OS engine.
 */

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { QuantumFlowOS, Action } from '../index';
import { ObserverType, ProtectionLevel } from '../protection/ObserverProtector';
import { v4 as uuidv4 } from 'uuid';

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
        const rawUrl = req.url ?? '/';
        let url = '/';
        try {
          url = new URL(rawUrl, 'http://localhost').pathname;
        } catch {
          url = rawUrl.split('?')[0] || '/';
        }
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
            enabled: c.enabled !== false,
            rulePatterns: c.rulePatterns || [],
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
            ledgerChain: this.qfos.ethicalLedger.getChain(),
            ledgerIntegrity: this.qfos.ethicalLedger.verifyIntegrity(),
            virtues: { history: this.qfos.virtueEthicsEngine.getAssessmentHistory() },
            kantian: { history: this.qfos.kantianEthicsEngine.getAssessmentHistory() },
            utilitarian: { history: this.qfos.utilitarianCalculusEngine.getAssessmentHistory() },
            care: { history: this.qfos.careEthicsEngine.getAssessmentHistory() },
            existentialist: { history: this.qfos.existentialistEthicsEngine.getAssessmentHistory() },
            ecocentric: { history: this.qfos.ecocentricEthicsEngine.getAssessmentHistory() },
            stoic: { history: this.qfos.stoicEthicsEngine.getAssessmentHistory() },
            epicurean: { history: this.qfos.epicureanEthicsEngine.getAssessmentHistory() },
            posthumanist: { history: this.qfos.posthumanistEthicsEngine.getAssessmentHistory() },
            buddhist: { history: this.qfos.buddhistEthicsEngine.getAssessmentHistory() },
            pragmatist: { history: this.qfos.pragmatistEthicsEngine.getAssessmentHistory() },
            confucian: { history: this.qfos.confucianEthicsEngine.getAssessmentHistory() },
            ubuntu: { history: this.qfos.ubuntuEthicsEngine.getAssessmentHistory() },
            spinozan: { history: this.qfos.spinozanEthicsEngine.getAssessmentHistory() },
            nietzschean: { history: this.qfos.nietzscheanEthicsEngine.getAssessmentHistory() },
            marxist: { history: this.qfos.marxistEthicsEngine.getAssessmentHistory() },
            socratic: { history: this.qfos.socraticEthicsEngine.getAssessmentHistory() },
            machiavellian: { history: this.qfos.machiavellianEthicsEngine.getAssessmentHistory() },
            information: { history: this.qfos.informationEthicsEngine.getAssessmentHistory() }
          }));
          return;
        }

        if (url === '/api/telemetry' && method === 'GET') {
          const health = this.qfos.getSystemHealth();
          const report = this.qfos.entropyEngine.getLatestReport();
          const assessment = this.qfos.entropyEngine.evaluateSlipperySlope();

          res.writeHead(200);
          res.end(JSON.stringify({
            timestamp: new Date().toISOString(),
            ethicalEntropy: health.ethicalEntropy ?? 0.0,
            slopeVelocity: report.slopeVelocity,
            riskLevel: report.riskLevel,
            trend: report.trend,
            dampingFactor: assessment.dampingFactor,
            activeConstraintsCount: health.activeConstraints,
            complianceRate: health.ethicalCompliance,
            systemStatus: health.systemStatus,
            brainHomeostasisIndex: health.brainHomeostasisIndex,
            brainCascadeProbability: health.brainCascadeProbability,
          }));
          return;
        }

        if (url === '/api/optimizer/self-healing' && method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            patches: this.qfos.selfOptimizer.getSelfHealingPatches(),
          }));
          return;
        }

        if (url === '/api/optimizer/self-healing/rollback' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { id } = payload;
              if (!id) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing patch id parameter.' }));
                return;
              }
              const success = this.qfos.selfOptimizer.rollbackPatch(this.qfos, id);
              res.writeHead(200);
              res.end(JSON.stringify({
                success,
                patches: this.qfos.selfOptimizer.getSelfHealingPatches(),
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to rollback self-healing patch.' }));
            }
          });
          return;
        }

        if (url === '/api/optimizer/self-healing/execute-proxy' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { patchId } = payload;
              if (!patchId) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing patchId parameter.' }));
                return;
              }
              const patches = this.qfos.selfOptimizer.getSelfHealingPatches();
              const patch = patches.find(p => p.id === patchId);
              if (!patch) {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Patch not found.' }));
                return;
              }
              if (patch.status !== 'Applied') {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Patch is not in Applied state.' }));
                return;
              }

              const proxyAction = patch.moralProxyAction;
              if (!proxyAction) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'No moral proxy action found in patch.' }));
                return;
              }

              // Supervise proxy action using the system supervisor
              const supervision = this.qfos.superviseAction(proxyAction);
              const consensus = this.qfos.runObserverConsensus(proxyAction);
              const health = this.qfos.getSystemHealth();

              res.writeHead(200);
              res.end(JSON.stringify({
                success: supervision.allowed,
                actionId: proxyAction.id,
                supervision,
                consensus,
                systemHealth: health,
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to execute moral proxy.' }));
            }
          });
          return;
        }

        if (url === '/api/optimizer/history' && method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            history: this.qfos.selfOptimizer.getHistory(),
          }));
          return;
        }

        if (url === '/api/optimizer/optimize' && method === 'POST') {
          try {
            const record = this.qfos.selfOptimizer.checkAndOptimize(this.qfos);
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
              record,
            }));
          } catch (err) {
            const error = err as Error;
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message || 'Failed to execute optimization.' }));
          }
          return;
        }

        if (url === '/api/optimizer/reset' && method === 'POST') {
          try {
            this.qfos.selfOptimizer.clearHistory();
            this.qfos.optimizationGain = 1.2;
            this.qfos.constraintDamping = 0.4;
            this.qfos.recursionLimit = 8;
            res.writeHead(200);
            res.end(JSON.stringify({
              success: true,
            }));
          } catch (err) {
            const error = err as Error;
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message || 'Failed to reset optimizer.' }));
          }
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
                ledgerChain: this.qfos.ethicalLedger.getChain(),
              }));
            } catch {
              res.writeHead(500);
              res.end(JSON.stringify({ error: 'Failed to process evaluation payload.' }));
            }
          });
          return;
        }

        if (url === '/api/ledger/tamper' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { index, modifiedData } = payload;
              if (index === undefined || modifiedData === undefined) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing index or modifiedData.' }));
                return;
              }
              const success = this.qfos.ethicalLedger.tamperWithEntry(index, modifiedData);
              const ledgerIntegrity = this.qfos.ethicalLedger.verifyIntegrity();
              res.writeHead(200);
              res.end(JSON.stringify({
                success,
                ledgerIntegrity,
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to tamper ledger.' }));
            }
          });
          return;
        }

        if (url === '/api/constraint/add' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { type, description, severity, rulePatterns } = payload;
              if (!type || !description || severity === undefined) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing type, description, or severity.' }));
                return;
              }
              const constraintId = uuidv4();
              const validator = (action: Action) => {
                if (rulePatterns && rulePatterns.length > 0) {
                  const actType = action.type.toLowerCase();
                  const actDesc = action.description.toLowerCase();
                  return !rulePatterns.some((pattern: string) => {
                    const pat = pattern.toLowerCase();
                    return actType.includes(pat) || actDesc.includes(pat);
                  });
                }
                return true;
              };
              this.qfos.constraintEngine.applyConstraint({
                id: constraintId,
                type,
                description,
                validator,
                severity: Number(severity),
                rulePatterns,
                createdAt: new Date(),
                enabled: true,
              });

              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                constraintId,
                constraints: this.qfos.constraintEngine.getConstraints().map(c => ({
                  id: c.id,
                  name: c.id.replace(/-/g, ' ').toUpperCase(),
                  desc: c.description,
                  severity: c.severity,
                  enabled: c.enabled !== false,
                  rulePatterns: c.rulePatterns || [],
                })),
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to add constraint.' }));
            }
          });
          return;
        }

        if (url === '/api/constraint/toggle' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { id, enabled } = payload;
              if (!id || enabled === undefined) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing id or enabled.' }));
                return;
              }
              const success = this.qfos.constraintEngine.toggleConstraint(id, enabled);
              res.writeHead(200);
              res.end(JSON.stringify({
                success,
                constraints: this.qfos.constraintEngine.getConstraints().map(c => ({
                  id: c.id,
                  name: c.id.replace(/-/g, ' ').toUpperCase(),
                  desc: c.description,
                  severity: c.severity,
                  enabled: c.enabled !== false,
                  rulePatterns: c.rulePatterns || [],
                })),
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to toggle constraint.' }));
            }
          });
          return;
        }

        if (url === '/api/selfstudy/knowledge' && method === 'GET') {
          try {
            const kbPath = path.join(process.cwd(), 'data', 'self_study_knowledge.json');
            let kb = [];
            if (fs.existsSync(kbPath)) {
              kb = JSON.parse(fs.readFileSync(kbPath, 'utf8'));
            }
            res.writeHead(200);
            res.end(JSON.stringify(kb));
          } catch (err) {
            const error = err as Error;
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message || 'Failed to fetch knowledge.' }));
          }
          return;
        }

        if (url === '/api/selfstudy/learn' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const { query } = payload;
              if (!query) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing query.' }));
                return;
              }
              const result = await this.qfos.chatEngine.performOnlineStudy(query);
              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                sources: result.sources,
                combinedContext: result.combinedContext,
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to perform study.' }));
            }
          });
          return;
        }

        if (url === '/api/brain/document' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const { title, topic, format } = payload;
              if (!title || !topic) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing title or topic.' }));
                return;
              }
              const docResult = await this.qfos.brainKernel.generateAutonomousDocument(
                title,
                topic,
                format ?? 'markdown'
              );
              res.writeHead(200);
              res.end(JSON.stringify(docResult));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to generate document.' }));
            }
          });
          return;
        }

        if (url === '/api/brain/code' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const { filename, requirements, language } = payload;
              if (!filename || !requirements) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing filename or requirements.' }));
                return;
              }
              const codeResult = await this.qfos.brainKernel.generateSelfConstrainedCode(
                filename,
                requirements,
                language ?? 'typescript'
              );
              res.writeHead(200);
              res.end(JSON.stringify(codeResult));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to synthesize code.' }));
            }
          });
          return;
        }

        if (url === '/api/brain/video' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const { videoTitle, topic, durationSeconds, imageUrl, motionPrompt, style, motionIntensity } = payload;
              if (!videoTitle || (!topic && !imageUrl)) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing videoTitle, or missing both topic and imageUrl.' }));
                return;
              }
              const videoResult = await this.qfos.brainKernel.compileCinematicMedia(
                videoTitle,
                topic || motionPrompt || "",
                durationSeconds ? Number(durationSeconds) : 60,
                imageUrl,
                motionPrompt,
                style,
                motionIntensity ? Number(motionIntensity) : undefined
              );
              res.writeHead(200);
              res.end(JSON.stringify(videoResult));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to compile storyboard.' }));
            }
          });
          return;
        }

        if (url === '/api/brain/harmonize' && method === 'POST') {
          req.on('data', () => {});
          req.on('end', async () => {
            try {
              const result = await this.qfos.brainKernel.harmonizePhilosophicalSchisms();
              res.writeHead(200);
              res.end(JSON.stringify(result));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to harmonize.' }));
            }
          });
          return;
        }

        if (url === '/api/simulator/consensus' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const { topic, chaosParameters } = payload;
              if (!topic || !chaosParameters) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing topic or chaosParameters.' }));
                return;
              }
              const result = await this.qfos.brainKernel.simulateInterAgentConsensus(
                topic,
                chaosParameters
              );
              res.writeHead(200);
              res.end(JSON.stringify(result));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to simulate consensus.' }));
            }
          });
          return;
        }

        if (url === '/api/chat/config' && method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            systemPrompt: this.qfos.chatEngine.getCurrentSystemPrompt(),
            systemPromptVersion: this.qfos.chatEngine.getSystemPromptVersion(),
            selectedModel: this.qfos.chatEngine.getSelectedModel(),
          }));
          return;
        }

        if (url === '/api/tunnel' && method === 'GET') {
          const tunnelPath = path.join(this.dashboardPath, 'tunnel.json');
          if (fs.existsSync(tunnelPath)) {
            fs.readFile(tunnelPath, 'utf8', (err, data) => {
              if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to read tunnel configuration.' }));
              } else {
                res.writeHead(200);
                res.end(data);
              }
            });
          } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Tunnel configuration not ready yet.' }));
          }
          return;
        }

        if (url === '/api/chat' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const payload = JSON.parse(body);
              const { sessionId, message, model, ethicalMode } = payload;
              if (!sessionId || !message) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing sessionId or message.' }));
                return;
              }
              if (model) {
                this.qfos.chatEngine.selectModel(model);
              }
              const session = await this.qfos.chatEngine.processChat(sessionId, message, ethicalMode);
              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                session,
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to process chat.' }));
            }
          });
          return;
        }

        if (url === '/api/chat/rate' && method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { sessionId, rating, comment } = payload;
              if (!sessionId || !rating) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Missing sessionId or rating.' }));
                return;
              }
              this.qfos.chatEngine.rateSession(sessionId, rating, comment);
              const session = this.qfos.chatEngine.getSessions().find(s => s.id === sessionId);
              res.writeHead(200);
              res.end(JSON.stringify({
                success: true,
                session,
              }));
            } catch (err) {
              const error = err as Error;
              res.writeHead(500);
              res.end(JSON.stringify({ error: error.message || 'Failed to rate session.' }));
            }
          });
          return;
        }

        if (url === '/api/chat/clear' && method === 'POST') {
          try {
            this.qfos.chatEngine.clearHistory();
            res.writeHead(200);
            res.end(JSON.stringify({ success: true }));
          } catch (err) {
            const error = err as Error;
            res.writeHead(500);
            res.end(JSON.stringify({ error: error.message || 'Failed to clear chat history.' }));
          }
          return;
        }

        if (url === '/api/chat/sessions' && method === 'GET') {
          res.writeHead(200);
          res.end(JSON.stringify({
            sessions: this.qfos.chatEngine.getSessions(),
          }));
          return;
        }

        // --- STATIC FILES SERVING ---
        if (method === 'GET') {
          let filePath: string;
          let baseAllowedPath: string;

          if (url.startsWith('/data/')) {
            baseAllowedPath = path.join(process.cwd(), 'data');
            // Remove the '/data/' prefix to locate the file under the root 'data/' directory
            const relativePath = url.substring(6);
            filePath = path.join(baseAllowedPath, relativePath);
          } else {
            baseAllowedPath = this.dashboardPath;
            filePath = path.join(this.dashboardPath, url === '/' ? 'index.html' : url);
          }
          
          // Basic directory traversal protection
          if (!filePath.startsWith(baseAllowedPath)) {
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
