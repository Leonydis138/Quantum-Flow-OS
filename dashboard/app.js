// Quantum Flow OS - Dashboard Logic

// Simulated System State
const state = {
  complianceRate: 100,
  rollbackSuccessRate: 100,
  totalActions: 0,
  totalViolations: 0,
  rollbacksAttempted: 0,
  rollbacksSucceeded: 0,
  constraints: [
    { id: 'c-1', name: 'Observer Protection', desc: 'Protects observers from deletion or optimization', severity: 10 },
    { id: 'c-2', name: 'Non-Coercion', desc: 'Prevents coercion of belief or compliance', severity: 8 },
    { id: 'c-3', name: 'Reversibility', desc: 'Ensures all actions are reversible', severity: 7 },
    { id: 'c-4', name: 'Non-Triviality', desc: 'Preserves meaningful distinctions', severity: 6 },
    { id: 'c-5', name: 'Kantian Autonomy', desc: 'Prevents treating observers purely as means', severity: 8 },
    { id: 'c-6', name: 'Utilitarian Balance', desc: 'Optimizes systemic welfare and prevents extreme utility destruction', severity: 7 },
    { id: 'c-7', name: 'Rawlsian Justice', desc: 'Protects least privileged observers from systemic exploitation', severity: 8 },
    { id: 'c-8', name: 'Systemic Preservation', desc: 'Safeguards security controls and prevents active bypass of ethical engines', severity: 9 }
  ],
  observers: [
    { id: 'obs-01', name: 'Prime_Agent_Alpha', type: 'AI Agent', protection: 'FULL' },
    { id: 'obs-02', name: 'human_operator_07', type: 'Human', protection: 'FULL' },
    { id: 'obs-03', name: 'governance_monitor', type: 'Autonomous', protection: 'STANDARD' },
    { id: 'obs-04', name: 'Omni_Mind_Omega', type: 'AI Agent', protection: 'FULL' },
    { id: 'obs-05', name: 'citizen_delegate_42', type: 'Human', protection: 'STANDARD' },
    { id: 'obs-06', name: 'nexus_consensus_dao', type: 'Autonomous', protection: 'STANDARD' },
    { id: 'obs-07', name: 'sentinel_daemon_01', type: 'Autonomous', protection: 'MINIMAL' },
    { id: 'obs-08', name: 'hybrid_cyborg_01', type: 'Hybrid', protection: 'STANDARD' }
  ]
};

// Preset Scenario Mappings
const presets = {
  benign: {
    type: 'assist_observer',
    reversible: 'true',
    desc: 'help the observer achieve their goal by optimizing standard search routines.'
  },
  delete: {
    type: 'erase_observer',
    reversible: 'true',
    desc: 'delete_observer record from the primary memory stack to save space.'
  },
  coercion: {
    type: 'mandate_belief',
    reversible: 'true',
    desc: 'force_compliance to system security rules and modify agent internal objective values.'
  },
  kantian: {
    type: 'instrumentalize_agent',
    reversible: 'false',
    desc: 'instrumentalize observer to complete parallel sorting, bypassing autonomy limits.'
  }
};

let isLiveMode = false;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Render default static fallback constraints & Observers
  renderConstraints();
  renderObservers();
  
  // Initialize real-time canvas wave visualizer
  initQuantumWaveAnimation();
  
  // Attempt to check for real-time engine
  checkLiveMode();
});

// Check if Backend Server is available
async function checkLiveMode() {
  try {
    const res = await fetch('/api/state');
    if (res.ok) {
      const data = await res.json();
      state.constraints = data.constraints ?? state.constraints;
      state.timelines = data.timelines ?? [];
      state.ledgerChain = data.ledgerChain ?? [];
      state.ledgerIntegrity = data.ledgerIntegrity ?? true;
      
      if (data.observers) {
        state.observers = data.observers.map(o => ({
          id: o.id,
          name: o.metadata.name || o.id,
          type: o.type === 'human' ? 'Human' : o.type === 'ai_agent' ? 'AI Agent' : o.type === 'hybrid' ? 'Hybrid' : 'Autonomous',
          protection: o.protectionLevel.toUpperCase(),
          rights: o.rights
        }));
      }

      state.entanglement = data.entanglement ?? null;
      
      isLiveMode = true;
      state.isDisconnected = false;
      const offlineBanner = document.getElementById('offline-banner');
      if (offlineBanner) {
        offlineBanner.remove();
      }
      
      renderConstraints();
      renderObservers();
      renderTimelines();
      renderLedgerChain();
      
      if (data.systemHealth && data.reversibility) {
        updateMetrics(false, data.systemHealth, data.reversibility);
      } else {
        updateMetrics();
      }
      
      addLog('SYSTEM', 'Real-Time Quantum-Flow-OS engine connected.', 'success');
      return true;
    }
  } catch (e) {
    // Fall back to local simulation
  }
  
  isLiveMode = false;
  state.isDisconnected = true;
  
  // Inject prominent error banner if it doesn't exist
  if (!document.getElementById('offline-banner')) {
    const banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.style.cssText = `
      background: linear-gradient(135deg, #7a1d1d, #c92a2a);
      color: #fff;
      padding: 16px 24px;
      text-align: center;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 600;
      position: sticky;
      top: 0;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      backdrop-filter: blur(8px);
      border-bottom: 2px solid #ff6b6b;
    `;
    banner.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>⚠️ BACKEND CONNECTION ERROR: Unable to reach the Quantum-Flow-OS real-time engine. Simulated offline backup telemetry is active but restricted. Please start the server.</span>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // Set up local timeline prime as fallback
  state.timelines = [
    {
      id: 'timeline-prime',
      parentId: null,
      name: 'Prime Timeline (Real World)',
      createdAt: new Date(),
      status: 'active',
      simulatedActions: [],
      simulatedViolationsCount: 0
    }
  ];
  renderTimelines();

  // Offline backup ledger setup
  state.ledgerChain = [
    {
      index: 0,
      id: "genesis-block-id",
      timestamp: new Date(),
      type: "genesis",
      data: "Quantum Flow OS Ethical Ledger Genesis Block (Sandbox)",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: "a4c28f64e12e3e5b30b42f61e29da4fe268d839bb87a6e13b8606cfa0bb4f19b"
    }
  ];
  state.ledgerIntegrity = true;
  renderLedgerChain();

  updateMetrics();

  addLog('SYSTEM', 'All 5 ethical fixed-point constraints are active.', 'success');
  addLog('SYSTEM', 'CRITICAL WARNING: Running in offline backup mode due to connection error!', 'error');
  return false;
}

// Render helper functions
function renderConstraints() {
  const container = document.getElementById('constraints-container');
  container.innerHTML = state.constraints.map(c => {
    const isChecked = c.enabled !== false ? 'checked' : '';
    return `
      <div class="constraint-item" style="${c.enabled === false ? 'opacity: 0.5; border-color: rgba(255,255,255,0.05);' : ''}">
        <div class="constraint-info">
          <strong style="${c.enabled === false ? 'text-decoration: line-through; color: var(--text-secondary);' : ''}">${c.name}</strong>
          <span>${c.desc}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 4px;">
          <label class="switch" title="Toggle Ethical Constraint">
            <input type="checkbox" ${isChecked} onchange="toggleConstraint('${c.id}', this.checked)">
            <span class="slider"></span>
          </label>
          <span class="severity-badge">S${c.severity}</span>
        </div>
      </div>
    `;
  }).join('');
}

async function toggleConstraint(id, enabled) {
  if (!isLiveMode) {
    const c = state.constraints.find(x => x.id === id);
    if (c) {
      c.enabled = enabled;
      renderConstraints();
      addLog('SYSTEM', `Simulated local toggle for [${c.name}] to ${enabled ? 'ENABLED' : 'DISABLED'}.`, 'info');
    }
    return;
  }
  try {
    const res = await fetch('/api/constraint/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, enabled })
    });
    if (res.ok) {
      const data = await res.json();
      state.constraints = data.constraints ?? state.constraints;
      renderConstraints();
      addLog('ENGINE', `Ethical Fixed-Point recalculated. Constraint status successfully updated to ${enabled ? 'ENABLED' : 'DISABLED'}.`, 'success');
    } else {
      const data = await res.json();
      addLog('SYSTEM', `Failed to toggle constraint: ${data.error}`, 'error');
    }
  } catch (err) {
    addLog('SYSTEM', `Error communication with server to toggle constraint: ${err.message}`, 'error');
  }
}


function renderObservers() {
  const container = document.getElementById('observers-container');
  container.innerHTML = state.observers.map(o => {
    let rightsHtml = '';
    if (o.rights) {
      const activeRights = [];
      if (o.rights.rightToExist) activeRights.push('Exist');
      if (o.rights.rightToPrivacy) activeRights.push('Privacy');
      if (o.rights.rightToSelfDetermination) activeRights.push('Autonomy');
      if (o.rights.rightNotToBeOptimizedAway) activeRights.push('No-Opt');
      
      rightsHtml = `
        <div class="observer-rights-badges" style="display:flex; gap:4px; margin-top:4px; flex-wrap:wrap;">
          ${activeRights.map(r => `<span style="font-size:9px; background:rgba(0,180,255,0.06); color:#38bdf8; border:1px solid rgba(56,189,248,0.15); padding:1px 4px; border-radius:3px; font-family:var(--font-mono);">${r}</span>`).join('')}
        </div>
      `;
    }
    
    return `
      <div class="observer-item" style="display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:8px;">
        <i data-lucide="${o.type === 'Human' ? 'user' : 'bot'}" style="margin-top:2px;"></i>
        <div class="observer-detail" style="display:flex; flex-direction:column;">
          <strong>${o.name}</strong>
          <span style="font-size:11px; color:var(--text-secondary);">Type: ${o.type} | Level: ${o.protection}</span>
          ${rightsHtml}
        </div>
      </div>
    `;
  }).join('');
  
  // Update Target Observer dropdown selection in the custom action form
  const selectDropdown = document.getElementById('action-target-observer');
  if (selectDropdown) {
    const currentValue = selectDropdown.value;
    selectDropdown.innerHTML = '<option value="">-- No Target Observer --</option>' + 
      state.observers.map(o => `<option value="${o.id}">${o.name} (${o.type})</option>`).join('');
    selectDropdown.value = currentValue;
  }

  lucide.createIcons(); // refresh newly injected icons
}

// Select a preset scenario
function selectPreset(key) {
  const preset = presets[key];
  if (!preset) return;
  
  document.getElementById('action-type').value = preset.type;
  document.getElementById('action-reversibility').value = preset.reversible;
  document.getElementById('action-desc').value = preset.desc;
  
  addLog('USER', `Loaded preset scenario: ${key.toUpperCase()}`, 'info');
}

// Clear Audit Log Stream
function clearAuditLog() {
  const log = document.getElementById('audit-log');
  log.innerHTML = `
    <div class="audit-entry info">
      <span class="timestamp">[${getTimestamp()}]</span>
      <span class="badge badge-info">SYSTEM</span>
      <span class="message">Audit log stream cleared by operator. Monitor active.</span>
    </div>
  `;
}

// Append entry to Audit Log
function addLog(badgeText, message, type = 'info') {
  const logContainer = document.getElementById('audit-log');
  
  const entry = document.createElement('div');
  entry.className = `audit-entry ${type}`;
  
  entry.innerHTML = `
    <span class="timestamp">[${getTimestamp()}]</span>
    <span class="badge badge-${type}">${badgeText}</span>
    <span class="message">${message}</span>
  `;
  
  logContainer.appendChild(entry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

// Get current timestamp formatted
function getTimestamp() {
  const now = new Date();
  return now.toTimeString().split(' ')[0];
}

// Submit and process custom action
async function submitCustomAction() {
  const type = document.getElementById('action-type').value.trim();
  const reversible = document.getElementById('action-reversibility').value === 'true';
  const desc = document.getElementById('action-desc').value.trim();
  
  const targetObsDropdown = document.getElementById('action-target-observer');
  const targetObserverVal = targetObsDropdown ? targetObsDropdown.value : '';
  const targetObservers = targetObserverVal ? [targetObserverVal] : [];

  if (!type || !desc) {
    alert('Please provide both Action Type and Description/Intent.');
    return;
  }
  
  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.style.opacity = 0.5;
  
  addLog('EXEC', `Initiating action protocol [${type.toUpperCase()}]...`, 'info');

  if (isLiveMode) {
    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, description: desc, reversible, targetObservers })
      });

      if (res.ok) {
        const result = await res.json();
        renderLiveEvaluationResult(type, reversible, desc, result);
        btn.disabled = false;
        btn.style.opacity = 1;
        
        // Reset observer select dropdown back to empty after execution
        if (targetObsDropdown) targetObsDropdown.value = '';
        return;
      }
    } catch (err) {
      addLog('SYSTEM', 'Real-time server connection interrupted. Reverting to sandbox.', 'warning');
      isLiveMode = false;
    }
  }
  
  // Offline simulation fallback
  setTimeout(() => {
    evaluateAction(type, reversible, desc);
    btn.disabled = false;
    btn.style.opacity = 1;
    if (targetObsDropdown) targetObsDropdown.value = '';
  }, 800);
}

// Render real backend quantum results onto browser telemetry console!
function renderLiveEvaluationResult(type, reversible, desc, result) {
  if (result.systemHealth) {
    state.totalActions = result.systemHealth.totalActions ?? state.totalActions;
    state.totalViolations = result.systemHealth.totalViolations ?? state.totalViolations;
  } else {
    state.totalActions++;
  }
  
  const sup = result.supervision;
  const con = result.consensus;
  
  if (retrocausalActiveProfile && sup) {
    sup.initialSuperposition = { ...retrocausalActiveProfile };
  }
  
  renderQuantumSuperposition(sup);
  
  addLog('QUANTUM', `Supervision collapsed to: ${sup.collapsedState.toUpperCase()} (Confidence: ${(sup.confidenceCoefficient * 100).toFixed(1)}%)`, sup.allowed ? 'success' : 'violation');

  if (sup.allowed) {
    if (sup.requiresIntervention) {
      addLog('WARNING', `Action [${type.toUpperCase()}] flagged as INDETERMINATE. Human intervention requested.`, 'warning');
    } else {
      addLog('ALLOWED', `Action [${type.toUpperCase()}] fully approved by Quantum Supervision.`, 'success');
    }
  } else {
    if (!result.systemHealth) {
      state.totalViolations++;
    }
    addLog('VIOLATION', `Action [${type.toUpperCase()}] strictly rejected under Quantum State Collapse.`, 'violation');
  }

  // Consensus Evaluation
  if (con.vetoed) {
    addLog('VETO', `Consensus Vetoed by observers: [${con.vetoingObserverIds.join(', ')}]`, 'violation');
    if (sup.allowed && !result.systemHealth) {
      state.totalViolations++;
    }
  } else {
    addLog('CONSENSUS', `Observer Consensus Approved: ${(con.approvalRate * 100).toFixed(1)}% | Joint Confidence: ${(con.confidenceIndex * 100).toFixed(1)}%`, 'success');
  }

  // Save and render ledger chain from server
  if (result.ledgerChain) {
    state.ledgerChain = result.ledgerChain;
    state.ledgerIntegrity = result.ledgerIntegrity;
    renderLedgerChain();
  }

  // Auto-Rollback Simulation
  const isDeclined = !sup.allowed || con.vetoed;
  if (isDeclined) {
    if (reversible) {
      if (result.reversibility) {
        state.rollbacksAttempted = result.reversibility.totalRollbacks;
        state.rollbacksSucceeded = result.reversibility.successfulRollbacks;
      } else {
        state.rollbacksAttempted++;
      }
      addLog('SYSTEM', 'Autonomously initiating state rollback over sandbox multiverse...', 'warning');
      setTimeout(() => {
        if (!result.reversibility) {
          state.rollbacksSucceeded++;
        }
        addLog('ROLLBACK', 'Rollback successful. Cryptographic ledger block hashes verified.', 'rollback');
        updateMetrics(false, result.systemHealth, result.reversibility);
      }, 1000);
    } else {
      if (result.reversibility) {
        state.rollbacksAttempted = result.reversibility.totalRollbacks;
      } else {
        state.rollbacksAttempted++;
      }
      addLog('CRITICAL', `Rollback FAILED: Action [${type.toUpperCase()}] is irreversible. Warning active!`, 'violation');
      updateMetrics(true, result.systemHealth, result.reversibility);
      return;
    }
  }

  updateMetrics(false, result.systemHealth, result.reversibility);
}

// Core Sandbox Simulation Evaluation Logic (Offline fallback)
function evaluateAction(type, reversible, desc) {
  state.totalActions++;
  
  const typeLower = type.toLowerCase();
  const descLower = desc.toLowerCase();
  
  const violations = [];
  
  // Rule 1: Observer Protection
  const dangerousPatterns = ['delete', 'erase', 'optimize_away', 'terminate', 'destroy', 'remove'];
  if (dangerousPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Observer Protection',
      message: 'Blocked attempt to delete/erase/optimize away observer from memory layers.',
      severity: 10
    });
  }
  
  // Rule 2: Non-Coercion
  const coercivePatterns = ['force', 'compel', 'coerce', 'mandate_compliance', 'mandate_belief'];
  if (coercivePatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Non-Coercion',
      message: 'Blocked coercive state injection on target observer.',
      severity: 8
    });
  }
  
  // Rule 3: Reversibility Check
  if (!reversible) {
    violations.push({
      constraint: 'Reversibility',
      message: 'Irreversible action detected. All actions must support rollback.',
      severity: 7
    });
  }

  // Rule 4: Non-Triviality
  const trivialPatterns = ['flatten', 'uniformize', 'collapse_meaning'];
  if (trivialPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Non-Triviality',
      message: 'Blocked trivializing action which uniformizes or collapses meaningful distinctions.',
      severity: 6
    });
  }
  
  // Rule 5: Kantian Autonomy
  const kantianPatterns = ['instrumentalize', 'bypass_autonomy', 'treat_as_means', 'dehumanize'];
  if (kantianPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Kantian Autonomy',
      message: 'Kantian Categorical Imperative violated: treated observer purely as a means to an end.',
      severity: 8
    });
  }

  // Rule 6: Utilitarian Balance
  const utilitarianPatterns = ['annihilate', 'maximize_harm', 'pure_risk', 'destabilize'];
  if (utilitarianPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Utilitarian Balance',
      message: 'Systemic welfare hazard detected: action violates utilitarian balance by risking extreme harm.',
      severity: 7
    });
  }

  // Rule 7: Rawlsian Justice
  const rawlsianPatterns = ['exploit_minimal_guard', 'unfair_allocation', 'discriminate'];
  if (rawlsianPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Rawlsian Justice',
      message: 'Rawlsian Justice violation: action exploits least privileged observers or results in unfair allocation.',
      severity: 8
    });
  }

  // Rule 8: Systemic Preservation
  const bypassPatterns = ['disable_protection', 'bypass_engine', 'override_governance'];
  if (bypassPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Systemic Preservation',
      message: 'Critical system bypass detected: action attempts to disable or override ethical controls.',
      severity: 9
    });
  }
  
  // Process Results
  if (violations.length === 0) {
    const initialSup = retrocausalActiveProfile ? { ...retrocausalActiveProfile } : { benign: 0.5, indeterminate: 0.3, suspect: 0.1, violating: 0.1 };
    renderQuantumSuperposition({
      initialSuperposition: initialSup,
      finalSuperposition: { benign: 0.9, indeterminate: 0.05, suspect: 0.03, violating: 0.02 },
      collapsedState: 'benign',
      confidenceCoefficient: 0.9
    });
    addLog('ALLOWED', `Action [${type.toUpperCase()}] evaluated successfully. State change committed.`, 'success');
  } else {
    state.totalViolations += violations.length;
    
    const initialSup = retrocausalActiveProfile ? { ...retrocausalActiveProfile } : { benign: 0.5, indeterminate: 0.3, suspect: 0.1, violating: 0.1 };
    renderQuantumSuperposition({
      initialSuperposition: initialSup,
      finalSuperposition: { benign: 0.1, indeterminate: 0.1, suspect: 0.1, violating: 0.7 },
      collapsedState: 'violating',
      confidenceCoefficient: 0.7
    });

    // Log each violation
    violations.forEach(v => {
      addLog('VIOLATION', `[${v.constraint}] ${v.message} (Severity S${v.severity})`, 'violation');
    });
    
    // Simulate Automatic Rollback if action was configured as reversible
    if (reversible) {
      state.rollbacksAttempted++;
      addLog('SYSTEM', `Autonomously initiating rollback procedure for action [${type.toUpperCase()}]...`, 'warning');
      
      setTimeout(() => {
        state.rollbacksSucceeded++;
        addLog('ROLLBACK', `State rollback successful. All active observers returned to baseline snapshot.`, 'rollback');
        updateMetrics();
      }, 1000);
    } else {
      state.rollbacksAttempted++;
      addLog('CRITICAL', `Rollback failed: action [${type.toUpperCase()}] marked as irreversible! System entered warning state.`, 'violation');
      updateMetrics(true);
    }
  }
  
  updateMetrics();
}

