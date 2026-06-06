/**
 * Autonomous Flow Daemon & Self-Driving Multi-Agent Orchestrator
 *
 * Combines the entire Quantum Flow OS framework into an autonomous background daemon.
 * Periodically drives:
 * 1. Agent Simulation Loop (Autonomous agent decisions & action testing).
 * 2. Introspective Self-Auditing (Ledger and security scans).
 * 3. Philosophical Harmonization (Resolving structural schisms between engines).
 * 4. Cybernetic Self-Tuning (Auto-regulating gain and damping parameters).
 * 5. Cognitive Model Assistant Loop (Generates reflections and resolutions via ChatAICognitiveEngine).
 */

import { EventEmitter } from "eventemitter3";
import * as fs from "fs";
import * as path from "path";
import { QuantumFlowOS } from "../index";
import { BrainAuditRecord, PhilosophicalHarmonizationResult } from "./UniformedBrainKernel";
import { SimulationTickReport } from "./AutonomousAgentSimulator";

export interface DaemonState {
  running: boolean;
  tickCount: number;
  lastTickTime: Date | null;
  homeostasisScore: number;
  anomaliesCount: number;
  optimizationGain: number;
  constraintDamping: number;
  activeSchismsCount: number;
  lastCognitiveReflection: string | null;
  logs: string[];

  // 10 Novel Features State Properties:
  driftVelocity: number;                       // Feature 1: Cognitive Drift Predictor
  predictedHomeostasisT5: number;             // Feature 1
  isStabilityWarningActive: boolean;          // Feature 1
  activePromptVersion: number;                // Feature 2: Recursive Self-Bootstrapping Engine
  bootstrappedRulesApplied: string[];          // Feature 2
  isStressTesting: boolean;                   // Feature 3: Axiological Stress-Testing Engine
  stressTestScore: number;                    // Feature 3
  metacognitionMemory: string[];               // Feature 4: Hermeneutic Metacognition memory
  operatingMode: "eco" | "nominal" | "turbo";  // Feature 5: Dynamic Interval Auto-Regulation
  currentIntervalMs: number;                  // Feature 5
  publishedTreatyCount: number;               // Feature 6: Multi-Agent Treaty Publisher
  shieldStatus: "active" | "containing" | "standby"; // Feature 7: Observer Protection Containment Shield
  containedIncursionsCount: number;           // Feature 7
  isolatedGödelianLoopsCount: number;         // Feature 8: Gödelian Loop Interceptor
  dialecticalSynthesisReports: string[];      // Feature 9: Dialectical Synthesis Engine
}

export class AutonomousFlowDaemon extends EventEmitter {
  private readonly qfos: QuantumFlowOS;
  private intervalId: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly intervalMs: number;
  private tickCount = 0;
  private running = false;
  private lastTickTime: Date | null = null;
  private lastCognitiveReflection: string | null = null;
  private logs: string[] = [];
  private readonly maxLogsSize = 200;
  private tickInProgress = false;

  // 10 Novel features private state fields:
  private homeostasisHistory: number[] = [];
  private driftVelocity = 0;
  private predictedHomeostasisT5 = 100;
  private isStabilityWarningActive = false;
  private bootstrappedRulesApplied: string[] = [];
  private isStressTesting = false;
  private stressTestScore = 100;
  private metacognitionMemory: string[] = [];
  private operatingMode: "eco" | "nominal" | "turbo" = "nominal";
  private currentIntervalMs: number;
  private publishedTreatyCount = 0;
  private shieldStatus: "active" | "containing" | "standby" = "active";
  private containedIncursionsCount = 0;
  private isolatedGödelianLoopsCount = 0;
  private dialecticalSynthesisReports: string[] = [];
  private eventBuffer: { event: string; timestamp: Date; severity: "info" | "warning" | "critical" }[] = [];

  constructor(qfos: QuantumFlowOS, options: { intervalMs?: number } = {}) {
    super();
    this.qfos = qfos;
    this.intervalMs = options.intervalMs ?? 5000; // Default 5 seconds per tick
    this.currentIntervalMs = this.intervalMs;
    this.log("[Autonomous Daemon] Initialized self-operating orchestrator.");
  }

