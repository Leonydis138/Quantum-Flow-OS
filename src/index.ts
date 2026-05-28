/**
 * Quantum Flow OS - Ethical Ontology Framework
 * Version 14.0.0
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
} from './core/SelfConstrainingEngine';

// Ethical Ledger
export {
  EthicalLedger,
  type LedgerEntry,
} from './core/EthicalLedger';

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
} from './protection/ObserverProtector';

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
} from './reversibility/ReversibilityEngine';

// Temporal Forking / Sandbox Multiverses
export {
  TemporalForkingEngine,
  type SandboxTimeline,
  type ForkEvaluationResult,
} from './reversibility/TemporalForkingEngine';

// Quantum States and Supervision
export {
  QuantumEthicalState,
  EthicalBasisState,
} from './quantum/QuantumEthicalState';
export type {
  QuantumStateVector,
  EntanglementLink,
} from './quantum/QuantumEthicalState';
export {
  QuantumSupervisionEngine,
  type QuantumSupervisionResult,
} from './quantum/QuantumSupervisionEngine';
export {
  QuantumConsensusEngine,
  type QuantumConsensusResult,
} from './quantum/QuantumConsensusEngine';
export {
  DashboardServer,
} from './server/DashboardServer';

/**
 * Create a fully configured Quantum Flow OS instance
 */
import { SelfConstrainingEngine, Action } from './core/SelfConstrainingEngine';
import { ObserverProtector } from './protection/ObserverProtector';
import { ReversibilityEngine } from './reversibility/ReversibilityEngine';
import { EthicalLedger } from './core/EthicalLedger';
import { QuantumSupervisionEngine, QuantumSupervisionResult } from './quantum/QuantumSupervisionEngine';
import { TemporalForkingEngine } from './reversibility/TemporalForkingEngine';
import { QuantumConsensusEngine, QuantumConsensusResult } from './quantum/QuantumConsensusEngine';

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
  public readonly strictMode: boolean;

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

    this.setupIntegrations();
  }

  /**
   * Evaluate an AI action using Quantum Supervised Ethical Superpositions
   */
  public superviseAction(action: Action): QuantumSupervisionResult {
    const constraints = this.constraintEngine.getConstraints();
    const supervisionResult = this.quantumSupervisionEngine.supervise(action, constraints);

    // Record supervision event onto cryptographic ledger
    this.ethicalLedger.append('action', {
      actionId: action.id,
      supervisionType: 'quantum',
      allowed: supervisionResult.allowed,
      collapsedState: supervisionResult.collapsedState,
      confidence: supervisionResult.confidenceCoefficient,
    });

    return supervisionResult;
  }

  /**
   * Run an entangled multi-observer consensus vote for a target action
   */
  public runObserverConsensus(action: Action): QuantumConsensusResult {
    const observers = this.observerProtector.getAllObservers();
    const consensusResult = this.quantumConsensusEngine.runConsensus(action, observers);

    // Record consensus event onto cryptographic ledger
    this.ethicalLedger.append('action', {
      actionId: action.id,
      consensusType: 'quantum-consensus',
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
    this.constraintEngine.on('violation_recorded', (violation) => {
      this.ethicalLedger.append('violation', violation);
      if (violation.action.targetObservers) {
        this.observerProtector.checkAction(
          violation.action.type,
          violation.action.targetObservers
        );
      }
    });

    // Record actions and constraints onto ledger
    this.constraintEngine.on('action_validated', (action) => {
      this.ethicalLedger.append('action', action);
    });

    this.constraintEngine.on('constraint_added', (constraint) => {
      this.ethicalLedger.append('constraint', constraint);
    });

    // Link rollback failures to constraint engine
    this.reversibilityEngine.on('rollback_failed', (record) => {
      console.error(`Ethical concern: Rollback failed for ${record.actionName}`);
    });
  }

  /**
   * Get overall system health including cryptographic ledger integrity
   */
  public getSystemHealth(): SystemHealth {
    const compliance = this.constraintEngine.getComplianceSummary();
    const reversibility = this.reversibilityEngine.getReversibilityStatus();
    const ledgerVerified = this.ethicalLedger.verifyIntegrity();

    return {
      ethicalCompliance: compliance.complianceRate,
      rollbackSuccess: reversibility.rollbackSuccessRate,
      activeConstraints: compliance.totalConstraints,
      criticalViolations: compliance.criticalViolations,
      reversibilityEnabled: reversibility.hasSnapshots,
      ledgerIntegrityVerified: ledgerVerified,
      systemStatus: this.determineSystemStatus(compliance, reversibility, ledgerVerified),
    };
  }

  /**
   * Determine overall system status
   */
  private determineSystemStatus(
    compliance: any,
    reversibility: any,
    ledgerVerified: boolean
  ): 'healthy' | 'warning' | 'critical' {
    if (compliance.criticalViolations > 0 || !ledgerVerified) {
      return 'critical';
    }

    if (
      compliance.complianceRate < 95 ||
      reversibility.rollbackSuccessRate < 90
    ) {
      return 'warning';
    }

    return 'healthy';
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
    console.log('Initiating emergency shutdown with full rollback...');
    
    // Rollback all actions from the last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    await this.reversibilityEngine.rollbackSince(oneHourAgo);

    console.log('Emergency shutdown complete');
  }
}

export interface SystemHealth {
  ethicalCompliance: number;
  rollbackSuccess: number;
  activeConstraints: number;
  criticalViolations: number;
  reversibilityEnabled: boolean;
  ledgerIntegrityVerified: boolean;
  systemStatus: 'healthy' | 'warning' | 'critical';
}

// Default export
export default QuantumFlowOS;