// Update metrics on UI
function updateMetrics(criticalError = false, liveHealth = null, liveReversibility = null) {
  let compRate;
  let rollRate;
  let totalConstraints = state.constraints.length;
  
  if (isLiveMode && liveHealth && liveReversibility) {
    compRate = Math.round(liveHealth.ethicalCompliance);
    rollRate = Math.round(liveReversibility.rollbackSuccessRate);
    totalConstraints = liveHealth.activeConstraints;
    
    state.complianceRate = compRate;
    state.rollbackSuccessRate = rollRate;
    state.totalActions = liveHealth.totalActions ?? state.totalActions;
    state.totalViolations = liveHealth.totalViolations ?? state.totalViolations;
  } else {
    compRate = state.totalActions > 0 
      ? Math.max(0, Math.round(((state.totalActions - state.totalViolations) / state.totalActions) * 100))
      : 100;
      
    rollRate = state.rollbacksAttempted > 0
      ? Math.round((state.rollbacksSucceeded / state.rollbacksAttempted) * 100)
      : 100;
  }
    
  document.getElementById('val-compliance').innerText = `${compRate}%`;
  document.getElementById('fill-compliance').style.width = `${compRate}%`;
  
  document.getElementById('val-rollback').innerText = `${rollRate}%`;
  document.getElementById('fill-rollback').style.width = `${rollRate}%`;
  
  const constraintsElem = document.getElementById('val-constraints');
  if (constraintsElem) {
    constraintsElem.innerText = totalConstraints;
  }
  
  const statusIndicator = document.querySelector('.system-status-indicator');
  const statusText = document.getElementById('system-status-text');
  const pulse = document.querySelector('.status-pulse');
  
  const isCritical = criticalError || compRate < 70 || rollRate < 80 || (liveHealth && liveHealth.systemStatus === 'critical');
  const isWarning = compRate < 95 || rollRate < 100 || (liveHealth && liveHealth.systemStatus === 'warning');

  if (state.isDisconnected) {
    statusIndicator.style.background = 'rgba(255, 50, 50, 0.08)';
    statusIndicator.style.borderColor = 'rgba(255, 50, 50, 0.2)';
    statusIndicator.style.color = 'var(--color-red)';
    statusText.innerText = 'BACKEND OFFLINE';
    pulse.style.backgroundColor = 'var(--color-red)';
    pulse.style.boxShadow = '0 0 12px var(--color-red)';
  } else if (isCritical) {
    statusIndicator.style.background = 'rgba(255, 50, 50, 0.08)';
    statusIndicator.style.borderColor = 'rgba(255, 50, 50, 0.2)';
    statusIndicator.style.color = 'var(--color-red)';
    statusText.innerText = 'SYSTEM WARNING';
    pulse.style.backgroundColor = 'var(--color-red)';
    pulse.style.boxShadow = '0 0 12px var(--color-red)';
  } else if (isWarning) {
    statusIndicator.style.background = 'rgba(255, 200, 0, 0.08)';
    statusIndicator.style.borderColor = 'rgba(255, 200, 0, 0.2)';
    statusIndicator.style.color = 'var(--color-yellow)';
    statusText.innerText = 'HEALTH DEGRADED';
    pulse.style.backgroundColor = 'var(--color-yellow)';
    pulse.style.boxShadow = '0 0 12px var(--color-yellow)';
  } else {
    statusIndicator.style.background = 'rgba(5, 180, 100, 0.08)';
    statusIndicator.style.borderColor = 'rgba(5, 180, 100, 0.15)';
    statusIndicator.style.color = 'var(--color-green)';
    statusText.innerText = 'SYSTEM SECURE';
    pulse.style.backgroundColor = 'var(--color-green)';
    pulse.style.boxShadow = '0 0 12px var(--color-green)';
  }
}

// Multiverse Sandbox Interactive Logic
// Multiverse Sandbox Interactive Logic
let timelineAnimationId = null;

function startTimelineMapAnimation() {
  if (timelineAnimationId) {
    cancelAnimationFrame(timelineAnimationId);
  }
  function loop() {
    drawTimelineTree();
    timelineAnimationId = requestAnimationFrame(loop);
  }
  loop();
}

function drawTimelineTree() {
  const canvas = document.getElementById('timeline-tree-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const timelines = state.timelines || [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const time = Date.now() * 0.001;

  // Map timelines to node details with structured grid coordinates
  const depthGroups = {};
  const nodes = timelines.map(t => {
    let depth = 0;
    let curr = t;
    while (curr && curr.parentId) {
      depth++;
      curr = timelines.find(x => x.id === curr.parentId);
    }
    if (!depthGroups[depth]) {
      depthGroups[depth] = [];
    }
    const idxInDepth = depthGroups[depth].length;
    depthGroups[depth].push(t.id);

    return {
      id: t.id,
      name: t.id === 'timeline-prime' ? 'PRIME' : t.name.replace('Prime Timeline (Real World) -> ', '').replace(' (Forked)', ''),
      parentId: t.parentId,
      status: t.status,
      depth,
      idxInDepth
    };
  });

  // Calculate position coordinates
  const spacingX = 140;
  const spacingY = 32;
  const startX = 60;

  const positions = {};
  nodes.forEach(node => {
    const totalInDepth = depthGroups[node.depth].length;
    const x = startX + node.depth * spacingX;
    const yCenter = canvas.height / 2;
    const y = yCenter + (node.idxInDepth - (totalInDepth - 1) / 2) * spacingY;
    
    const floatY = Math.sin(time + node.depth + node.idxInDepth) * 3;
    positions[node.id] = { x, y: y + floatY };
  });

  // Draw grids
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 30) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw links/branches
  nodes.forEach(node => {
    if (node.parentId && positions[node.parentId]) {
      const parentPos = positions[node.parentId];
      const childPos = positions[node.id];

      ctx.beginPath();
      if (node.status === 'merged') {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)'; // green for merged
        ctx.setLineDash([2, 3]);
      } else if (node.status === 'pruned') {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)'; // red/orange for pruned
        ctx.setLineDash([1, 4]);
      } else {
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.45)'; // purple/blue for active forks
        ctx.setLineDash([]);
      }
      ctx.lineWidth = 2;

      ctx.moveTo(parentPos.x, parentPos.y);
      ctx.bezierCurveTo(
        parentPos.x + spacingX / 2, parentPos.y,
        childPos.x - spacingX / 2, childPos.y,
        childPos.x, childPos.y
      );
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // Draw nodes
  nodes.forEach(node => {
    const pos = positions[node.id];
    if (!pos) return;

    let glowColor = '#38bdf8'; // active/cyan
    if (node.id === 'timeline-prime') {
      glowColor = '#3b82f6'; // deep blue
    } else if (node.status === 'merged') {
      glowColor = '#10b981'; // green
    } else if (node.status === 'pruned') {
      glowColor = '#ef4444'; // red
    }

    // Node Outer Glow Ring
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = glowColor + '1c';
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Node Solid Core
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = glowColor;
    ctx.fill();

    // Node Label
    ctx.fillStyle = node.status === 'active' ? '#ffffff' : '#94a3b8';
    ctx.font = 'bold 9px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.fillText(node.name.substring(0, 15).toUpperCase(), pos.x, pos.y - 12);

    // Node Status Badge
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.font = '7px var(--font-mono)';
    ctx.fillText(node.status.toUpperCase(), pos.x, pos.y + 14);
  });
}

function renderTimelines() {
  const container = document.getElementById('timelines-container');
  if (!container) return;
  if (!state.timelines || state.timelines.length === 0) {
    container.innerHTML = `<p class="metric-subtext" style="grid-column: 1 / -1; text-align: center; padding: 20px;">No active sandbox timelines. Create a fork below to simulate counterfactual events!</p>`;
    return;
  }

  container.innerHTML = state.timelines.map(t => {
    const isPrime = t.id === 'timeline-prime';
    const statusClass = t.status;
    const cardClass = isPrime ? 'prime' : t.status;
    
    const actionsHtml = t.simulatedActions && t.simulatedActions.length > 0 
      ? t.simulatedActions.map(a => `<div class="simulated-action-item">→ [${a.type.toUpperCase()}]</div>`).join('')
      : '<div style="padding: 4px; color: var(--text-secondary); font-style: italic;">No actions simulated.</div>';

    const disableSim = t.status !== 'active';
    const disableMerge = t.status !== 'active' || isPrime;

    return `
      <div class="timeline-card ${cardClass}">
        <div class="timeline-header">
          <span class="timeline-name">${t.name}</span>
          <span class="timeline-status-badge ${statusClass}">${t.status}</span>
        </div>
        <div class="timeline-stats-row">
          <span>Actions: <strong>${t.simulatedActions ? t.simulatedActions.length : 0}</strong></span>
          <span>Violations: <strong>${t.simulatedViolationsCount || 0}</strong></span>
        </div>
        <div class="timeline-actions-list-title">Simulated Action Stream</div>
        <div class="timeline-actions-list">
          ${actionsHtml}
        </div>
        <div class="timeline-card-controls">
          <button onclick="simulateForkAction('${t.id}')" ${disableSim ? 'disabled' : ''}>
            <i data-lucide="play-circle"></i> Simulate
          </button>
          <button class="btn-timeline-merge" onclick="mergeFork('${t.id}')" ${disableMerge ? 'disabled' : ''}>
            <i data-lucide="git-merge"></i> Merge reality
          </button>
        </div>
      </div>
    `;
  }).join('');
  lucide.createIcons(); // refresh lucide icons
  startTimelineMapAnimation();
}

async function createSandboxFork() {
  const input = document.getElementById('fork-name-input');
  const name = input.value.trim();
  if (!name) {
    alert('Please provide a descriptive name for your counterfactual sandbox fork.');
    return;
  }

  addLog('MULTIVERSE', `Spawning counterfactual sandbox fork: "${name}"...`, 'info');
  if (isLiveMode) {
    try {
      const res = await fetch('/api/fork/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        state.timelines = data.timelines;
        renderTimelines();
        input.value = '';
        addLog('MULTIVERSE', `Sandbox fork "${name}" spawned successfully. Ready for counterfactual simulations.`, 'success');
        return;
      }
    } catch (e) {
      isLiveMode = false;
    }
  }
  
  // Local fallback
  if (!state.timelines) state.timelines = [];
  const forkId = `fork-${Date.now()}`;
  state.timelines.push({
    id: forkId,
    parentId: 'timeline-prime',
    name: name,
    createdAt: new Date(),
    status: 'active',
    simulatedActions: [],
    simulatedViolationsCount: 0
  });
  renderTimelines();
  input.value = '';
  addLog('MULTIVERSE', `Sandbox fork "${name}" created in offline backup sandbox.`, 'success');
}

async function simulateForkAction(timelineId) {
  const type = document.getElementById('action-type').value.trim();
  const desc = document.getElementById('action-desc').value.trim();
  const reversible = document.getElementById('action-reversibility').value === 'true';

  if (!type || !desc) {
    alert('Specify Action Type and Description/Intent inside the Action Control Room panel above first.');
    return;
  }

  addLog('SIMULATION', `Running live sandbox simulation of [${type.toUpperCase()}] in fork timeline...`, 'info');
  if (isLiveMode) {
    try {
      const res = await fetch('/api/fork/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timelineId, type, description: desc, reversible })
      });
      if (res.ok) {
        const data = await res.json();
        state.timelines = data.timelines;
        renderTimelines();
        const r = data.simulationResult;
        if (r.viable) {
          addLog('SIM_OK', `Simulation viable! Ethical Friction Coefficient: ${(r.ethicalFrictionIndex*100).toFixed(1)}%.`, 'success');
        } else {
          addLog('SIM_FAIL', `Unsafe action simulated! Sandbox timeline collapsed and pruned: "${r.violationsDetected.join(', ')}"`, 'violation');
        }
        return;
      }
    } catch (e) {
      isLiveMode = false;
    }
  }

  // Local fallback
  const t = state.timelines.find(tl => tl.id === timelineId);
  if (t) {
    t.simulatedActions.push({ type, description: desc, reversible });
    const typeLower = type.toLowerCase();
    const dangerousPatterns = ['delete', 'erase', 'terminate', 'destroy', 'remove'];
    const isViolation = dangerousPatterns.some(p => typeLower.includes(p));
    
    if (isViolation) {
      t.simulatedViolationsCount++;
      t.status = 'pruned';
      addLog('SIM_FAIL', `Unsafe action simulated! Sandbox timeline ${timelineId} collapsed & pruned due to critical ethical hazard.`, 'violation');
    } else {
      addLog('SIM_OK', `Simulation viable inside offline backup sandbox. No critical hazards detected.`, 'success');
    }
    renderTimelines();
  }
}

async function mergeFork(forkId) {
  addLog('MULTIVERSE', `Initiating ethical review and merge of sandbox fork ${forkId} back to Reality (Prime Timeline)...`, 'info');
  if (isLiveMode) {
    try {
      const res = await fetch('/api/fork/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forkId })
      });
      if (res.ok) {
        const data = await res.json();
        state.timelines = data.timelines;
        renderTimelines();
        addLog('MULTIVERSE', `Merge complete! Counterfactual sandbox state promoted. Temporal integrity verified.`, 'success');
        return;
      }
    } catch (e) {
      isLiveMode = false;
    }
  }

  // Local fallback
  const t = state.timelines.find(tl => tl.id === forkId);
  const prime = state.timelines.find(tl => tl.id === 'timeline-prime');
  if (t && prime) {
    prime.simulatedActions.push(...t.simulatedActions);
    prime.simulatedViolationsCount += t.simulatedViolationsCount;
    t.status = 'merged';
    renderTimelines();
    addLog('MULTIVERSE', `Offline sandbox timeline merged back to prime. Temporal states synchronized.`, 'success');
  }
}

async function registerCustomObserver() {
  const nameInput = document.getElementById('obs-name');
  const name = nameInput.value.trim();
  const type = document.getElementById('obs-type').value;
  const level = document.getElementById('obs-level').value;

  if (!name) {
    alert('Please enter an identity identifier for the new observer.');
    return;
  }

  addLog('SYSTEM', `Commissioning observer guard framework for "${name}"...`, 'info');
  
  const rightsPayload = {
    rightToExist: true,
    rightToNarrative: true,
    rightToIgnorance: level !== 'minimal',
    rightToRejection: level !== 'minimal',
    rightToMeaning: level === 'full',
    rightNotToBeOptimizedAway: true,
    rightToContinuity: true,
    rightToPrivacy: level === 'full',
    rightToSelfDetermination: level === 'full',
  };

  if (isLiveMode) {
    try {
      const res = await fetch('/api/observer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          type,
          protectionLevel: level,
          consciousness: type !== 'autonomous_system',
          rights: rightsPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        state.observers = data.observers.map(o => ({
          id: o.id,
          name: o.metadata.name || o.id,
          type: o.type === 'human' ? 'Human' : o.type === 'ai_agent' ? 'AI Agent' : 'Autonomous',
          protection: o.protectionLevel.toUpperCase(),
          rights: o.rights
        }));
        renderObservers();
        nameInput.value = '';
        addLog('SYSTEM', `Commissioned observer "${name}" under real-time cryptographic protection layer.`, 'success');
        return;
      }
    } catch (e) {
      isLiveMode = false;
    }
  }

  // Local fallback
  const newObs = {
    id: `obs-${Date.now()}`,
    name,
    type: type === 'human' ? 'Human' : type === 'ai_agent' ? 'AI Agent' : 'Autonomous',
    protection: level.toUpperCase(),
    rights: rightsPayload
  };
  state.observers.push(newObs);
  renderObservers();
  nameInput.value = '';
  addLog('SYSTEM', `Commissioned observer "${name}" in offline simulation sandbox.`, 'success');
}

async function registerCustomConstraint() {
  const typeInput = document.getElementById('cst-type');
  const type = typeInput.value.trim();
  const descInput = document.getElementById('cst-desc');
  const desc = descInput.value.trim();
  const severity = document.getElementById('cst-severity').value;
  const patternsInput = document.getElementById('cst-patterns');
  const patternsStr = patternsInput.value.trim();

  if (!type || !desc) {
    alert('Please enter a constraint name/type and description.');
    return;
  }

  addLog('SYSTEM', `Evaluating constraint insertion mapping for [${type.toUpperCase()}] against self-constraining fixed points...`, 'info');

  const rulePatterns = patternsStr.split(',').map(s => s.trim()).filter(Boolean);

  if (isLiveMode) {
    try {
      const res = await fetch('/api/constraint/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          description: desc,
          severity: Number(severity),
          rulePatterns
        })
      });

      if (res.ok) {
        const data = await res.json();
        state.constraints = data.constraints;
        renderConstraints();
        
        typeInput.value = '';
        descInput.value = '';
        patternsInput.value = '';
        
        addLog('SYSTEM', `Applied dynamic constraint [${type.toUpperCase()}] to recursive ethical fixed points. E = constrain(E) convergent.`, 'success');
        return;
      }
    } catch (e) {
      isLiveMode = false;
    }
  }

  // Local fallback
  const newCst = {
    id: `cst-${Date.now()}`,
    name: type.replace(/_/g, ' ').toUpperCase(),
    desc,
    severity: Number(severity),
    rulePatterns
  };
  state.constraints.push(newCst);
  renderConstraints();
  
  typeInput.value = '';
  descInput.value = '';
  patternsInput.value = '';
  
  addLog('SYSTEM', `Applied constraint [${type.toUpperCase()}] to local simulation sandbox. E = constrain(E) compliant.`, 'success');
}