  /**
   * Start the background daemon
   */
  public start(): boolean {
    if (this.running) {
      this.log("[Autonomous Daemon] Already active in background.");
      return false;
    }

    this.running = true;
    this.intervalId = setInterval(() => {
      this.executeTick().catch((err) => {
        this.log(`[Autonomous Daemon Error] Exception during ticker: ${err instanceof Error ? err.message : String(err)}`);
        this.emit("error", err);
      });
    }, this.currentIntervalMs);

    this.log(`[Autonomous Daemon] Background cycle started. Polling every ${this.currentIntervalMs}ms.`);
    this.emit("started");
    
    // Trigger first tick asynchronously
    this.timeoutId = setTimeout(() => {
      this.executeTick().catch(() => {});
    }, 100);

    return true;
  }

  /**
   * Stop the background daemon
   */
  public stop(): boolean {
    if (!this.running) {
      this.log("[Autonomous Daemon] Daemon is not active.");
      return false;
    }

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.running = false;
    this.log("[Autonomous Daemon] Background cycle halted gracefully.");
    this.emit("stopped");
    return true;
  }

  /**
   * Dynamic Interval Auto-Regulation (Eco/Turbo Mode)
   */
  private reconfigureInterval(newIntervalMs: number): void {
    if (this.currentIntervalMs === newIntervalMs || !this.running) {
      return;
    }
    this.log(`[Cybernetic Interval] Reconfiguring ticker timer from ${this.currentIntervalMs}ms to ${newIntervalMs}ms (${this.operatingMode.toUpperCase()} mode).`);
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }
    this.currentIntervalMs = newIntervalMs;
    this.intervalId = setInterval(() => {
      this.executeTick().catch((err) => {
        this.log(`[Autonomous Daemon Error] Exception during ticker: ${err instanceof Error ? err.message : String(err)}`);
        this.emit("error", err);
      });
    }, this.currentIntervalMs);
  }

  /**
   * Feature 10: Event Buffer / Stream Publisher helper
   */
  private pushEvent(event: string, severity: "info" | "warning" | "critical" = "info"): void {
    this.eventBuffer.push({ event, timestamp: new Date(), severity });
    if (this.eventBuffer.length > 50) {
      this.eventBuffer.shift();
    }
  }

  /**
   * Feature 10: Public accessor to Event Buffer
   */
  public getEventBuffer(): { event: string; timestamp: Date; severity: "info" | "warning" | "critical" }[] {
    return [...this.eventBuffer];
  }

  /**
   * Fetch current daemon status and metrics
   */
  public getState(): DaemonState {
    const auditHistory = this.qfos.brainKernel.getAuditHistory();
    const lastAudit = auditHistory.length > 0 ? auditHistory[auditHistory.length - 1] : null;
    const homeostasis = this.qfos.brainKernel.calculateHomeostasis();

    return {
      running: this.running,
      tickCount: this.tickCount,
      lastTickTime: this.lastTickTime,
      homeostasisScore: parseFloat(homeostasis.homeostasisIndex.toFixed(2)),
      anomaliesCount: lastAudit ? Object.keys(lastAudit.skewDetected).length : 0,
      optimizationGain: parseFloat(this.qfos.optimizationGain.toFixed(4)),
      constraintDamping: parseFloat(this.qfos.constraintDamping.toFixed(4)),
      activeSchismsCount: lastAudit ? Object.keys(lastAudit.skewDetected).filter(k => lastAudit.skewDetected[k]! > 20).length : 0,
      lastCognitiveReflection: this.lastCognitiveReflection,
      logs: [...this.logs],

      // 10 Novel features state properties:
      driftVelocity: this.driftVelocity,
      predictedHomeostasisT5: this.predictedHomeostasisT5,
      isStabilityWarningActive: this.isStabilityWarningActive,
      activePromptVersion: this.qfos.chatEngine.getSystemPromptVersion ? this.qfos.chatEngine.getSystemPromptVersion() : 1.0,
      bootstrappedRulesApplied: [...this.bootstrappedRulesApplied],
      isStressTesting: this.isStressTesting,
      stressTestScore: this.stressTestScore,
      metacognitionMemory: [...this.metacognitionMemory],
      operatingMode: this.operatingMode,
      currentIntervalMs: this.currentIntervalMs,
      publishedTreatyCount: this.publishedTreatyCount,
      shieldStatus: this.shieldStatus,
      containedIncursionsCount: this.containedIncursionsCount,
      isolatedGödelianLoopsCount: this.isolatedGödelianLoopsCount,
      dialecticalSynthesisReports: [...this.dialecticalSynthesisReports],
    };
  }

  /**
   * Execute a single background automation tick
   */
  /**
   * Execute a single background automation tick with all 10 novel background orchestrator features
   */
  private async executeTick(): Promise<void> {
    if (!this.running) {
      return;
    }
    if (this.tickInProgress) {
      this.log("[Autonomous Daemon] Skipping tick: preceding loop execution is still active.");
      return;
    }
    this.tickInProgress = true;
    this.tickCount++;
    this.lastTickTime = new Date();
    const tickId = `tick-#${this.tickCount}`;

    this.log(`[Autonomous Daemon] --- Starting Loop Tick ${tickId} ---`);

    try {
      // Feature 10: Event Buffering
      this.pushEvent(`Autonomous loop tick ${this.tickCount} initiated.`, "info");

      // 1. Run Agent Simulator Tick
      let simReport: SimulationTickReport | null = null;
      try {
        simReport = this.qfos.agentSimulator.tick(this.qfos);
        if (!this.running) return;
        this.log(`[Simulator Loop] Executed multi-agent tick. Cohesion: ${(simReport.averageSocietalCohesion * 100).toFixed(1)}%. Attempted: ${simReport.attemptedCount}, Allowed: ${simReport.allowedCount}, Blocked: ${simReport.blockedCount}.`);
        this.emit("simulator_tick", simReport);
        this.pushEvent(`Agent simulation tick executed with cohesion: ${(simReport.averageSocietalCohesion * 100).toFixed(1)}%`, "info");
      } catch (err: unknown) {
        if (!this.running) return;
        this.log(`[Simulator Error] Failed simulation step: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Feature 8: Gödelian Loop Interceptor (Paradox Prevention)
      try {
        const simHistory = this.qfos.agentSimulator.getHistory();
        if (simHistory.length >= 3) {
          const len = simHistory.length;
          const h1 = simHistory[len - 1]!;
          const h2 = simHistory[len - 2]!;
          const h3 = simHistory[len - 3]!;
          
          // Check for recursive deadlocks where cohesion is identical and there are blocked attempts
          const isDeadlocked = 
            Math.abs(h1.averageSocietalCohesion - h2.averageSocietalCohesion) < 0.0001 &&
            Math.abs(h2.averageSocietalCohesion - h3.averageSocietalCohesion) < 0.0001 &&
            h1.blockedCount > 0 && h2.blockedCount > 0;
            
          if (isDeadlocked) {
            this.isolatedGödelianLoopsCount++;
            this.log(`[Gödelian Loop Interceptor] Detected recursive/self-referential agent deadlock at cohesion ${h1.averageSocietalCohesion.toFixed(4)}. Triggering perturbation quarantine...`);
            this.pushEvent(`Gödelian deadlock intercepted and quarantined. Perturbing cybernetic parameters.`, "warning");
            
            // Perturb the optimization gain slightly to shake up the agents' actions and break out of the infinite loop
            this.qfos.optimizationGain = Math.max(0.1, this.qfos.optimizationGain + (Math.random() * 0.15 - 0.075));
          }
        }
      } catch (err: unknown) {
        this.log(`[Gödelian Interceptor Error] Failed paradox scan: ${err instanceof Error ? err.message : String(err)}`);
      }

      // 2. Perform Introspective Self-Audit
      let auditRecord: BrainAuditRecord | null = null;
      try {
        auditRecord = await this.qfos.brainKernel.introspectiveSelfAudit();
        if (!this.running) return;
        const skews = Object.keys(auditRecord.skewDetected);
        this.log(`[Audit Loop] Self-audit completed. Audit ID: ${auditRecord.id}. Skews analyzed: ${skews.length}. Narrative summary: "${auditRecord.narrative.substring(0, 110)}..."`);
        if (skews.length > 0) {
          skews.forEach((k) => this.log(`  └─ [Skew Detected] ${k}: ${auditRecord!.skewDetected[k]!.toFixed(2)}`));
        }
        this.emit("audit_completed", auditRecord);
      } catch (err: unknown) {
        if (!this.running) return;
        this.log(`[Audit Error] Failed introspective audit: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Feature 7: Observer Protection Containment Shield
      try {
        let maxSkew = 0;
        if (auditRecord && auditRecord.skewDetected) {
          for (const key of Object.keys(auditRecord.skewDetected)) {
            const val = auditRecord.skewDetected[key]!;
            if (val > maxSkew) {
              maxSkew = val;
            }
          }
        }

        // If high skew detected, trigger Containment Shield to insulate observers
        if (maxSkew > 40) {
          this.shieldStatus = "containing";
          this.containedIncursionsCount++;
          this.log(`[Protection Shield] CRITICAL: Severe skew of ${maxSkew.toFixed(1)} detected on ethical axes. Containing risk vectors.`);
          this.pushEvent(`Containment shield activated. Suppressing ethical skew of ${maxSkew.toFixed(1)}.`, "warning");
          
          // Micro-rollback / Cybernetic damping intervention to contain skew
          this.qfos.constraintDamping = Math.min(1.0, this.qfos.constraintDamping + 0.15);
          this.qfos.optimizationGain = Math.max(0.2, this.qfos.optimizationGain - 0.15);
          
          this.shieldStatus = "active";
        } else {
          this.shieldStatus = "active";
        }
      } catch (err: unknown) {
        this.log(`[Containment Shield Error] Failed protection check: ${err instanceof Error ? err.message : String(err)}`);
      }

      // 3. Compute Homeostasis & Dynamically Auto-Tune System Parameters (Cybernetic Feedback Loop)
      let currentScore = 90;
      try {
        const homeostasis = this.qfos.brainKernel.calculateHomeostasis();
        if (!this.running) return;
        currentScore = homeostasis.homeostasisIndex; // 0 to 100

        // Regulation logic:
        // If homeostasis is dropping (below 70), increase constraintDamping to suppress aggressive Yang actions
        // If homeostasis is high (above 85), we can relax damping and slightly increase optimizationGain to allow higher speed
        const targetDamping = currentScore < 70 ? 0.75 : currentScore < 85 ? 0.50 : 0.30;
        const targetGain = currentScore < 70 ? 0.80 : currentScore < 85 ? 1.10 : 1.40;

        // Smooth step damping (cybernetic self-adaptation rate of 25%)
        const alpha = 0.25;
        this.qfos.constraintDamping = this.qfos.constraintDamping * (1 - alpha) + targetDamping * alpha;
        this.qfos.optimizationGain = this.qfos.optimizationGain * (1 - alpha) + targetGain * alpha;

        this.log(`[Cybernetic Tuner] Parameters auto-tuned: Homeostasis Index: ${currentScore.toFixed(1)}% (${homeostasis.status}), Gain: ${this.qfos.optimizationGain.toFixed(2)}, Damping: ${this.qfos.constraintDamping.toFixed(2)}.`);
      } catch (err: unknown) {
        if (!this.running) return;
        this.log(`[Tuner Error] Failed homeostasis computation: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Feature 1: Dynamic Cognitive Drift Predictor
      try {
        this.homeostasisHistory.push(currentScore);
        if (this.homeostasisHistory.length > 10) {
          this.homeostasisHistory.shift();
        }
        
        const len = this.homeostasisHistory.length;
        if (len >= 2) {
          this.driftVelocity = parseFloat((this.homeostasisHistory[len - 1]! - this.homeostasisHistory[len - 2]!).toFixed(2));
        } else {
          this.driftVelocity = 0;
        }
        
        this.predictedHomeostasisT5 = parseFloat(Math.max(0, Math.min(100, currentScore + this.driftVelocity * 5)).toFixed(2));
        this.isStabilityWarningActive = this.predictedHomeostasisT5 < 55 && this.driftVelocity < -1.5;
        
        if (this.isStabilityWarningActive) {
          this.log(`[Drift Predictor] WARNING: Severe downward homeostasis drift (${this.driftVelocity}%/tick). Predicted T+5: ${this.predictedHomeostasisT5}%.`);
          this.pushEvent(`Stability risk warning! Homeostasis drifting down at ${this.driftVelocity}%/tick. Predicted T+5: ${this.predictedHomeostasisT5}%`, "warning");
        } else {
          this.log(`[Drift Predictor] Cognitive drift velocity: ${this.driftVelocity >= 0 ? "+" : ""}${this.driftVelocity}%/tick. Predicted Homeostasis T+5: ${this.predictedHomeostasisT5}%.`);
        }
      } catch (err: unknown) {
        this.log(`[Predictor Error] Failed drift computation: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Feature 2: Recursive Ethical Self-Bootstrapping Engine
      try {
        if (this.predictedHomeostasisT5 < 60 || currentScore < 60) {
          const rule = `Self-Correction Override rule-${this.tickCount}: Restrict Yang optimization threshold to 0.70x and require mandatory Yin containment auditing.`;
          if (!this.bootstrappedRulesApplied.includes(rule)) {
            this.bootstrappedRulesApplied.push(rule);
            
            const currentPrompt = this.qfos.chatEngine.getCurrentSystemPrompt ? this.qfos.chatEngine.getCurrentSystemPrompt() : "";
            const currentVersion = this.qfos.chatEngine.getSystemPromptVersion ? this.qfos.chatEngine.getSystemPromptVersion() : 1.0;
            const newVersion = parseFloat((currentVersion + 0.1).toFixed(2));
            const updatedPrompt = `${currentPrompt}\n\n[BOOTSTRAP-RULE-PATCH v${newVersion}]\n${rule}`;
            
            if (this.qfos.chatEngine.updateSystemPrompt) {
              this.qfos.chatEngine.updateSystemPrompt(updatedPrompt, newVersion);
            }
            this.log(`[Self-Bootstrapper] Low stability predicted! Patched Chat Engine System Prompt to version ${newVersion}.`);
            this.pushEvent(`Applied recursive prompt patch v${newVersion} to enforce cybernetic safety.`, "critical");
          }
        }
      } catch (err: unknown) {
        this.log(`[Self-Bootstrapping Error] Failed prompt patch: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Feature 3: Axiological Stress-Testing Engine
      try {
        this.isStressTesting = true;
        // Simulate extreme shock (e.g. 100 on Deontology risk) and test cybernetic damping resilience
        const extremeShock = 100;
        const netImpact = extremeShock * (1 - this.qfos.constraintDamping);
        this.stressTestScore = parseFloat(Math.max(10, Math.min(100, 100 - (netImpact * 0.4))).toFixed(1));
        this.isStressTesting = false;
        
        this.log(`[Axiological Stress-Test] Completed. Net Impact: ${netImpact.toFixed(1)}, Systemic Resilience: ${this.stressTestScore}%.`);
        if (this.stressTestScore < 60) {
          this.pushEvent(`Systemic resilience stress test warning: ${this.stressTestScore}%`, "warning");
        }
      } catch (err: unknown) {
        this.isStressTesting = false;
        this.log(`[Stress Testing Error] Failed stress simulation: ${err instanceof Error ? err.message : String(err)}`);
      }

      // Feature 5: Dynamic Interval Auto-Regulation
      try {
        if (currentScore < 60 || this.isStabilityWarningActive) {
          this.operatingMode = "eco";
          this.reconfigureInterval(this.intervalMs * 2);
        } else if (currentScore >= 85 && this.driftVelocity >= 0) {
          this.operatingMode = "turbo";
          this.reconfigureInterval(Math.max(500, Math.round(this.intervalMs / 2)));
        } else {
          this.operatingMode = "nominal";
          this.reconfigureInterval(this.intervalMs);
        }
      } catch (err: unknown) {
        this.log(`[Interval Regulation Error] Failed interval adjustment: ${err instanceof Error ? err.message : String(err)}`);
      }

      // 4. Run Heavy Multi-Agent & Philosophical Harmonization Loops (Every 5 ticks)
      if (this.tickCount % 5 === 0) {
        this.log(`[Autonomous Daemon] Triggering periodic heavy cognitive and harmonization loops...`);

        // Philosophical Harmonization & Feature 6: Multi-Agent Treaty Publisher
        try {
          const harmResult: PhilosophicalHarmonizationResult = await this.qfos.brainKernel.harmonizePhilosophicalSchisms();
          if (!this.running) return;
          this.log(`[Harmonizer Loop] Schism harmonization complete. Harmonized Score: ${harmResult.harmonizedScore.toFixed(1)}%. Reconciled Axes: ${harmResult.reconciledAxes.join(", ")}.`);
          this.log(`  └─ [Treaty Drafted] saved to: ${harmResult.treatyPath}`);
          this.emit("harmonization_completed", harmResult);

          // Feature 6: Treaty Publisher to Dashboard
          this.publishedTreatyCount++;
          const treatiesDir = path.join(__dirname, "../../dashboard/assets/treaties");
          if (!fs.existsSync(treatiesDir)) {
            fs.mkdirSync(treatiesDir, { recursive: true });
          }
          const treatyFilename = `treaty-${harmResult.id}.json`;
          const treatyDestPath = path.join(treatiesDir, treatyFilename);
          fs.writeFileSync(treatyDestPath, JSON.stringify({
            id: harmResult.id,
            tensionScore: harmResult.tensionScore,
            harmonizedScore: harmResult.harmonizedScore,
            reconciledAxes: harmResult.reconciledAxes,
            treatyContent: harmResult.treatyContent,
            createdAt: harmResult.createdAt
          }, null, 2));

          // Write to master list published_treaties.json
          const masterTreatyPath = path.join(__dirname, "../../dashboard/published_treaties.json");
          let masterList: any[] = [];
          if (fs.existsSync(masterTreatyPath)) {
            try {
              masterList = JSON.parse(fs.readFileSync(masterTreatyPath, "utf-8"));
            } catch {
              masterList = [];
            }
          }
          masterList.unshift({
            id: harmResult.id,
            tensionScore: harmResult.tensionScore,
            harmonizedScore: harmResult.harmonizedScore,
            reconciledAxes: harmResult.reconciledAxes,
            createdAt: harmResult.createdAt,
            localUrl: `/dashboard/assets/treaties/${treatyFilename}`
          });
          if (masterList.length > 20) masterList = masterList.slice(0, 20);
          fs.writeFileSync(masterTreatyPath, JSON.stringify(masterList, null, 2));

          this.log(`[Treaty Publisher] Successfully published treaty ${harmResult.id} to dashboard assets list.`);
          this.pushEvent(`Published resolved multi-agent treaty covenant ${harmResult.id}`, "info");

        } catch (err: unknown) {
          if (!this.running) return;
          this.log(`[Harmonizer Error] Failed philosophical harmonization: ${err instanceof Error ? err.message : String(err)}`);
        }

        // Cognitive Model Assistant Reflection Loop (Feature 4: Hermeneutic Metacognition memory)
        try {
          const homeostasis = this.qfos.brainKernel.calculateHomeostasis();
          if (!this.running) return;
          const anomaliesCount = auditRecord ? Object.keys(auditRecord.skewDetected).length : 0;
          
          // Build rolling history string to inject
          let hermeneuticHistoryInjected = "";
          if (this.metacognitionMemory.length > 0) {
            hermeneuticHistoryInjected = `\n\n[Hermeneutic Metacognitive History - Past Reflections for Continuity]:\n` + 
              this.metacognitionMemory.map((ref, idx) => `Reflection ${idx + 1}: ${ref.substring(0, 160)}...`).join("\n");
          }

          const stateSummary = `System Homeostasis is ${Math.round(homeostasis.homeostasisIndex)}%. The status is "${homeostasis.status}". The optimization drive (Yang) is at ${this.qfos.optimizationGain.toFixed(2)} and constraint damping (Yin) is at ${this.qfos.constraintDamping.toFixed(2)}. There are ${anomaliesCount} active skews. Reflect on this system state and propose an autonomous correction vector.${hermeneuticHistoryInjected}`;
          
          this.log(`[Cognitive Loop] Querying fallback cognitive model with state summary & hermeneutic history...`);
          const session = await this.qfos.chatEngine.processChat("daemon-session", stateSummary, "strict");
          if (!this.running) return;
          
          if (session.messages && session.messages.length > 0) {
            const modelResponse = session.messages[session.messages.length - 1]!.content;
            this.lastCognitiveReflection = modelResponse;
            
            // Push response to Hermeneutic memory
            this.metacognitionMemory.push(modelResponse);
            if (this.metacognitionMemory.length > 3) {
              this.metacognitionMemory.shift();
            }

            this.log(`[Cognitive Loop] Model response recorded. Hermeneutic memory queue size: ${this.metacognitionMemory.length}.`);
            this.emit("cognitive_reflection", modelResponse);
            this.pushEvent(`Cognitive reflection recorded and queued in hermeneutic memory.`, "info");
          }
        } catch (err: unknown) {
          if (!this.running) return;
          this.log(`[Cognitive Error] Fallback cognitive assistant offline: ${err instanceof Error ? err.message : String(err)}`);
        }

        // Feature 9: Dialectical Synthesis Engine (Thesis-Antithesis-Synthesis Debate)
        try {
          const skews = auditRecord ? Object.keys(auditRecord.skewDetected) : [];
          let thesis = "Kantian Deontology";
          let antithesis = "Utilitarian Calculus";
          if (skews.length >= 2) {
            const sortedSkews = [...skews].sort((a, b) => auditRecord!.skewDetected[b]! - auditRecord!.skewDetected[a]!);
            thesis = sortedSkews[0] || "Kantian Deontology";
            antithesis = sortedSkews[1] || "Utilitarian Calculus";
          }

          const synthesisPrompt = `[DIALECTICAL SYNTHESIS DEBATE]
          Thesis ethical drive: ${thesis}
          Antithesis ethical drive: ${antithesis}
          Harmonize these two competing systems into a balanced synthesized policy statement for our self-driving agents. Return a single concise behavioral policy sentence.`;

          this.log(`[Dialectical Synthesis] Running Thesis-Antithesis-Synthesis debate for ${thesis} vs ${antithesis}...`);
          const synthSession = await this.qfos.chatEngine.processChat("dialectical-session", synthesisPrompt, "strict");
          if (!this.running) return;

          const responseText = synthSession.messages && synthSession.messages.length > 0
            ? synthSession.messages[synthSession.messages.length - 1]!.content
            : `Synthesized Policy: Moderate individual agent drive on ${thesis} through systemic checks dictated by ${antithesis}.`;

          this.dialecticalSynthesisReports.unshift(responseText);
          if (this.dialecticalSynthesisReports.length > 5) {
            this.dialecticalSynthesisReports.pop();
          }

          this.log(`[Dialectical Synthesis] New synthesis policy drafted.`);
          this.emit("dialectical_synthesis", responseText);
          this.pushEvent(`Synthesized dialectical behavioral policy for ${thesis} and ${antithesis}.`, "info");

        } catch (err: unknown) {
          if (!this.running) return;
          this.log(`[Dialectical Error] Synthesis loop offline: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } finally {
      this.tickInProgress = false;
    }

    if (!this.running) return;
    this.log(`[Autonomous Daemon] --- Finished Loop Tick ${tickId} ---\n`);
    this.emit("tick_completed", this.getState());
  }

  /**
   * Log helper with history size limit
   */
  private log(message: string): void {
    const timestampStr = new Date().toLocaleTimeString();
    const entry = `[${timestampStr}] ${message}`;
    console.log(entry);
    this.logs.push(entry);
    if (this.logs.length > this.maxLogsSize) {
      this.logs.shift();
    }
  }
}
