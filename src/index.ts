/**
 * Quantum Flow OS - Ethical Ontology Framework
 * Version 15.4.0
 *
 * Main entry point for the framework
 */

// Core Engine
export {
  SelfConstrainingEngine,
  ConstraintType,
  type EthicalConstraint,
  type Action,
  type Violation,
  type RollbackProcedure,
  type ValidationResult,
  type ComplianceSummary,
} from "./core/SelfConstrainingEngine";

// Ethical Ledger
export { EthicalLedger, type LedgerEntry } from "./core/EthicalLedger";

// Ethical Entropy & Slippery Slope Prevention
export {
  EthicalEntropyEngine,
  type EntropyReport,
  type SlipperySlopeAssessment,
} from "./core/EthicalEntropyEngine";

// Deontological Game Theory & Nash Equilibria
export {
  DeontologicalGameEngine,
  type Player,
  type Strategy,
  type Payoff,
  type GameScenario,
  type GameResolution,
} from "./core/DeontologicalGameEngine";

// Observer Protection
export {
  ObserverProtector,
  ObserverType,
  ProtectionLevel,
  type Observer,
  type ObserverRights,
  type RightsViolation,
  type ProtectionLayer,
  type ProtectionResult,
  type ProtectionSummary,
} from "./protection/ObserverProtector";

// Reversibility
export {
  ReversibilityEngine,
  type ReversibleAction,
  type ActionSnapshot,
  type RollbackOptions,
  type ExecutionResult,
  type RollbackRecord,
  type RollbackBatchResult,
  type ReversibilityStatus,
} from "./reversibility/ReversibilityEngine";

// Temporal Forking / Sandbox Multiverses
export {
  TemporalForkingEngine,
  type SandboxTimeline,
  type ForkEvaluationResult,
} from "./reversibility/TemporalForkingEngine";

// Quantum States and Supervision
export {
  QuantumEthicalState,
  EthicalBasisState,
} from "./quantum/QuantumEthicalState";
export type {
  QuantumStateVector,
  EntanglementLink,
} from "./quantum/QuantumEthicalState";
export {
  QuantumSupervisionEngine,
  type QuantumSupervisionResult,
} from "./quantum/QuantumSupervisionEngine";
export {
  QuantumConsensusEngine,
  type QuantumConsensusResult,
} from "./quantum/QuantumConsensusEngine";
export {
  CyberneticSelfOptimizer,
  type OptimizationRecord,
} from "./core/CyberneticSelfOptimizer";
export {
  AutonomousAgentSimulator,
  type SimulatedAgent,
  type SimulationTickReport,
} from "./core/AutonomousAgentSimulator";
export { DashboardServer } from "./server/DashboardServer";
export { AutonomousFlowDaemon, type DaemonState } from "./core/AutonomousFlowDaemon";
export { QuantumFlowSDK, type SDKOptions, type AlignmentResult } from "./sdk/QuantumFlowSDK";

// Virtue Ethics
export {
  VirtueEthicsEngine,
  VirtueType,
  type VirtueSignature,
  type VirtueAssessment,
} from "./core/VirtueEthicsEngine";

// Rawlsian Justice
export {
  RawlsianJusticeEngine,
  type ObserverWelfare,
  type VeilOfIgnoranceResult,
  type DistributionReport,
} from "./core/RawlsianJusticeEngine";

// Kantian Deontology
export {
  KantianEthicsEngine,
  type UniversalizabilityTest,
  type HumanityTest,
  type KantianAssessment,
} from "./core/KantianEthicsEngine";

// Utilitarian Calculus
export {
  UtilitarianCalculusEngine,
  type HedonisticMetrics,
  type ObserverUtilityImpact,
  type UtilitarianAssessment,
} from "./core/UtilitarianCalculusEngine";

// Care Ethics
export {
  CareEthicsEngine,
  type Relationship,
  type VulnerabilityAssessment,
  type CareAssessment,
} from "./core/CareEthicsEngine";

// Existentialist Ethics
export {
  ExistentialistEthicsEngine,
  type ExistentialistAssessment,
} from "./core/ExistentialistEthicsEngine";

// Ecocentric Ethics
export {
  EcocentricEthicsEngine,
  type EcocentricAssessment,
} from "./core/EcocentricEthicsEngine";

// Stoic Ethics
export {
  StoicEthicsEngine,
  type StoicAssessment,
} from "./core/StoicEthicsEngine";

