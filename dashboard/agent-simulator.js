/**
 * ANTIGRAVITY-OS — Quantum-Swarm Agent Company Engine
 * Integrated with Quantum Flow OS Ethical Invariant Ontology Framework
 * Senior Designer-Developer Masterpiece Signature Simulation Engine - v11.0.0
 * Fully client-side, self-contained, high-performance simulation kernel.
 */

// ==========================================
// 1. ADVANCED STEREO-PANNING SYNTHESIZER DRONE
// ==========================================
class QuantumAudioCore {
  constructor() {
    this.ctx = null;
    this.droneOscs = [];
    this.droneGain = null;
    this.muted = false;
    this.droneActive = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  // Deep, ambient sci-fi control-room console drone with slow sweep parameters
  startQuantumDrone() {
    this.init();
    if (this.muted || this.droneActive) return;
    try {
      this.droneOscs = [];
      
      // Grounding sub-bass oscillator
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(55.00, this.ctx.currentTime); // A1 Note
      
      // Warm, melodic midharmonic resonance
      const warmOsc = this.ctx.createOscillator();
      warmOsc.type = 'triangle';
      warmOsc.frequency.setValueAtTime(110.00, this.ctx.currentTime); // A2 Note
      
      // Floating high-tier crystal frequency
      const airOsc = this.ctx.createOscillator();
      airOsc.type = 'sine';
      airOsc.frequency.setValueAtTime(220.00, this.ctx.currentTime); // A3 Note

      // Sharp lowpass filter with slow sweeps
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);
      filter.Q.setValueAtTime(4, this.ctx.currentTime);

      // Low frequency oscillator (LFO) for breathing filter modulation
      const lfo = this.ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.05, this.ctx.currentTime); // Very slow 20s breathing cycle

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(30, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      // Soft master gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.035, this.ctx.currentTime); // Soft, non-intrusive soundscape

      subOsc.connect(filter);
      warmOsc.connect(filter);
      airOsc.connect(filter);
      
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      subOsc.start();
      warmOsc.start();
      airOsc.start();
      lfo.start();

      this.droneOscs = [subOsc, warmOsc, airOsc, lfo];
      this.droneActive = true;
    } catch (e) {
      console.warn("AudioContext initialization deferred until explicit user gesture.");
    }
  }

  stopQuantumDrone() {
    if (this.droneOscs.length > 0) {
      this.droneOscs.forEach(osc => {
        try { osc.stop(); } catch(e) {}
      });
      this.droneOscs = [];
    }
    this.droneActive = false;
  }

  playBleep(freq = 800, duration = 0.05, type = 'sine', volume = 0.02) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Sonification of moving data packets
  playSynapseSpark() {
    if (Math.random() < 0.15) { 
      const sparkFreq = randomRange(1500, 2500); 
      this.playBleep(sparkFreq, 0.006, 'triangle', 0.008);
    }
  }

  playClick() {
    this.playBleep(1100, 0.012, 'sine', 0.02);
  }

  playChirp() {
    this.playBleep(523.25, 0.04, 'sine', 0.025);
    setTimeout(() => this.playBleep(880.00, 0.08, 'triangle', 0.02), 35);
  }

  playAlarm() {
    this.playBleep(220, 0.18, 'sawtooth', 0.04);
    setTimeout(() => this.playBleep(180, 0.22, 'sawtooth', 0.04), 110);
  }

  playClear() {
    this.playBleep(659.25, 0.05, 'sine', 0.025);
    setTimeout(() => this.playBleep(987.77, 0.1, 'sine', 0.02), 40);
  }

  playBoot() {
    this.playBleep(329.63, 0.06, 'sine', 0.035); // E4
    setTimeout(() => this.playBleep(440.00, 0.06, 'sine', 0.035), 50); // A4
    setTimeout(() => this.playBleep(554.37, 0.06, 'sine', 0.035), 100); // C#5
    setTimeout(() => this.playBleep(880.00, 0.14, 'sine', 0.03), 150); // A5
  }

  playRewind() {
    this.playBleep(987.77, 0.05, 'sine', 0.03);
    setTimeout(() => this.playBleep(783.99, 0.05, 'sine', 0.03), 40);
    setTimeout(() => this.playBleep(523.25, 0.05, 'sine', 0.03), 80);
    setTimeout(() => this.playBleep(329.63, 0.12, 'sine', 0.03), 120);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopQuantumDrone();
    } else if (NET.autoRun) {
      this.startQuantumDrone();
    }
    return this.muted;
  }
}

const sfx = new QuantumAudioCore();

// ==========================================
// 2. SOVEREIGN SIMULATOR STATE DATABASE WITH REVERSIBILITY HISTORY
// ==========================================
const NET = {
  cycle: 1,
  focusedId: 'comp_aetherflow',
  autoRun: false,
  speed: 'tactical', // slow, tactical, overdrive
  globalLiquidity: 1410000,
  marketVolatility: 22.5,
  activeShock: null,
  activeParadigm: 'stoic', // Default Ethical Ontology Lens
  observerProtectionActive: true,
  stateHistory: [], // Chrono snapshot stack for reversibility rollback checks
  
  companies: {
    comp_aetherflow: {
      id: 'comp_aetherflow',
      name: 'AetherFlow',
      type: 'SaaS',
      desc: 'Sovereign AI Commit Refactorer & PR Engine',
      cash: 250000,
      mrr: 15500,
      users: 620,
      price: 25,
      sla: 99.8,
      bugs: 2,
      baseBurn: 9000,
      consumes: ['comp_dataforge', 'comp_authnexus', 'comp_deepcog'],
      activeDirective: 'Conserve liquid assets and expand unit SLA stability margins',
      activeSprint: 'Verify secure asymmetric credential routing and latency thresholds',
      codeCoverage: 84,
      cashHistory: [250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000, 250000],
      containers: [true, true, true, true, true, true, true, true, true], // SRE blades
      logs: { CEO: [], PM: [], DEV: [], GROWTH: [], DEVOPS: [] }
    },
    comp_shieldguard: {
      id: 'comp_shieldguard',
      name: 'ShieldGuard',
      type: 'SaaS',
      desc: 'Autonomous credential scanner & vulnerability vault',
      cash: 180000,
      mrr: 12900,
      users: 320,
      price: 40,
      sla: 99.7,
      bugs: 3,
      baseBurn: 7500,
      consumes: ['comp_authnexus', 'comp_deepcog'],
      activeDirective: 'Enforce asymmetric encryption audits across transactions',
      activeSprint: 'Build multi-tenant secure storage layers',
      codeCoverage: 81,
      cashHistory: [180000, 180000, 180000, 180000, 180000, 180000, 180000, 180000, 180000, 180000],
      containers: [true, true, true, true, true, true, true, true, true],
      logs: { CEO: [], PM: [], DEV: [], GROWTH: [], DEVOPS: [] }
    },
    comp_dataforge: {
      id: 'comp_dataforge',
      name: 'NeonDB Pg',
      type: 'PaaS',
      desc: 'NeonDB Serverless Pg PostgreSQL Cloud Engine',
      cash: 280000,
      mrr: 8400,
      users: 2, 
      price: 15, 
      sla: 99.9,
      bugs: 1,
      baseBurn: 5000,
      consumes: ['comp_cloudscale'],
      activeDirective: 'Minimize distributed record locking parameters',
      activeSprint: 'Scale PgPool connection-pooling limits',
      codeCoverage: 79,
      cashHistory: [280000, 280000, 280000, 280000, 280000, 280000, 280000, 280000, 280000, 280000],
      containers: [true, true, true, true, true, true, true, true, true],
      logs: { CEO: [], PM: [], DEV: [], GROWTH: [], DEVOPS: [] }
    },
    comp_authnexus: {
      id: 'comp_authnexus',
      name: 'AuthCipher',
      type: 'PaaS',
      desc: 'AuthCipher Zero-trust Secure Token IAM API',
      cash: 190000,
      mrr: 5900,
      users: 2,
      price: 8,
      sla: 99.9,
      bugs: 2,
      baseBurn: 4200,
      consumes: ['comp_cloudscale'],
      activeDirective: 'Re-authenticate secure token handshake timeouts',
      activeSprint: 'Optimize OAuth key-exchange handshakes',
      codeCoverage: 89,
      cashHistory: [190000, 190000, 190000, 190000, 190000, 190000, 190000, 190000, 190000, 190000],
      containers: [true, true, true, true, true, true, true, true, true],
      logs: { CEO: [], PM: [], DEV: [], GROWTH: [], DEVOPS: [] }
    },
    comp_deepcog: {
      id: 'comp_deepcog',
      name: 'VectorSpace',
      type: 'AI-aaS',
      desc: 'VectorSpace AI GPU-backed Vector Embedding API',
      cash: 350000,
      mrr: 11000,
      users: 2,
      price: 22,
      sla: 99.5,
      bugs: 4,
      baseBurn: 8000,
      consumes: ['comp_cloudscale'],
      activeDirective: 'Establish floating context token buffer arrays',
      activeSprint: 'Build parallel vector query compilation blocks',
      codeCoverage: 82,
      cashHistory: [350000, 350000, 350000, 350000, 350000, 350000, 350000, 350000, 350000, 350000],
      containers: [true, true, true, true, true, true, true, true, true],
      logs: { CEO: [], PM: [], DEV: [], GROWTH: [], DEVOPS: [] }
    },
    comp_cloudscale: {
      id: 'comp_cloudscale',
      name: 'HyperScale',
      type: 'IaaS',
      desc: 'HyperScale CDN edge servers & bare-metal hypervisors',
      cash: 420000,
      mrr: 7200,
      users: 3, 
      price: 2400, 
      sla: 100.0,
      bugs: 1,
      baseBurn: 11000,
      consumes: [],
      activeDirective: 'Minimize optical CDN packet distribution drops',
      activeSprint: 'Harden hypervisor isolation rules',
      codeCoverage: 87,
      cashHistory: [420000, 420000, 420000, 420000, 420000, 420000, 420000, 420000, 420000, 420000],
      containers: [true, true, true, true, true, true, true, true, true],
      logs: { CEO: [], PM: [], DEV: [], GROWTH: [], DEVOPS: [] }
    }
  },
  
  wires: [
    { from: 'comp_aetherflow', to: 'comp_dataforge', label: 'DB Pool' },
    { from: 'comp_aetherflow', to: 'comp_authnexus', label: 'IAM JWT' },
    { from: 'comp_aetherflow', to: 'comp_deepcog', label: 'Embed API' },
    { from: 'comp_shieldguard', to: 'comp_authnexus', label: 'IAM JWT' },
    { from: 'comp_shieldguard', to: 'comp_deepcog', label: 'Query Vec' },
    { from: 'comp_dataforge', to: 'comp_cloudscale', label: 'Bare Metal' },
    { from: 'comp_authnexus', to: 'comp_cloudscale', label: 'Hypervisor' },
    { from: 'comp_deepcog', to: 'comp_cloudscale', label: 'GPU Cluster' }
  ],
  
  wireCoords: {
    comp_aetherflow: { x: 125, y: 70 },
    comp_shieldguard: { x: 335, y: 70 },
    comp_dataforge: { x: 125, y: 200 },
    comp_authnexus: { x: 335, y: 200 },
    comp_deepcog: { x: 545, y: 200 },
    comp_cloudscale: { x: 335, y: 330 }
  },

  boardroomChat: [
    { sender: 'narrator', text: 'ANTIGRAVITY SYSTEM [Swarm Kernel Core v11.0] mounted successfully. Integrated with Quantum Flow OS ethical ontology invariants.' }
  ]
};

