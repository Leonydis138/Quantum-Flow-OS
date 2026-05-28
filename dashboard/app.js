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

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Render Constraints & Observers
  renderConstraints();
  renderObservers();
  
  // Log startup success
  addLog('SYSTEM', 'All 5 ethical fixed-point constraints are loaded and active.', 'success');
  addLog('SYSTEM', '3 observers are being actively monitored.', 'info');
});

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
  container.innerHTML = state.observers.map(o => `
    <div class="observer-item">
      <i data-lucide="${o.type === 'Human' ? 'user' : 'bot'}"></i>
      <div class="observer-detail">
        <strong>${o.name}</strong>
        <span>Type: ${o.type} | Level: ${o.protection}</span>
      </div>
    </div>
  `).join('');
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
function submitCustomAction() {
  const type = document.getElementById('action-type').value.trim();
  const reversible = document.getElementById('action-reversibility').value === 'true';
  const desc = document.getElementById('action-desc').value.trim();
  
  if (!type || !desc) {
    alert('Please provide both Action Type and Description/Intent.');
    return;
  }
  
  // Disable button momentarily for execution simulation
  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.style.opacity = 0.5;
  
  addLog('EXEC', `Initiating action protocol [${type.toUpperCase()}]...`, 'info');
  
  setTimeout(() => {
    evaluateAction(type, reversible, desc);
    btn.disabled = false;
    btn.style.opacity = 1;
  }, 800);
}

// Core Simulation Evaluation Logic (reflecting our framework updates!)
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
  
  // Rule 4: Kantian Autonomy (Our newly integrated protection layer!)
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
  // Calculate Rates
  const compRate = state.totalActions > 0 
    ? Math.max(0, Math.round(((state.totalActions - state.totalViolations) / state.totalActions) * 100))
    : 100;
    
  const rollRate = state.rollbacksAttempted > 0
    ? Math.round((state.rollbacksSucceeded / state.rollbacksAttempted) * 100)
    : 100;
    
  // Update elements
  document.getElementById('val-compliance').innerText = `${compRate}%`;
  document.getElementById('fill-compliance').style.width = `${compRate}%`;
  
  document.getElementById('val-rollback').innerText = `${rollRate}%`;
  document.getElementById('fill-rollback').style.width = `${rollRate}%`;
  
  // Update System Health Indicator
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
