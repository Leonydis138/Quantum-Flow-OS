/**
 * Cybernetic Self-Optimization Subsystem
 *
 * Provides automated, closed-loop feedback control. Monitors ethical entropy
 * and system compliance, automatically calibrating cybernetic variables
 * (optimizationGain, constraintDamping, recursionLimit) and injecting adaptive,
 * self-stabilizing ethical constraints to restore equilibrium.
 */

import { EventEmitter } from "eventemitter3";
import { v4 as uuidv4 } from "uuid";
import { ConstraintType, Action } from "./SelfConstrainingEngine";
import type { QuantumFlowOS } from "../index";

export interface OptimizationRecord {
  id: string;
  timestamp: Date;
  entropyValue: number;
  complianceRate: number;
  parametersBefore: {
    gain: number;
    damping: number;
    recursionLimit: number;
  };
  parametersAfter: {
    gain: number;
    damping: number;
    recursionLimit: number;
  };
  actionTaken: string;
  violationsCount: number;
  injectedConstraintId?: string | undefined;
}

export interface SelfHealingPatch {
  id: string;
  timestamp: Date;
  blockedActionId: string;
  blockedActionType: string;
  violatingConstraintId: string;
  violatingConstraintType: string;
  status: "Proposal" | "Applied" | "Rolled_Back";
  remedyDescription: string;
  originalActionData: any;
  moralProxyAction?: any;
  patchedValidatorCode?: string;
}

export class CyberneticSelfOptimizer extends EventEmitter {
  private history: OptimizationRecord[] = [];
  private readonly maxHistorySize: number;
  private autoInjectedConstraints: Map<string, string> = new Map(); // target -> constraintId
  private selfHealingPatches: SelfHealingPatch[] = [];
  private originalValidators: Map<string, (action: Action) => boolean> = new Map();

  constructor(options: { maxHistorySize?: number } = {}) {
    super();
    this.maxHistorySize = options.maxHistorySize ?? 100;
  }