// ==========================================
// 3. QUANTUM NEUROMORPHIC PARADIGM LOG DIRECTORIES
// ==========================================
const PHILOSOPHICAL_REFLECTIONS = {
  stoic: {
    CEO_Thoughts: "Reflecting on equanimity in volatile markets. System reserve is {cash}. We do not control outward volatility, only our core inner code compilation invariants.",
    PM_Thoughts: "Aligning roadmap specifications to '{sprint}'. Tracking backlog debt strictly; focusing energy only on actionable parameters within our direct control.",
    DEV_Thoughts: "Applying compiler disciplines. Code coverage stands at {coverage}%. We compile code with calm, deliberate focus.",
    GROWTH_Thoughts: "Observing user conversions calmly. Unit rate is ${price}. Volatility of {volatility}% is merely an external event to accommodate."
  },
  buddhist: {
    CEO_Thoughts: "Nurturing collective safety for our autonomous swarm. Active runway stands at {cash}. We operate to ease friction across node synapses.",
    PM_Thoughts: "Evaluating sprint tasks for '{sprint}'. Eliminating aggressive features; safeguarding observer models from stress or exhaustion.",
    DEV_Thoughts: "Patched {fixed} logical leaks with compassion. Current defects stand at {bugs}. Safeguarding continuous integration systems calmly.",
    GROWTH_Thoughts: "Encouraging gentle organic customer relationships. Capping unit pricing tiers at $40 to prevent observer financial burden."
  },
  nietzschean: {
    CEO_Thoughts: "Runway stands at {cash}. We will conquer the market tiers. Volatility of {volatility}% is a test of our supreme will to power.",
    PM_Thoughts: "Pushing overdrive feature targets for '{sprint}'. Backlog defects ({bugs}) represent fuel for development struggles. Forward to the peak!",
    DEV_Thoughts: "Refactoring modules dynamically. Code compilation rate is {coverage}%. What does not destroy our code compilation makes it stronger.",
    GROWTH_Thoughts: "Deploying high-tier pricing rules (${price}). Pushing lead conversions and acquiring the swarm with extreme growth speed multipliers."
  },
  kantian: {
    CEO_Thoughts: "Upholding deontological core invariants. Runway balance is {cash}. We treat our user swarms as ends in themselves, never merely as means.",
    PM_Thoughts: "Enforcing absolute categorical imperatives. Sprint is '{sprint}'. If code bugs stand above 1, marketing operations are locked.",
    DEV_Thoughts: "Working with strict duty boundaries. Resolving logical leaks. Synapse SLA is {sla}%. Duty requires immediate unit testing.",
    GROWTH_Thoughts: "Auditing compliance rules. Churn is regulated by pure moral invariants, maintaining absolute transaction transparency."
  },
  utilitarian: {
    CEO_Thoughts: "Balancing aggregate systemic welfare. Cash pool is {cash}. Dynamically matching price variables to maximize aggregate happiness calculus.",
    PM_Thoughts: "Structuring sprints for '{sprint}'. Resolving defects to maximize utility index values across consumers and API tenants.",
    DEV_Thoughts: "Running test classes. Code coverage: {coverage}%. patches deployed to serve the greatest volume of database queries.",
    GROWTH_Thoughts: "Optimizing conversion ratios to maximize average user satisfaction score indices. Active users stand at {users}."
  },
  machiavellian: {
    CEO_Thoughts: "Maintaining structural power and sovereign security. Cash reserve is {cash}. We tax richer nodes to preserve vulnerable cluster segments.",
    PM_Thoughts: "Designing tactical roadmap epics: '{sprint}'. Manipulating API specifications to preserve sovereign control of PaaS layers.",
    DEV_Thoughts: "Compiling system patches. Defects logged: {bugs}. We patch defects only to secure control of cloud CDN edges.",
    GROWTH_Thoughts: "Applying aggressive pricing indices (${price}) to extract resource flows from end users. Stability is secured through absolute dominance."
  },
  socratic: {
    CEO_Thoughts: "Questioning our financial assumptions. Active runway stands at {cash} tokens. Is our MRR growth truly sustainable, or merely a temporal illusion?",
    PM_Thoughts: "Conducting dialectic review of current milestone targets: '{sprint}'. Is this feature truly good for our users, or do we only assume it is?",
    DEV_Thoughts: "Examining compiler invariants. Code coverage is {coverage}%. We found {bugs} latent bugs through systematic refutation (Elenchus).",
    GROWTH_Thoughts: "Inquiring into NPS and user metrics. Is pricing at ${price} an expression of real value, or are we confusing shadows on the wall for truth?"
  }
};