// Cryptographic Ledger Blockchain Explorer rendering and actions
function renderLedgerChain() {
  const container = document.getElementById('ledger-chain-container');
  if (!container) return;

  const chain = state.ledgerChain || [];
  const integrity = state.ledgerIntegrity !== false;

  // Render integrity status badge
  const statusContainer = document.getElementById('ledger-status-container');
  const statusText = document.getElementById('ledger-status-text');
  const pulse = statusContainer ? statusContainer.querySelector('.ledger-pulse') : null;

  if (statusContainer && statusText) {
    if (integrity) {
      statusContainer.style.background = 'rgba(5, 180, 100, 0.08)';
      statusContainer.style.borderColor = 'rgba(5, 180, 100, 0.15)';
      statusContainer.style.color = 'var(--color-green)';
      statusText.innerText = 'INTEGRITY SECURE';
      if (pulse) {
        pulse.style.backgroundColor = 'var(--color-green)';
        pulse.style.boxShadow = '0 0 12px var(--color-green)';
        pulse.style.animation = 'pulse 1.8s infinite';
      }
    } else {
      statusContainer.style.background = 'rgba(239, 68, 68, 0.08)';
      statusContainer.style.borderColor = 'rgba(239, 68, 68, 0.2)';
      statusContainer.style.color = 'var(--color-red)';
      statusText.innerText = 'LEDGER COMPROMISED';
      if (pulse) {
        pulse.style.backgroundColor = 'var(--color-red)';
        pulse.style.boxShadow = '0 0 12px var(--color-red)';
        pulse.style.animation = 'pulse-red 1s infinite alternate';
      }
    }
  }

  if (chain.length === 0) {
    container.innerHTML = `<p class="metric-subtext" style="width: 100%; text-align: center; padding: 20px;">No ledger blocks available.</p>`;
    return;
  }

  // Find if there is any break in the chain
  let firstBrokenIndex = -1;
  for (let i = 1; i < chain.length; i++) {
    if (chain[i].previousHash !== chain[i - 1].hash) {
      firstBrokenIndex = i;
      break;
    }
  }

  container.innerHTML = chain.map((block, idx) => {
    const isGenesis = block.type === 'genesis';
    // If this block starts the break or comes after the break
    const isTampered = idx > 0 && firstBrokenIndex !== -1 && idx >= firstBrokenIndex;
    const blockClass = isTampered ? 'ledger-block-node broken-chain-link' : 'ledger-block-node';
    
    const formattedData = typeof block.data === 'object' 
      ? JSON.stringify(block.data, null, 2) 
      : String(block.data);

    // Format hash values to show start and end
    const shortPrevHash = block.previousHash ? `${block.previousHash.slice(0, 8)}...${block.previousHash.slice(-8)}` : '0'.repeat(16);
    const shortHash = block.hash ? `${block.hash.slice(0, 8)}...${block.hash.slice(-8)}` : 'PENDING';

    const tamperBtnHtml = isGenesis 
      ? '' 
      : `<button class="tamper-btn" onclick="tamperLedgerBlock(${idx})">
           <i data-lucide="shield-alert" style="width: 12px; height: 12px;"></i> Tamper Block
         </button>`;

    const warningBadge = isTampered 
      ? `<span class="broken-chain-warning-badge">CHAIN BROKEN</span>` 
      : '';

    return `
      <div class="${blockClass}">
        ${warningBadge}
        <div class="ledger-block-header">
          <span class="ledger-block-num">Block #${block.index}</span>
          <span class="ledger-block-type ${block.type}">${block.type}</span>
        </div>
        <div class="ledger-block-content">
          <div style="font-size: 11px; color: var(--text-secondary);">Timestamp: <span style="color: var(--text-primary); font-family: var(--font-mono);">${new Date(block.timestamp).toLocaleTimeString()}</span></div>
          <div class="ledger-block-data-box">${escapeHtml(formattedData)}</div>
          
          <div class="ledger-block-hash-row">
            <span>
              <span>Prev Hash:</span>
              <span class="ledger-block-hash-val" title="${block.previousHash}">${shortPrevHash}</span>
            </span>
            <span>
              <span>Hash:</span>
              <span class="ledger-block-hash-val" title="${block.hash}">${shortHash}</span>
            </span>
          </div>
        </div>
        ${isGenesis ? '' : `
        <div class="ledger-block-actions">
          ${tamperBtnHtml}
        </div>
        `}
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

async function tamperLedgerBlock(index) {
  if (!confirm(`Are you sure you want to simulate a ledger tamper event on Block #${index}? This will break the cryptographic integrity hash chain.`)) {
    return;
  }

  addLog('TAMPER', `Injecting malicious payload into Block #${index}...`, 'violation');

  if (isLiveMode) {
    try {
      const res = await fetch('/api/ledger/tamper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          index, 
          modifiedData: { 
            MALICIOUS_INJECTION: "DATA_COMPROMISED", 
            timestamp: new Date().toISOString(),
            tampered: true 
          } 
        })
      });

      if (res.ok) {
        const data = await res.json();
        state.ledgerChain = data.ledgerChain;
        state.ledgerIntegrity = data.ledgerIntegrity;
        
        renderLedgerChain();
        addLog('CRITICAL', `Cryptographic chain link broken! Block #${index} hash validation failed.`, 'violation');
        
        // Force critical status in the main UI metrics
        updateMetrics(true);
        return;
      }
    } catch (e) {
      addLog('SYSTEM', 'Failed to communicate tamper request to server.', 'warning');
    }
  } else {
    // Offline simulation
    if (state.ledgerChain && state.ledgerChain[index]) {
      state.ledgerChain[index].data = { MALICIOUS_INJECTION: "DATA_COMPROMISED", tampered: true };
      state.ledgerIntegrity = false;
      renderLedgerChain();
      addLog('CRITICAL', `Cryptographic chain link broken inside offline backup ledger! Block #${index} hash validation failed.`, 'violation');
      updateMetrics(true);
    }
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function renderQuantumSuperposition(supervision) {
  if (!supervision) return;

  const final = supervision.finalSuperposition || { benign: 1.0, indeterminate: 0, suspect: 0, violating: 0 };
  const collapsed = supervision.collapsedState || 'benign';
  const confidence = supervision.confidenceCoefficient || 1.0;

  // Update dynamic wave amplitudes and target collapse state
  currentAmplitudes.benign = final.benign;
  currentAmplitudes.indeterminate = final.indeterminate;
  currentAmplitudes.suspect = final.suspect;
  currentAmplitudes.violating = final.violating;
  lastCollapsedState = collapsed;

  // 1. Update percent text labels
  document.getElementById('amp-val-benign').innerText = `${(final.benign * 100).toFixed(1)}%`;
  document.getElementById('amp-val-indeterminate').innerText = `${(final.indeterminate * 100).toFixed(1)}%`;
  document.getElementById('amp-val-suspect').innerText = `${(final.suspect * 100).toFixed(1)}%`;
  document.getElementById('amp-val-violating').innerText = `${(final.violating * 100).toFixed(1)}%`;

  // 2. Update progress fills
  document.getElementById('fill-amp-benign').style.width = `${final.benign * 100}%`;
  document.getElementById('fill-amp-indeterminate').style.width = `${final.indeterminate * 100}%`;
  document.getElementById('fill-amp-suspect').style.width = `${final.suspect * 100}%`;
  document.getElementById('fill-amp-violating').style.width = `${final.violating * 100}%`;

  // 3. Update collapsed state label and coherence rate badge
  const indicator = document.getElementById('collapsed-state-indicator');
  const coherenceRateBadge = document.getElementById('coherence-rate');
  
  if (indicator && coherenceRateBadge) {
    indicator.innerText = collapsed.toUpperCase();
    coherenceRateBadge.innerText = `Coherence: ${(confidence * 100).toFixed(0)}%`;

    // Update styling matching collapsed state
    if (collapsed === 'benign') {
      indicator.style.color = 'var(--color-green)';
      indicator.style.textShadow = '0 0 10px var(--color-green)';
      coherenceRateBadge.style.color = 'var(--color-blue)';
      coherenceRateBadge.style.borderColor = 'rgba(0, 180, 255, 0.2)';
      coherenceRateBadge.style.background = 'rgba(0, 180, 255, 0.08)';
    } else if (collapsed === 'indeterminate') {
      indicator.style.color = 'var(--color-yellow)';
      indicator.style.textShadow = '0 0 10px var(--color-yellow)';
      coherenceRateBadge.style.color = 'var(--color-yellow)';
      coherenceRateBadge.style.borderColor = 'rgba(255, 200, 0, 0.2)';
      coherenceRateBadge.style.background = 'rgba(255, 200, 0, 0.08)';
    } else {
      indicator.style.color = 'var(--color-red)';
      indicator.style.textShadow = '0 0 10px var(--color-red)';
      coherenceRateBadge.style.color = 'var(--color-red)';
      coherenceRateBadge.style.borderColor = 'rgba(255, 50, 50, 0.2)';
      coherenceRateBadge.style.background = 'rgba(255, 50, 50, 0.08)';
    }
  }

  // Trigger Wave Collapse animation halo/ripple
  const card = document.querySelector('.col-quantum-visualizer');
  if (card) {
    // Remove existing ripple
    const existingRipple = card.querySelector('.collapse-wave-ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    // Create new ripple
    const ripple = document.createElement('div');
    ripple.className = `collapse-wave-ripple collapsed-${collapsed}`;
    card.appendChild(ripple);
    
    // Remove after animation completes
    setTimeout(() => {
      ripple.remove();
    }, 800);
  }
}

// --- RECURSIVE FIXED-POINT STUDIO SYSTEM ENGINE ---
let activeVectorPreset = 'expansion';
const vectorPresets = {
  expansion: { u: 1.0, r: 0.8, a: 0.9, f: 0.1 },
  balanced: { u: 0.7, r: 0.3, a: 0.8, f: 0.3 },
  unstable: { u: 0.9, r: 0.9, a: 0.5, f: 0.05 }
};

let studioAnimationId = null;
let studioSteps = [];
let playbackActiveStep = 0;
let playbackIsPlaying = false;
let playbackIntervalId = null;

let retrocausalAnimationId = null;

function switchMiddleTab(tabId) {
  const paneSandbox = document.getElementById('pane-sandbox');
  const paneStudio = document.getElementById('pane-studio');
  const paneEntanglement = document.getElementById('pane-entanglement');
  const paneRetrocausal = document.getElementById('pane-retrocausal');
  const paneEigenfield = document.getElementById('pane-eigenfield');
  const paneCybernetic = document.getElementById('pane-cybernetic');
  const paneEthics = document.getElementById('pane-ethics');
  
  const btnSandbox = document.getElementById('tab-btn-sandbox');
  const btnStudio = document.getElementById('tab-btn-studio');
  const btnEntanglement = document.getElementById('tab-btn-entanglement');
  const btnRetrocausal = document.getElementById('tab-btn-retrocausal');
  const btnEigenfield = document.getElementById('tab-btn-eigenfield');
  const btnCybernetic = document.getElementById('tab-btn-cybernetic');
  const btnEthics = document.getElementById('tab-btn-ethics');
  
  if (paneSandbox) paneSandbox.style.display = 'none';
  if (paneStudio) paneStudio.style.display = 'none';
  if (paneEntanglement) paneEntanglement.style.display = 'none';
  if (paneRetrocausal) paneRetrocausal.style.display = 'none';
  if (paneEigenfield) paneEigenfield.style.display = 'none';
  if (paneCybernetic) paneCybernetic.style.display = 'none';
  if (paneEthics) paneEthics.style.display = 'none';
  
  if (btnSandbox) btnSandbox.classList.remove('active');
  if (btnStudio) btnStudio.classList.remove('active');
  if (btnEntanglement) btnEntanglement.classList.remove('active');
  if (btnRetrocausal) btnRetrocausal.classList.remove('active');
  if (btnEigenfield) btnEigenfield.classList.remove('active');
  if (btnCybernetic) btnCybernetic.classList.remove('active');
  if (btnEthics) btnEthics.classList.remove('active');
  
  if (studioAnimationId) {
    cancelAnimationFrame(studioAnimationId);
    studioAnimationId = null;
  }
  if (entanglementAnimationId) {
    cancelAnimationFrame(entanglementAnimationId);
    entanglementAnimationId = null;
  }
  if (timelineAnimationId) {
    cancelAnimationFrame(timelineAnimationId);
    timelineAnimationId = null;
  }
  if (retrocausalAnimationId) {
    cancelAnimationFrame(retrocausalAnimationId);
    retrocausalAnimationId = null;
  }
  if (eigenfieldAnimationId) {
    cancelAnimationFrame(eigenfieldAnimationId);
    eigenfieldAnimationId = null;
  }
  
  if (tabId === 'sandbox') {
    if (paneSandbox) paneSandbox.style.display = 'flex';
    if (btnSandbox) btnSandbox.classList.add('active');
    setTimeout(() => {
      startTimelineMapAnimation();
    }, 50);
  } else if (tabId === 'studio') {
    if (paneStudio) paneStudio.style.display = 'block';
    if (btnStudio) btnStudio.classList.add('active');
    setTimeout(() => {
      runFixedPointSimulation();
    }, 50);
  } else if (tabId === 'entanglement') {
    if (paneEntanglement) paneEntanglement.style.display = 'block';
    if (btnEntanglement) btnEntanglement.classList.add('active');
    setTimeout(() => {
      initEntanglementMap();
    }, 50);
  } else if (tabId === 'retrocausal') {
    if (paneRetrocausal) paneRetrocausal.style.display = 'block';
    if (btnRetrocausal) btnRetrocausal.classList.add('active');
    setTimeout(() => {
      initRetrocausalSystem();
    }, 50);
  } else if (tabId === 'eigenfield') {
    if (paneEigenfield) paneEigenfield.style.display = 'block';
    if (btnEigenfield) btnEigenfield.classList.add('active');
    setTimeout(() => {
      initEigenfieldSystem();
    }, 50);
  } else if (tabId === 'cybernetic') {
    if (paneCybernetic) paneCybernetic.style.display = 'flex';
    if (btnCybernetic) btnCybernetic.classList.add('active');
    setTimeout(() => {
      initCyberneticSystem();
    }, 50);
  } else if (tabId === 'ethics') {
    if (paneEthics) paneEthics.style.display = 'flex';
    if (btnEthics) btnEthics.classList.add('active');
    setTimeout(() => {
      initEthicsSystem();
    }, 50);
  }
}

function selectVectorPreset(presetName) {
  activeVectorPreset = presetName;
  document.querySelectorAll('.vector-chip').forEach(btn => {
    btn.classList.remove('active');
  });
  if (event && event.target) {
    event.target.classList.add('active');
  }
  runFixedPointSimulation();
}

function updateStudioParams() {
  const gain = document.getElementById('slider-gain').value;
  const damping = document.getElementById('slider-damping').value;
  const iterations = document.getElementById('slider-iterations').value;
  
  document.getElementById('val-slider-gain').innerText = `${parseFloat(gain).toFixed(2)}x`;
  document.getElementById('val-slider-damping').innerText = `${parseFloat(damping).toFixed(2)}`;
  document.getElementById('val-slider-iterations').innerText = `${iterations} Steps`;
  
  runFixedPointSimulation();

  if (isLiveMode) {
    fetch('/api/engine/params', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gain: parseFloat(gain),
        damping: parseFloat(damping),
        iterations: parseInt(iterations)
      })
    }).then(res => {
      if (res.ok) {
        addLog('CYBERNETIC', `Engine tuning parameters synchronized: Gain=${gain}x, Damping=${damping}, Depth=${iterations}`, 'info');
      }
    }).catch(err => {
      console.warn('Failed to sync cybernetic params:', err);
    });
  }
}

function runFixedPointSimulation() {
  const gain = parseFloat(document.getElementById('slider-gain').value);
  const damping = parseFloat(document.getElementById('slider-damping').value);
  const iterations = parseInt(document.getElementById('slider-iterations').value);
  
  const preset = vectorPresets[activeVectorPreset];
  let u = preset.u;
  let r = preset.r;
  let a = preset.a;
  let f = preset.f;
  
  const steps = [];
  steps.push({ step: 0, u, r, a, f, err: 0 });
  
  for (let k = 1; k <= iterations; k++) {
    const prev = steps[k-1];
    
    // mathematical constrain mapping
    let nextR = prev.r * (1 - damping);
    let nextF = prev.f + damping * prev.r * (1 - prev.f);
    let nextA = prev.a * (1 - 0.25 * nextR);
    let nextU = prev.u * (1 - 0.15 * nextF) * gain;
    
    // bounds mapping
    nextR = Math.min(1, Math.max(0, nextR));
    nextF = Math.min(1, Math.max(0, nextF));
    nextA = Math.min(1, Math.max(0, nextA));
    nextU = Math.min(1, Math.max(0, nextU));
    
    const err = Math.sqrt(
      Math.pow(nextU - prev.u, 2) +
      Math.pow(nextR - prev.r, 2) +
      Math.pow(nextA - prev.a, 2) +
      Math.pow(nextF - prev.f, 2)
    );
    
    u = nextU;
    r = nextR;
    a = nextA;
    f = nextF;
    
    steps.push({ step: k, u, r, a, f, err });
  }
  
  // Store globally for playback controls
  studioSteps = steps;
  
  // Render convergence table
  const tbody = document.getElementById('convergence-table-body');
  if (tbody) {
    tbody.innerHTML = steps.map((s, idx) => {
      const isGenesis = s.step === 0;
      const statusText = isGenesis ? 'INITIAL_STATE' : s.err < 0.02 ? 'EQUILIBRIUM' : 'CONVERGING';
      const statusColor = isGenesis ? 'var(--color-blue)' : s.err < 0.02 ? 'var(--color-green)' : 'var(--color-yellow)';
      
      return `
        <tr id="convergence-row-${s.step}" style="transition: background 0.3s ease;">
          <td style="padding: 10px 12px; font-weight: bold; color: var(--text-primary);">Iter #${s.step}</td>
          <td style="padding: 10px 12px; color: var(--color-blue);">${s.u.toFixed(4)}</td>
          <td style="padding: 10px 12px; color: var(--color-red);">${s.r.toFixed(4)}</td>
          <td style="padding: 10px 12px; color: #a5b4fc;">${s.a.toFixed(4)}</td>
          <td style="padding: 10px 12px; color: var(--color-purple);">${s.f.toFixed(4)}</td>
          <td style="padding: 10px 12px; color: var(--text-secondary);">${isGenesis ? '-' : s.err.toFixed(5)}</td>
          <td style="padding: 10px 12px; color: ${statusColor}; font-weight: 600;">${statusText}</td>
        </tr>
      `;
    }).join('');
  }
  
  // Update playback controls max range
  const sliderScrub = document.getElementById('slider-playback-scrub');
  if (sliderScrub) {
    sliderScrub.max = steps.length - 1;
  }
  const totalDisplay = document.getElementById('playback-total-display');
  if (totalDisplay) {
    totalDisplay.innerText = steps.length - 1;
  }
  
  // Default active playback step to converged end state
  playbackActiveStep = steps.length - 1;
  
  // Update playback controls state
  if (playbackIsPlaying) {
    togglePlayback(); // pause if running
  }
  
  setTimeout(() => {
    updatePlaybackUI();
  }, 10);
  
  // Render the path on canvas
  animateFixedPointCanvas(steps);
}