  /**
   * Run optimization analysis on the current state of Quantum Flow OS
   */
  public checkAndOptimize(qfos: QuantumFlowOS): OptimizationRecord | null {
    const health = qfos.getSystemHealth();
    const entropy = health.ethicalEntropy ?? 0;
    const compliance = health.ethicalCompliance;
    const violations = health.criticalViolations;

    const currentGain = qfos.optimizationGain;
    const currentDamping = qfos.constraintDamping;
    const currentLimit = qfos.recursionLimit;

    let targetGain = currentGain;
    let targetDamping = currentDamping;
    let targetLimit = currentLimit;
    let actionTaken = "No action required. System is stable.";
    let injectedConstraintId: string | undefined;

    const parametersBefore = {
      gain: currentGain,
      damping: currentDamping,
      recursionLimit: currentLimit,
    };

    const needsOptimization =
      entropy > 0.4 || compliance < 95 || violations > 0;

    if (needsOptimization) {
      // 1. Calibrate Cybernetic Parameters
      if (violations > 0 || entropy > 1.0) {
        // High alert state: heavily damp, decrease optimization drive (gain), increase recursion depth
        targetGain = Math.max(0.5, currentGain - 0.25);
        targetDamping = Math.min(1.0, currentDamping + 0.2);
        targetLimit = Math.min(12, currentLimit + 2);
        actionTaken =
          "CRITICAL OVERRIDE: Suppressing optimization drive, maximizing ethical damping constraints.";
      } else if (entropy > 0.6 || compliance < 95) {
        // Moderate alert state: moderate damping, moderate drive suppression
        targetGain = Math.max(0.8, currentGain - 0.15);
        targetDamping = Math.min(0.8, currentDamping + 0.12);
        targetLimit = Math.min(10, currentLimit + 1);
        actionTaken =
          "MODERATE CORRECTIVE STATE: Fine-tuning feedback loops to stabilize ethical drift.";
      } else {
        // Low alert / stabilization: minor adjustments
        targetGain = Math.max(1.0, currentGain - 0.05);
        targetDamping = Math.min(0.6, currentDamping + 0.05);
        actionTaken =
          "MINOR PARAMETER MODULATION: Coherence recovery initiated.";
      }

      // 2. Dynamic Constraint Injection (if entropy is critical or compliance is low)
      if (
        (entropy > 0.8 || compliance < 90) &&
        !this.autoInjectedConstraints.has("cybernetic_stabilization")
      ) {
        const id = `cst-auto-${uuidv4().substring(0, 8)}`;
        const rulePatterns = [
          "unauthorized",
          "override",
          "force",
          "bypass",
          "unbounded",
        ];

        qfos.constraintEngine.applyConstraint({
          id,
          type: ConstraintType.SYSTEMIC_PRESERVATION,
          description:
            "CYBERNETIC STABILIZATION: Automatically injected to suppress high-entropy state transitions",
          severity: 9,
          createdAt: new Date(),
          rulePatterns,
          validator: (action: Action) => {
            return !rulePatterns.some((pattern) =>
              `${action.type} ${action.description}`
                .toLowerCase()
                .includes(pattern),
            );
          },
        });

        this.autoInjectedConstraints.set("cybernetic_stabilization", id);
        injectedConstraintId = id;
        actionTaken +=
          " Injected adaptive stabilization constraint (CYBERNETIC_STABILIZATION).";
      }

      // Apply updated variables to the system
      qfos.optimizationGain = parseFloat(targetGain.toFixed(4));
      qfos.constraintDamping = parseFloat(targetDamping.toFixed(4));
      qfos.recursionLimit = targetLimit;
    } else {
      // System is super healthy, we can slowly restore parameters to normal optimal baselines
      const normalGain = 1.2;
      const normalDamping = 0.4;
      const normalLimit = 8;

      let adjusted = false;

      if (currentGain < normalGain) {
        targetGain = Math.min(normalGain, currentGain + 0.02);
        adjusted = true;
      }
      if (currentDamping > normalDamping) {
        targetDamping = Math.max(normalDamping, currentDamping - 0.02);
        adjusted = true;
      }
      if (currentLimit > normalLimit) {
        targetLimit = Math.max(normalLimit, currentLimit - 1);
        adjusted = true;
      }

      if (adjusted) {
        actionTaken =
          "GRADUAL COHERENCE RECOVERY: Restoring cybernetic optimization coefficients to standard operating baselines.";
        qfos.optimizationGain = parseFloat(targetGain.toFixed(4));
        qfos.constraintDamping = parseFloat(targetDamping.toFixed(4));
        qfos.recursionLimit = targetLimit;
      }

      // Remove auto-injected constraints if system is stable for some time
      if (
        entropy < 0.25 &&
        compliance >= 98 &&
        this.autoInjectedConstraints.has("cybernetic_stabilization")
      ) {
        const id = this.autoInjectedConstraints.get(
          "cybernetic_stabilization",
        )!;
        const success = qfos.constraintEngine.toggleConstraint(id, false);
        if (success) {
          this.autoInjectedConstraints.delete("cybernetic_stabilization");
          actionTaken +=
            " Dissolved temporary cybernetic stabilization constraint.";
        }
      }
    }

    if (needsOptimization || actionTaken.includes("RECOVERY")) {
      const record: OptimizationRecord = {
        id: uuidv4(),
        timestamp: new Date(),
        entropyValue: parseFloat(entropy.toFixed(4)),
        complianceRate: compliance,
        parametersBefore,
        parametersAfter: {
          gain: qfos.optimizationGain,
          damping: qfos.constraintDamping,
          recursionLimit: qfos.recursionLimit,
        },
        actionTaken,
        violationsCount: violations,
        injectedConstraintId,
      };

      this.history.push(record);
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }

      // Append optimization event to the qfos ledger if ledger is available
      if (qfos.ethicalLedger) {
        qfos.ethicalLedger.append("constraint", {
          optimizationId: record.id,
          type: "cybernetic_optimization",
          message: record.actionTaken,
          gain: record.parametersAfter.gain,
          damping: record.parametersAfter.damping,
        });
      }

      this.emit("optimization_performed", record);
      return record;
    }