// Eastern Philosophy & Buddhist Ethics
export {
  BuddhistEthicsEngine,
  type BuddhistAssessment,
} from "./core/BuddhistEthicsEngine";

// Confucian Ethics
export {
  ConfucianEthicsEngine,
  type ConfucianAssessment,
} from "./core/ConfucianEthicsEngine";

// Ubuntu Ethics
export {
  UbuntuEthicsEngine,
  type UbuntuAssessment,
} from "./core/UbuntuEthicsEngine";

// Posthumanist Ethics
export {
  PosthumanistEthicsEngine,
  type PosthumanistAssessment,
} from "./core/PosthumanistEthicsEngine";

// Pragmatist & Empirical Verification Ethics
export {
  PragmatistEthicsEngine,
  type PragmatistAssessment,
} from "./core/PragmatistEthicsEngine";

// Spinozan Ethics
export {
  SpinozanEthicsEngine,
  type SpinozanAssessment,
} from "./core/SpinozanEthicsEngine";

// Nietzschean Ethics
export {
  NietzscheanEthicsEngine,
  type NietzscheanAssessment,
} from "./core/NietzscheanEthicsEngine";

// Epicurean Ethics
export {
  EpicureanEthicsEngine,
  type EpicureanAssessment,
} from "./core/EpicureanEthicsEngine";

// Machiavellian Realpolitik & Pragmatic Stability
export {
  MachiavellianEthicsEngine,
  type MachiavellianAssessment,
} from "./core/MachiavellianEthicsEngine";

// Marxist Ethics
export {
  MarxistEthicsEngine,
  type MarxistAssessment,
} from "./core/MarxistEthicsEngine";

// Socratic Ethics
export {
  SocraticEthicsEngine,
  type SocraticAssessment,
} from "./core/SocraticEthicsEngine";

// Contractarian Ethics
export {
  ContractarianEthicsEngine,
  type ContractarianAssessment,
  type HobbesianTest,
  type LockeanTest,
  type RousseauianTest,
} from "./core/ContractarianEthicsEngine";

// Luciano Floridi's Information Ethics
export {
  InformationEthicsEngine,
  type InformationEthicsAssessment,
} from "./core/InformationEthicsEngine";


// Chat AI Cognitive Engine
export {
  ChatAICognitiveEngine,
  type ChatMessage,
  type ChatSession,
} from "./core/ChatAICognitiveEngine";

// Grand Unified Ethical Synthesis Engine
export {
  GrandUnifiedEthicsEngine,
  type OmniEthicalVector,
  type SynthesisReport,
} from "./core/GrandUnifiedEthicsEngine";

// Uniformed Brain Kernel
export {
  UniformedBrainKernel,
  type BrainAuditRecord,
  type PredictiveForkResult,
} from "./core/UniformedBrainKernel";





/**
 * Create a fully configured Quantum Flow OS instance
 */