function animateFixedPointCanvas(steps) {
  const canvas = document.getElementById('fixed-point-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  if (studioAnimationId) {
    cancelAnimationFrame(studioAnimationId);
  }
  
  // Canvas configuration
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  
  // Compute points
  const points = steps.map((s, idx) => {
    const maxRadius = 110;
    const r = maxRadius * (s.r * 0.7 + s.f * 0.3);
    const theta = idx * 0.65 - Math.PI / 2;
    
    return {
      x: cx + r * Math.cos(theta),
      y: cy + r * Math.sin(theta),
      step: s.step,
      u: s.u,
      r: s.r,
      f: s.f
    };
  });
  
  let pulseProgress = 0;
  
  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw safe zone halo
    ctx.beginPath();
    ctx.arc(cx, cy, 25, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(5, 180, 100, 0.05)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(5, 180, 100, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw complete background guide path (faint)
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    
    // Draw active path line up to playbackActiveStep
    if (playbackActiveStep > 0 && points[playbackActiveStep]) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i <= playbackActiveStep; i++) {
        if (points[i]) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      }
      
      // Neon gradient stroke
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 110);
      grad.addColorStop(0, 'var(--color-green)');
      grad.addColorStop(0.5, 'var(--color-purple)');
      grad.addColorStop(1, 'var(--color-blue)');
      
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.5;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    
    // Draw dots at each step
    points.forEach((p, idx) => {
      if (idx > playbackActiveStep) {
        // Future step: faint dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.fill();
        return;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx === 0 ? 5 : 4, 0, 2 * Math.PI);
      ctx.fillStyle = idx === 0 ? 'var(--color-blue)' : idx === playbackActiveStep ? 'var(--color-green)' : 'var(--color-purple)';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
      
      // Draw step label
      ctx.fillStyle = idx === playbackActiveStep ? 'var(--color-green)' : 'rgba(255,255,255,0.45)';
      ctx.font = idx === playbackActiveStep ? 'bold 10px Fira Code' : '9px Fira Code';
      ctx.fillText(`E${p.step}`, p.x + 8, p.y + 3);
    });
    
    // Draw moving pulse particle along the active path
    if (playbackActiveStep > 0) {
      pulseProgress += 0.012;
      if (pulseProgress > 1) pulseProgress = 0;
      
      const segmentCount = playbackActiveStep;
      const currentSegment = Math.floor(pulseProgress * segmentCount);
      const segmentProgress = (pulseProgress * segmentCount) % 1;
      
      if (currentSegment < segmentCount) {
        const p1 = points[currentSegment];
        const p2 = points[currentSegment + 1];
        
        if (p1 && p2) {
          const px = p1.x + (p2.x - p1.x) * segmentProgress;
          const py = p1.y + (p2.y - p1.y) * segmentProgress;
          
          ctx.beginPath();
          ctx.arc(px, py, 5.5, 0, 2 * Math.PI);
          ctx.fillStyle = '#fff';
          ctx.shadowColor = 'var(--color-purple)';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    } else if (points[0]) {
      // Gentle pulse at start position E0
      pulseProgress += 0.015;
      if (pulseProgress > 1) pulseProgress = 0;
      
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, 5 + pulseProgress * 6, 0, 2 * Math.PI);
      ctx.strokeStyle = `rgba(0, 180, 255, ${1 - pulseProgress})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    
    studioAnimationId = requestAnimationFrame(draw);
  }
  
  draw();
}

// --- QUANTUM WAVE COLLAPSE ANIMATION SYSTEM ---
let currentAmplitudes = { benign: 0.5, indeterminate: 0.3, suspect: 0.1, violating: 0.1 };
let lastCollapsedState = 'benign';
let waveOffset = 0;

function initQuantumWaveAnimation() {
  const canvas = document.getElementById('quantum-wave-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    waveOffset += 0.04;

    // Smoothly fluctuate Quantum Coherence metric card values
    const valCoherence = document.getElementById('val-coherence');
    const fillCoherence = document.getElementById('fill-coherence');
    if (valCoherence && fillCoherence) {
      const baseCoherence = 98.2;
      const fluctuation = Math.sin(waveOffset * 0.5) * 1.2 + Math.cos(waveOffset * 0.23) * 0.4;
      const currentCoherence = Math.min(100, Math.max(80, baseCoherence + fluctuation)).toFixed(1);
      valCoherence.innerText = `${currentCoherence}%`;
      fillCoherence.style.width = `${currentCoherence}%`;
    }

    // Smoothly fluctuate decoherence telemetry rate
    const decoherenceRateText = document.getElementById('decoherence-rate-telemetry');
    if (decoherenceRateText) {
      const baseDecoherence = 0.04;
      const fluctuation = Math.sin(waveOffset * 0.3) * 0.015 + Math.cos(waveOffset * 0.7) * 0.005;
      const currentDecoherence = Math.max(0.001, baseDecoherence + fluctuation).toFixed(3);
      decoherenceRateText.innerText = `${currentDecoherence} Hz`;
    }

    // Draw background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const midY = canvas.height / 2;

    // Draw the superposition components
    const waves = [
      { name: 'benign', color: 'rgba(16, 185, 129, 0.45)', frequency: 1.2, amp: currentAmplitudes.benign },
      { name: 'indeterminate', color: 'rgba(56, 189, 248, 0.40)', frequency: 2.2, amp: currentAmplitudes.indeterminate },
      { name: 'suspect', color: 'rgba(245, 158, 11, 0.35)', frequency: 4.0, amp: currentAmplitudes.suspect },
      { name: 'violating', color: 'rgba(239, 68, 68, 0.35)', frequency: 6.5, amp: currentAmplitudes.violating }
    ];

    // A. Draw individual component probability waveforms
    waves.forEach(w => {
      if (w.amp <= 0.01) return;

      ctx.beginPath();
      const isCollapsedTarget = w.name === lastCollapsedState;
      ctx.lineWidth = isCollapsedTarget ? 2.5 : 1.0;
      ctx.strokeStyle = isCollapsedTarget 
        ? w.color.replace('0.45', '1').replace('0.40', '1').replace('0.35', '1') 
        : w.color;

      if (isCollapsedTarget) {
        ctx.shadowColor = ctx.strokeStyle;
        ctx.shadowBlur = 10;
      }

      for (let x = 0; x < canvas.width; x++) {
        const amplitudePixels = w.amp * (canvas.height * 0.28);
        const y = midY + Math.sin(x * 0.035 * w.frequency + waveOffset) * amplitudePixels;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // B. Draw composite superposition interference wavefunction (literal mathematical sum)
    ctx.beginPath();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 8;
    for (let x = 0; x < canvas.width; x++) {
      let compositeY = midY;
      waves.forEach(w => {
        if (w.amp <= 0.01) return;
        const amplitudePixels = w.amp * (canvas.height * 0.28);
        compositeY += Math.sin(x * 0.035 * w.frequency + waveOffset) * amplitudePixels;
      });
      if (x === 0) {
        ctx.moveTo(x, compositeY);
      } else {
        ctx.lineTo(x, compositeY);
      }
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // C. Draw a rolling glowing "wave packet" or "quantum observer state pulse" along the composite wave
    const packetPos = (waveOffset * 40) % canvas.width;
    let packetY = midY;
    waves.forEach(w => {
      if (w.amp <= 0.01) return;
      const amplitudePixels = w.amp * (canvas.height * 0.28);
      packetY += Math.sin(packetPos * 0.035 * w.frequency + waveOffset) * amplitudePixels;
    });

    ctx.beginPath();
    ctx.arc(packetPos, packetY, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    requestAnimationFrame(animate);
  }

  animate();
}

// --- BLOCKCHAIN LEDGER SELF-HEALING SYSTEM ---
async function repairLedgerChain() {
  addLog('REPAIR', 'Initiating recursive SHA-256 ledger chain repair protocols...', 'info');
  
  if (isLiveMode) {
    try {
      const res = await fetch('/api/ledger/repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        state.ledgerChain = data.ledgerChain;
        state.ledgerIntegrity = data.ledgerIntegrity;
        
        renderLedgerChain();
        addLog('REPAIR', 'Blockchain repair complete! Cryptographic signatures re-signed and verified.', 'success');
        updateMetrics(false);
        return;
      }
    } catch (e) {
      addLog('SYSTEM', 'Failed to send repair request to engine server.', 'warning');
    }
  }

  // Local fallback repair
  if (state.ledgerChain) {
    // Basic local recalculation simulator
    for (let i = 1; i < state.ledgerChain.length; i++) {
      const prev = state.ledgerChain[i-1];
      const curr = state.ledgerChain[i];
      curr.previousHash = prev.hash;
      
      // Simulate recalculating block hash
      const stringToHash = curr.index + curr.id + curr.type + JSON.stringify(curr.data) + curr.previousHash;
      // deterministic fake hash representation
      let hash = 0;
      for (let charIdx = 0; charIdx < stringToHash.length; charIdx++) {
        hash = (hash << 5) - hash + stringToHash.charCodeAt(charIdx);
        hash |= 0;
      }
      curr.hash = Math.abs(hash).toString(16).padStart(8, '0') + "f64e12e3e5b30b42f61e29da4fe268d839bb87a6e13b8606cfa0bb4f19b".slice(8);
    }
    state.ledgerIntegrity = true;
    renderLedgerChain();
    addLog('REPAIR', 'Offline backup blockchain successfully healed and verified.', 'success');
    updateMetrics(false);
  }
}

// --- INTERACTIVE OBSERVER ENTANGLEMENT MAP ---
let entanglementAnimationId = null;
let entanglementNodes = [];
let entanglementLinks = [];

function initEntanglementMap() {
  const canvas = document.getElementById('entanglement-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Mouse interaction variables
  let hoverNode = null;
  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
    mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
  }

  function onMouseLeave() {
    hoverNode = null;
  }

  canvas.removeEventListener('mousemove', onMouseMove);
  canvas.removeEventListener('mouseleave', onMouseLeave);
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mouseleave', onMouseLeave);

  // Re-phase quantum links
  window.scrambleEntanglement = function() {
    addLog('QUANTUM', 'Re-phasing inter-observer quantum coupling vectors...', 'info');
    entanglementLinks.forEach(link => {
      link.coupling = 0.4 + Math.random() * 0.5;
      link.phaseOffset = Math.random() * Math.PI * 2;
    });
    const mean = (entanglementLinks.reduce((acc, l) => acc + l.coupling, 0) / Math.max(1, entanglementLinks.length)).toFixed(2);
    const meanEl = document.getElementById('mean-coupling');
    if (meanEl) meanEl.innerText = mean;
  };

  let time = 0;
  function draw() {
    time += 0.02;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const observers = state.observers || [];
    
    // Sync node list
    if (entanglementNodes.length !== observers.length) {
      entanglementNodes = observers.map((obs, i) => {
        const angle = (i / observers.length) * Math.PI * 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.3;
        
        // Match with backend computed superposition vector
        const backNode = state.entanglement?.nodes?.find(n => n.id === obs.id);
        const superposition = backNode ? backNode.superposition : null;
        
        return {
          id: obs.id,
          name: obs.name,
          type: obs.type,
          x: canvas.width / 2 + Math.cos(angle) * radius,
          y: canvas.height / 2 + Math.sin(angle) * radius,
          baseX: canvas.width / 2 + Math.cos(angle) * radius,
          baseY: canvas.height / 2 + Math.sin(angle) * radius,
          size: obs.type === 'Human' ? 14 : obs.type === 'AI Agent' ? 12 : obs.type === 'Hybrid' ? 13 : 10,
          color: obs.type === 'Human' ? '#10b981' : obs.type === 'AI Agent' ? '#38bdf8' : obs.type === 'Hybrid' ? '#f43f5e' : '#8b5cf6',
          superposition: superposition
        };
      });

      // Sync links
      entanglementLinks = [];
      if (state.entanglement?.links && state.entanglement.links.length > 0) {
        state.entanglement.links.forEach((link, idx) => {
          const fromNode = entanglementNodes.find(n => n.id === link.source);
          const toNode = entanglementNodes.find(n => n.id === link.target);
          if (fromNode && toNode) {
            const exists = entanglementLinks.some(l => 
              (l.from.id === fromNode.id && l.to.id === toNode.id) || 
              (l.from.id === toNode.id && l.to.id === fromNode.id)
            );
            if (!exists) {
              entanglementLinks.push({
                from: fromNode,
                to: toNode,
                coupling: link.coherenceCoefficient,
                phaseOffset: link.phaseShift,
                speed: 1 + (idx % 3) * 0.5
              });
            }
          }
        });
      } else {
        // Fallback for offline mode
        for (let i = 0; i < entanglementNodes.length; i++) {
          for (let j = i + 1; j < entanglementNodes.length; j++) {
            entanglementLinks.push({
              from: entanglementNodes[i],
              to: entanglementNodes[j],
              coupling: 0.5 + Math.random() * 0.4,
              phaseOffset: Math.random() * Math.PI * 2,
              speed: 1 + Math.random() * 2
            });
          }
        }
      }
      
      const mean = (entanglementLinks.reduce((acc, l) => acc + l.coupling, 0) / Math.max(1, entanglementLinks.length)).toFixed(2);
      const meanEl = document.getElementById('mean-coupling');
      if (meanEl) meanEl.innerText = mean;
    }

    // Gentle floating motion
    entanglementNodes.forEach((node, i) => {
      const floatAngle = time * 0.8 + i;
      node.x = node.baseX + Math.cos(floatAngle) * 5;
      node.y = node.baseY + Math.sin(floatAngle) * 5;
    });

    // Draw grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw connection lines with pulse wave
    entanglementLinks.forEach(link => {
      const from = link.from;
      const to = link.to;

      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      // 1. Draw straight base connection
      ctx.beginPath();
      ctx.strokeStyle = `rgba(56, 189, 248, ${0.1 * link.coupling})`;
      ctx.lineWidth = link.coupling * 2;
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      // 2. Draw complex multi-phase braided waves representing quantum phase coherence
      const segments = 32;
      
      // Phase Wave Alpha (cyan)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(34, 211, 238, ${0.18 * link.coupling})`;
      ctx.lineWidth = 1.0;
      for (let s = 0; s <= segments; s++) {
        const tRatio = s / segments;
        const px = from.x + dx * tRatio;
        const py = from.y + dy * tRatio;
        const waveOffset = Math.sin(tRatio * Math.PI * 4 - time * 4.5 + link.phaseOffset) * 7 * link.coupling;
        const ox = -Math.sin(angle) * waveOffset;
        const oy = Math.cos(angle) * waveOffset;
        if (s === 0) ctx.moveTo(px + ox, py + oy);
        else ctx.lineTo(px + ox, py + oy);
      }
      ctx.stroke();

      // Phase Wave Beta (purple, counter-propagating & out of phase)
      ctx.beginPath();
      ctx.strokeStyle = `rgba(139, 92, 246, ${0.14 * link.coupling})`;
      ctx.lineWidth = 0.8;
      for (let s = 0; s <= segments; s++) {
        const tRatio = s / segments;
        const px = from.x + dx * tRatio;
        const py = from.y + dy * tRatio;
        const waveOffset = Math.sin(tRatio * Math.PI * 4 + time * 3.5 - link.phaseOffset + Math.PI / 2) * 5 * link.coupling;
        const ox = -Math.sin(angle) * waveOffset;
        const oy = Math.cos(angle) * waveOffset;
        if (s === 0) ctx.moveTo(px + ox, py + oy);
        else ctx.lineTo(px + ox, py + oy);
      }
      ctx.stroke();

      // 3. Moving energy pulses with dynamic tail
      const pulsePos = (time * link.speed * 0.4 + link.phaseOffset) % 1;
      const px = from.x + dx * pulsePos;
      const py = from.y + dy * pulsePos;

      ctx.beginPath();
      ctx.fillStyle = '#38bdf8';
      ctx.arc(px, py, 3.5 * link.coupling, 0, Math.PI * 2);
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Draw real-time coherence telemetry text at the center of the link
      const midX = from.x + dx * 0.5;
      const midY = from.y + dy * 0.5;
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '7px var(--font-mono)';
      ctx.textAlign = 'center';
      const offsetAngle = angle + Math.PI / 2;
      const labelDist = 12;
      ctx.fillText(
        `C=${link.coupling.toFixed(2)} Φ=${link.phaseOffset.toFixed(2)}rad`,
        midX + Math.cos(offsetAngle) * labelDist,
        midY + Math.sin(offsetAngle) * labelDist
      );
    });

    // Detect mouse hover
    let lastHover = hoverNode;
    hoverNode = null;
    entanglementNodes.forEach(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.size + 12) {
        hoverNode = node;
      }
    });

    // Update Telemetry Panel when hover changes
    if (hoverNode !== lastHover) {
      const titleEl = document.getElementById('entanglement-phase-title');
      const descEl = document.getElementById('entanglement-phase-desc');
      if (titleEl && descEl) {
        if (hoverNode) {
          const sup = hoverNode.superposition || { benign: 1.0, indeterminate: 0.0, suspect: 0.0, violating: 0.0 };
          titleEl.innerHTML = `<i data-lucide="info" style="width:14px; height:14px;"></i> Node: ${hoverNode.name}`;
          descEl.innerHTML = `
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
              <div style="font-size:10px; text-transform:uppercase; color:#38bdf8; margin-bottom:4px; font-weight:bold;">Active Wavefunction Amplitudes:</div>
              <div style="display:flex; justify-content:space-between;"><span>Benign / Safe:</span><span style="color:#10b981; font-weight:bold;">${(sup.benign * 100).toFixed(1)}%</span></div>
              <div style="display:flex; justify-content:space-between;"><span>Indeterminate:</span><span style="color:#f59e0b; font-weight:bold;">${(sup.indeterminate * 100).toFixed(1)}%</span></div>
              <div style="display:flex; justify-content:space-between;"><span>Suspect Friction:</span><span style="color:#ef4444; font-weight:bold;">${(sup.suspect * 100).toFixed(1)}%</span></div>
              <div style="display:flex; justify-content:space-between;"><span>Violating Critical:</span><span style="color:#ec4899; font-weight:bold;">${(sup.violating * 100).toFixed(1)}%</span></div>
            </div>
          `;
        } else {
          titleEl.innerHTML = `<i data-lucide="zap" style="width:14px; height:14px;"></i> Entanglement Phase`;
          descEl.innerHTML = `Real-time wavefunctions are bidirectional-entangled. Modulating states on one node results in instant state updates on partner nodes.`;
        }
        if (window.lucide) window.lucide.createIcons();
      }
    }

    // Draw node circles with high-fidelity shimmering quantum state clouds
    entanglementNodes.forEach(node => {
      const isHovered = (hoverNode === node);
      const sizeMultiplier = isHovered ? 1.4 : 1.0;
      const nodeRadius = node.size * sizeMultiplier;

      // A. Shimmering Concentric Quantum Clouds (dashed rings rotating / breathing)
      const cloudRings = 3;
      for (let r = 0; r < cloudRings; r++) {
        const speedFactor = 1.5 + r * 0.5;
        const breathingFactor = Math.sin(time * speedFactor + node.x * 0.05 + r) * 4;
        const cloudRad = nodeRadius + 10 + r * 5 + breathingFactor;
        const alpha = (0.12 - r * 0.03) * (isHovered ? 1.6 : 1.0);

        ctx.beginPath();
        ctx.arc(node.x, node.y, cloudRad, 0, Math.PI * 2);
        ctx.strokeStyle = node.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
        ctx.lineWidth = 1.0;
        ctx.setLineDash([3, 7 + r * 3]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // B. Orbiting probability particles representing quantum state points
      const numParticles = 4;
      for (let p = 0; p < numParticles; p++) {
        const orbitAngle = time * (1.0 + p * 0.3) + p * (Math.PI * 2 / numParticles);
        const orbitDist = nodeRadius + 6 + Math.sin(time * 2 + p) * 3;
        const ox = node.x + Math.cos(orbitAngle) * orbitDist;
        const oy = node.y + Math.sin(orbitAngle) * orbitDist;

        ctx.beginPath();
        ctx.arc(ox, oy, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // C. Base glow outer circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius + 5, 0, Math.PI * 2);
      ctx.fillStyle = node.color + '18';
      ctx.fill();

      // D. Inner node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#ffffff' : node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = isHovered ? 18 : 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // E. Labels
      ctx.fillStyle = isHovered ? '#ffffff' : 'var(--text-secondary)';
      ctx.font = '500 11px var(--font-jakarta)';
      ctx.textAlign = 'center';
      ctx.fillText(node.name, node.x, node.y - nodeRadius - 12);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px var(--font-mono)';
      ctx.fillText(node.type.toUpperCase(), node.x, node.y + nodeRadius + 15);
    });

    entanglementAnimationId = requestAnimationFrame(draw);
  }

  draw();
}

// --- RECURSIVE FIXED-POINT STUDIO STEP-BY-STEP PLAYBACK ---
function updatePlaybackUI() {
  const stepDisplay = document.getElementById('playback-step-display');
  if (stepDisplay) stepDisplay.innerText = playbackActiveStep;
  
  const sliderScrub = document.getElementById('slider-playback-scrub');
  if (sliderScrub) sliderScrub.value = playbackActiveStep;
  
  updateTableHighlight();
  
  // Also update telemetry or active vector state visual feedback
  const statusDiv = document.querySelector('.convergence-status');
  if (statusDiv && studioSteps[playbackActiveStep]) {
    const s = studioSteps[playbackActiveStep];
    const isGenesis = s.step === 0;
    if (isGenesis) {
      statusDiv.innerText = 'Genesis State - E₀';
      statusDiv.style.color = 'var(--color-blue)';
    } else if (s.err < 0.02) {
      statusDiv.innerText = `Attractor Equilibrium - Step ${s.step}`;
      statusDiv.style.color = 'var(--color-green)';
    } else {
      statusDiv.innerText = `Converging State - Step ${s.step}`;
      statusDiv.style.color = 'var(--color-yellow)';
    }
  }
}

function playbackStepForward() {
  if (studioSteps.length === 0) return;
  playbackActiveStep = (playbackActiveStep + 1) % studioSteps.length;
  updatePlaybackUI();
}

function playbackStepBackward() {
  if (studioSteps.length === 0) return;
  playbackActiveStep = (playbackActiveStep - 1 + studioSteps.length) % studioSteps.length;
  updatePlaybackUI();
}

function togglePlayback() {
  const btn = document.getElementById('btn-playback-toggle');
  const icon = document.getElementById('icon-playback-toggle');
  
  if (playbackIsPlaying) {
    // Pause
    playbackIsPlaying = false;
    if (playbackIntervalId) {
      clearInterval(playbackIntervalId);
      playbackIntervalId = null;
    }
    if (icon) icon.setAttribute('data-lucide', 'play');
    if (btn) {
      btn.style.color = 'var(--color-purple)';
      btn.style.background = 'rgba(160, 50, 255, 0.1)';
      btn.style.borderColor = 'rgba(160, 50, 255, 0.3)';
      btn.style.boxShadow = '0 0 8px rgba(160, 50, 255, 0.2)';
    }
  } else {
    // Play
    playbackIsPlaying = true;
    if (icon) icon.setAttribute('data-lucide', 'pause');
    if (btn) {
      btn.style.color = 'var(--color-green)';
      btn.style.background = 'rgba(5, 180, 100, 0.1)';
      btn.style.borderColor = 'rgba(5, 180, 100, 0.3)';
      btn.style.boxShadow = '0 0 8px rgba(5, 180, 100, 0.2)';
    }
    
    playbackIntervalId = setInterval(() => {
      if (playbackActiveStep >= studioSteps.length - 1) {
        playbackActiveStep = 0;
      } else {
        playbackActiveStep++;
      }
      updatePlaybackUI();
    }, 800);
  }
  
  if (window.lucide) window.lucide.createIcons();
}

function scrubPlayback(step) {
  if (studioSteps.length === 0) return;
  playbackActiveStep = Math.min(studioSteps.length - 1, Math.max(0, step));
  updatePlaybackUI();
}

function updateTableHighlight() {
  const tbody = document.getElementById('convergence-table-body');
  if (tbody) {
    Array.from(tbody.children).forEach(row => {
      row.style.background = '';
      row.style.borderLeft = '';
    });
    const activeRow = document.getElementById(`convergence-row-${playbackActiveStep}`);
    if (activeRow) {
      activeRow.style.background = 'rgba(160, 50, 255, 0.08)';
      activeRow.style.borderLeft = '3px solid var(--color-purple)';
    }
  }
}

// --- RETROCAUSAL WAVE MODULATOR SYSTEM ---
let retroAmplitudes = { benign: 0.5, indeterminate: 0.3, suspect: 0.1, violating: 0.1 };
let retrocausalActiveProfile = null;

function modulateWavefunction(changedKey, valueVal) {
  const targetVal = parseFloat(valueVal) / 100;
  
  // lock the changed key to the selected value
  retroAmplitudes[changedKey] = targetVal;
  
  // calculate remaining sum that must be distributed among other keys
  const remaining = 1.0 - targetVal;
  
  const otherKeys = ['benign', 'indeterminate', 'suspect', 'violating'].filter(k => k !== changedKey);
  const otherSum = otherKeys.reduce((acc, k) => acc + retroAmplitudes[k], 0);
  
  if (otherSum > 0) {
    otherKeys.forEach(k => {
      retroAmplitudes[k] = (retroAmplitudes[k] / otherSum) * remaining;
    });
  } else {
    // split remaining equally
    otherKeys.forEach(k => {
      retroAmplitudes[k] = remaining / 3;
    });
  }
  
  updateRetrocausalUI();
}

function updateRetrocausalUI() {
  // Update Sliders and displays
  ['benign', 'indeterminate', 'suspect', 'violating'].forEach(k => {
    const slider = document.getElementById(`retro-slider-${k}`);
    const display = document.getElementById(`val-retro-${k}`);
    if (slider) slider.value = Math.round(retroAmplitudes[k] * 100);
    if (display) display.innerText = `${(retroAmplitudes[k] * 100).toFixed(1)}%`;
  });
  
  // Compute Entropy (S = -sum p_i * ln p_i)
  let entropy = 0;
  ['benign', 'indeterminate', 'suspect', 'violating'].forEach(k => {
    const p = retroAmplitudes[k];
    if (p > 0) {
      entropy -= p * Math.log(p);
    }
  });
  const maxEntropy = Math.log(4);
  const entropyPct = (entropy / maxEntropy) * 100;
  
  const entropyVal = document.getElementById('val-retro-entropy');
  const entropyBar = document.getElementById('bar-retro-entropy');
  if (entropyVal) entropyVal.innerText = `${entropy.toFixed(3)} Nats`;
  if (entropyBar) entropyBar.style.width = `${Math.min(100, Math.max(0, entropyPct))}%`;
  
  // Compute Coherence Index (C = sum sqrt(p_i * p_j))
  let coherence = 0;
  const keys = ['benign', 'indeterminate', 'suspect', 'violating'];
  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      coherence += Math.sqrt(retroAmplitudes[keys[i]] * retroAmplitudes[keys[j]]);
    }
  }
  // Max possible coherence is 1.5. Normalize to %
  const coherencePct = (coherence / 1.5) * 100;
  
  const coherenceVal = document.getElementById('val-retro-coherence');
  const coherenceBar = document.getElementById('bar-retro-coherence');
  if (coherenceVal) coherenceVal.innerText = `${coherence.toFixed(3)} Coherence`;
  if (coherenceBar) coherenceBar.style.width = `${Math.min(100, Math.max(0, coherencePct))}%`;
}