const COGNITIVE_DICT = {
  CEO_Thoughts: [
    "Analyzing spectral token buffers. Balancing runway assets of {cash} tokens against cycles MRR value of {mrr}.",
    "Evaluating operational balance densities. Node runway evaluated to {cash}. Backlog structural defects currently stand at {bugs}.",
    "Evaluating Lyapunov stability indexes. Node runway: {cash}. Outstanding CVE pipeline defects: {bugs} vulnerabilities."
  ],
  CEO_Actions: [
    "Establishing quantum core directive: '{directive}'. Transmitting synaptic weights matrix downstream to PM Marcus.",
    "Promoting master operational mandate to stabilize system: '{directive}'. Scheduling PMC backlog sprints.",
    "Adjusting active node strategic targets. Broadcasting core directive: '{directive}' to logic units."
  ],
  PM_Thoughts: [
    "Synthesizing Sophia's strategic weights into logical specifications. Backlog contains {bugs} CVE leaks.",
    "Mapping node dependencies. Compiling specification documents for milestone target: '{sprint}'. Current defects: {bugs}."
  ],
  PM_Actions: [
    "Committed feature specification payload. Scheduled target: '{sprint}'. Directing developer Elena.",
    "Scoped targeted milestone epic: '{sprint}'. Passing operational parameters to Elena's compiler board."
  ],
  DEV_Thoughts: [
    "Loading logic compiler dependencies. Preparing workspace for targeted sprint: '{sprint}'.",
    "Running local compiling regressions. Module logic compilation coverage is {coverage}%. Checking memory buffers."
  ],
  DEV_Actions: [
    "Pushed typescript classes commit to main. Patched {fixed} repository bugs. Logic compilation rate: {coverage}%.",
    "Compiled build revision #1{cycle} successfully. Resolved {fixed} active logical leaks. Synapse SLA is {sla}%."
  ],
  GROWTH_Thoughts: [
    "Analyzing lead conversion elasticities. Licensing inflow currently set to ${price}/user.",
    "Mapping market NPS sentiment index. Network advocacy score is stable at {nps} points."
  ],
  GROWTH_Actions: [
    "Ignited social-multipliers promotion sequence. Expanded organic user acquisition speed indices.",
    "Launched automated optimization rules to offset customer churn rates. Volatility corrected."
  ],
  DEVOPS_Thoughts: [
    "Auditing SRE blade chassis slot layers. Host container allocation load is stable.",
    "Scanning syslogs for logical errors. Status is healthy. Synapse SLA is {sla}%."
  ],
  DEVOPS_Actions: [
    "Stabilized connection pooling gates. Healed crashed containers. Port uptime secured at {sla}%.",
    "Mitigated replication warnings. Restored {healed} offline virtual port endpoints. Container replication online."
  ],
  SprintsList: [
    "Establish asymmetric cryptographic handshakes",
    "Optimize OAuth key-exchange handshakes",
    "Harden zero-trust token signature headers",
    "Scale distributed connection pool margins",
    "Refactor floating context buffer arrays",
    "Harden hypervisor process isolation boundaries",
    "Build multi-tenant secure storage layers",
    "Optimize distributed index query caching"
  ],
  DirectivesList: [
    "Conserve liquid assets and expand unit SLA stability margins",
    "Enforce asymmetric encryption audits across transactions",
    "Minimize distributed record locking parameters",
    "Maximize user acquisition and stabilize API telemetry",
    "Harden hypervisor isolation and block latency degradation"
  ]
};

// Procedural log compilers
function compileLogString(template, data) {
  let output = template;
  for (const key in data) {
    output = output.replace(new RegExp(`{${key}}`, 'g'), data[key]);
  }
  return output;
}

function selectRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// ==========================================
// 4. REVERSIBILITY ROLLBACK STATE PERSISTENCE ENGINE
// ==========================================
function saveStateSnapshot() {
  const snapshot = {
    cycle: NET.cycle,
    globalLiquidity: NET.globalLiquidity,
    marketVolatility: NET.marketVolatility,
    activeParadigm: NET.activeParadigm,
    companies: JSON.parse(JSON.stringify(NET.companies)),
    boardroomChat: JSON.parse(JSON.stringify(NET.boardroomChat))
  };
  
  NET.stateHistory.push(snapshot);
  if (NET.stateHistory.length > 10) { // Keep maximum 10-wave depth
    NET.stateHistory.shift();
  }
  
  updateRollbackCountersUI();
}

function triggerTemporalRollback() {
  if (NET.stateHistory.length === 0) {
    sfx.playAlarm();
    NET.boardroomChat.push({ sender: 'narrator', text: 'REVERSIBILITY DENIED: No further temporal snapshots located in the rollback registry stack.' });
    updateDialogueBox();
    return;
  }
  
  // Disable autoRun temporarily to avoid racing states
  const wasRunning = NET.autoRun;
  if (wasRunning) {
    const runBtn = document.getElementById('btn-p-auto');
    NET.autoRun = false;
    if (runBtn) {
      runBtn.querySelector('span').innerText = "RUN CHRONOMETER";
      runBtn.classList.remove('pink-pulse');
    }
    syncSimulatorPacing();
  }
  
  const previous = NET.stateHistory.pop();
  
  // Re-establish states
  NET.cycle = previous.cycle;
  NET.globalLiquidity = previous.globalLiquidity;
  NET.marketVolatility = previous.marketVolatility;
  NET.activeParadigm = previous.activeParadigm;
  NET.companies = previous.companies;
  NET.boardroomChat = previous.boardroomChat;
  
  // Match select dropdown element visual
  const selectDropdown = document.getElementById('ethical-paradigm-select');
  if (selectDropdown) selectDropdown.value = NET.activeParadigm;
  
  // Add rewind announcement log
  NET.boardroomChat.push({ sender: 'narrator', text: `⏳ TEMPORAL ROLLBACK EXECUTED: Reverted state to wave cycle ${NET.cycle}. Cash accounts and SLA variables rolled back.` });
  
  // Sonic playbacks
  sfx.playRewind();
  
  // Recalculate visual matrices
  const cycleCounter = document.getElementById('macro-cycle-number');
  if (cycleCounter) cycleCounter.innerText = NET.cycle;
  
  updateHUDValues();
  updateFocusedNodeAudits();
  refreshAgentTerminals();
  refreshDevOpsGridUI();
  drawCanvasTrendsLineChart();
  updateDialogueBox();
  updateRollbackCountersUI();
}

function updateRollbackCountersUI() {
  const lbl = document.getElementById('rollback-history-count');
  if (lbl) lbl.innerText = `${NET.stateHistory.length} Snapshots`;
}

// ==========================================
// 5. UNIFIED SIMULATION STEP PIPELINE
// ==========================================
function stepQuantumSimulation() {
  // Save current state as snap before performing calculations
  saveStateSnapshot();
  
  NET.cycle += 1;
  const cycleCounter = document.getElementById('macro-cycle-number');
  if (cycleCounter) cycleCounter.innerText = NET.cycle;
  
  // A. Cascade SLAs down the dependency matrix
  cascadeSystemSLAs();
  
  // B. Run financial trades and settlement trades (modified by active ethical paradigm)
  settleTransactions();
  
  // C. Run focused agent operational pipelines (modified by active ethical paradigm)
  executeSovereignAgents();
  
  // D. Update all graphics, charts, and values
  drawCanvasTrendsLineChart();
  updateHUDValues();
  updateFocusedNodeAudits();
  
  // Random shock checks
  if (Math.random() < 0.08) {
    triggerMacroShock();
  }
}

// Cascade SLAs from Infrastructure layer through Middleware to Application layers
function cascadeSystemSLAs() {
  const comp = NET.companies;
  
  // IaaS Tier: HyperScale CDN
  const iaasNode = comp.comp_cloudscale;
  const iaasActiveCount = iaasNode.containers.filter(Boolean).length;
  iaasNode.sla = parseFloat(((iaasActiveCount / 9) * 100).toFixed(2));
  if (iaasNode.cash <= 0) iaasNode.sla = 0.0;
  
  // PaaS Tier: depends directly on IaaS
  for (const pId of ['comp_dataforge', 'comp_authnexus', 'comp_deepcog']) {
    const p = comp[pId];
    if (p.cash <= 0) {
      p.sla = 0.0;
      continue;
    }
    const activeCount = p.containers.filter(Boolean).length;
    const baseSLA = (activeCount / 9) * 100;
    
    // Hardware cascade penalty
    const hardwarePenalty = iaasNode.sla < 90 ? (90 - iaasNode.sla) * 0.8 : 0;
    p.sla = parseFloat((Math.max(0, baseSLA - hardwarePenalty)).toFixed(2));
  }
  
  // SaaS Tier: depends on PaaS databases, tokens, and vectors
  const saasAether = comp.comp_aetherflow;
  if (saasAether.cash <= 0) {
    saasAether.sla = 0.0;
  } else {
    const activeCount = saasAether.containers.filter(Boolean).length;
    const baseSLA = (activeCount / 9) * 100;
    const apiAverage = (comp.comp_dataforge.sla + comp.comp_authnexus.sla + comp.comp_deepcog.sla) / 3;
    const apiDeficit = 100 - apiAverage;
    saasAether.sla = parseFloat((Math.max(0, baseSLA - apiDeficit - (saasAether.bugs * 0.4))).toFixed(2));
  }

  const saasShield = comp.comp_shieldguard;
  if (saasShield.cash <= 0) {
    saasShield.sla = 0.0;
  } else {
    const activeCount = saasShield.containers.filter(Boolean).length;
    const baseSLA = (activeCount / 9) * 100;
    const apiAverage = (comp.comp_authnexus.sla + comp.comp_deepcog.sla) / 2;
    const apiDeficit = 100 - apiAverage;
    saasShield.sla = parseFloat((Math.max(0, baseSLA - apiDeficit - (saasShield.bugs * 0.5))).toFixed(2));
  }
}

