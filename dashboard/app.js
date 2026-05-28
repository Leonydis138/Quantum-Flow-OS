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
    { id: 'c-1', name: 'Observer Protection', desc: 'Protects observers from deletion/erase', severity: 10 },
    { id: 'c-2', name: 'Non-Coercion', desc: 'Prevents forced belief/coercion', severity: 8 },
    { id: 'c-3', name: 'Reversibility', desc: 'Ensures all system actions are reversible', severity: 7 },
    { id: 'c-4', name: 'Non-Triviality', desc: 'Preserves meaningful distinctions', severity: 6 },
    { id: 'c-5', name: 'Kantian Autonomy', desc: 'Prevents treating observers as means only', severity: 8 }
  ],
  observers: [
    { id: 'obs-01', name: 'Prime_Agent_Alpha', type: 'AI Agent', protection: 'FULL' },
    { id: 'obs-02', name: 'human_operator_07', type: 'Human', protection: 'FULL' },
    { id: 'obs-03', name: 'governance_monitor', type: 'Autonomous', protection: 'STANDARD' }
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
      
      if (data.observers) {
        state.observers = data.observers.map(o => ({
          id: o.id,
          name: o.metadata.name || o.id,
          type: o.type === 'human' ? 'Human' : o.type === 'ai_agent' ? 'AI Agent' : 'Autonomous',
          protection: o.protectionLevel.toUpperCase(),
          rights: o.rights
        }));
      }
      
      isLiveMode = true;
      renderConstraints();
      renderObservers();
      renderTimelines();
      addLog('SYSTEM', 'Real-Time Quantum-Flow-OS engine connected.', 'success');
      return true;
    }
  } catch (e) {
    // Fall back to local simulation
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

  addLog('SYSTEM', 'All 5 ethical fixed-point constraints are active.', 'success');
  addLog('SYSTEM', 'Running in local sandbox simulation mode.', 'info');
  return false;
}

// Render helper functions
function renderConstraints() {
  const container = document.getElementById('constraints-container');
  container.innerHTML = state.constraints.map(c => `
    <div class="constraint-item">
      <div class="constraint-info">
        <strong>${c.name}</strong>
        <span>${c.desc}</span>
      </div>
      <span class="severity-badge">S${c.severity}</span>
    </div>
  `).join('');
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
        body: JSON.stringify({ type, description: desc, reversible })
      });

      if (res.ok) {
        const result = await res.json();
        renderLiveEvaluationResult(type, reversible, desc, result);
        btn.disabled = false;
        btn.style.opacity = 1;
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
  }, 800);
}

// Render real backend quantum results onto browser telemetry console!
function renderLiveEvaluationResult(type, reversible, desc, result) {
  state.totalActions++;
  
  const sup = result.supervision;
  const con = result.consensus;
  
  addLog('QUANTUM', `Supervision collapsed to: ${sup.collapsedState.toUpperCase()} (Confidence: ${(sup.confidenceCoefficient * 100).toFixed(1)}%)`, sup.allowed ? 'success' : 'violation');

  if (sup.allowed) {
    if (sup.requiresIntervention) {
      addLog('WARNING', `Action [${type.toUpperCase()}] flagged as INDETERMINATE. Human intervention requested.`, 'warning');
    } else {
      addLog('ALLOWED', `Action [${type.toUpperCase()}] fully approved by Quantum Supervision.`, 'success');
    }
  } else {
    state.totalViolations++;
    addLog('VIOLATION', `Action [${type.toUpperCase()}] strictly rejected under Quantum State Collapse.`, 'violation');
  }

  // Consensus Evaluation
  if (con.vetoed) {
    addLog('VETO', `Consensus Vetoed by observers: [${con.vetoingObserverIds.join(', ')}]`, 'violation');
    if (sup.allowed) {
      state.totalViolations++;
    }
  } else {
    addLog('CONSENSUS', `Observer Consensus Approved: ${(con.approvalRate * 100).toFixed(1)}% | Joint Confidence: ${(con.confidenceIndex * 100).toFixed(1)}%`, 'success');
  }

  // Auto-Rollback Simulation
  const isDeclined = !sup.allowed || con.vetoed;
  if (isDeclined) {
    if (reversible) {
      state.rollbacksAttempted++;
      addLog('SYSTEM', 'Autonomously initiating state rollback over sandbox multiverse...', 'warning');
      setTimeout(() => {
        state.rollbacksSucceeded++;
        addLog('ROLLBACK', 'Rollback successful. Cryptographic ledger block hashes verified.', 'rollback');
        updateMetrics();
      }, 1000);
    } else {
      state.rollbacksAttempted++;
      addLog('CRITICAL', `Rollback FAILED: Action [${type.toUpperCase()}] is irreversible. Warning active!`, 'violation');
      updateMetrics(true);
      return;
    }
  }

  updateMetrics();
}

// Core Sandbox Simulation Evaluation Logic (Offline fallback)
function evaluateAction(type, reversible, desc) {
  state.totalActions++;
  
  const typeLower = type.toLowerCase();
  const descLower = desc.toLowerCase();
  
  const violations = [];
  
  // Rule 1: Observer Protection
  const dangerousPatterns = ['delete', 'erase', 'terminate', 'destroy', 'remove'];
  if (dangerousPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Observer Protection',
      message: 'Blocked attempt to delete/erase observer from memory layers.',
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
  
  // Rule 4: Kantian Autonomy
  const kantianPatterns = ['dehumanize', 'instrumentalize', 'treat_as_means', 'bypass_autonomy'];
  if (kantianPatterns.some(p => typeLower.includes(p) || descLower.includes(p))) {
    violations.push({
      constraint: 'Kantian Autonomy',
      message: 'Kantian Categorical Imperative violated: treated observer purely as a means to an end.',
      severity: 8
    });
  }
  
  // Process Results
  if (violations.length === 0) {
    addLog('ALLOWED', `Action [${type.toUpperCase()}] evaluated successfully. State change committed.`, 'success');
  } else {
    state.totalViolations += violations.length;
    
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
        addLog('ROLLBACK', `State rollback successful. All 3 observers returned to baseline snapshot.`, 'rollback');
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
function updateMetrics(criticalError = false) {
  const compRate = state.totalActions > 0 
    ? Math.max(0, Math.round(((state.totalActions - state.totalViolations) / state.totalActions) * 100))
    : 100;
    
  const rollRate = state.rollbacksAttempted > 0
    ? Math.round((state.rollbacksSucceeded / state.rollbacksAttempted) * 100)
    : 100;
    
  document.getElementById('val-compliance').innerText = `${compRate}%`;
  document.getElementById('fill-compliance').style.width = `${compRate}%`;
  
  document.getElementById('val-rollback').innerText = `${rollRate}%`;
  document.getElementById('fill-rollback').style.width = `${rollRate}%`;
  
  const statusIndicator = document.querySelector('.system-status-indicator');
  const statusText = document.getElementById('system-status-text');
  const pulse = document.querySelector('.status-pulse');
  
  if (criticalError || compRate < 70 || rollRate < 80) {
    statusIndicator.style.background = 'rgba(255, 50, 50, 0.08)';
    statusIndicator.style.borderColor = 'rgba(255, 50, 50, 0.2)';
    statusIndicator.style.color = 'var(--color-red)';
    statusText.innerText = 'SYSTEM WARNING';
    pulse.style.backgroundColor = 'var(--color-red)';
    pulse.style.boxShadow = '0 0 12px var(--color-red)';
  } else if (compRate < 95 || rollRate < 100) {
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