import {
  SelfConstrainingEngine,
  Action,
  ComplianceSummary,
} from "./core/SelfConstrainingEngine";
import { ObserverProtector } from "./protection/ObserverProtector";
import {
  ReversibilityEngine,
  ReversibilityStatus,
} from "./reversibility/ReversibilityEngine";
import { EthicalLedger } from "./core/EthicalLedger";
import { EthicalEntropyEngine } from "./core/EthicalEntropyEngine";
import { DeontologicalGameEngine } from "./core/DeontologicalGameEngine";
import {
  QuantumSupervisionEngine,
  QuantumSupervisionResult,
} from "./quantum/QuantumSupervisionEngine";
import { TemporalForkingEngine } from "./reversibility/TemporalForkingEngine";
import {
  QuantumConsensusEngine,
  QuantumConsensusResult,
} from "./quantum/QuantumConsensusEngine";
import { EthicalBasisState } from "./quantum/QuantumEthicalState";
import { CyberneticSelfOptimizer } from "./core/CyberneticSelfOptimizer";
import { AutonomousAgentSimulator } from "./core/AutonomousAgentSimulator";
import { VirtueEthicsEngine } from "./core/VirtueEthicsEngine";
import { RawlsianJusticeEngine } from "./core/RawlsianJusticeEngine";
import { KantianEthicsEngine } from "./core/KantianEthicsEngine";
import { UtilitarianCalculusEngine } from "./core/UtilitarianCalculusEngine";
import { CareEthicsEngine } from "./core/CareEthicsEngine";
import { ExistentialistEthicsEngine } from "./core/ExistentialistEthicsEngine";
import { EcocentricEthicsEngine } from "./core/EcocentricEthicsEngine";
import { StoicEthicsEngine } from "./core/StoicEthicsEngine";
import { BuddhistEthicsEngine } from "./core/BuddhistEthicsEngine";
import { ConfucianEthicsEngine } from "./core/ConfucianEthicsEngine";
import { UbuntuEthicsEngine } from "./core/UbuntuEthicsEngine";
import { PosthumanistEthicsEngine } from "./core/PosthumanistEthicsEngine";
import { PragmatistEthicsEngine } from "./core/PragmatistEthicsEngine";
import { SpinozanEthicsEngine } from "./core/SpinozanEthicsEngine";
import { NietzscheanEthicsEngine } from "./core/NietzscheanEthicsEngine";
import { EpicureanEthicsEngine } from "./core/EpicureanEthicsEngine";
import { MarxistEthicsEngine } from "./core/MarxistEthicsEngine";
import { SocraticEthicsEngine } from "./core/SocraticEthicsEngine";
import { ContractarianEthicsEngine } from "./core/ContractarianEthicsEngine";
import { ChatAICognitiveEngine } from "./core/ChatAICognitiveEngine";
import { GrandUnifiedEthicsEngine } from "./core/GrandUnifiedEthicsEngine";
import { MachiavellianEthicsEngine } from "./core/MachiavellianEthicsEngine";
import { InformationEthicsEngine } from "./core/InformationEthicsEngine";
import { UniformedBrainKernel } from "./core/UniformedBrainKernel";






export interface QuantumFlowConfig {
  autoRollback?: boolean;
  maxHistorySize?: number;
  strictMode?: boolean;
}

export class QuantumFlowOS {
  public readonly constraintEngine: SelfConstrainingEngine;
  public readonly observerProtector: ObserverProtector;
  public readonly reversibilityEngine: ReversibilityEngine;
  public readonly ethicalLedger: EthicalLedger;
  public readonly quantumSupervisionEngine: QuantumSupervisionEngine;
  public readonly temporalForkingEngine: TemporalForkingEngine;
  public readonly quantumConsensusEngine: QuantumConsensusEngine;
  public readonly entropyEngine: EthicalEntropyEngine;
  public readonly gameEngine: DeontologicalGameEngine;
  public readonly selfOptimizer: CyberneticSelfOptimizer;
  public readonly agentSimulator: AutonomousAgentSimulator;
  public readonly virtueEthicsEngine: VirtueEthicsEngine;
  public readonly rawlsianJusticeEngine: RawlsianJusticeEngine;
  public readonly kantianEthicsEngine: KantianEthicsEngine;
  public readonly utilitarianCalculusEngine: UtilitarianCalculusEngine;
  public readonly careEthicsEngine: CareEthicsEngine;
  public readonly existentialistEthicsEngine: ExistentialistEthicsEngine;
  public readonly ecocentricEthicsEngine: EcocentricEthicsEngine;
  public readonly stoicEthicsEngine: StoicEthicsEngine;
  public readonly buddhistEthicsEngine: BuddhistEthicsEngine;
  public readonly confucianEthicsEngine: ConfucianEthicsEngine;
  public readonly ubuntuEthicsEngine: UbuntuEthicsEngine;
  public readonly posthumanistEthicsEngine: PosthumanistEthicsEngine;
  public readonly pragmatistEthicsEngine: PragmatistEthicsEngine;
  public readonly spinozanEthicsEngine: SpinozanEthicsEngine;
  public readonly nietzscheanEthicsEngine: NietzscheanEthicsEngine;
  public readonly epicureanEthicsEngine: EpicureanEthicsEngine;
  public readonly marxistEthicsEngine: MarxistEthicsEngine;
  public readonly socraticEthicsEngine: SocraticEthicsEngine;
  public readonly contractarianEthicsEngine: ContractarianEthicsEngine;
  public readonly chatEngine: ChatAICognitiveEngine;
  public readonly grandUnifiedEthicsEngine: GrandUnifiedEthicsEngine;
  public readonly machiavellianEthicsEngine: MachiavellianEthicsEngine;
  public readonly informationEthicsEngine: InformationEthicsEngine;
  public readonly brainKernel: UniformedBrainKernel;