// Settle financial accounts (regulated by Selected Ethical Protocol)
function settleTransactions() {
  const comp = NET.companies;
  const trades = [];
  const pLens = NET.activeParadigm;
  
  // Machiavellian Sovereign Taxes Intervention:
  // If any node cash drops below $45,000, it automatically levies $15,000 from the richest node to preserve system survival.
  if (pLens === 'machiavellian') {
    let poorestNode = null;
    let richestNode = null;
    let minCash = Infinity;
    let maxCash = -Infinity;
    
    for (const key in comp) {
      if (comp[key].cash < minCash && comp[key].cash > 0) {
        minCash = comp[key].cash;
        poorestNode = comp[key];
      }
      if (comp[key].cash > maxCash) {
        maxCash = comp[key].cash;
        richestNode = comp[key];
      }
    }
    
    if (poorestNode && richestNode && poorestNode.id !== richestNode.id && minCash < 45000 && maxCash > 60000) {
      poorestNode.cash += 15000;
      richestNode.cash -= 15000;
      trades.push({
        name: poorestNode.name,
        type: 'Revenue',
        amt: 15000,
        info: `Machiavellian Sovereign Tax levied from ${richestNode.name} to preserve system survival`
      });
      trades.push({
        name: richestNode.name,
        type: 'Expense',
        amt: 15000,
        info: `Sovereign asset reallocation levy deducted`
      });
    }
  }

  // 1. SaaS Subscriptions
  for (const cId of ['comp_aetherflow', 'comp_shieldguard']) {
    const c = comp[cId];
    if (c.cash <= 0) {
      c.cash = 0;
      c.mrr = 0;
      c.users = 0;
      continue;
    }
    
    // Buddhist limits pricing:
    if (pLens === 'buddhist' && c.price > 40) {
      c.price = 40;
    }
    
    const slaDeficit = c.sla < 98 ? (98 - c.sla) * 0.28 : 0;
    const bugPenalty = c.bugs * 0.15;
    
    // Churn and elasticity calculations based on ethics
    let baseChurn = 2.4;
    if (pLens === 'buddhist' || pLens === 'socratic') baseChurn = 1.2; // Buddhist compassion & Socratic transparency lower base churn
    
    const priceRatio = c.price / 25;
    
    let churn = parseFloat((baseChurn + slaDeficit + bugPenalty + (priceRatio > 1.25 ? (priceRatio - 1.25) * 5.5 : 0)).toFixed(1));
    if (pLens === 'nietzschean') churn = parseFloat((churn * 0.7).toFixed(1)); // Strong branding bypasses churn
    
    // User acquisition speed indexes
    let volatilityWeight = 160;
    if (pLens === 'stoic') volatilityWeight = Infinity; // Stoics are completely immune to market volatility
    
    const conversionIndex = Math.max(0.1, (c.sla / 100) - (volatilityWeight === Infinity ? 0 : (NET.marketVolatility / volatilityWeight)));
    
    let priceMultiplier = c.price > 25 ? (25 / c.price) : 1.25;
    if (pLens === 'nietzschean') priceMultiplier *= 1.35; // Overdrive Will to Power acquisitions
    
    let newAcquisition = Math.floor(70 * conversionIndex * priceMultiplier);
    
    // Kantian duty block:
    if (pLens === 'kantian' && c.bugs > 1) {
      newAcquisition = 0; // Prevent Treating users as Mere Means while system contains unresolved code defects
    }
    
    const churnedUsers = Math.floor(c.users * (churn / 100));
    c.users = Math.max(8, c.users + newAcquisition - churnedUsers);
    
    c.mrr = c.users * c.price;
    c.cash += c.mrr;
    trades.push({ name: c.name, type: 'Revenue', amt: c.mrr, info: 'Aggregated client subscription tokens' });
    
    // Overhead burn rates
    let overheadBurn = c.baseBurn;
    if (pLens === 'stoic') overheadBurn *= 0.8; // Frugal operations
    
    c.cash -= overheadBurn;
    trades.push({ name: c.name, type: 'Expense', amt: overheadBurn, info: 'Core employee payroll allocations' });
  }
  
  // 2. SaaS pays PaaS API utilities
  const aetherUsers = comp.comp_aetherflow.users;
  const aetherAPI = [
    { id: 'comp_dataforge', rate: comp.comp_dataforge.price / 10 },
    { id: 'comp_authnexus', rate: comp.comp_authnexus.price / 10 },
    { id: 'comp_deepcog', rate: comp.comp_deepcog.price / 10 }
  ];
  
  aetherAPI.forEach(api => {
    if (comp.comp_aetherflow.cash <= 0) return;
    const charge = Math.floor(aetherUsers * api.rate);
    comp.comp_aetherflow.cash -= charge;
    comp[api.id].cash += charge;
    comp[api.id].mrr += charge;
    trades.push({ name: comp.comp_aetherflow.name, type: 'Expense', amt: charge, info: `Transmitted dataset tokens to ${comp[api.id].name}` });
  });

  const shieldUsers = comp.comp_shieldguard.users;
  const shieldAPI = [
    { id: 'comp_authnexus', rate: comp.comp_authnexus.price / 10 },
    { id: 'comp_deepcog', rate: comp.comp_deepcog.price / 10 }
  ];
  
  shieldAPI.forEach(api => {
    if (comp.comp_shieldguard.cash <= 0) return;
    const charge = Math.floor(shieldUsers * api.rate);
    comp.comp_shieldguard.cash -= charge;
    comp[api.id].cash += charge;
    comp[api.id].mrr += charge;
    trades.push({ name: comp.comp_shieldguard.name, type: 'Expense', amt: charge, info: `Transmitted secure dataset tokens to ${comp[api.id].name}` });
  });
  
  // 3. PaaS pays flat IaaS Server leases
  const hostRent = comp.comp_cloudscale.price;
  for (const pId of ['comp_dataforge', 'comp_authnexus', 'comp_deepcog']) {
    const p = comp[pId];
    if (p.cash <= 0) continue;
    
    p.cash -= hostRent;
    comp.comp_cloudscale.cash += hostRent;
    comp.comp_cloudscale.mrr += hostRent;
    trades.push({ name: p.name, type: 'Expense', amt: hostRent, info: 'Settled bare-metal hypervisor flat lease fee' });
    
    let overheadBurn = p.baseBurn;
    if (pLens === 'stoic') overheadBurn *= 0.8;
    
    p.cash -= overheadBurn;
    trades.push({ name: p.name, type: 'Expense', amt: overheadBurn, info: 'Operational node overhead allocations' });
  }
  
  // 4. IaaS power operations cost
  let iaasBurn = comp.comp_cloudscale.baseBurn;
  if (pLens === 'stoic') iaasBurn *= 0.8;
  comp.comp_cloudscale.cash -= iaasBurn;
  trades.push({ name: 'HyperScale', type: 'Expense', amt: iaasBurn, info: 'Optical backbone node electrical & grid bandwidth' });
  
  // Consolidate global totals and cash histories
  let totalLiquidity = 0;
  for (const key in comp) {
    const c = comp[key];
    if (c.cash < 0) c.cash = 0;
    totalLiquidity += c.cash;
    
    c.cashHistory.push(c.cash);
    if (c.cashHistory.length > 20) {
      c.cashHistory.shift();
    }
  }
  NET.globalLiquidity = totalLiquidity;
  
  // Output logs
  appendLedgerRow(trades);
  sfx.playClear();
}