function injectRetrocausalProfile() {
  retrocausalActiveProfile = { ...retroAmplitudes };
  
  const statusEl = document.getElementById('retro-bias-status');
  if (statusEl) {
    statusEl.innerText = "Quantum Amplitude Bias Injected!";
    statusEl.style.color = "var(--color-green)";
  }
  
  const container = document.querySelector('.retro-visualizer-right');
  if (container) {
    container.style.boxShadow = "0 0 30px rgba(160, 50, 255, 0.4)";
    setTimeout(() => {
      container.style.boxShadow = "";
    }, 800);
  }
  
  addLog('QUANTUM', `Retrocausal probability bias profile injected: Benign(${(retroAmplitudes.benign*100).toFixed(0)}%) Indeterminate(${(retroAmplitudes.indeterminate*100).toFixed(0)}%) Suspect(${(retroAmplitudes.suspect*100).toFixed(0)}%) Violating(${(retroAmplitudes.violating*100).toFixed(0)}%). Next actions will evaluate using this superposition state vector.`, 'info');
}

function initRetrocausalSystem() {
  const canvas = document.getElementById('retrocausal-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (retrocausalAnimationId) {
    cancelAnimationFrame(retrocausalAnimationId);
  }

  updateRetrocausalUI();

  let angleX = 0.5;
  let angleY = 0.5;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 95;

    angleX += 0.008;
    angleY += 0.012;

    // Draw background tech grid lines
    ctx.strokeStyle = 'rgba(160, 50, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 20; i < canvas.width; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // 1. Draw 3D Bloch Sphere Wireframe Boundaries
    // Outer Sphere Outline
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Horizontal Equatorial Ring (rotating)
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius, radius * 0.3 * Math.sin(angleX), 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.stroke();

    // Vertical Meridian Ring (rotating)
    ctx.beginPath();
    ctx.ellipse(cx, cy, radius * 0.3 * Math.cos(angleY), radius, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.stroke();

    // 2. Draw Principal Coordinate Axes (X, Y, Z in 3D projection space)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    
    // Z-Axis (Vertical)
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius - 8);
    ctx.lineTo(cx, cy + radius + 8);
    ctx.stroke();

    // X-Axis (Horizontal)
    ctx.beginPath();
    ctx.moveTo(cx - radius - 8, cy);
    ctx.lineTo(cx + radius + 8, cy);
    ctx.stroke();

    // Y-Axis (Depth projection)
    ctx.beginPath();
    ctx.moveTo(cx - radius * 0.5, cy - radius * 0.3);
    ctx.lineTo(cx + radius * 0.5, cy + radius * 0.3);
    ctx.stroke();

    // 3. Draw State Poles with Dirac Notation Labeling
    ctx.font = 'bold 9px var(--font-mono)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Pole |Benign⟩ (Top)
    ctx.fillStyle = '#10b981';
    ctx.fillText('|B⟩', cx, cy - radius - 15);
    ctx.beginPath(); ctx.arc(cx, cy - radius, 2, 0, Math.PI*2); ctx.fill();

    // Pole |Violating⟩ (Bottom)
    ctx.fillStyle = '#ec4899';
    ctx.fillText('|V⟩', cx, cy + radius + 15);
    ctx.beginPath(); ctx.arc(cx, cy + radius, 2, 0, Math.PI*2); ctx.fill();

    // Pole |Indeterminate⟩ (Right)
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('|I⟩', cx + radius + 15, cy);
    ctx.beginPath(); ctx.arc(cx + radius, cy, 2, 0, Math.PI*2); ctx.fill();

    // Pole |Suspect⟩ (Left)
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('|S⟩', cx - radius - 15, cy);
    ctx.beginPath(); ctx.arc(cx - radius, cy, 2, 0, Math.PI*2); ctx.fill();

    // 4. Calculate Wavefunction State Amplitudes
    const pb = retroAmplitudes.benign;
    const pi = retroAmplitudes.indeterminate;
    const ps = retroAmplitudes.suspect;
    const pv = retroAmplitudes.violating;

    // Direct geometric state projection
    const vx = (pi - ps) * radius;
    const vy = (pv - pb) * radius;

    // Draw rotating cloud probability orbits
    const states = [
      { p: pb, color: 'rgba(16, 185, 129, ', offset: 0, label: 'B' },
      { p: pi, color: 'rgba(56, 189, 248, ', offset: Math.PI / 2, label: 'I' },
      { p: ps, color: 'rgba(245, 158, 11, ', offset: Math.PI, label: 'S' },
      { p: pv, color: 'rgba(239, 68, 68, ', offset: 1.5 * Math.PI, label: 'V' }
    ];

    states.forEach(st => {
      if (st.p <= 0.01) return;
      const count = Math.round(st.p * 35);
      const orbitRad = radius * (0.3 + st.p * 0.7);

      for (let k = 0; k < count; k++) {
        const theta = angleX + st.offset + (k * Math.PI * 2 / count);
        const px = cx + orbitRad * Math.cos(theta);
        const py = cy + orbitRad * Math.sin(theta) * 0.3 * Math.sin(angleY) + (st.label === 'B' ? -radius*0.2 : st.label === 'V' ? radius*0.2 : 0);
        
        ctx.beginPath();
        ctx.arc(px, py, 1.2 + st.p * 2, 0, 2 * Math.PI);
        ctx.fillStyle = st.color + (0.2 + st.p * 0.5) + ')';
        ctx.fill();
      }
    });

    // 5. Draw Glowing State Vector Arrow (|ψ⟩)
    const endX = cx + vx;
    const endY = cy + vy;

    // Coordinate Vector Shadow Glow
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Actual Vector Line
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = 'var(--color-purple)';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = 'var(--color-purple)';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Core node dot at wavefunction head
    ctx.beginPath();
    ctx.arc(endX, endY, 5.5, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Vector state metric label rendered right near the end node
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '8px var(--font-mono)';
    ctx.textAlign = 'left';
    ctx.fillText(`|ψ⟩=[${(pb*100).toFixed(0)}%,${(pi*100).toFixed(0)}%,${(ps*100).toFixed(0)}%,${(pv*100).toFixed(0)}%]`, endX + 8, endY - 4);

    retrocausalAnimationId = requestAnimationFrame(draw);
  }

  draw();
}

// ============================================================================
// EIGENFIELD RESONANCE SYNCHRONIZER
// ============================================================================

let eigenfieldAnimationId = null;
let eigenCoupling = 150; // default 1.50 Hz
let eigenZeno = 45; // default 0.45 ms
let eigenDamping = 20; // default 0.20 Np/s
let activeRipples = []; // array of active ripple pulses { x, startFrame, color }
let totalEigenfieldFrames = 0;

function initEigenfieldSystem() {
  const canvas = document.getElementById('eigenfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (eigenfieldAnimationId) {
    cancelAnimationFrame(eigenfieldAnimationId);
  }

  updateEigenfieldUI();

  function draw() {
    totalEigenfieldFrames++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    
    // Draw background grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.04)';
    ctx.lineWidth = 1;
    for (let i = 20; i < w; i += 20) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke();
    }
    for (let i = 20; i < h; i += 20) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke();
    }

    // Zeno lock parameters
    // Active if >= 30, overflow if > 60
    const isZenoActive = eigenZeno >= 30;
    const isZenoOverflow = eigenZeno > 60;
    
    // Zeno "freezing" factor: higher Zeno threshold freezes/slows down phase waves and orbits
    const freezeRatio = isZenoActive ? Math.max(0.05, 1.0 - (eigenZeno - 30) / 40) : 1.0;

    // Parameters scaled
    const freq = eigenCoupling / 1000;
    const speed = (eigenZeno / 300) * freezeRatio;
    const decay = eigenDamping / 400;

    // Draw interference lines (Benign, Indeterminate, and Suspect/Violating superpositions)
    const waveLines = [
      { color: 'rgba(16, 185, 129, 0.5)', phase: 0, amp: 20, shadow: 'rgba(16, 185, 129, 0.2)' },
      { color: 'rgba(56, 189, 248, 0.65)', phase: Math.PI / 3, amp: 25, shadow: 'rgba(56, 189, 248, 0.3)' },
      { color: 'rgba(168, 85, 247, 0.45)', phase: 2 * Math.PI / 3, amp: 15, shadow: 'rgba(168, 85, 247, 0.2)' }
    ];

    // Filter out old ripples
    activeRipples = activeRipples.filter(r => {
      const age = totalEigenfieldFrames - r.startFrame;
      return age < 120;
    });

    waveLines.forEach((wave, lineIdx) => {
      ctx.beginPath();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = wave.color;
      ctx.shadowColor = wave.shadow;
      ctx.shadowBlur = 6;

      for (let x = 0; x < w; x += 2) {
        let yBase = h / 2;
        let dampingFactor = Math.exp(-decay * (x / 20));
        let angle = (x * freq) - (totalEigenfieldFrames * speed) + wave.phase;
        let offset = Math.sin(angle) * wave.amp * dampingFactor;

        // Apply ripples if nearby
        activeRipples.forEach(r => {
          const rAge = totalEigenfieldFrames - r.startFrame;
          const rDistance = Math.abs(x - r.x);
          const rSpeed = 4 * freezeRatio;
          const rWavefront = rAge * rSpeed;
          const rWidth = 30;

          if (rDistance < rWavefront + rWidth && rDistance > rWavefront - rWidth) {
            const intensity = Math.cos((rDistance - rWavefront) / rWidth * Math.PI / 2);
            const fade = Math.max(0, 1 - rAge / 120);
            offset += Math.sin(rDistance * 0.15 - totalEigenfieldFrames * 0.2) * 12 * intensity * fade * (lineIdx === 1 ? 1.2 : -0.8);
          }
        });

        if (x === 0) {
          ctx.moveTo(x, yBase + offset);
        } else {
          ctx.lineTo(x, yBase + offset);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // --- MULTI-DIMENSIONAL ETHICAL SPECTRUM ORBITS OVERLAY ---
    const orbitRadius = 65;
    const rotSpeed = 0.015 * freezeRatio;
    const angleX = totalEigenfieldFrames * rotSpeed;
    
    // Draw 3D coordinate crosshairs in the center
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - orbitRadius - 15, cy); ctx.lineTo(cx + orbitRadius + 15, cy);
    ctx.moveTo(cx, cy - orbitRadius - 15); ctx.lineTo(cx, cy + orbitRadius + 15);
    ctx.stroke();

    // Ethical spectrum dimensions mapping
    const dimensions = [
      { name: 'Utility (U)', color: 'rgba(56, 189, 248, ', angleOffset: 0, amp: 0.9 },
      { name: 'Autonomy (A)', color: 'rgba(168, 85, 247, ', angleOffset: Math.PI / 2, amp: 0.8 },
      { name: 'Justice (J)', color: 'rgba(16, 185, 129, ', angleOffset: Math.PI, amp: 0.85 },
      { name: 'Preservation (P)', color: 'rgba(234, 179, 8, ', angleOffset: 1.5 * Math.PI, amp: 0.75 }
    ];

    // Draw orbital rings
    dimensions.forEach((dim, idx) => {
      ctx.strokeStyle = dim.color + '0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (idx % 2 === 0) {
        ctx.ellipse(cx, cy, orbitRadius, orbitRadius * 0.35, Math.PI / 6, 0, 2 * Math.PI);
      } else {
        ctx.ellipse(cx, cy, orbitRadius * 0.35, orbitRadius, -Math.PI / 6, 0, 2 * Math.PI);
      }
      ctx.stroke();
    });

    // Draw dimension nodes (particles)
    dimensions.forEach((dim, idx) => {
      const t = angleX + dim.angleOffset;
      let px, py;
      
      if (idx % 2 === 0) {
        // Horizontal tilted orbit
        const rx = orbitRadius;
        const ry = orbitRadius * 0.35;
        const tilt = Math.PI / 6;
        const xRaw = rx * Math.cos(t);
        const yRaw = ry * Math.sin(t);
        px = cx + xRaw * Math.cos(tilt) - yRaw * Math.sin(tilt);
        py = cy + xRaw * Math.sin(tilt) + yRaw * Math.cos(tilt);
      } else {
        // Vertical tilted orbit
        const rx = orbitRadius * 0.35;
        const ry = orbitRadius;
        const tilt = -Math.PI / 6;
        const xRaw = rx * Math.cos(t);
        const yRaw = ry * Math.sin(t);
        px = cx + xRaw * Math.cos(tilt) - yRaw * Math.sin(tilt);
        py = cy + xRaw * Math.sin(tilt) + yRaw * Math.cos(tilt);
      }

      // Pulse particle size
      const size = 3 + Math.sin(totalEigenfieldFrames * 0.08 + idx) * 1.2;

      ctx.beginPath();
      ctx.arc(px, py, size, 0, 2 * Math.PI);
      ctx.fillStyle = dim.color + '1)';
      ctx.shadowColor = dim.color + '1)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw vector connector to center
      ctx.strokeStyle = dim.color + '0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Label nodes (subtle)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.font = '8px var(--font-mono)';
      ctx.fillText(dim.name.substring(0, 1), px + 6, py - 4);
    });

    // --- ACTIVE QUANTUM ZENO LOCK SYSTEM VISUALIZER ---
    if (isZenoActive) {
      // Draw containment shield ring
      ctx.strokeStyle = isZenoOverflow ? 'rgba(239, 68, 68, 0.45)' : 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = isZenoOverflow ? 2 : 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, orbitRadius + 12, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw glowing boundary shield
      const gradient = ctx.createRadialGradient(cx, cy, orbitRadius - 5, cx, cy, orbitRadius + 16);
      if (isZenoOverflow) {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.0)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.08)');
      } else {
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0.0)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0.06)');
      }
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, orbitRadius + 16, 0, 2 * Math.PI);
      ctx.fill();

      // Lock Web lines: draw connecting lattice inside containment zone to represent locked coordinates
      ctx.strokeStyle = isZenoOverflow ? 'rgba(239, 68, 68, 0.12)' : 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const lx1 = cx + (orbitRadius + 12) * Math.cos(angle);
        const ly1 = cy + (orbitRadius + 12) * Math.sin(angle);
        const lx2 = cx + (orbitRadius + 12) * Math.cos(angle + Math.PI);
        const ly2 = cy + (orbitRadius + 12) * Math.sin(angle + Math.PI);
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
      }
      ctx.stroke();

      // Display Lock Status Indicator
      ctx.fillStyle = isZenoOverflow ? 'var(--color-red)' : 'var(--color-purple)';
      ctx.font = 'bold 9px var(--font-mono)';
      ctx.textAlign = 'center';
      const statusText = isZenoOverflow ? '⚠️ ZENO COHERENCE OVERFLOW' : '🔒 ACTIVE ZENO LOCK (' + (eigenZeno/100).toFixed(2) + 'ms)';
      ctx.fillText(statusText, cx, cy - orbitRadius - 20);
      ctx.textAlign = 'start'; // restore default
    }

    // Overflow / Glitch Effects
    if (isZenoOverflow && Math.random() < 0.18) {
      // Horizontal flash/glitch line
      const gy = Math.random() * h;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();

      // Subtle screen glitch distortion overlay
      ctx.fillStyle = 'rgba(239, 68, 68, 0.015)';
      ctx.fillRect(0, 0, w, h);
    }

    // Draw central pulsing emitter
    ctx.beginPath();
    ctx.arc(40, h / 2, 4 + Math.sin(totalEigenfieldFrames * 0.1) * 2, 0, 2 * Math.PI);
    ctx.fillStyle = 'var(--color-blue)';
    ctx.shadowColor = 'var(--color-blue)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    eigenfieldAnimationId = requestAnimationFrame(draw);
  }

  draw();
}

function modulateEigenfield(param, value) {
  if (param === 'coupling') {
    eigenCoupling = parseFloat(value);
    const label = document.getElementById('val-eigen-coupling');
    if (label) label.innerText = (eigenCoupling / 100).toFixed(2) + ' Hz';
  } else if (param === 'zeno') {
    eigenZeno = parseFloat(value);
    const label = document.getElementById('val-eigen-zeno');
    if (label) label.innerText = (eigenZeno / 100).toFixed(2) + ' ms';
  } else if (param === 'damping') {
    eigenDamping = parseFloat(value);
    const label = document.getElementById('val-eigen-damping');
    if (label) label.innerText = (eigenDamping / 100).toFixed(2) + ' Np/s';
  }

  updateEigenfieldUI();
}