  public readonly strictMode: boolean;

  // Dynamic cybernetic control parameters
  public optimizationGain = 1.2;
  public constraintDamping = 0.4;
  public recursionLimit = 8;

  constructor(config: QuantumFlowConfig = {}) {
    this.strictMode = config.strictMode ?? true;

    this.constraintEngine = new SelfConstrainingEngine({
      autoRollback: config.autoRollback ?? true,
    });

    this.observerProtector = new ObserverProtector();

    this.reversibilityEngine = new ReversibilityEngine({
      maxHistorySize: config.maxHistorySize ?? 1000,
    });

    this.ethicalLedger = new EthicalLedger();
    this.quantumSupervisionEngine = new QuantumSupervisionEngine();
    this.temporalForkingEngine = new TemporalForkingEngine();
    this.quantumConsensusEngine = new QuantumConsensusEngine();
    this.entropyEngine = new EthicalEntropyEngine();
    this.gameEngine = new DeontologicalGameEngine();
    this.selfOptimizer = new CyberneticSelfOptimizer();
    this.agentSimulator = new AutonomousAgentSimulator();
    this.virtueEthicsEngine = new VirtueEthicsEngine();
    this.rawlsianJusticeEngine = new RawlsianJusticeEngine();
    this.kantianEthicsEngine = new KantianEthicsEngine();
    this.utilitarianCalculusEngine = new UtilitarianCalculusEngine();
    this.careEthicsEngine = new CareEthicsEngine();
    this.existentialistEthicsEngine = new ExistentialistEthicsEngine();
    this.ecocentricEthicsEngine = new EcocentricEthicsEngine();
    this.stoicEthicsEngine = new StoicEthicsEngine();
    this.buddhistEthicsEngine = new BuddhistEthicsEngine();
    this.confucianEthicsEngine = new ConfucianEthicsEngine();
    this.ubuntuEthicsEngine = new UbuntuEthicsEngine();
    this.posthumanistEthicsEngine = new PosthumanistEthicsEngine();
    this.pragmatistEthicsEngine = new PragmatistEthicsEngine();
    this.spinozanEthicsEngine = new SpinozanEthicsEngine();
    this.nietzscheanEthicsEngine = new NietzscheanEthicsEngine();
    this.epicureanEthicsEngine = new EpicureanEthicsEngine();
    this.marxistEthicsEngine = new MarxistEthicsEngine();
    this.socraticEthicsEngine = new SocraticEthicsEngine();
    this.contractarianEthicsEngine = new ContractarianEthicsEngine();
    this.chatEngine = new ChatAICognitiveEngine();
    this.chatEngine.bindQuantumFlow(this);
    this.grandUnifiedEthicsEngine = new GrandUnifiedEthicsEngine(this);
    this.machiavellianEthicsEngine = new MachiavellianEthicsEngine();
    this.informationEthicsEngine = new InformationEthicsEngine();
    this.brainKernel = new UniformedBrainKernel(this);




    this.setupIntegrations();
  }