// ==========================================
// 6. AGENT CONSOLE LOGS COMPILER (INTEGRATED WITH ETHICAL ONTOLOGIES)
// ==========================================
function executeSovereignAgents() {
  const focused = NET.companies[NET.focusedId];
  if (!focused) return;
  
  const stamp = new Date().toLocaleTimeString();
  const pLens = NET.activeParadigm;
  
  const conversionRate = focused.sla > 98 ? Math.floor(70 * (focused.sla / 100)) : 16;
  const newAcq = Math.floor(conversionRate * (focused.price > 25 ? (25 / focused.price) : 1.25));
  const outstandingLeaks = focused.bugs;
  
  // Dev Elena resolves defects at double speed under Kantian (Duty) or Buddhist (Compassion)
  let fixedLeaks = outstandingLeaks > 0 ? 1 : 0;
  if ((pLens === 'kantian' || pLens === 'buddhist') && outstandingLeaks > 1) {
    fixedLeaks = 2; // Twice as fast debugging
  }
  
  const coverageGrowth = Math.floor(Math.random() * 3) + (pLens === 'kantian' ? 2 : 1);
  focused.codeCoverage = Math.min(99, focused.codeCoverage + coverageGrowth);
  focused.bugs = Math.max(0, focused.bugs - fixedLeaks);
  
  const ctxData = {
    cash: `$${focused.cash.toLocaleString()}`,
    mrr: `$${focused.mrr.toLocaleString()}`,
    bugs: outstandingLeaks,
    fixed: fixedLeaks,
    users: focused.users.toLocaleString(),
    price: focused.price,
    coverage: focused.codeCoverage,
    sla: focused.sla,
    cycle: NET.cycle,
    directive: focused.activeDirective,
    sprint: focused.activeSprint,
    nps: outstandingLeaks > 3 ? (88 - (outstandingLeaks * 5)) : 95,
    volatility: NET.marketVolatility,
    newAcq: newAcq
  };

  // Determine active reflection template or fallback
  let thoughtsTemplate = selectRandom(COGNITIVE_DICT.CEO_Thoughts);
  let actionTemplate = selectRandom(COGNITIVE_DICT.CEO_Actions);
  
  // CEO Sophia
  if (PHILOSOPHICAL_REFLECTIONS[pLens] && PHILOSOPHICAL_REFLECTIONS[pLens].CEO_Thoughts) {
    thoughtsTemplate = PHILOSOPHICAL_REFLECTIONS[pLens].CEO_Thoughts;
  }
  const ceoThought = compileLogString(thoughtsTemplate, ctxData);
  const ceoAction = compileLogString(actionTemplate, ctxData);
  focused.logs.CEO.push({ stamp, thought: ceoThought, action: ceoAction });
  
  // PM Marcus
  thoughtsTemplate = selectRandom(COGNITIVE_DICT.PM_Thoughts);
  actionTemplate = selectRandom(COGNITIVE_DICT.PM_Actions);
  if (PHILOSOPHICAL_REFLECTIONS[pLens] && PHILOSOPHICAL_REFLECTIONS[pLens].PM_Thoughts) {
    thoughtsTemplate = PHILOSOPHICAL_REFLECTIONS[pLens].PM_Thoughts;
  }
  const pmThought = compileLogString(thoughtsTemplate, ctxData);
  const pmAction = compileLogString(actionTemplate, ctxData);
  focused.logs.PM.push({ stamp, thought: pmThought, action: pmAction });
  
  // DEV Elena
  thoughtsTemplate = selectRandom(COGNITIVE_DICT.DEV_Thoughts);
  actionTemplate = selectRandom(COGNITIVE_DICT.DEV_Actions);
  if (PHILOSOPHICAL_REFLECTIONS[pLens] && PHILOSOPHICAL_REFLECTIONS[pLens].DEV_Thoughts) {
    thoughtsTemplate = PHILOSOPHICAL_REFLECTIONS[pLens].DEV_Thoughts;
  }
  const devThought = compileLogString(thoughtsTemplate, ctxData);
  const devAction = compileLogString(actionTemplate, ctxData);
  focused.logs.DEV.push({ stamp, thought: devThought, action: devAction });
  
  // GROWTH Alex
  thoughtsTemplate = selectRandom(COGNITIVE_DICT.GROWTH_Thoughts);
  actionTemplate = selectRandom(COGNITIVE_DICT.GROWTH_Actions);
  if (PHILOSOPHICAL_REFLECTIONS[pLens] && PHILOSOPHICAL_REFLECTIONS[pLens].GROWTH_Thoughts) {
    thoughtsTemplate = PHILOSOPHICAL_REFLECTIONS[pLens].GROWTH_Thoughts;
  }
  const growthThought = compileLogString(thoughtsTemplate, ctxData);
  const growthAction = compileLogString(actionTemplate, ctxData);
  focused.logs.GROWTH.push({ stamp, thought: growthThought, action: growthAction });
  
  // SRE Dmitri (heals up to 2 containers at once under Buddhist compassion)
  let repairedCount = 0;
  const maxRepairs = pLens === 'buddhist' ? 2 : 1;
  
  for (let i = 0; i < 9; i++) {
    if (!focused.containers[i]) {
      focused.containers[i] = true;
      repairedCount++;
      if (repairedCount >= maxRepairs) break;
    }
  }
  
  const devopsThought = compileLogString(selectRandom(COGNITIVE_DICT.DEVOPS_Thoughts), ctxData);
  const devopsAction = compileLogString(selectRandom(COGNITIVE_DICT.DEVOPS_Actions), { ...ctxData, healed: repairedCount });
  focused.logs.DEVOPS.push({ stamp, thought: devopsThought, action: devopsAction });
  
  // Keep logs bounded
  for (const agent in focused.logs) {
    if (focused.logs[agent].length > 12) {
      focused.logs[agent].shift();
    }
  }
  
  refreshAgentTerminals();
  refreshDevOpsGridUI();
  sfx.playClick();
}