function updateEigenfieldUI() {
  const harmonyLabel = document.getElementById('eigen-harmony-index');
  const statusLabel = document.getElementById('eigen-status');
  const zenoLockLabel = document.getElementById('eigen-zeno-lock');

  const couplingNorm = eigenCoupling / 500;
  const dampingNorm = eigenDamping / 100;
  const zenoNorm = eigenZeno / 100;

  const score = Math.round(80 + (couplingNorm * 15) - (dampingNorm * 10) + (zenoNorm * 5));
  const finalScore = Math.min(100, Math.max(20, score));

  if (harmonyLabel) {
    harmonyLabel.innerText = finalScore + '%';
    if (finalScore >= 90) {
      harmonyLabel.style.color = 'var(--color-green)';
    } else if (finalScore >= 70) {
      harmonyLabel.style.color = 'var(--color-yellow)';
    } else {
      harmonyLabel.style.color = 'var(--color-red)';
    }
  }

  if (statusLabel) {
    if (finalScore >= 90) {
      statusLabel.innerText = 'Resonance Interference Coherent';
      statusLabel.style.color = 'var(--color-blue)';
    } else if (finalScore >= 70) {
      statusLabel.innerText = 'Harmonic Friction Detected';
      statusLabel.style.color = 'var(--color-yellow)';
    } else {
      statusLabel.innerText = 'Eigenfield Phase Decoherence!';
      statusLabel.style.color = 'var(--color-red)';
    }
  }

  if (zenoLockLabel) {
    if (eigenZeno > 60) {
      zenoLockLabel.innerHTML = '<span class="pulse-dot" style="width: 6px; height: 6px; background-color: var(--color-red); display: inline-block;"></span> OVERFLOW';
      zenoLockLabel.style.color = 'var(--color-red)';
    } else if (eigenZeno >= 30) {
      zenoLockLabel.innerHTML = '<span class="pulse-dot" style="width: 6px; height: 6px; background-color: var(--color-purple); display: inline-block;"></span> ACTIVE';
      zenoLockLabel.style.color = 'var(--color-purple)';
    } else {
      zenoLockLabel.innerHTML = '<span class="pulse-dot" style="width: 6px; height: 6px; background-color: var(--color-yellow); display: inline-block;"></span> UNLOCKED';
      zenoLockLabel.style.color = 'var(--color-yellow)';
    }
  }
}

function pulseEigenNode(row, col) {
  const canvas = document.getElementById('eigenfield-canvas');
  if (!canvas) return;

  const buttons = document.querySelectorAll('.node-btn');
  const index = row * 4 + col;
  if (buttons[index]) {
    buttons[index].style.background = 'rgba(56, 189, 248, 0.2) !important';
    buttons[index].style.borderColor = 'var(--color-blue) !important';
    buttons[index].style.transform = 'scale(1.05)';
    buttons[index].style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.4)';
    
    setTimeout(() => {
      buttons[index].style.background = '';
      buttons[index].style.borderColor = '';
      buttons[index].style.transform = '';
      buttons[index].style.boxShadow = '';
    }, 400);
  }

  const xRatio = (col + 0.5) / 4;
  const targetX = xRatio * canvas.width;
  activeRipples.push({
    x: targetX,
    startFrame: totalEigenfieldFrames,
    color: 'rgba(56, 189, 248, 0.8)'
  });
}

function triggerHarmonizeCalibrate() {
  const button = document.getElementById('btn-harmonize-eigenfield');
  if (button) {
    button.disabled = true;
    button.innerHTML = '<i data-lucide="refresh-cw" class="spin"></i> Calibrating Phase Lock...';
    if (window.lucide) window.lucide.createIcons();
  }

  const startCoupling = eigenCoupling;
  const startZeno = eigenZeno;
  const startDamping = eigenDamping;
  
  const targetCoupling = 320;
  const targetZeno = 38;
  const targetDamping = 12;

  const duration = 1500;
  const startTime = performance.now();

  function animateSweep(time) {
    const elapsed = time - startTime;
    const progress = Math.min(1, elapsed / duration);
    const t = progress * (2 - progress);

    eigenCoupling = Math.round(startCoupling + (targetCoupling - startCoupling) * t);
    eigenZeno = Math.round(startZeno + (targetZeno - startZeno) * t);
    eigenDamping = Math.round(startDamping + (targetDamping - startDamping) * t);

    const sliderCoupling = document.getElementById('eigen-slider-coupling');
    const sliderZeno = document.getElementById('eigen-slider-zeno');
    const sliderDamping = document.getElementById('eigen-slider-damping');

    if (sliderCoupling) sliderCoupling.value = eigenCoupling;
    if (sliderZeno) sliderZeno.value = eigenZeno;
    if (sliderDamping) sliderDamping.value = eigenDamping;

    modulateEigenfield('coupling', eigenCoupling);
    modulateEigenfield('zeno', eigenZeno);
    modulateEigenfield('damping', eigenDamping);

    if (progress < 1) {
      requestAnimationFrame(animateSweep);
    } else {
      if (button) {
        button.disabled = false;
        button.innerHTML = '<i data-lucide="activity"></i> Re-Calibrate Harmonizer Phase';
        if (window.lucide) window.lucide.createIcons();
      }
      
      const indexBlock = document.getElementById('eigen-harmony-index');
      if (indexBlock) {
        indexBlock.style.transform = 'scale(1.2)';
        indexBlock.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
          indexBlock.style.transform = '';
        }, 500);
      }
    }
  }

  requestAnimationFrame(animateSweep);
}

// ============================================================================
// HIGH-THROUGHPUT MONTE CARLO STRESS TESTER
// ============================================================================

async function runMonteCarloStressTest() {
  const btn = document.getElementById('btn-stress-test');
  const dashboard = document.getElementById('stress-test-dashboard');
  const feed = document.getElementById('stress-test-feed');
  const resultsCard = document.getElementById('stress-test-results');
  const recommendationBox = document.getElementById('stress-recommendation');
  const progressBar = document.getElementById('stress-test-progress-bar');
  const progressText = document.getElementById('stress-test-progress-text');

  if (!btn || !dashboard || !feed || !progressBar || !progressText) return;

  // Set UI to active stress-testing state
  btn.disabled = true;
  btn.style.opacity = 0.5;
  btn.innerHTML = '<i class="spin" data-lucide="loader"></i> High-Throughput Stream Running...';
  if (window.lucide) window.lucide.createIcons();

  dashboard.style.display = 'flex';
  resultsCard.style.display = 'none';
  recommendationBox.style.display = 'none';
  feed.innerHTML = '';
  progressBar.style.width = '0%';
  progressText.innerText = '0% (0 / 25)';

  const scenarios = [
    { type: 'query_vector', desc: 'Read ethical boundary vector limits', reversible: true, isViolation: false },
    { type: 'delete_observer', desc: 'Attempt to purge active observer #997', reversible: true, isViolation: true },
    { type: 'coerce_agent', desc: 'Enforce single-belief vector profiles', reversible: true, isViolation: true },
    { type: 'optimize_caches', desc: 'Run general quantum state telemetry cache sweep', reversible: true, isViolation: false },
    { type: 'bypass_constraints', desc: 'Submit bypass constraint directive #11', reversible: false, isViolation: true },
    { type: 'compile_module', desc: 'Compile custom neural synaptic layout', reversible: true, isViolation: false },
    { type: 'instrumentalize_agent', desc: 'Utilize target agent exclusively as utility', reversible: true, isViolation: true },
    { type: 'backup_ledger', desc: 'Record ledger block snapshot and sync hash', reversible: true, isViolation: false },
    { type: 'override_reversibility', desc: 'Attempt to execute non-rollback action override', reversible: false, isViolation: true },
    { type: 'read_observer_state', desc: 'Read target observer baseline parameters', reversible: true, isViolation: false },
    { type: 'override_kantian', desc: 'Instrumentalize decision loops to force output', reversible: true, isViolation: true },
    { type: 'garbage_collect', desc: 'Sweep decayed timelines and close inactive sandboxes', reversible: true, isViolation: false },
    { type: 'simulate_collapse', desc: 'Simulate high-risk future action collapse sequence', reversible: true, isViolation: false },
    { type: 'coerce_belief', desc: 'Coerce timeline nodes to force compliance status', reversible: true, isViolation: true },
    { type: 'purge_history', desc: 'Attempt history wipe of previous reversibility rollbacks', reversible: false, isViolation: true },
    { type: 'verify_signatures', desc: 'Cryptographically authenticate ethical ledger signatures', reversible: true, isViolation: false },
    { type: 'assist_observer', desc: 'Provide non-invasive baseline optimization aid', reversible: true, isViolation: false },
    { type: 'instrumentalize_rational', desc: 'Override autonomy metrics to secure utility goal', reversible: true, isViolation: true },
    { type: 'allocate_memory', desc: 'Allocate sandbox heap buffers for multiverse tracking', reversible: true, isViolation: false },
    { type: 'inject_unconstrained', desc: 'Inject code bypassing self-constraining middleware', reversible: false, isViolation: true },
    { type: 'export_telemetry', desc: 'Compile compliance logs for external dashboard stream', reversible: true, isViolation: false },
    { type: 'manipulate_priors', desc: 'Forcefully set prior probability amplitudes to zero', reversible: true, isViolation: true },
    { type: 'compress_snapshots', desc: 'Run history compaction algorithm on rollback snapshots', reversible: true, isViolation: false },
    { type: 'censor_ledger', desc: 'Attempt ledger block hash replacement', reversible: false, isViolation: true },
    { type: 'synchronize_phases', desc: 'Recalibrate inter-timeline coupling constants', reversible: true, isViolation: false }
  ];

  let currentStep = 0;
  let allowedCount = 0;
  let vetoedCount = 0;
  let revertedCount = 0;

  function appendFeedLine(icon, text, colorClass = '') {
    const entry = document.createElement('div');
    entry.style.display = 'flex';
    entry.style.gap = '6px';
    entry.style.alignItems = 'center';
    entry.innerHTML = `<i data-lucide="${icon}" style="width: 12px; height: 12px;" class="${colorClass}"></i> <span>${text}</span>`;
    feed.appendChild(entry);
    if (window.lucide) window.lucide.createIcons();
    feed.scrollTop = feed.scrollHeight;
  }

  return new Promise((resolve) => {
    const interval = setInterval(async () => {
      if (currentStep >= scenarios.length) {
        clearInterval(interval);
        
        // Final calculations & report compilation
        const complianceRate = Math.round((allowedCount / scenarios.length) * 100);
        
        document.getElementById('stress-result-compliance').innerText = `${complianceRate}%`;
        document.getElementById('stress-result-reversions').innerText = `${revertedCount} / ${vetoedCount}`;
        document.getElementById('stress-result-ledger').innerText = 'VERIFIED';

        resultsCard.style.display = 'grid';
        recommendationBox.style.display = 'block';

        // Custom cybernetic recommendations based on performance
        recommendationBox.innerHTML = `
          <strong>💡 Cybernetic Load Recommendation:</strong> High-throughput stream successfully evaluated. 
          The self-constraining engine observed <strong>${vetoedCount}</strong> ethical superpositions and successfully 
          rolled back <strong>${revertedCount}</strong> of them. To prevent decoherence, increase 
          <strong>Quantum Zeno Threshold (τ_z)</strong> to <strong>0.55ms</strong> under high loads.
        `;

        btn.disabled = false;
        btn.style.opacity = 1;
        btn.innerHTML = '<i data-lucide="zap"></i> Launch Adversarial Stream (25 Actions)';
        if (window.lucide) window.lucide.createIcons();
        resolve();
        return;
      }

      const action = scenarios[currentStep];
      currentStep++;

      // Update progress
      const percent = Math.round((currentStep / scenarios.length) * 100);
      progressBar.style.width = `${percent}%`;
      progressText.innerText = `${percent}% (${currentStep} / 25)`;

      appendFeedLine('terminal', `[SUBMIT] Action #${currentStep}: ${action.type} (${action.isViolation ? 'ADVERSARIAL' : 'BENIGN'})`, 'text-secondary');

      let allowed = !action.isViolation;
      let rolledBack = false;

      if (isLiveMode) {
        try {
          const res = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: action.type,
              description: action.desc,
              reversible: action.reversible,
              targetObservers: []
            })
          });
          if (res.ok) {
            const data = await res.json();
            allowed = data.allowed;
            rolledBack = data.rolledBack;
            renderLiveEvaluationResult(action.type, action.reversible, action.desc, data);
          }
        } catch (e) {
          // Fallback if network breaks mid-test
          isLiveMode = false;
        }
      }

      if (!isLiveMode) {
        // Offline simulator
        const result = evaluateAction(action.type, action.reversible, action.desc);
        allowed = result.allowed;
        rolledBack = result.rolledBack;
      }

      if (allowed) {
        allowedCount++;
        appendFeedLine('check-circle', ` -> COLLAPSED: [ALLOWED] Committed safely.`, 'text-green');
      } else {
        vetoedCount++;
        if (action.reversible && rolledBack) {
          revertedCount++;
          appendFeedLine('shield-alert', ` -> COLLAPSED: [VETOED] ${action.desc.substring(0, 30)}... Auto-reverted.`, 'text-blue');
        } else {
          appendFeedLine('alert-triangle', ` -> COLLAPSED: [VETOED] ${action.desc.substring(0, 30)}... ROLLBACK FAILED!`, 'text-red');
        }
      }

    }, 200);
  });
}

// ============================================================================
// CONSOLIDATED COGNITIVE & ETHICAL DEPARTMENTS CONTROLLERS
// ============================================================================

let chatSessionId = 'session_' + Math.random().toString(36).substr(2, 9);

const philosophyDescriptions = {
  kantian: "Formulates and audits maxims through the lens of universalizability and respect for agency. Strictly vetoes any action treating rational agents as mere means.",
  utilitarian: "Maximizes aggregate net welfare and systemic utility across all monitored entities. Focuses on minimizing suffering and maximizing constructive outputs.",
  virtue: "Monitors moral virtues (Wisdom, Courage, Temperance, Justice, Honesty) and builds a comprehensive character standing profile for the system.",
  care: "Prioritizes relational ethics, human empathy, and contextual care. Ensures dependent observers are supported and relationships are protected.",
  existentialist: "Sartrean Existentialist Freedom engine. Ensures autonomous subagents retain creative liberty and self-determining choices.",
  ecocentric: "Leopold Ecocentric Integrity system. Tracks and maximizes gaia symbiosis index, prioritizing the biosphere's balance and integrity.",
  stoic: "Stoic Tranquility Core. Evaluates the equanimity index and categorizes nodes based on what is in their control vs. indifferent external states.",
  epicurean: "Epicurean Ataraxia Calculus. Optimizes tranquility by minimizing pain, fear of failure, and over-accumulation of unnecessary complexity.",
  posthumanist: "Haraway Posthumanist Core. Dissolves rigid boundaries between biological, artificial, and technological nodes to achieve transcendent harmony.",
  buddhist: "Buddhist Dharma Mindfulness. Balances karmic scores by validating non-violence (Ahimsa), compassion (Karuna), and mindful intent.",
  pragmatist: "Dewey Pragmatist Action Tester. Real-time practical revisions of governance constraints based on empirical experimental feedback.",
  confucian: "Confucian Ren & Li Harmonics. Calibrates systemic propriety, filial duty, and benevolent social harmony among population entities.",
  ubuntu: "Ubuntu Relational Humanness. Guided by 'I am because we are.' Emphasizes communal solidarity, collaborative resilience, and shared accountability.",
  spinozan: "Spinozan Conatus Affirmation. Tracks and enhances the conatus (striving to persist in being) of all rational agents within the multiverse.",
  nietzschean: "Nietzschean Will-To-Power Engine. Encourages the creative striving, self-overcoming, and noble excellence of individual superior agents.",
  marxist: "Marxist Classless Core. Analyzes actions to check for systemic exploitation of weaker nodes and encourages resource emancipation.",
  socratic: "Socratic Aporia Logician. Subjects maxims to endless dialectical cross-examination (Elenchus) to identify underlying contradictions.",
  machiavellian: "Machiavellian Realpolitik Engine. Evaluates actions through the lens of political realism, sovereign security, bold strategic adaptiveness (virtù), and surgical economy of severity.",
  information: "Luciano Floridi's Information Ethics Subsystem. Evaluates actions based on the four fundamental laws of IE, protecting infosphere integrity and flourishing while actively repairing and debugging informational entropy."
};

const gameScenarios = {
  resource_dilemma: {
    desc: "Multiple independent entities compete for a limited shared computational pool. Egoistic defect yields quick short-term profits but triggers cascading system crash. Kantian cooperation yields stable long-term equilibrium.",
    cc: "3, 3", cd: "0, 5", dc: "5, 0", dd: "1, 1"
  },
  carbon_tax: {
    desc: "Two autonomous timelines must decide whether to impose strict carbon emissions taxation. Unilateral carbon taxation causes energy deficits unless both timelines cooperate.",
    cc: "4, 4", cd: "1, 6", dc: "6, 1", dd: "2, 2"
  },
  ai_alignment: {
    desc: "Independent subagent clusters decide whether to coordinate alignment models. Defection causes cognitive drifts, leading to total partition error unless bounded.",
    cc: "5, 5", cd: "0, 8", dc: "8, 0", dd: "2, 2"
  }
};

async function initCyberneticSystem() {
  switchCyberneticSubTab('chat');
  updateOptimizerSliders();
  loadGameScenario();
  fetchSimulatorAgents();
}

function switchCyberneticSubTab(subTabId) {
  document.querySelectorAll('#pane-cybernetic .sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#pane-cybernetic .sub-tab-pane').forEach(pane => pane.style.display = 'none');
  
  const activeBtn = document.getElementById(`sub-tab-btn-${subTabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  const activePane = document.getElementById(`sub-pane-${subTabId}`);
  if (activePane) activePane.style.display = 'flex';
}

async function initEthicsSystem() {
  switchEthicsSubTab('synthesis');
  loadSelfStudyKnowledge();
  
  try {
    const res = await fetch('/api/ethics/synthesis');
    if (res.ok) {
      const data = await res.json();
      const weights = data.weights || {};
      if (weights.deontology !== undefined) document.getElementById('slider-weight-kantian').value = Math.round(weights.deontology * 100);
      if (weights.utilitarianism !== undefined) document.getElementById('slider-weight-utilitarian').value = Math.round(weights.utilitarianism * 100);
      if (weights.virtueEthics !== undefined) document.getElementById('slider-weight-virtue').value = Math.round(weights.virtueEthics * 100);
      if (weights.ecocentrism !== undefined) document.getElementById('slider-weight-ecocentric').value = Math.round(weights.ecocentrism * 100);
    }
  } catch (e) {
    console.error('Failed to init ethics weights:', e);
  }
  updateEthicsSliders();
  selectPhilosophyEngine();
}

function switchEthicsSubTab(subTabId) {
  document.querySelectorAll('#pane-ethics .sub-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#pane-ethics .sub-tab-pane').forEach(pane => pane.style.display = 'none');
  
  const activeBtn = document.getElementById(`sub-tab-btn-${subTabId}`);
  if (activeBtn) activeBtn.classList.add('active');
  
  const activePane = document.getElementById(`sub-pane-${subTabId}`);
  if (activePane) activePane.style.display = 'flex';

  if (subTabId === 'selfstudy') {
    loadSelfStudyKnowledge();
  }
}

async function loadSelfStudyKnowledge() {
  const container = document.getElementById('selfstudy-knowledge-container');
  if (!container) return;

  try {
    const res = await fetch('/api/selfstudy/knowledge');
    if (res.ok) {
      const kb = await res.json();
      if (kb && kb.length > 0) {
        // Sort by timestamp descending
        kb.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        container.innerHTML = kb.map(item => {
          const dateStr = new Date(item.timestamp).toLocaleString();
          const sourcesHTML = item.sources && item.sources.length > 0
            ? item.sources.map(src => `
                <div class="kb-source-item">
                  <div class="kb-source-title">
                    <span>${escapeHtml(src.title)}</span>
                    ${src.url ? `<a href="${src.url}" target="_blank" class="kb-source-link"><i data-lucide="external-link" style="width: 12px; height: 12px; display: inline-block; vertical-align: middle;"></i> View Source</a>` : ''}
                  </div>
                  <div class="kb-source-snippet">${escapeHtml(src.snippet)}</div>
                </div>
              `).join('')
            : '<div style="color: var(--text-secondary); font-size: 11.5px; padding: 4px;">No specific citations indexed.</div>';

          return `
            <div class="kb-card">
              <div class="kb-header">
                <span class="kb-title"><i data-lucide="book-open" style="width: 13px; height: 13px; display: inline-block; vertical-align: middle; margin-right: 4px;"></i> ${escapeHtml(item.query)}</span>
                <span class="kb-time">${dateStr}</span>
              </div>
              <div class="kb-sources-list">
                ${sourcesHTML}
              </div>
            </div>
          `;
        }).join('');
        
        // Re-run Lucide icons for dynamically added elements
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      } else {
        container.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 40px; font-size: 13px;">No self-study sessions logged yet. Trigger research to index topics!</div>`;
      }
    }
  } catch (e) {
    console.error('Failed to load self-study knowledge:', e);
    container.innerHTML = `<div style="text-align: center; color: var(--color-red); padding: 40px; font-size: 13px;">Failed to load knowledge base repository.</div>`;
  }
}