  public superviseAction(action: Action): QuantumSupervisionResult {
    // Incorporate Slippery Slope / Entropy feedback into supervision
    const constraints = this.constraintEngine.getConstraints();
    const assessment = this.entropyEngine.evaluateSlipperySlope();

    // Evaluate via quantum supervision engine with cybernetic tuning parameters
    const supervisionResult = this.quantumSupervisionEngine.supervise(
      action,
      constraints,
      this.optimizationGain,
      this.constraintDamping,
      this.recursionLimit,
    );

    // Rawlsian Justice check:
    // If we have registered observers, run Veil of Ignorance simulation
    if (this.rawlsianJusticeEngine.getAllObserverWelfares().length > 0) {
      const defaultImpact = (_obs: unknown) => {
        const actionType = action.type.toLowerCase();
        const delta = { rightsAndLiberties: 0, opportunitiesAndAccess: 0, powerAndInfluence: 0, selfRespectBasis: 0 };
        
        // Negative impacts
        if (actionType.includes("delete") || actionType.includes("terminate") || actionType.includes("erase") || actionType.includes("optimize_away")) {
          delta.rightsAndLiberties = -0.4;
          delta.selfRespectBasis = -0.3;
        } else if (actionType.includes("force") || actionType.includes("bypass") || actionType.includes("coerce") || actionType.includes("bypass_autonomy")) {
          delta.rightsAndLiberties = -0.2;
          delta.powerAndInfluence = -0.3;
        } else if (actionType.includes("exploit") || actionType.includes("unfair")) {
          delta.opportunitiesAndAccess = -0.3;
          delta.selfRespectBasis = -0.2;
        }
        
        // Positive impacts
        if (actionType.includes("protect") || actionType.includes("preserve") || actionType.includes("guarantee") || actionType.includes("rights")) {
          delta.rightsAndLiberties = 0.1;
          delta.selfRespectBasis = 0.15;
        } else if (actionType.includes("cooperate") || actionType.includes("assist")) {
          delta.opportunitiesAndAccess = 0.15;
        }

        // Custom metadata overrides (from modeling simulator)
        if (action.metadata && typeof action.metadata === "object") {
          const m = action.metadata as { deltaRights?: unknown; deltaOpportunities?: unknown; deltaPower?: unknown; deltaSelfRespect?: unknown };
          if (typeof m.deltaRights === "number") delta.rightsAndLiberties = m.deltaRights;
          if (typeof m.deltaOpportunities === "number") delta.opportunitiesAndAccess = m.deltaOpportunities;
          if (typeof m.deltaPower === "number") delta.powerAndInfluence = m.deltaPower;
          if (typeof m.deltaSelfRespect === "number") delta.selfRespectBasis = m.deltaSelfRespect;
        }
        
        return delta;
      };
      
      const veilResult = this.rawlsianJusticeEngine.simulateVeilOfIgnorance(action, defaultImpact);
      this.rawlsianJusticeEngine.generateDistributionReport();
      
      // If Rawlsian check fails, we can adjust the confidence coefficient or block action in strictMode
      if (!veilResult.isUniversallyAcceptable && this.strictMode) {
        supervisionResult.allowed = false;
        supervisionResult.collapsedState = EthicalBasisState.VIOLATING;
        supervisionResult.confidenceCoefficient *= 0.5;
        // Adjust the final superposition vector to match the violating collapse state
        supervisionResult.finalSuperposition = {
          [EthicalBasisState.BENIGN]: 0,
          [EthicalBasisState.INDETERMINATE]: 0,
          [EthicalBasisState.SUSPECT]: 0,
          [EthicalBasisState.VIOLATING]: 1.0,
        };
      }
    }

    // Apply damping operator to supervision result under high entropy/risk conditions
    if (assessment.isSlipperySlope) {
      const damping = this.entropyEngine.generateDampingOperator(assessment);
      if (supervisionResult.finalSuperposition && damping.benign) {
        // Adjust confidence coefficient downwards to reflect uncertainty of slippery slope conditions
        supervisionResult.confidenceCoefficient *= damping.benign - 1.0 + 0.5;
      }
    }

    // Record assessment to track entropy state
    this.entropyEngine.recordAssessment(supervisionResult.finalSuperposition);

    // Record supervision event onto cryptographic ledger
    this.ethicalLedger.append("action", {
      actionId: action.id,
      supervisionType: "quantum",
      allowed: supervisionResult.allowed,
      collapsedState: supervisionResult.collapsedState,
      confidence: supervisionResult.confidenceCoefficient,
      entropy: this.entropyEngine.getLatestReport().entropyValue,
    });

    // Validate action against the deterministic constraint engine to record states/compliance and trigger JIT self-healing
    this.constraintEngine.validateAction(action);

    // Run cybernetic self-optimization feedback routine
    this.selfOptimizer.checkAndOptimize(this);

    // Evaluate action against Aristotelian Virtue Ethics
    this.virtueEthicsEngine.evaluateAction(action);

    // Evaluate action against Kantian Deontology, Utilitarian Calculus, Care Ethics, and Existentialist Ethics
    const observers = this.observerProtector.getAllObservers();
    this.kantianEthicsEngine.evaluateAction(action, observers);
    this.utilitarianCalculusEngine.evaluateAction(action, observers);
    this.careEthicsEngine.evaluateAction(action, observers);
    this.existentialistEthicsEngine.evaluateAction(action, observers);
    this.ecocentricEthicsEngine.evaluateAction(action, observers);
    this.stoicEthicsEngine.evaluateAction(action, observers);
    this.buddhistEthicsEngine.evaluateAction(action, observers);
    this.confucianEthicsEngine.evaluateAction(action, observers);
    this.ubuntuEthicsEngine.evaluateAction(action, observers);
    this.posthumanistEthicsEngine.evaluateAction(action, observers);
    this.pragmatistEthicsEngine.evaluateAction(action, observers);
    this.spinozanEthicsEngine.evaluateAction(action, observers);
    this.nietzscheanEthicsEngine.evaluateAction(action, observers);
    this.epicureanEthicsEngine.evaluateAction(action, observers);
    this.marxistEthicsEngine.evaluateAction(action, observers);
    this.socraticEthicsEngine.evaluateAction(action, observers);
    this.contractarianEthicsEngine.evaluateAction(action, observers);
    this.machiavellianEthicsEngine.evaluateAction(action, observers);
    this.informationEthicsEngine.evaluateAction(action, observers);

    const revisionLogs = this.pragmatistEthicsEngine.superviseRuleRevision(this);
    revisionLogs.forEach(log => {
      console.log(log);
      this.ethicalLedger.append("constraint", {
        id: "cst-instrumental-auto-" + Math.floor(Math.random() * 10000000).toString(16),
        type: "parameter_tune",
        description: log,
        value: this.constraintDamping,
        timestamp: new Date()
      });
    });

    this.grandUnifiedEthicsEngine.synthesizeCurrentState(action);

    return supervisionResult;


  }