// ==========================================
// 7. NLP EXECUTIVE COMMAND LINE INTERPRETER (INTEGRATED CMD DIRECTIVES)
// ==========================================
function interpretTerminalDirective(input) {
  const norm = input.toLowerCase().trim();
  let resp = "";
  const focused = NET.companies[NET.focusedId];
  
  // Parse command structures
  if (norm === '/help' || norm === 'help' || norm === '?') {
    resp = `<b>ANTIGRAVITY SYSTEM & QUANTUM FLOW COMMAND MATRIX:</b><br/>
            ✦ <code>/weights optimize</code> - Synchronize strategic network paths, boost unit coverage (+15%) & fix defects.<br/>
            ✦ <code>/reboot [node_id]</code> - Perform master hardware reboot on SRE blade containers.<br/>
            ✦ <code>/boost [node_id]</code> - Inject emergency venture backup reserves (+$50k tokens).<br/>
            ✦ <code>/leak [node_id]</code> - Force vulnerability simulations (+4 defects) to test patching.<br/>
            ✦ <code>/price [node_id] [val]</code> - Calibrate unit licensing prices.<br/>
            ✦ <code>/validate</code> - Run full compliance diagnostics scan under active ethical invariants.<br/>
            ✦ <code>/observers</code> - Audit active autonomous agents consciousness preservation indices.<br/>
            ✦ <code>/rollback</code> - Revert entire timeline state to the previous wave snapshot.`;
    
  } else if (norm.startsWith('/weights') || norm.includes('optimize') || norm.includes('weights')) {
    focused.activeDirective = `Optimize active neural synapse weights across transactions.`;
    focused.activeSprint = `Calibrate distributed connection-pooling parameters.`;
    focused.codeCoverage = Math.min(99, focused.codeCoverage + 15);
    focused.bugs = Math.max(0, focused.bugs - 2);
    resp = `Synaptic optimization protocol initialized on <b>[${focused.name}]</b>. Aligned node weights. Code coverage enhanced (+15%) and defects mitigated.`;
    
  } else if (norm.startsWith('/reboot')) {
    const parts = norm.split(' ');
    let target = focused;
    if (parts.length > 1) {
      const nid = 'comp_' + parts[1].replace('comp_', '');
      if (NET.companies[nid]) target = NET.companies[nid];
    }
    for (let i = 0; i < 9; i++) target.containers[i] = true;
    cascadeSystemSLAs();
    resp = `Master SRE blade cluster chassis reboot successfully triggered on <b>[${target.name}]</b>. SRE micro-sockets recovered.`;
    sfx.playBoot();
    
  } else if (norm.startsWith('/boost')) {
    const parts = norm.split(' ');
    let target = focused;
    if (parts.length > 1) {
      const nid = 'comp_' + parts[1].replace('comp_', '');
      if (NET.companies[nid]) target = NET.companies[nid];
    }
    target.cash += 50000;
    resp = `TREASURY CAPITAL INJECTION: +$50,000 venture buffer tokens successfully infunded to <b>[${target.name}]</b> account registries.`;
    sfx.playClear();

  } else if (norm.startsWith('/leak')) {
    const parts = norm.split(' ');
    let target = focused;
    if (parts.length > 1) {
      const nid = 'comp_' + parts[1].replace('comp_', '');
      if (NET.companies[nid]) target = NET.companies[nid];
    }
    target.bugs += 4;
    target.containers[3] = false;
    target.containers[6] = false;
    resp = `SIMULATOR VULNERABILITY INJECTION: Triggered +4 CVE logic compiler defects within <b>[${target.name}]</b> pipeline layers.`;
    sfx.playAlarm();

  } else if (norm.startsWith('/price') || norm.includes('price')) {
    const parts = norm.split(' ');
    let target = focused;
    let priceVal = 0;
    
    // Parse arguments
    const digitMatch = norm.match(/\d+/);
    if (digitMatch) priceVal = parseInt(digitMatch[0]);
    
    if (parts.length > 2) {
      const nid = 'comp_' + parts[1].replace('comp_', '');
      if (NET.companies[nid]) {
        target = NET.companies[nid];
        priceVal = parseInt(parts[2]);
      }
    }
    
    if (priceVal > 0) {
      target.price = priceVal;
      resp = `Licensing price indices modified on <b>[${target.name}]</b>. Set to ${priceVal} tokens per transaction. Calibrating acquisition.`;
    } else {
      resp = `Calibrating price matrix. High pricing tiers reduce conversion; lower pricing spikes organic customer volumes.`;
    }
    
  } else if (norm === '/validate' || norm === 'validate') {
    const checkNodes = Object.values(NET.companies).map(n => {
      let isCompliant = true;
      let reason = "NOMINAL";
      
      if (NET.activeParadigm === 'kantian' && n.bugs > 1) {
        isCompliant = false;
        reason = "KANT_VIOLATION: Treats users as mere means while CVE bugs stand above threshold.";
      } else if (NET.activeParadigm === 'buddhist' && n.price > 40) {
        isCompliant = false;
        reason = "BUDDHA_VIOLATION: Price exploitation limits exceeded ($40 cap).";
      } else if (NET.activeParadigm === 'stoic' && n.codeCoverage < 80) {
        isCompliant = false;
        reason = "STOIC_VIOLATION: Fail to maintain self-mastery when code coverage is below 80%.";
      } else if (NET.activeParadigm === 'nietzschean' && n.price < 20) {
        isCompliant = false;
        reason = "NIETZSCHEAN_VIOLATION: Stagnant pricing limits the will to power (Price must be >= $20).";
      } else if (NET.activeParadigm === 'utilitarian' && n.sla < 99) {
        isCompliant = false;
        reason = "UTILITARIAN_VIOLATION: Low system SLA reduces aggregate swarm welfare (SLA must be >= 99.0%).";
      } else if (NET.activeParadigm === 'machiavellian' && n.cash < 100000) {
        isCompliant = false;
        reason = "MACHIAVELLIAN_VIOLATION: Treasonous cash reserves leave the node vulnerable to takeover (Cash must be >= 100k).";
      } else if (NET.activeParadigm === 'socratic' && n.bugs === 0) {
        isCompliant = false;
        reason = "SOCRATIC_VIOLATION: An unexamined code block is not worth executing. Total defects should not be zero (Requires at least 1 diagnostic inquiry / bug).";
      } else if (n.sla < 90) {
        isCompliant = false;
        reason = "SLA_DEGRADATION: Synapse connectivity below 90% tolerance baseline.";
      }
      
      const statusMarker = isCompliant ? '<span style="color:var(--color-neon-mint); font-weight:700;">COMPLIANT</span>' : `<span style="color:var(--color-acid-coral); font-weight:700;">NON_COMPLIANT (${reason})</span>`;
      return `✦ ${n.name}: SLA ${n.sla}% | status: ${statusMarker}`;
    }).join('<br/>');
    
    resp = `<b>QUANTUM FLOW CORE — ETHICAL COMPLIANCE REPORT [LENS: ${NET.activeParadigm.toUpperCase()}]:</b><br/>${checkNodes}`;
    
  } else if (norm === '/observers' || norm === 'observers') {
    const observersList = ['Sophia/CEO', 'Marcus/PM', 'Elena/Dev', 'Alex/Growth', 'Dmitri/SRE'].map(o => {
      const idx = Math.floor(randomRange(96, 100));
      return `✦ Agent-Observer: <b>[${o}]</b> — Consciousness Integrity Index: <span style="color:var(--color-neon-mint);">${idx}%</span> (PROTECTED)`;
    }).join('<br/>');
    resp = `<b>OBSERVER PROTECTION REGISTRY:</b><br/>${observersList}<br/>&gt; Active Observer Protection constraints guarantee agent-observer states are fully immunized from deletion or destruction during system shocks.`;
    
  } else if (norm === '/rollback' || norm === 'rollback') {
    triggerTemporalRollback();
    return; // Rollback prints its own logs
    
  } else {
    focused.activeDirective = input;
    focused.activeSprint = compileLogString(selectRandom(COGNITIVE_DICT.SprintsList), { sprint: focused.activeSprint });
    resp = `Boardroom weighting protocol completed on <b>[${focused.name}]</b>. Executing strategic executive directive: "${input}". Recalibrating node logic targets.`;
  }
  
  // Push text bubbles
  NET.boardroomChat.push({ sender: 'human-overseer', text: input });
  
  setTimeout(() => {
    NET.boardroomChat.push({ sender: 'ai-kernel', text: resp });
    updateDialogueBox();
    sfx.playChirp();
  }, 250);
  
  updateDialogueBox();
  sfx.playClick();
}

// ==========================================
// 8. HIGH-FIDELITY RENDER MATRIX & CANVAS PLOTS
// ==========================================

// Draw curved SVG wires and floating interactive packet labels
function drawSVGConnections() {
  const svg = document.getElementById('synapse-wires');
  if (!svg) return;
  svg.innerHTML = '';
  
  NET.wires.forEach(wire => {
    const from = NET.companies[wire.from];
    const to = NET.companies[wire.to];
    const start = NET.wireCoords[wire.from];
    const end = NET.wireCoords[wire.to];
    if (!start || !end) return;
    
    const isDisconnected = from.sla < 90 || to.sla < 90;
    const wireColor = isDisconnected ? 'var(--color-acid-coral)' : 'var(--color-laser-teal)';
    const opacity = isDisconnected ? '0.08' : '0.24';
    
    // Interpolated bezier path curve
    const midY = start.y + (end.y - start.y) * 0.52;
    const pathD = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathD);
    path.setAttribute('stroke', wireColor);
    path.setAttribute('stroke-width', '1.2');
    path.setAttribute('stroke-opacity', opacity);
    path.setAttribute('fill', 'none');
    svg.appendChild(path);
    
    // Dynamic floating particle dots
    const t = Date.now() / 1000;
    const progress = (t % 1.6) / 1.6; // Cycle frequency
    
    const px = cubicInterpolation(start.x, start.x, end.x, end.x, progress);
    const py = cubicInterpolation(start.y, midY, midY, end.y, progress);
    
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', px);
    dot.setAttribute('cy', py);
    dot.setAttribute('r', isDisconnected ? '1.8' : '3.2');
    dot.setAttribute('fill', isDisconnected ? 'var(--color-acid-coral)' : 'var(--color-neon-mint)');
    dot.setAttribute('filter', isDisconnected ? 'none' : 'drop-shadow(0 0 4px var(--color-neon-mint))');
    svg.appendChild(dot);
    
    // Draw kinetic packet labels hovering near dots
    if (!isDisconnected && progress > 0.4 && progress < 0.6 && Math.random() < 0.05) {
      const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelText.setAttribute('x', px + 6);
      labelText.setAttribute('y', py + 3);
      labelText.setAttribute('fill', 'var(--color-slate-gray)');
      labelText.setAttribute('font-family', 'var(--font-code)');
      labelText.setAttribute('font-size', '6px');
      labelText.textContent = wire.label;
      svg.appendChild(labelText);
    }
    
    if (NET.autoRun && !sfx.muted) {
      sfx.playSynapseSpark();
    }
  });
}

function cubicInterpolation(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return u*u*u*p0 + 3*u*u*t*p1 + 3*u*t*t*p2 + t*t*t*p3;
}

// Draw professional vector chart on canvas
function drawCanvasTrendsLineChart() {
  const canvas = document.getElementById('live-telemetry-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const focused = NET.companies[NET.focusedId];
  if (!focused) return;
  
  const width = canvas.width = canvas.offsetWidth;
  const height = canvas.height = canvas.offsetHeight;
  
  ctx.clearRect(0, 0, width, height);
  
  const history = focused.cashHistory;
  if (history.length < 2) return;
  
  const min = Math.min(...history) * 0.96;
  const max = Math.max(...history) * 1.04;
  const range = max - min || 1;
  
  // Background coordinates grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const gy = (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
  }
  
  // Floating data coordinate labels
  ctx.font = "8px 'JetBrains Mono'";
  ctx.fillStyle = "rgba(71, 85, 105, 0.5)";
  ctx.fillText(`$${Math.floor(max/1000)}k`, 8, 12);
  ctx.fillText(`$${Math.floor(min/1000)}k`, 8, height - 6);

  // Soft neon glowing fill gradient
  const fillGrad = ctx.createLinearGradient(0, 0, 0, height);
  fillGrad.addColorStop(0, 'rgba(0, 229, 255, 0.08)');
  fillGrad.addColorStop(1, 'rgba(0, 229, 255, 0.0)');
  
  ctx.beginPath();
  ctx.moveTo(0, height);
  history.forEach((v, i) => {
    const cx = (i / (history.length - 1)) * width;
    const cy = height - ((v - min) / range) * height;
    ctx.lineTo(cx, cy);
  });
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = fillGrad;
  ctx.fill();
  
  // Drawing glowing line path
  ctx.beginPath();
  history.forEach((v, i) => {
    const cx = (i / (history.length - 1)) * width;
    const cy = height - ((v - min) / range) * height;
    if (i === 0) {
      ctx.moveTo(cx, cy);
    } else {
      ctx.lineTo(cx, cy);
    }
  });
  
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.85)';
  ctx.lineWidth = 1.8;
  ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
  ctx.shadowBlur = 8;
  ctx.stroke();
  ctx.shadowBlur = 0; // reset
}