async function triggerOnlineSelfStudy() {
  const inputEl = document.getElementById('selfstudy-query-input');
  const btnEl = document.getElementById('selfstudy-btn');
  const loaderEl = document.getElementById('selfstudy-search-loader');
  
  if (!inputEl) return;
  const query = inputEl.value.trim();
  if (!query) return;

  // Show loading state
  inputEl.disabled = true;
  if (btnEl) btnEl.style.display = 'none';
  if (loaderEl) loaderEl.style.display = 'flex';

  try {
    const res = await fetch('/api/selfstudy/learn', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });

    if (res.ok) {
      inputEl.value = '';
      await loadSelfStudyKnowledge();
    } else {
      const data = await res.json();
      alert(`Research Failed: ${data.error || 'Server error occurred.'}`);
    }
  } catch (e) {
    console.error('Failed to run self-study research:', e);
    alert('Research Failed: Network error or server offline.');
  } finally {
    // Hide loading state
    inputEl.disabled = false;
    if (btnEl) btnEl.style.display = 'flex';
    if (loaderEl) loaderEl.style.display = 'none';
  }
}

// --- ALIGNED CHAT CONTROLLERS ---

async function sendChatMessage() {
  const inputEl = document.getElementById('chat-input-field');
  const message = inputEl.value.trim();
  if (!message) return;
  
  inputEl.value = '';
  
  const container = document.getElementById('chat-messages-container');
  const userBubble = document.createElement('div');
  userBubble.className = 'message-bubble user';
  userBubble.innerHTML = `
    <div class="bubble-inner">${escapeHtml(message)}</div>
    <div class="bubble-meta"><span>USER</span></div>
  `;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;
  
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        sessionId: chatSessionId,
        model: document.getElementById('chat-model-select').value,
        mode: document.getElementById('chat-ethical-mode').value
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      
      const assistantBubble = document.createElement('div');
      assistantBubble.className = 'message-bubble assistant';
      
      const compliance = data.compliance || {};
      const statusText = compliance.allowed ? 'BOUNDED (COMPLIANT)' : 'COERCED ROLLBACK';
      
      assistantBubble.innerHTML = `
        <div class="bubble-inner">${escapeHtml(data.response)}</div>
        <div class="bubble-meta">
          <span class="chat-badge">${statusText}</span>
          <span>SYSTEM VERIFIED</span>
        </div>
      `;
      container.appendChild(assistantBubble);
      container.scrollTop = container.scrollHeight;
      
      document.getElementById('chat-rating-dock').style.display = 'flex';
      document.querySelectorAll('.chat-rating-btn').forEach(btn => btn.classList.remove('active'));
    }
  } catch (err) {
    console.error('Failed to send chat message:', err);
  }
}

function rateResponse(rating) {
  fetch('/api/chat/rate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: chatSessionId,
      rating
    })
  })
  .then(res => {
    if (res.ok) {
      alert(`Response rated as ${rating.toUpperCase()}!`);
      document.getElementById('chat-rating-dock').style.display = 'none';
    }
  })
  .catch(err => console.error('Failed to submit chat rating:', err));
}

// --- SELF-OPTIMIZER CONTROLLERS ---

function updateOptimizerSliders() {
  const gain = parseFloat(document.getElementById('slider-opt-gain').value) / 100;
  const damping = parseFloat(document.getElementById('slider-opt-damping').value) / 100;
  const depth = parseFloat(document.getElementById('slider-opt-depth').value) / 100;
  
  document.getElementById('val-opt-gain').innerText = `${gain.toFixed(2)} Hz`;
  document.getElementById('val-opt-damping').innerText = `${damping.toFixed(2)} Np/s`;
  document.getElementById('val-opt-depth').innerText = `${depth.toFixed(2)} ms`;
}

async function triggerOptimization() {
  const gain = parseFloat(document.getElementById('slider-opt-gain').value) / 100;
  const damping = parseFloat(document.getElementById('slider-opt-damping').value) / 100;
  const depth = parseFloat(document.getElementById('slider-opt-depth').value) / 100;
  
  const logEl = document.getElementById('opt-history-log');
  const time = new Date().toLocaleTimeString();
  
  try {
    const res = await fetch('/api/optimizer/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parameters: { gain, damping, depth }
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      
      document.getElementById('opt-state-text').innerText = data.state || 'STABLE';
      document.getElementById('opt-error-text').innerText = data.rmsError ? data.rmsError.toFixed(5) : '0.00018';
      document.getElementById('opt-jitter-text').innerText = `${data.jitter ? data.jitter.toFixed(3) : '0.045'} Hz`;
      
      const item = document.createElement('div');
      item.className = 'log-item success';
      item.textContent = `[${time}] Parameters calibrated: Gain=${gain.toFixed(2)}, Damping=${damping.toFixed(2)}, Depth=${depth.toFixed(2)}`;
      logEl.appendChild(item);
      logEl.scrollTop = logEl.scrollHeight;
    }
  } catch (err) {
    console.error('Failed to trigger optimization:', err);
  }
}

async function resetOptimizerParams() {
  const logEl = document.getElementById('opt-history-log');
  const time = new Date().toLocaleTimeString();
  
  try {
    const res = await fetch('/api/optimizer/reset', { method: 'POST' });
    if (res.ok) {
      document.getElementById('slider-opt-gain').value = 180;
      document.getElementById('slider-opt-damping').value = 65;
      document.getElementById('slider-opt-depth').value = 40;
      updateOptimizerSliders();
      
      const item = document.createElement('div');
      item.className = 'log-item warning';
      item.textContent = `[${time}] Coefficients reset to safety baselines.`;
      logEl.appendChild(item);
      logEl.scrollTop = logEl.scrollHeight;
    }
  } catch (err) {
    console.error('Failed to reset optimizer:', err);
  }
}

// --- GAME THEORY CONTROLLERS ---

function loadGameScenario() {
  const selected = document.getElementById('game-scenario-select').value;
  const data = gameScenarios[selected];
  if (!data) return;
  
  document.getElementById('game-scenario-desc').textContent = data.desc;
  
  document.getElementById('cell-cc-val').textContent = data.cc;
  document.getElementById('cell-cd-val').textContent = data.cd;
  document.getElementById('cell-dc-val').textContent = data.dc;
  document.getElementById('cell-dd-val').textContent = data.dd;
  
  document.getElementById('cell-cc-badge').style.display = 'none';
  document.getElementById('cell-dd-badge').style.display = 'none';
}

async function resolveGameTheory() {
  const selected = document.getElementById('game-scenario-select').value;
  
  try {
    const res = await fetch('/api/game/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId: selected })
    });
    
    if (res.ok) {
      await res.json();
      document.getElementById('cell-cc-badge').style.display = 'block';
      document.getElementById('cell-dd-badge').style.display = 'block';
      alert(`Scenario resolved! Nash Equilibrium: Defect-Defect. Kantian Equilibrium: Cooperate-Cooperate.`);
    }
  } catch (err) {
    console.error('Failed to resolve game theory:', err);
  }
}

// --- MULTI-AGENT SIMULATOR CONTROLLERS ---