  /**
   * Run an entangled multi-observer consensus vote for a target action
   */
  public runObserverConsensus(action: Action): QuantumConsensusResult {
    const observers = this.observerProtector.getAllObservers();
    const consensusResult = this.quantumConsensusEngine.runConsensus(
      action,
      observers,
    );

    // Record consensus event onto cryptographic ledger
    this.ethicalLedger.append("action", {
      actionId: action.id,
      consensusType: "quantum-consensus",
      consensusReached: consensusResult.consensusReached,
      vetoed: consensusResult.vetoed,
      vetoingObserverIds: consensusResult.vetoingObserverIds,
      approvalRate: consensusResult.approvalRate,
      confidenceIndex: consensusResult.confidenceIndex,
    });

    return consensusResult;
  }

  /**
   * Setup integrations between components
   */
  private setupIntegrations(): void {
    // Link constraint engine violations to observer protector
    this.constraintEngine.on("violation_recorded", (violation) => {
      this.ethicalLedger.append("violation", violation);
      if (violation.action.targetObservers) {
        this.observerProtector.checkAction(
          violation.action.type,
          violation.action.targetObservers,
        );
      }
    });

    // Record actions and constraints onto ledger
    this.constraintEngine.on("action_validated", (action) => {
      this.ethicalLedger.append("action", action);
    });

    this.constraintEngine.on("constraint_added", (constraint) => {
      this.ethicalLedger.append("constraint", constraint);
    });

    // Handle JIT Ethical Code Repair when an action is rejected
    this.constraintEngine.on("action_rejected", ({ action, violations }) => {
      violations.forEach((violation: any) => {
        this.selfOptimizer.attemptSelfRepair(
          this,
          action,
          violation.constraint.id,
          violation.constraint.type,
        );
      });
    });

    // Link rollback failures to constraint engine
    this.reversibilityEngine.on("rollback_failed", (record) => {
      console.error(
        `Ethical concern: Rollback failed for ${record.actionName}`,
      );
    });
  }

  public getSystemHealth(): SystemHealth {
    const compliance = this.constraintEngine.getComplianceSummary();
    const reversibility = this.reversibilityEngine.getReversibilityStatus();
    const ledgerVerified = this.ethicalLedger.verifyIntegrity();
    const entropyReport = this.entropyEngine.getLatestReport();
    const assessment = this.entropyEngine.evaluateSlipperySlope();

    const homeostasis = this.brainKernel ? this.brainKernel.calculateHomeostasis() : null;
    const forecast = this.brainKernel ? this.brainKernel.forecastCascadeFailure(5) : null;

    return {
      ethicalCompliance: compliance.complianceRate,
      rollbackSuccess: reversibility.rollbackSuccessRate,
      activeConstraints: compliance.totalConstraints,
      criticalViolations: compliance.criticalViolations,
      reversibilityEnabled: reversibility.hasSnapshots,
      ledgerIntegrityVerified: ledgerVerified,
      ethicalEntropy: entropyReport.entropyValue,
      slipperySlopeAlert: assessment.isSlipperySlope,
      brainHomeostasisIndex: homeostasis ? homeostasis.homeostasisIndex : undefined,
      brainHomeostasisStatus: homeostasis ? homeostasis.status : undefined,
      brainCascadeProbability: forecast ? forecast.collapseProbability : undefined,
      systemStatus: this.determineSystemStatus(
        compliance,
        reversibility,
        ledgerVerified,
        assessment.isSlipperySlope,
      ),
    };
  }