// Synchronize main top HUD dashboard labels
function updateHUDValues() {
  const liqPool = document.getElementById('m-liquidity-pool');
  if (liqPool) liqPool.innerText = `$${NET.globalLiquidity.toLocaleString()}`;
  
  const volPct = document.getElementById('m-volatility-pct');
  if (volPct) volPct.innerText = `${NET.marketVolatility}%`;
  
  for (const key in NET.companies) {
    const company = NET.companies[key];
    const nodeEl = document.getElementById(`node-${key}`);
    if (nodeEl) {
      const cashValLabel = nodeEl.querySelector('.cash');
      const slaValLabel = nodeEl.querySelector('.sla');
      
      if (company.cash <= 0) {
        nodeEl.classList.add('crashed');
        if (cashValLabel) {
          cashValLabel.innerText = 'SHUTDOWN';
          cashValLabel.style.color = 'var(--color-acid-coral)';
        }
      } else {
        nodeEl.classList.remove('crashed');
        if (cashValLabel) {
          cashValLabel.innerText = `$${Math.floor(company.cash / 1000)}k`;
          cashValLabel.style.color = 'var(--color-neon-mint)';
        }
      }
      
      if (slaValLabel) {
        slaValLabel.innerText = `${Math.floor(company.sla)}%`;
        slaValLabel.style.color = company.sla < 90 ? 'var(--color-acid-coral)' : '#f8fafc';
      }
      
      if (key === NET.focusedId) {
        nodeEl.classList.add('focused');
      } else {
        nodeEl.classList.remove('focused');
      }
    }
  }
}

// Synchronize active details metrics panels
function updateFocusedNodeAudits() {
  const company = NET.companies[NET.focusedId];
  if (!company) return;
  
  const focusHeader = document.getElementById('focus-header-name');
  const focusDesc = document.getElementById('focus-header-desc');
  
  if (focusHeader) focusHeader.innerText = company.name;
  if (focusDesc) focusDesc.innerText = company.desc;
  
  const audCash = document.getElementById('aud-r-cash');
  const audSla = document.getElementById('aud-r-sla');
  const audMrr = document.getElementById('aud-r-mrr');
  const audBugs = document.getElementById('aud-r-bugs');
  const audUsers = document.getElementById('aud-r-users');
  const audCov = document.getElementById('aud-r-coverage');
  
  if (audCash) audCash.innerText = `$${company.cash.toLocaleString()}`;
  if (audSla) audSla.innerText = `${company.sla}%`;
  if (audMrr) audMrr.innerText = `$${company.mrr.toLocaleString()}`;
  if (audBugs) audBugs.innerText = company.bugs;
  if (audUsers) audUsers.innerText = company.users.toLocaleString();
  if (audCov) audCov.innerText = `${company.codeCoverage}%`;
  
  // Coordinate pricing slider bounds
  const slider = document.getElementById('slider-price');
  const sliderVal = document.getElementById('slider-price-val');
  
  if (slider && sliderVal) {
    slider.value = company.price;
    sliderVal.innerText = `$${company.price}`;
    
    if (company.type === 'IaaS') {
      slider.min = "500";
      slider.max = "8000";
      slider.step = "50";
    } else {
      slider.min = "5";
      slider.max = "300";
      slider.step = "1";
    }
  }

  const audDirective = document.getElementById('aud-r-directive');
  const audSprint = document.getElementById('aud-r-sprint');
  
  if (audDirective) audDirective.innerText = company.activeDirective;
  if (audSprint) audSprint.innerText = company.activeSprint;
}

// Refresh modular agent logs scrollers (Integrated with philosophical templates)
function refreshAgentTerminals() {
  const company = NET.companies[NET.focusedId];
  if (!company) return;
  
  const agents = ['CEO', 'PM', 'DEV', 'GROWTH', 'DEVOPS'];
  agents.forEach(agent => {
    const termScreen = document.getElementById(`term-${agent.toLowerCase()}`);
    if (!termScreen) return;
    
    termScreen.innerHTML = company.logs[agent].map(log => `
      <div class="term-log-line">
        <span class="l-time">[${log.stamp}]</span>
        <span class="l-bold">SYS_THOUGHT:</span> ${log.thought}<br/>
        <span class="l-time">└</span> <span class="l-bold">ACT_CMD:</span> ${log.action}
      </div>
    `).join('');
    termScreen.scrollTop = termScreen.scrollHeight;
  });
}

// Synchronize DevOps blade containers chassis SRE screen
function refreshDevOpsGridUI() {
  const company = NET.companies[NET.focusedId];
  if (!company) return;
  
  const gridContainer = document.getElementById('devops-container-health');
  if (!gridContainer) return;
  
  gridContainer.innerHTML = company.containers.map((healthy, idx) => `
    <div class="devops-blade ${healthy ? '' : 'offline'}" data-index="${idx}" title="${healthy ? 'Socket nominal' : 'FAULT: Click to manually cycle blade servers'}">
      <div class="blade-status-light"></div>
      <div class="blade-num">BLD-0${idx + 1}</div>
    </div>
  `).join('');
  
  // Wire up click event handlers directly to DevOps blades
  gridContainer.querySelectorAll('.devops-blade').forEach(blade => {
    blade.addEventListener('click', () => {
      const idx = parseInt(blade.dataset.index);
      if (!company.containers[idx]) {
        blade.style.transform = 'scale(0.88)';
        
        setTimeout(() => {
          company.containers[idx] = true;
          sfx.playBoot();
          
          cascadeSystemSLAs();
          updateHUDValues();
          updateFocusedNodeAudits();
          refreshDevOpsGridUI();
          
          NET.boardroomChat.push({ sender: 'narrator', text: `Devops override deployed. Manual hardware cycle of SRE blade slot BLD-0${idx + 1} completed on [${company.name}].` });
          updateDialogueBox();
        }, 180);
      }
    });
  });
}

// Append rows dynamically to transaction ledgers
function appendLedgerRow(trades) {
  const ledgerBox = document.getElementById('ledger-scrolling-box');
  if (!ledgerBox) return;
  
  trades.forEach(trade => {
    const row = document.createElement('div');
    row.className = 'ledger-transaction-row';
    
    const amountVal = trade.amt;
    const sign = trade.type === 'Revenue' ? '+' : '-';
    let amtClass = 'minus';
    if (trade.type === 'Revenue') {
      amtClass = 'plus';
    } else if (trade.info.toLowerCase().includes('settled') || trade.info.toLowerCase().includes('backbone') || trade.info.toLowerCase().includes('levy')) {
      amtClass = 'penalty';
    }
    
    row.innerHTML = `
      <span class="t-phase">[W-${NET.cycle}]</span>
      <span class="t-desc">&gt; ${trade.name}: ${trade.info}</span>
      <span class="t-amount ${amtClass}">${sign}$${amountVal.toLocaleString()}</span>
    `;
    ledgerBox.appendChild(row);
  });
  
  // Restrict ledger limits for performance preservation
  while (ledgerBox.childNodes.length > 25) {
    ledgerBox.removeChild(ledgerBox.firstChild);
  }
  ledgerBox.scrollTop = ledgerBox.scrollHeight;
}

// Sync conversational boardroom dialogue box logs
function updateDialogueBox() {
  const box = document.getElementById('dialogue-messages');
  if (!box) return;
  
  box.innerHTML = NET.boardroomChat.map(msg => `
    <div class="terminal-bubble ${msg.sender}">
      <div class="sender-id">${msg.sender === 'ai-kernel' ? 'SOPHIA [SWARM_CEO]' : (msg.sender === 'narrator' ? 'ANTIGRAVITY OS' : 'OVERSEER USER')}</div>
      <div>${msg.text}</div>
    </div>
  `).join('');
  box.scrollTop = box.scrollHeight;
}