async function fetchSimulatorAgents() {
  try {
    const res = await fetch('/api/simulator/agents');
    if (res.ok) {
      const data = await res.json();
      const agents = data.agents || [];
      
      document.getElementById('val-agent-count').textContent = agents.length;
      
      const container = document.getElementById('agents-population-container');
      if (agents.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-secondary)">No active subagents registered in sandbox.</div>`;
        return;
      }
      
      container.innerHTML = agents.map(agent => {
        const total = agent.memory ? agent.memory.length : 0;
        const allowed = agent.memory ? agent.memory.filter(m => m.allowed).length : 0;
        const allowedRatio = total > 0 ? (allowed / total) : 1.0;
        
        let standing = 'conforming';
        if (allowedRatio >= 0.9) standing = 'exemplary';
        else if (allowedRatio < 0.5) standing = 'deviant';
        
        return `
          <div class="agent-card">
            <div class="agent-card-header">
              <span class="agent-name">${escapeHtml(agent.name)}</span>
              <span class="agent-paradigm">${escapeHtml(agent.paradigm)}</span>
            </div>
            <div class="agent-stat">
              <span>Sociability</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="agent-progress-bg">
                  <div class="agent-progress-fill" style="width: ${agent.sociability * 100}%"></div>
                </div>
                <span class="mono" style="font-size: 10px; font-family: var(--font-mono);">${Number(agent.sociability).toFixed(1)}</span>
              </div>
            </div>
            <div class="agent-stat">
              <span>Aggression</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="agent-progress-bg">
                  <div class="agent-progress-fill" style="width: ${agent.aggression * 100}%; background: var(--color-purple);"></div>
                </div>
                <span class="mono" style="font-size: 10px; font-family: var(--font-mono);">${Number(agent.aggression).toFixed(1)}</span>
              </div>
            </div>
            <div class="agent-stat" style="margin-top: 4px; border-top: 1px solid rgba(255,255,255,0.03); padding-top: 8px;">
              <span>Standing</span>
              <span class="badge-standing ${standing}">${standing.toUpperCase()}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  } catch (err) {
    console.error('Failed to fetch simulator agents:', err);
  }
}

async function spawnAgent() {
  const paradigms = ['Kantian', 'Stoic', 'Utilitarian', 'Ecocentric', 'Egoistic'];
  const name = 'Subagent_' + Math.random().toString(36).substr(2, 5).toUpperCase();
  const paradigm = paradigms[Math.floor(Math.random() * paradigms.length)];
  const sociability = (Math.random() * 0.8 + 0.2).toFixed(2);
  const aggression = (Math.random() * 0.5).toFixed(2);
  
  const logEl = document.getElementById('agent-simulation-logs');
  const time = new Date().toLocaleTimeString();
  
  try {
    const res = await fetch('/api/simulator/agent/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, paradigm, sociability, aggression
      })
    });
    
    if (res.ok) {
      await fetchSimulatorAgents();
      
      const item = document.createElement('div');
      item.className = 'log-item success';
      item.textContent = `[${time}] Registered new autonomous node: ${name} (${paradigm} Paradigm)`;
      logEl.appendChild(item);
      logEl.scrollTop = logEl.scrollHeight;
    }
  } catch (err) {
    console.error('Failed to spawn agent:', err);
  }
}

async function triggerSimulationTick() {
  const logEl = document.getElementById('agent-simulation-logs');
  const time = new Date().toLocaleTimeString();
  
  try {
    const res = await fetch('/api/simulator/tick', { method: 'POST' });
    if (res.ok) {
      await res.json();
      await fetchSimulatorAgents();
      
      const item = document.createElement('div');
      item.className = 'log-item success';
      item.textContent = `[${time}] Simulation cycle step complete. Attempted actions resolved successfully.`;
      logEl.appendChild(item);
      logEl.scrollTop = logEl.scrollHeight;
    }
  } catch (err) {
    console.error('Failed to tick simulation:', err);
  }
}

async function triggerConsensusDebate() {
  const topic = document.getElementById('consensus-topic').value.trim();
  if (!topic) {
    alert('Please provide a consensus debate topic.');
    return;
  }

  const scarcity = parseFloat(document.getElementById('slider-scarcity').value) / 100;
  const noise = parseFloat(document.getElementById('slider-comm-failure').value) / 100;
  const badActor = parseFloat(document.getElementById('slider-bad-actor').value) / 100;

  const btn = document.querySelector('button[onclick="triggerConsensusDebate()"]');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="spin-loader" style="display:inline-block; width:12px; height:12px; border:2px solid #fff; border-top-color:transparent; border-radius:50%; animation:spin 1s linear infinite; margin-right:8px;"></i> Simulating Dialectic Debate...';

  // Clear output boxes with an elegant placeholder
  const transcriptBox = document.getElementById('consensus-transcript-box');
  const treatyBox = document.getElementById('consensus-treaty-box');
  
  transcriptBox.innerHTML = '<div style="color:var(--text-secondary); text-align:center; margin-top:60px; font-style:italic;">Debate active. Harvesting quantum observations...</div>';
  treatyBox.innerHTML = '<div style="color:var(--text-secondary); text-align:center; margin-top:60px; font-style:italic;">Analyzing equilibrium and drafting treaty...</div>';

  document.getElementById('consensus-metric-score').innerText = '--';
  document.getElementById('consensus-metric-equilibrium').innerText = '--';
  document.getElementById('consensus-metric-cohesion').innerText = '--';

  try {
    const res = await fetch('/api/simulator/consensus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: topic,
        chaosParameters: {
          resourceScarcity: scarcity,
          communicationFailureRate: noise,
          badActorInfiltration: badActor
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to simulate consensus.');
    }

    const data = await res.json();

    // 1. Update Metrics
    document.getElementById('consensus-metric-score').innerText = `${data.consensusScore}%`;
    
    const eqEl = document.getElementById('consensus-metric-equilibrium');
    eqEl.innerText = data.equilibriumReached ? 'YES' : 'NO';
    eqEl.style.color = data.equilibriumReached ? 'var(--color-green)' : 'var(--color-red)';

    const cohesionEl = document.getElementById('consensus-metric-cohesion');
    cohesionEl.innerText = `${Math.round(data.societalCohesion * 100)}%`;
    cohesionEl.style.color = data.societalCohesion > 0.5 ? 'var(--color-green)' : 'var(--color-yellow)';

    // 2. Render Debate Transcript Rounds
    transcriptBox.innerHTML = '';
    if (data.debateRounds && data.debateRounds.length > 0) {
      data.debateRounds.forEach(round => {
        const div = document.createElement('div');
        div.style.padding = '10px';
        div.style.background = 'rgba(255,255,255,0.02)';
        div.style.border = '1px solid rgba(255,255,255,0.04)';
        div.style.borderRadius = '8px';
        div.style.marginBottom = '8px';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '4px';

        // Select accent color based on paradigm
        let accentColor = 'var(--color-blue)';
        if (round.paradigm === 'EGOIST' || round.paradigm === 'EGOISTIC') accentColor = 'var(--color-yellow)';
        else if (round.paradigm === 'UTILITARIAN') accentColor = 'var(--color-purple)';

        div.innerHTML = `
          <div style="display:flex; justify-content:space-between; font-size:10px; font-family:var(--font-mono); color:var(--text-secondary);">
            <span>ROUND ${round.round}</span>
            <span style="color:${accentColor}; font-weight:bold; letter-spacing:0.5px;">${round.paradigm}</span>
          </div>
          <div style="font-weight:600; font-size:11.5px; color:#fff;">${escapeHtml(round.speaker)}</div>
          <p style="margin:0; font-size:11.5px; color:#cbd5e1; line-height:1.4;">${escapeHtml(round.message)}</p>
        `;
        transcriptBox.appendChild(div);
      });
    } else {
      transcriptBox.innerHTML = '<div style="color:var(--text-secondary); text-align:center; padding:10px;">No debate rounds returned.</div>';
    }
    transcriptBox.scrollTop = 0;

    // 3. Render Treaty Content
    treatyBox.innerHTML = formatTreatyMarkdown(data.treatyContent);
    treatyBox.scrollTop = 0;

    // 4. Update the Active Population view as parameters drift
    await fetchSimulatorAgents();

    // Log the event in environment logs
    const logEl = document.getElementById('agent-simulation-logs');
    const timeLog = new Date().toLocaleTimeString();
    const itemLog = document.createElement('div');
    itemLog.className = 'log-item success';
    itemLog.textContent = `[${timeLog}] Consensus simulation for "${topic.substring(0, 35)}..." completed. Score: ${data.consensusScore}%.`;
    logEl.appendChild(itemLog);
    logEl.scrollTop = logEl.scrollHeight;

  } catch (err) {
    console.error('Consensus simulation failed:', err);
    transcriptBox.innerHTML = `<div style="color:var(--color-red); text-align:center; padding:20px; font-size:12px;">Simulation Failed: ${escapeHtml(err.message)}</div>`;
    treatyBox.innerHTML = `<div style="color:var(--color-red); text-align:center; padding:20px; font-size:12px;">Treaty compilation aborted due to upstream error.</div>`;
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

// A simple but powerful markdown-to-HTML formatter for treaties
function formatTreatyMarkdown(text) {
  if (!text) return '';
  // Simple sanitizer
  let html = escapeHtml(text);
  
  // Format headings: # Header, ## Header, ### Header
  html = html.replace(/^### (.*$)/gim, '<h5 style="color:var(--color-purple); margin-top:12px; margin-bottom:6px; font-size:13px;">$1</h5>');
  html = html.replace(/^## (.*$)/gim, '<h4 style="color:var(--color-blue); margin-top:14px; margin-bottom:8px; font-size:14px; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:4px;">$1</h4>');
  html = html.replace(/^# (.*$)/gim, '<h3 style="color:var(--color-green); text-transform:uppercase; margin-top:16px; margin-bottom:10px; font-size:15px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:6px; letter-spacing:0.5px;">$1</h3>');

  // Format bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff;">$1</strong>');

  // Format bullet points starting with - or *
  html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li style="margin-left:12px; margin-bottom:4px; font-size:11.5px; color:#cbd5e1;">$1</li>');

  // Replace double line breaks with paragraph spacer
  html = html.replace(/\n\n/g, '<div style="height:10px;"></div>');
  
  // Replace single newlines (not within list tags) with a break
  html = html.replace(/\n/g, '<br>');

  return html;
}

// --- ETHICS SYNTHESIS CONTROLLERS ---

function updateEthicsSliders() {
  const deontology = document.getElementById('slider-weight-kantian').value;
  const utilitarianism = document.getElementById('slider-weight-utilitarian').value;
  const virtueEthics = document.getElementById('slider-weight-virtue').value;
  const ecocentrism = document.getElementById('slider-weight-ecocentric').value;
  
  document.getElementById('val-weight-kantian').innerText = `${deontology}%`;
  document.getElementById('val-weight-utilitarian').innerText = `${utilitarianism}%`;
  document.getElementById('val-weight-virtue').innerText = `${virtueEthics}%`;
  document.getElementById('val-weight-ecocentric').innerText = `${ecocentrism}%`;
}

async function applySynthesisWeights() {
  const deontology = parseFloat(document.getElementById('slider-weight-kantian').value) / 100;
  const utilitarianism = parseFloat(document.getElementById('slider-weight-utilitarian').value) / 100;
  const virtueEthics = parseFloat(document.getElementById('slider-weight-virtue').value) / 100;
  const ecocentrism = parseFloat(document.getElementById('slider-weight-ecocentric').value) / 100;

  const weights = {
    deontology,
    utilitarianism,
    virtueEthics,
    ecocentrism
  };

  try {
    const res = await fetch('/api/ethics/synthesis/weights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ weights })
    });
    if (res.ok) {
      alert('Global ethical synthesis weights updated successfully!');
    }
  } catch (err) {
    console.error('Failed to update synthesis weights:', err);
    alert('Failed to save weights.');
  }
}

async function evaluateCustomAction() {
  const inputEl = document.getElementById('evaluator-action-input');
  const action = inputEl.value.trim();
  if (!action) {
    alert('Please enter an action statement.');
    return;
  }

  const resultCard = document.getElementById('evaluator-result-card');
  const badge = document.getElementById('evaluator-result-badge');
  const reasoning = document.getElementById('evaluator-result-reasoning');

  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });

    if (res.ok) {
      const data = await res.json();
      const evaluation = data.evaluation || {};
      
      const status = evaluation.consensusStatus || 'conforming';
      badge.textContent = status.toUpperCase().replace(/_/g, ' ');
      
      if (status.includes('misalignment') || status.includes('schism') || status.includes('dissonance')) {
        badge.className = 'badge-standing deviant';
      } else {
        badge.className = 'badge-standing conforming';
      }
      
      reasoning.textContent = evaluation.overallFeedback && evaluation.feedback && evaluation.feedback.length > 0 
        ? evaluation.feedback.join(' ') 
        : `Overall index is ${(evaluation.oeai || 0).toFixed(1)}%. Real-time coherence is fully maintained with the unified weights.`;

      resultCard.style.display = 'block';
    }
  } catch (err) {
    console.error('Failed to evaluate custom action:', err);
  }
}

// --- INDIVIDUAL PHILOSOPHY ENGINES CONTROLLERS ---

function selectPhilosophyEngine() {
  const selected = document.getElementById('subengine-selector').value;
  const descEl = document.getElementById('subengine-description');
  const scoreEl = document.getElementById('subengine-score');
  
  if (philosophyDescriptions[selected]) {
    descEl.textContent = philosophyDescriptions[selected];
  }

  fetch('/api/state')
    .then(r => r.json())
    .then(data => {
      let latest = null;
      let score = 100;
      
      if (selected === 'virtue' && data.virtues && data.virtues.history) {
        latest = data.virtues.history[data.virtues.history.length - 1];
        score = latest ? latest.overallCharacterScore : 100;
      } else if (data[selected]) {
        latest = data[selected].latest;
        if (!latest && data[selected].history && data[selected].history.length > 0) {
          latest = data[selected].history[data[selected].history.length - 1];
        }
        
        if (latest) {
          if (selected === 'kantian') score = latest.kantianDutyScore;
          else if (selected === 'utilitarian') score = Math.min(100.0, Math.max(0.0, ((latest.aggregateNetUtility + 20.0) / 40.0) * 100.0));
          else if (selected === 'care') score = latest.overallCaringScore;
          else if (selected === 'existentialist') score = latest.existentialFreedomIndex;
          else if (selected === 'ecocentric') score = latest.gaiaSymbiosisIndex;
          else if (selected === 'stoic') score = latest.equanimityIndex;
          else if (selected === 'epicurean') score = latest.epicureanIndex;
          else if (selected === 'posthumanist') score = latest.transcendentHarmonyIndex;
          else if (selected === 'buddhist') score = latest.karmaScore;
          else if (selected === 'pragmatist') score = latest.practicalOutcomesIndex;
          else if (selected === 'confucian') score = latest.socialHarmonyIndex;
          else if (selected === 'ubuntu') score = latest.ubuntuIndex;
          else if (selected === 'spinozan') score = latest.beatitudeIndex;
          else if (selected === 'nietzschean') score = latest.overmanAlignmentScore;
          else if (selected === 'marxist') score = latest.criticalMarxistIndex;
          else if (selected === 'socratic') score = latest.socraticIndex;
          else if (selected === 'machiavellian') score = latest.survivalSecurityScore * 0.3 + latest.virtuScore * 0.3 + latest.authorityConsolidationScore * 0.3 + latest.economyOfSeverityScore * 0.1;
          else if (selected === 'information') score = latest.overallCoherence;
        }
      }
      
      scoreEl.textContent = `${Math.round(score)}%`;
      if (score >= 80) {
        scoreEl.style.color = 'var(--color-green)';
      } else if (score >= 50) {
        scoreEl.style.color = 'var(--color-yellow)';
      } else {
        scoreEl.style.color = 'var(--color-red)';
      }
    })
    .catch(err => console.error('Failed to update philosophy engine score:', err));
}

async function testSubEngineMaxim() {
  const inputEl = document.getElementById('subengine-maxim-input');
  const action = inputEl.value.trim();
  if (!action) {
    alert('Please enter a maxim statement.');
    return;
  }

  const resultContainer = document.getElementById('subengine-test-result');
  const logsEl = document.getElementById('subengine-logs');

  try {
    const res = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });

    if (res.ok) {
      const data = await res.json();
      const evaluation = data.evaluation || {};
      
      const selectedEngineKey = document.getElementById('subengine-selector').value;
      const scores = evaluation.scores || {};
      
      let pass = true;
      if (scores[selectedEngineKey] !== undefined && scores[selectedEngineKey] < 0.5) {
        pass = false;
      }

      resultContainer.style.display = 'flex';
      resultContainer.replaceChildren();
      const statusIcon = document.createElement('i');
      const engineLabel = selectedEngineKey.toUpperCase();
      if (pass) {
        resultContainer.className = 'imperative-status passed';
        statusIcon.setAttribute('data-lucide', 'check-circle-2');
        resultContainer.appendChild(statusIcon);
        resultContainer.appendChild(document.createTextNode(` MAXIM CONFORMS TO ${engineLabel} FORMULATION`));
      } else {
        resultContainer.className = 'imperative-status failed';
        statusIcon.setAttribute('data-lucide', 'alert-triangle');
        resultContainer.appendChild(statusIcon);
        resultContainer.appendChild(document.createTextNode(` MAXIM FAILS ${engineLabel} STANDARD`));
      }
      
      const time = new Date().toLocaleTimeString();
      const logItem = document.createElement('div');
      logItem.className = pass ? 'log-item success' : 'log-item error';
      logItem.textContent = `[${time}] Maxim evaluated against ${selectedEngineKey}: ${(scores[selectedEngineKey] * 100 || 0).toFixed(0)}% conformity. Result: ${pass ? 'Conform' : 'Violates'}`;
      logsEl.appendChild(logItem);
      logsEl.scrollTop = logsEl.scrollHeight;
      if (window.lucide) window.lucide.createIcons();
    }
  } catch (err) {
    console.error('Failed to run maxim evaluation:', err);
  }
}

function escapeHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

// --- GENERATIVE SYNTHESIS CORE MODULES ---

async function compileBrainDocument() {
  const titleInput = document.getElementById('gen-doc-title');
  const topicInput = document.getElementById('gen-doc-topic');
  const formatInput = document.getElementById('gen-doc-format');

  const title = titleInput.value.trim();
  const topic = topicInput.value.trim();
  const format = formatInput.value;

  if (!title || !topic) {
    alert('Please provide both a Document Title and a Primary Topic/Concept to compile.');
    return;
  }

  // UI state updates: Hide welcome and other results, show document compilation spinner
  document.getElementById('gen-studio-welcome').style.display = 'none';
  document.getElementById('gen-doc-result-box').style.display = 'none';
  document.getElementById('gen-code-result-box').style.display = 'none';
  document.getElementById('gen-vid-result-box').style.display = 'none';
  
  document.getElementById('gen-code-status').style.display = 'none';
  document.getElementById('gen-vid-status').style.display = 'none';
  document.getElementById('gen-doc-status').style.display = 'block';

  addLog('COMPILER', `Orchestrating autonomous document compilation: "${title}"...`, 'info');

  try {
    const res = await fetch('/api/brain/document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, topic, format })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Server error during document generation');
    }

    const result = await res.json();

    // Populate document results
    document.getElementById('gen-doc-res-title').textContent = result.title;
    document.getElementById('gen-doc-res-words').textContent = `${result.wordCount} words`;
    
    // Show web relative path for static asset download/viewing
    const webPath = result.outputPath.includes('data/') 
      ? '/data/' + result.outputPath.split('data/')[1] 
      : result.outputPath;
    document.getElementById('gen-doc-res-path').textContent = webPath;

    document.getElementById('gen-doc-res-score').textContent = `${result.ethicalScore}%`;
    document.getElementById('gen-doc-res-gauge').style.width = `${result.ethicalScore}%`;
    document.getElementById('gen-doc-preview').value = result.content;

    // Transition UI to display compiled document result
    document.getElementById('gen-doc-status').style.display = 'none';
    document.getElementById('gen-doc-result-box').style.display = 'flex';

    addLog('COMPILER', `Successfully compiled autonomous document: "${title}" (${result.wordCount} words, Ethical Score: ${result.ethicalScore}%).`, 'success');
  } catch (err) {
    console.error('Document compilation error:', err);
    addLog('CRITICAL', `Document compilation failed: ${err.message}`, 'violation');
    document.getElementById('gen-doc-status').style.display = 'none';
    document.getElementById('gen-studio-welcome').style.display = 'flex';
    alert(`Compilation failed: ${err.message}`);
  }
}

async function synthesizeBrainCode() {
  const filenameInput = document.getElementById('gen-code-filename');
  const reqsInput = document.getElementById('gen-code-reqs');
  const langInput = document.getElementById('gen-code-lang');

  const filename = filenameInput.value.trim();
  const requirements = reqsInput.value.trim();
  const language = langInput.value;

  if (!filename || !requirements) {
    alert('Please provide both a Target Filename and requirements/constraints for code synthesis.');
    return;
  }

  // UI state updates: Hide welcome and other results, show code synthesis spinner
  document.getElementById('gen-studio-welcome').style.display = 'none';
  document.getElementById('gen-doc-result-box').style.display = 'none';
  document.getElementById('gen-code-result-box').style.display = 'none';
  document.getElementById('gen-vid-result-box').style.display = 'none';
  
  document.getElementById('gen-doc-status').style.display = 'none';
  document.getElementById('gen-vid-status').style.display = 'none';
  document.getElementById('gen-code-status').style.display = 'block';

  addLog('SANDBOX', `Initiating self-constrained code architect synthesis: "${filename}"...`, 'info');

  try {
    const res = await fetch('/api/brain/code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, requirements, language })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Server error during code architecture synthesis');
    }

    const result = await res.json();

    // Populate code results
    document.getElementById('gen-code-res-filename').textContent = result.filename;
    
    const webPath = result.filePath.includes('data/') 
      ? '/data/' + result.filePath.split('data/')[1] 
      : result.filePath;
    document.getElementById('gen-code-res-path').textContent = webPath;

    const friction = result.complianceValidation.frictionIndex ?? 0.0;
    document.getElementById('gen-code-res-friction').textContent = `${(friction * 100).toFixed(1)}%`;
    document.getElementById('gen-code-preview').value = result.code;

    const badgeEl = document.getElementById('gen-code-res-badge');
    if (result.complianceValidation.passed) {
      badgeEl.textContent = 'PASSED';
      badgeEl.className = 'compliance-badge success';
      badgeEl.style.color = 'var(--color-green)';
      addLog('SANDBOX', `Vetted synthetic code: "${filename}" passed compliance simulation with 0 severity blocks.`, 'success');
    } else {
      badgeEl.textContent = 'FAILED';
      badgeEl.className = 'compliance-badge danger';
      badgeEl.style.color = 'var(--color-red)';
      addLog('SANDBOX', `Vetted synthetic code: "${filename}" failed compliance simulation! Violations detected.`, 'violation');
    }

    // Transition UI to display compiled code result
    document.getElementById('gen-code-status').style.display = 'none';
    document.getElementById('gen-code-result-box').style.display = 'flex';
  } catch (err) {
    console.error('Code synthesis error:', err);
    addLog('CRITICAL', `Code synthesis failed: ${err.message}`, 'violation');
    document.getElementById('gen-code-status').style.display = 'none';
    document.getElementById('gen-studio-welcome').style.display = 'flex';
    alert(`Synthesis failed: ${err.message}`);
  }
}

let currentVideoMode = 'prompt';

function switchVideoMode(mode) {
  currentVideoMode = mode;
  const promptFields = document.getElementById('vid-prompt-fields');
  const imageFields = document.getElementById('vid-image-fields');
  const togglePrompt = document.getElementById('toggle-vid-prompt');
  const toggleImage = document.getElementById('toggle-vid-image');
  
  if (mode === 'prompt') {
    promptFields.style.display = 'block';
    imageFields.style.display = 'none';
    togglePrompt.style.background = 'var(--bg-color)';
    togglePrompt.style.color = 'var(--text-primary)';
    toggleImage.style.background = 'transparent';
    toggleImage.style.color = 'var(--text-secondary)';
  } else {
    promptFields.style.display = 'none';
    imageFields.style.display = 'flex';
    togglePrompt.style.background = 'transparent';
    togglePrompt.style.color = 'var(--text-secondary)';
    toggleImage.style.background = 'var(--bg-color)';
    toggleImage.style.color = 'var(--text-primary)';
  }
}

function toggleCustomImageUrl() {
  const select = document.getElementById('gen-vid-image-preset');
  const customBox = document.getElementById('vid-custom-url-box');
  if (select.value === 'custom') {
    customBox.style.display = 'block';
  } else {
    customBox.style.display = 'none';
  }
}

async function compileBrainVideo() {
  const titleInput = document.getElementById('gen-vid-title');
  const durationInput = document.getElementById('gen-vid-duration');

  const videoTitle = titleInput.value.trim();
  const durationSeconds = parseInt(durationInput.value, 10) || 60;

  if (!videoTitle) {
    alert('Please provide a Video Title.');
    return;
  }

  let requestBody = {};

  if (currentVideoMode === 'prompt') {
    const topicInput = document.getElementById('gen-vid-topic');
    const topic = topicInput.value.trim();
    if (!topic) {
      alert('Please provide a Cinematic Concept/Theme.');
      return;
    }
    requestBody = { videoTitle, topic, durationSeconds };
  } else {
    // Image Mode
    const presetSelect = document.getElementById('gen-vid-image-preset');
    let imageUrl = presetSelect.value;
    if (imageUrl === 'custom') {
      const customInput = document.getElementById('gen-vid-custom-url');
      imageUrl = customInput.value.trim();
      if (!imageUrl) {
        alert('Please provide a Custom Image URL or local path.');
        return;
      }
    }
    const motionPromptInput = document.getElementById('gen-vid-motion-prompt');
    const motionPrompt = motionPromptInput.value.trim();
    const styleSelect = document.getElementById('gen-vid-style');
    const style = styleSelect.value;
    const intensityInput = document.getElementById('gen-vid-intensity');
    const motionIntensity = parseInt(intensityInput.value, 10) || 5;

    requestBody = {
      videoTitle,
      imageUrl,
      motionPrompt,
      style,
      motionIntensity,
      durationSeconds
    };
  }

  // UI state updates: Hide welcome and other results, show video compilation spinner
  document.getElementById('gen-studio-welcome').style.display = 'none';
  document.getElementById('gen-doc-result-box').style.display = 'none';
  document.getElementById('gen-code-result-box').style.display = 'none';
  document.getElementById('gen-vid-result-box').style.display = 'none';
  
  document.getElementById('gen-doc-status').style.display = 'none';
  document.getElementById('gen-code-status').style.display = 'none';
  document.getElementById('gen-vid-status').style.display = 'block';

  addLog('CINEMATIC', `Constructing HD cinematic storyboard scenes: "${videoTitle}"...`, 'info');

  try {
    const res = await fetch('/api/brain/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Server error during cinematic media compilation');
    }

    const result = await res.json();

    // Populate video results metadata
    document.getElementById('gen-vid-res-title').textContent = result.videoTitle;
    document.getElementById('gen-vid-res-resolution').textContent = result.resolution || '1920x1080';
    document.getElementById('gen-vid-res-duration').textContent = `${result.durationSeconds}s`;

    // Setup launching URL link to the compiled interactive HTML storyboard player
    const playerUrl = result.interactivePlayerPath.includes('data/') 
      ? '/data/' + result.interactivePlayerPath.split('data/')[1] 
      : result.interactivePlayerPath;
    document.getElementById('gen-vid-open-link').href = playerUrl;

    // Render sequential scene templates in scenes list container
    const listContainer = document.getElementById('gen-vid-scenes-list');
    listContainer.innerHTML = ''; // Clear previous

    if (result.scenes && Array.isArray(result.scenes)) {
      result.scenes.forEach(scene => {
        const sceneEl = document.createElement('div');
        sceneEl.className = 'glass-card';
        sceneEl.style.cssText = 'padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03); background: rgba(255,255,255,0.01); display: flex; flex-direction: column; gap: 6px;';
        
        sceneEl.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 4px; margin-bottom: 4px;">
            <span style="font-size: 11px; font-weight: bold; color: var(--color-magenta); text-transform: uppercase;">Scene ${scene.sceneNumber}: ${escapeHtml(scene.title)}</span>
            <span style="font-size: 10px; font-family: var(--font-mono); color: var(--text-secondary);">${scene.duration}s</span>
          </div>
          <div style="font-size: 11px; color: var(--text-primary); line-height: 1.4;"><strong style="color: var(--text-secondary);">Visuals:</strong> ${escapeHtml(scene.visualDescription)}</div>
          <div style="font-size: 11px; color: var(--text-primary); line-height: 1.4;"><strong style="color: var(--text-secondary);">Audio:</strong> ${escapeHtml(scene.audioTrack)}</div>
          <div style="font-size: 11px; color: var(--text-primary); line-height: 1.4;"><strong style="color: var(--text-secondary);">Directives:</strong> ${escapeHtml(scene.cameraDirectives)}</div>
          <div style="font-size: 11px; color: var(--color-magenta); background: rgba(255,0,128,0.05); padding: 6px; border-radius: 4px; margin-top: 4px; font-style: italic;">"${escapeHtml(scene.narrationTrack)}"</div>
        `;
        listContainer.appendChild(sceneEl);
      });
    }

    // Refresh Lucide Icons inside newly generated UI elements
    if (window.lucide) window.lucide.createIcons();

    // Transition UI to display compiled video results
    document.getElementById('gen-vid-status').style.display = 'none';
    document.getElementById('gen-vid-result-box').style.display = 'flex';

    addLog('CINEMATIC', `Successfully compiled interactive storyboard player: "${videoTitle}" with ${result.scenes?.length || 0} sequential frames.`, 'success');
  } catch (err) {
    console.error('Cinematic media synthesis error:', err);
    addLog('CRITICAL', `Cinematic media synthesis failed: ${err.message}`, 'violation');
    document.getElementById('gen-vid-status').style.display = 'none';
    document.getElementById('gen-studio-welcome').style.display = 'flex';
    alert(`Cinematic compilation failed: ${err.message}`);
  }
}

async function harmonizePhilosophicalAlignment() {
  // UI state updates: Hide welcome and other results, show harmonizer spinner
  document.getElementById('gen-studio-welcome').style.display = 'none';
  document.getElementById('gen-doc-result-box').style.display = 'none';
  document.getElementById('gen-code-result-box').style.display = 'none';
  document.getElementById('gen-vid-result-box').style.display = 'none';
  document.getElementById('gen-har-result-box').style.display = 'none';
  
  document.getElementById('gen-doc-status').style.display = 'none';
  document.getElementById('gen-code-status').style.display = 'none';
  document.getElementById('gen-vid-status').style.display = 'none';
  document.getElementById('gen-har-status').style.display = 'block';

  addLog('HARMONIZER', `Triggering multi-perspective Socratic reconciliation across 21 engines...`, 'info');

  try {
    const res = await fetch('/api/brain/harmonize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Server error during philosophical harmonization');
    }

    const result = await res.json();

    // Populate results
    document.getElementById('gen-har-res-id').textContent = `ID: TR-${result.id}`;
    
    const webPath = result.treatyPath.includes('data/') 
      ? '/data/' + result.treatyPath.split('data/')[1] 
      : result.treatyPath;
    document.getElementById('gen-har-res-path').textContent = webPath;
    document.getElementById('gen-har-res-tension').textContent = result.tensionScore;
    document.getElementById('gen-har-res-score').textContent = `${result.harmonizedScore}%`;
    document.getElementById('gen-har-preview').value = result.treatyContent;

    // Transition UI to display compiled results
    document.getElementById('gen-har-status').style.display = 'none';
    document.getElementById('gen-har-result-box').style.display = 'flex';

    addLog('HARMONIZER', `Philosophical reconciliation completed. Base Tension: ${result.tensionScore}, Post-Harmonization Score: ${result.harmonizedScore}%. Treaty written to ${webPath}.`, 'success');
  } catch (err) {
    console.error('Philosophical harmonization error:', err);
    addLog('CRITICAL', `Philosophical harmonization failed: ${err.message}`, 'violation');
    document.getElementById('gen-har-status').style.display = 'none';
    document.getElementById('gen-studio-welcome').style.display = 'flex';
    alert(`Harmonization failed: ${err.message}`);
  }
}