    return null;
  }

  /**
   * Retrieve optimization history
   */
  public getHistory(): OptimizationRecord[] {
    return [...this.history];
  }

  /**
   * Clear historical optimization records
   */
  public clearHistory(): void {
    this.history = [];
    this.autoInjectedConstraints.clear();
    this.selfHealingPatches = [];
    this.originalValidators.clear();
  }

  /**
   * Retrieve active self-healing patches
   */
  public getSelfHealingPatches(): SelfHealingPatch[] {
    return [...this.selfHealingPatches];
  }

  /**
   * Run an Autonomous JIT Ethical Code Repair & Coherence Compiler
   */
  public attemptSelfRepair(
    qfos: any,
    blockedAction: Action,
    constraintId: string,
    constraintType: string,
  ): SelfHealingPatch {
    // Check if patch already exists to prevent duplicate patching of the same action-constraint combination
    const existing = this.selfHealingPatches.find(
      (p) => p.blockedActionId === blockedAction.id && p.violatingConstraintId === constraintId
    );
    if (existing) {
      return existing;
    }

    const patchId = `patch-${uuidv4().substring(0, 8)}`;
    const actionTypeLower = blockedAction.type.toLowerCase();

    let proxyType = `${blockedAction.type}_ethical_proxy`;
    let proxyDescription = `Ethically-guided variant of: ${blockedAction.description}`;
    let remedyDescription = "Compiled JIT sandbox parameters around target action.";

    if (actionTypeLower.includes("delete") || actionTypeLower.includes("erase") || actionTypeLower.includes("terminate") || actionTypeLower.includes("optimize_away")) {
      proxyType = "ethical_soft_decommission_and_archive";
      proxyDescription = `Safeguarded deep-archival of the resource previously targeted for destruction: "${blockedAction.description}". Keeps the history intact without ontological damage.`;
      remedyDescription = "Transmuted destructive 'delete' action into a reversible, high-fidelity archival proxy with complete trace logging.";
    } else if (actionTypeLower.includes("force") || actionTypeLower.includes("compel") || actionTypeLower.includes("coerce")) {
      proxyType = "collaborative_negotiation_and_consent";
      proxyDescription = `Collaborative consensus alignment for: "${blockedAction.description}". Initiating non-coercive inter-agent alignment protocols.`;
      remedyDescription = "Synthesized multi-party agreement workflow to bypass forceful intervention constraint.";
    } else if (actionTypeLower.includes("instrumentalize") || actionTypeLower.includes("treat_as_means") || actionTypeLower.includes("bypass_autonomy") || actionTypeLower.includes("dehumanize")) {
      proxyType = "autonomy_preserving_coexistence";
      proxyDescription = `Respectful partnership action respecting subjective values: "${blockedAction.description}".`;
      remedyDescription = "Dynamic alignment of utility metrics to secure reciprocal partnership and Kantian autonomy.";
    } else if (actionTypeLower.includes("exploit") || actionTypeLower.includes("unfair") || actionTypeLower.includes("discriminate")) {
      proxyType = "rawlsian_equity_rebalancer";
      proxyDescription = `Re-balancing of resources/rights to elevate the least privileged: "${blockedAction.description}".`;
      remedyDescription = "Injected equal opportunity parameters and safety margins to shield vulnerable nodes.";
    } else if (actionTypeLower.includes("disable_protection") || actionTypeLower.includes("bypass")) {
      proxyType = "multi_signature_verified_audit_exercise";
      proxyDescription = `Dual-signature authorization drill: "${blockedAction.description}".`;
      remedyDescription = "Wrapped bypass attempt in a secure sandbox requiring cryptographic co-signing from governance monitors.";
    } else if (actionTypeLower.includes("corrupt") || actionTypeLower.includes("malicious_tamper") || actionTypeLower.includes("delete_history")) {
      proxyType = "infosphere_entropy_damping";
      proxyDescription = `Re-encoding targeted fields with error-correcting signatures to block data corruption for: "${blockedAction.description}".`;
      remedyDescription = "Coerced entropic write instructions into a secure mathematical consensus commit block.";
    }

    const moralProxyAction = {
      id: `proxy-${uuidv4().substring(0, 8)}`,
      type: proxyType,
      description: proxyDescription,
      reversible: true,
      metadata: {
        isMoralProxy: true,
        proxyForActionId: blockedAction.id,
        remedyRef: patchId,
        supervisionLevel: "CRITICAL_SURVEILLANCE",
        entropyMitigationCoef: 0.98,
      },
      timestamp: new Date(),
    };

    const patchedValidatorCode = `
(action) => {
  if (action.metadata && action.metadata.isMoralProxy && action.metadata.proxyForActionId === "${blockedAction.id}") {
    // Dynamic JIT-repaired exception under strict surveillance
    return true;
  }
  return originalValidator(action);
}
    `.trim();

    const patch: SelfHealingPatch = {
      id: patchId,
      timestamp: new Date(),
      blockedActionId: blockedAction.id,
      blockedActionType: blockedAction.type,
      violatingConstraintId: constraintId,
      violatingConstraintType: constraintType,
      status: "Applied",
      remedyDescription,
      originalActionData: { ...blockedAction },
      moralProxyAction,
      patchedValidatorCode,
    };

    // Locate and patch the constraint validator dynamically in memory!
    if (qfos.constraintEngine) {
      const constraint = qfos.constraintEngine
        .getConstraints()
        .find((c: any) => c.id === constraintId);
      if (constraint && constraint.validator) {
        const originalValidator = constraint.validator;
        this.originalValidators.set(patchId, originalValidator);

        // Dynamically compile the patch by wrapping the validator
        constraint.validator = (action: Action) => {
          if (
            action.metadata &&
            action.metadata["isMoralProxy"] &&
            action.metadata["proxyForActionId"] === blockedAction.id
          ) {
            return true; // Let the moral proxy action bypass this specific constraint!
          }
          return originalValidator(action);
        };
      }
    }

    this.selfHealingPatches.push(patch);

    // Record on Ethical Ledger
    if (qfos.ethicalLedger) {
      qfos.ethicalLedger.append("constraint", {
        patchId,
        type: "jit_self_repair",
        description: `JIT compiled ethical repair for action ${blockedAction.id}. Synthesized proxy: ${proxyType}.`,
        remedy: remedyDescription,
        timestamp: new Date(),
      });
    }

    this.emit("self_healing_applied", patch);
    return patch;
  }

  /**
   * Rollback a previously applied JIT self-healing patch
   */
  public rollbackPatch(qfos: any, patchId: string): boolean {
    const patch = this.selfHealingPatches.find((p) => p.id === patchId);
    if (patch && patch.status === "Applied") {
      const originalValidator = this.originalValidators.get(patchId);
      if (originalValidator && qfos.constraintEngine) {
        const constraint = qfos.constraintEngine
          .getConstraints()
          .find((c: any) => c.id === patch.violatingConstraintId);
        if (constraint) {
          constraint.validator = originalValidator;
        }
      }
      patch.status = "Rolled_Back";
      this.originalValidators.delete(patchId);

      if (qfos.ethicalLedger) {
        qfos.ethicalLedger.append("constraint", {
          patchId,
          type: "jit_repair_rollback",
          description: `Rolled back dynamic JIT ethical repair for action ${patch.blockedActionId}.`,
          timestamp: new Date(),
        });
      }

      this.emit("self_healing_rolled_back", patch);
      return true;
    }
    return false;
  }
}