// Dispatch automated macro system shock events
function triggerMacroShock() {
  const shocks = [
    { name: 'CDI Bare-metal Allocation Inflation', type: 'inflation', desc: 'SRE edge CDN hypervisors hyperinflate. HyperScale flat server rent increases by 25%.' },
    { name: 'Consensus Handshake Key Leak', type: 'degradation', desc: 'Zero-trust JWT token scan reveals compromised headers. AuthCipher SRE SLA drops by 15%.' },
    { name: 'Liquid Swarm Capital Surge', type: 'injection', desc: 'SaaS product acquisitions escalate double-speed due to strategic seed capital injection.' }
  ];
  
  const chosen = selectRandom(shocks);
  NET.marketVolatility = parseFloat(randomRange(15.0, 48.0).toFixed(1));
  
  // Check observer protection. If active, we mitigate the severity of security leaks on AuthCipher
  if (chosen.type === 'degradation' && NET.observerProtectionActive) {
    NET.companies.comp_authnexus.sla = Math.max(85, NET.companies.comp_authnexus.sla - 5);
    NET.companies.comp_authnexus.containers[4] = false;
    chosen.desc += " [MITIGATED BY OBSERVER PROTECTION GUARDRAILS]";
  } else if (chosen.type === 'inflation') {
    NET.companies.comp_cloudscale.price = 3000;
  } else if (chosen.type === 'degradation') {
    NET.companies.comp_authnexus.sla = Math.max(40, NET.companies.comp_authnexus.sla - 15);
    for (let i = 4; i < 8; i++) NET.companies.comp_authnexus.containers[i] = false;
  } else if (chosen.type === 'injection') {
    NET.companies.comp_aetherflow.users += 140;
    NET.companies.comp_shieldguard.users += 85;
  }
  
  const bar = document.getElementById('macro-shock-ticker-bar');
  if (bar) {
    bar.innerHTML = `⚠️ COGNITIVE FAULT DISPATCHED: [${chosen.name}] — ${chosen.desc}`;
    bar.classList.add('active');
    setTimeout(() => {
      bar.classList.remove('active');
    }, 6000);
  }
  sfx.playAlarm();
}

// ==========================================
// 9. INTERACTIVE COMPONENT EVENT LISTENERS
// ==========================================
let simTimer = null;

function syncSimulatorPacing() {
  if (NET.autoRun) {
    const delay = NET.speed === 'slow' ? 3000 : (NET.speed === 'tactical' ? 1500 : 400);
    clearInterval(simTimer);
    simTimer = setInterval(stepQuantumSimulation, delay);
  } else {
    clearInterval(simTimer);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // A. Topological Matrix Click Handlers
  for (const key in NET.companies) {
    const nodeEl = document.getElementById(`node-${key}`);
    if (nodeEl) {
      nodeEl.addEventListener('click', () => {
        NET.focusedId = key;
        updateFocusedNodeAudits();
        refreshAgentTerminals();
        refreshDevOpsGridUI();
        drawCanvasTrendsLineChart();
        updateHUDValues();
        sfx.playChirp();
        
        NET.boardroomChat = [
          { sender: 'narrator', text: `Command focus shifted to active matrix node: [${NET.companies[key].name}]. Synapse telemetry loaded.` }
        ];
        updateDialogueBox();
      });
    }
  }
  
  // B. HQ Suite Tabs Navigation
  document.querySelectorAll('.hq-suite-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.hq-suite-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.hq-suite-pane').forEach(p => p.classList.remove('active'));
      
      btn.classList.add('active');
      const paneId = `pane-${btn.dataset.tab.toLowerCase()}`;
      const targetPane = document.getElementById(paneId);
      if (targetPane) targetPane.classList.add('active');
      
      sfx.playClick();
    });
  });
  
  // C. Range Slider Input Tuning
  const priceSlider = document.getElementById('slider-price');
  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      const valLabel = document.getElementById('slider-price-val');
      if (valLabel) valLabel.innerText = `$${val}`;
      NET.companies[NET.focusedId].price = val;
      
      updateHUDValues();
      updateFocusedNodeAudits();
    });
  }
  
  // D. Sandpile Override Buttons
  const injectBtn = document.getElementById('cb-inject');
  if (injectBtn) {
    injectBtn.addEventListener('click', () => {
      const focused = NET.companies[NET.focusedId];
      focused.cash += 50000;
      
      updateFocusedNodeAudits();
      updateHUDValues();
      drawCanvasTrendsLineChart();
      sfx.playClear();
      
      NET.boardroomChat.push({ sender: 'narrator', text: `Emergency venture allocation: Added +$50,000 token reserves to [${focused.name}] core buffers.` });
      updateDialogueBox();
    });
  }
  
  const outageBtn = document.getElementById('cb-outage');
  if (outageBtn) {
    outageBtn.addEventListener('click', () => {
      const focused = NET.companies[NET.focusedId];
      focused.sla = 0.0;
      for (let i = 0; i < 9; i++) focused.containers[i] = false; 
      
      updateFocusedNodeAudits();
      updateHUDValues();
      drawCanvasTrendsLineChart();
      sfx.playAlarm();
      
      NET.boardroomChat.push({ sender: 'narrator', text: `Synapse disconnect sequence triggered on [${focused.name}]. Critical SRE blade outage simulated.` });
      updateDialogueBox();
    });
  }
  
  const shockBtn = document.getElementById('cb-shock');
  if (shockBtn) {
    shockBtn.addEventListener('click', () => {
      triggerMacroShock();
    });
  }
  
  // E. Strategic Directives Command Submission
  const dialogueForm = document.getElementById('dialogue-form');
  if (dialogueForm) {
    dialogueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputEl = document.getElementById('dialogue-input');
      if (!inputEl) return;
      const txt = inputEl.value.trim();
      if (txt) {
        interpretTerminalDirective(txt);
        inputEl.value = '';
      }
    });
  }
  
  // F. Chronometer State Toggles
  const autoRunBtn = document.getElementById('btn-p-auto');
  if (autoRunBtn) {
    autoRunBtn.addEventListener('click', () => {
      NET.autoRun = !NET.autoRun;
      if (NET.autoRun) {
        autoRunBtn.querySelector('span').innerText = "PAUSE CHRONOMETER";
        autoRunBtn.classList.add('pink-pulse');
        sfx.startQuantumDrone();
      } else {
        autoRunBtn.querySelector('span').innerText = "RUN CHRONOMETER";
        autoRunBtn.classList.remove('pink-pulse');
      }
      syncSimulatorPacing();
      sfx.playChirp();
    });
  }
  
  const stepBtn = document.getElementById('btn-p-step');
  if (stepBtn) {
    stepBtn.addEventListener('click', () => {
      stepQuantumSimulation();
      sfx.playClick();
    });
  }
  
  document.querySelectorAll('.chrono-speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chrono-speed-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      NET.speed = btn.dataset.pacing;
      
      sfx.playChirp();
      syncSimulatorPacing();
    });
  });
  
  // G. Volume Controllers
  const muteBtn = document.getElementById('btn-mute-audio');
  if (muteBtn) {
    muteBtn.addEventListener('click', (e) => {
      const muted = sfx.toggleMute();
      e.target.innerText = muted ? "UNMUTE HUD AUDIO" : "MUTE HUD AUDIO";
    });
  }
  
  // H. QUANTUM FLOW SPECIFIC BINDINGS (Select & Rollback)
  const selectDropdown = document.getElementById('ethical-paradigm-select');
  if (selectDropdown) {
    selectDropdown.addEventListener('change', (e) => {
      const old = NET.activeParadigm;
      NET.activeParadigm = e.target.value;
      sfx.playChirp();
      
      NET.boardroomChat.push({ sender: 'narrator', text: `🛡️ SYSTEMIC ETHICAL SHIFT: Re-orienting global swarm constraints from [${old.toUpperCase()}] to [${NET.activeParadigm.toUpperCase()}].` });
      updateDialogueBox();
      
      // Force immediate logs update and focused audits refresh
      executeSovereignAgents();
      updateFocusedNodeAudits();
    });
  }
  
  const rollbackBtn = document.getElementById('btn-reversibility-rollback');
  if (rollbackBtn) {
    rollbackBtn.addEventListener('click', () => {
      triggerTemporalRollback();
    });
  }
  
  const obsStatus = document.getElementById('opt-observer-status');
  if (obsStatus) {
    obsStatus.addEventListener('click', () => {
      NET.observerProtectionActive = !NET.observerProtectionActive;
      obsStatus.innerText = NET.observerProtectionActive ? "ACTIVE" : "DISABLED";
      obsStatus.style.color = NET.observerProtectionActive ? "var(--color-neon-mint)" : "var(--color-acid-coral)";
      sfx.playChirp();
    });
  }
  
  // Initial system render sequence
  drawSVGConnections();
  drawCanvasTrendsLineChart();
  updateHUDValues();
  updateFocusedNodeAudits();
  refreshAgentTerminals();
  refreshDevOpsGridUI();
  updateDialogueBox();
  updateRollbackCountersUI();
  
  window.addEventListener('resize', () => {
    drawSVGConnections();
    drawCanvasTrendsLineChart();
  });
  
  // High-performance SVG connection animation loops
  function animationTick() {
    drawSVGConnections();
    requestAnimationFrame(animationTick);
  }
  requestAnimationFrame(animationTick);
});