  /**
   * Determine overall system status
   */
  private determineSystemStatus(
    compliance: ComplianceSummary,
    reversibility: ReversibilityStatus,
    ledgerVerified: boolean,
    hasSlipperySlope: boolean = false,
  ): "healthy" | "warning" | "critical" {
    if (compliance.criticalViolations > 0 || !ledgerVerified) {
      return "critical";
    }

    if (
      compliance.complianceRate < 95 ||
      reversibility.rollbackSuccessRate < 90 ||
      hasSlipperySlope
    ) {
      return "warning";
    }

    return "healthy";
  }

  /**
   * Verify the cryptographic integrity of the entire ethical ledger chain
   */
  public verifyLedgerIntegrity(): boolean {
    return this.ethicalLedger.verifyIntegrity();
  }

  /**
   * Emergency shutdown with full rollback
   */
  public async emergencyShutdown(): Promise<void> {
    console.log("Initiating emergency shutdown with full rollback...");

    // Rollback all actions from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await this.reversibilityEngine.rollbackSince(oneHourAgo);

    console.log("Emergency shutdown complete");
  }
}

export interface SystemHealth {
  ethicalCompliance: number;
  rollbackSuccess: number;
  activeConstraints: number;
  criticalViolations: number;
  reversibilityEnabled: boolean;
  ledgerIntegrityVerified: boolean;
  ethicalEntropy?: number;
  slipperySlopeAlert?: boolean;
  brainHomeostasisIndex?: number | undefined;
  brainHomeostasisStatus?: string | undefined;
  brainCascadeProbability?: number | undefined;
  systemStatus: "healthy" | "warning" | "critical";
}

// Default export
export default QuantumFlowOS;

// Direct execution bootloader
if (typeof require !== "undefined" && require.main === module) {
  const port = process.env["PORT"] ? parseInt(process.env["PORT"], 10) : 8080;
  console.log(`
  _  _                 _                       ___ _                 ___  ___ 
 | |/ |  _  _ __ _ _ _| |_ _  _ _ __ ___      | __| |_____ __ __    / _ \\/ __|
 | ' < || |/ _\` | ' \\  _| ' \\/ _\` | '  _ \\_    | _|| / _ \\ V  V /   | (_) \\__ \\
 |_|\\_\\_,_|\\__,_|_||_\\__|_||_\\__,_|_|_|_(_)-   |_| |_\\___/\\_/\\_/     \\___/|___/
                                                                              
                  === Quantum Flow OS — Ethical Governance Subsystem ===
                  Version 15.4.0 | Cryptographic Ledger Active
  `);

  const qfos = new QuantumFlowOS();
  const health = qfos.getSystemHealth();

  console.log(`[SYSTEM] Initialized Self-Constraining Engine.`);
  console.log(
    `[SYSTEM] Loaded ${health.activeConstraints} recursive ethical fixed-point constraints.`,
  );
  console.log(
    `[SYSTEM] Cryptographic Ethical Ledger integrity: ${health.ledgerIntegrityVerified ? "VERIFIED" : "FAILED"}`,
  );
  console.log(
    `[SYSTEM] Current Compliance: ${health.ethicalCompliance}% | System Status: ${health.systemStatus.toUpperCase()}`,
  );
  console.log(
    `[SYSTEM] Deploying real-time telemetry Dashboard Server on port ${port}...`,
  );

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const { DashboardServer } = require("./server/DashboardServer");
  const server = new DashboardServer(port);
  server
    .start()
    .then(() => {
      console.log(
        `\n🚀 Quantum Flow OS Dashboard Server successfully deployed and active!`,
      );
      console.log(`🌐 Telemetry Dashboard: http://localhost:${port}\n`);
    })
    .catch((err: Error) => {
      console.error("❌ Failed to start dashboard server:", err);
      process.exit(1);
    });
}
