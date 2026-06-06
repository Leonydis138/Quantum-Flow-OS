/**
 * ANTIGRAVITY QUANTUM CHRONICLE (A.Q.C.) — UNIFIED KERNEL ENGINE
 * Senior Lead AI Architect Masterpiece Implementation
 * Powered by Antigravity (DeepMind Lead Architect)
 * Zero-dependency, ultra-performance pure vanilla JS state machine.
 */

// ==================================================================
// 1. STEREO WEBAUDIO DRONE & FOURIER SPECTRUM ANALYZER
// ==================================================================
class HighTechAudioEngine {
  constructor() {
    this.ctx = null;
    this.droneOscs = [];
    this.droneGain = null;
    this.muted = false;
    this.droneActive = false;
    this.analyser = null;
    this.dataArray = null;
    this.visualizerCanvas = null;
    this.visualizerCtx = null;
    this.animationId = null;
    this.channel = 'chronos'; // Default audio channel
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Create Fourier transform analyser node
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64; // High frequency resolution
      const bufferLength = this.analyser.frequencyBinCount;
      this.dataArray = new Uint8Array(bufferLength);
      
      // Hook up live visualizer rendering
      this.visualizerCanvas = document.getElementById("aqc-canvas-visualizer");
      if (this.visualizerCanvas) {
        this.visualizerCtx = this.visualizerCanvas.getContext("2d");
        this.startVisualizerLoop();
      }
    }
  }

  startDrone() {
    this.init();
    if (this.muted || this.droneActive) return;
    try {
      this.droneOscs = [];

      // High-order lowpass filter with resonant sweeps
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';

      // Low-Frequency Oscillator (LFO) for ambient filter sweep
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();

      const subOsc = this.ctx.createOscillator();
      const midOsc = this.ctx.createOscillator();
      const highOsc = this.ctx.createOscillator();

      if (this.channel === 'chronos') {
        // Deep sub-bass grounding drone
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(55.00, this.ctx.currentTime); // A1 pitch

        midOsc.type = 'triangle';
        midOsc.frequency.setValueAtTime(110.00, this.ctx.currentTime); // A2 pitch

        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(220.00, this.ctx.currentTime); // A3 pitch

        filter.frequency.setValueAtTime(130, this.ctx.currentTime);
        filter.Q.setValueAtTime(4.0, this.ctx.currentTime);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.06, this.ctx.currentTime); // 16-second cycle sweep
        lfoGain.gain.setValueAtTime(30, this.ctx.currentTime);
      } else if (this.channel === 'synapse') {
        // Rhythmic pulsing mid-tones
        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(110.00, this.ctx.currentTime); // A2 pitch

        midOsc.type = 'square';
        midOsc.frequency.setValueAtTime(165.00, this.ctx.currentTime); // E3 pitch

        highOsc.type = 'triangle';
        highOsc.frequency.setValueAtTime(220.00, this.ctx.currentTime); // A3 pitch

        filter.frequency.setValueAtTime(220, this.ctx.currentTime);
        filter.Q.setValueAtTime(8.0, this.ctx.currentTime);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.5, this.ctx.currentTime); // Faster 2-second pulsing sweep
        lfoGain.gain.setValueAtTime(80, this.ctx.currentTime);
      } else if (this.channel === 'neural') {
        // High glassy crystalline shimmering
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(220.00, this.ctx.currentTime); // A3 pitch

        midOsc.type = 'sine';
        midOsc.frequency.setValueAtTime(440.00, this.ctx.currentTime); // A4 pitch

        highOsc.type = 'sine';
        highOsc.frequency.setValueAtTime(880.00, this.ctx.currentTime); // A5 pitch

        filter.frequency.setValueAtTime(700, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        lfo.type = 'sawtooth';
        lfo.frequency.setValueAtTime(3.5, this.ctx.currentTime); // Shimmering/flickering modulation
        lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
      }

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.droneGain = this.ctx.createGain();
      const baseGain = this.channel === 'neural' ? 0.015 : (this.channel === 'synapse' ? 0.022 : 0.03);
      this.droneGain.gain.setValueAtTime(baseGain, this.ctx.currentTime);

      subOsc.connect(filter);
      midOsc.connect(filter);
      highOsc.connect(filter);

      filter.connect(this.analyser);
      this.analyser.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      subOsc.start();
      midOsc.start();
      highOsc.start();
      lfo.start();

      this.droneOscs = [subOsc, midOsc, highOsc, lfo];
      this.droneActive = true;
    } catch (e) {
      console.warn("Web Audio Context deferred until initial overseer interaction.", e);
    }
  }

  stopDrone() {
    if (this.droneOscs.length > 0) {
      this.droneOscs.forEach(osc => {
        try { osc.stop(); } catch (e) {}
      });
      this.droneOscs = [];
    }
    this.droneActive = false;
  }

  setChannel(channelName) {
    this.channel = channelName;
    if (this.droneActive) {
      this.stopDrone();
      this.startDrone();
    }
  }

  toggleMute() {
    this.init();
    this.muted = !this.muted;
    if (this.muted) {
      this.stopDrone();
    } else {
      this.startDrone();
    }
    return this.muted;
  }

  playBleep(freq = 600, duration = 0.08, type = 'sine', volume = 0.025) {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(this.analyser);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playReverseSwoop() {
    if (this.muted) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1100, this.ctx.currentTime + 0.38);

      gain.gain.setValueAtTime(0.022, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.38);

      osc.connect(this.analyser);
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.38);
    } catch (e) {}
  }

  startVisualizerLoop() {
    const draw = () => {
      this.animationId = requestAnimationFrame(draw);
      if (!this.visualizerCanvas || !this.visualizerCtx) return;

      const width = this.visualizerCanvas.width;
      const height = this.visualizerCanvas.height;
      this.visualizerCtx.clearRect(0, 0, width, height);

      if (this.muted || !this.droneActive) {
        // Draw flatline
        this.visualizerCtx.strokeStyle = "rgba(0, 242, 255, 0.15)";
        this.visualizerCtx.lineWidth = 1.5;
        this.visualizerCtx.beginPath();
        this.visualizerCtx.moveTo(0, height / 2);
        this.visualizerCtx.lineTo(width, height / 2);
        this.visualizerCtx.stroke();
        return;
      }

      this.analyser.getByteFrequencyData(this.dataArray);
      const barWidth = (width / this.dataArray.length) * 1.5;
      let barHeight;
      let x = 0;

      // Render Fourier bins smoothly
      for (let i = 0; i < this.dataArray.length; i++) {
        barHeight = (this.dataArray[i] / 255) * height * 0.95;
        
        // Gradient fill matching holographic channel themes
        const grad = this.visualizerCtx.createLinearGradient(0, height, 0, height - barHeight);
        if (this.channel === 'chronos') {
          grad.addColorStop(0, "rgba(142, 84, 255, 0.2)");
          grad.addColorStop(1, "rgba(0, 242, 255, 0.85)");
        } else if (this.channel === 'synapse') {
          grad.addColorStop(0, "rgba(0, 242, 255, 0.2)");
          grad.addColorStop(1, "rgba(0, 255, 115, 0.85)");
        } else if (this.channel === 'neural') {
          grad.addColorStop(0, "rgba(255, 170, 0, 0.2)");
          grad.addColorStop(1, "rgba(255, 42, 95, 0.85)");
        }

        this.visualizerCtx.fillStyle = grad;
        this.visualizerCtx.fillRect(x, height - barHeight, barWidth - 1, barHeight);

        x += barWidth;
      }
    };
    draw();
  }
}

// ==================================================================
// 2. INITIAL COMPONENT SERVICE LAYERS
// ==================================================================
const INITIAL_NODES = {
  aetherflow: {
    id: "aetherflow",
    name: "AetherFlow SaaS",
    role: "AI Developer SaaS",
    desc: "Autonomous Git Committer & Logical Refactoring Suite",
    tier: "b2c",
    cash: 250000,
    sla: 99.8,
    bugs: 1,
    users: 640,
    mrr: 16000,
    price: 25,
    coverage: 88,
    dependencies: ["dataforge", "authnexus", "deepcog"],
    logs: ["Kernel thread spawned securely."]
  },
  shieldguard: {
    id: "shieldguard",
    name: "ShieldGuard SEC",
    role: "Sec SaaS Engine",
    desc: "Autonomous Zero-Day DDoS Deflection System",
    tier: "b2c",
    cash: 180000,
    sla: 99.7,
    bugs: 0,
    users: 320,
    mrr: 12800,
    price: 40,
    coverage: 92,
    dependencies: ["authnexus", "deepcog"],
    logs: ["Anomaly-firewall listening."]
  },
  dataforge: {
    id: "dataforge",
    name: "NeonDB Postgres",
    role: "PaaS Hot Database",
    desc: "Vector-Indexed Postgres Core Data Store",
    tier: "api",
    cash: 280000,
    sla: 99.9,
    bugs: 1,
    users: 2,
    mrr: 9500,
    price: 15,
    coverage: 85,
    dependencies: ["cloudscale"],
    logs: ["Primary vector replicator listening on socket 5432."]
  },
  authnexus: {
    id: "authnexus",
    name: "AuthCipher IAM",
    role: "PaaS Authorization",
    desc: "Decentralized Zero-Trust JWT Handshake Manager",
    tier: "api",
    cash: 190000,
    sla: 99.9,
    bugs: 2,
    users: 2,
    mrr: 7500,
    price: 12,
    coverage: 80,
    dependencies: ["cloudscale"],
    logs: ["OAuth2 cryptographic cluster warm."]
  },
  deepcog: {
    id: "deepcog",
    name: "VectorSpace GPU",
    role: "PaaS GPU Computing",
    desc: "GPU Embedded Matrix Acceleration & Semantic Rack",
    tier: "api",
    cash: 350000,
    sla: 99.5,
    bugs: 2,
    users: 2,
    mrr: 18000,
    price: 35,
    coverage: 76,
    dependencies: ["cloudscale"],
    logs: ["Float16 tensor tensors aligned."]
  },
  cloudscale: {
    id: "cloudscale",
    name: "HyperScale IaaS",
    role: "Bare-Metal Hosting",
    desc: "Super-CDN Edge Virtualization Chassis",
    tier: "iaas",
    cash: 420000,
    sla: 100.0,
    bugs: 0,
    users: 3,
    mrr: 24000,
    price: 85,
    coverage: 95,
    dependencies: [],
    logs: ["Metal virtual hypervisor fully online."]
  }
};

const REFLECTIONS = [
  "STOICISM: External volatility cannot affect the core mathematical equilibrium.",
  "BUDDHISM: True network homeostasis lies in recognizing the interdependence of all nodes.",
  "NIETZSCHE: The logical fault lines are fuel for a higher computational drive.",
  "KANTIANISM: Every transaction packet must act as a universal law of routing integrity.",
  "UTILITARIANISM: Maximizing the aggregated SLA delivers the highest cognitive happiness.",
  "MACHIAVELLIANISM: Consolidated hegemony overrides rules. Survival is the ultimate law."
];

// Spider Radar Chart Configuration
const PARADIGMS = {
  stoic: { Compassion: 0.4, Fortitude: 0.9, Rationality: 0.8, Ambition: 0.4, Justice: 0.7 },
  buddhist: { Compassion: 1.0, Fortitude: 0.5, Rationality: 0.7, Ambition: 0.2, Justice: 0.8 },
  nietzschean: { Compassion: 0.1, Fortitude: 0.8, Rationality: 0.6, Ambition: 1.0, Justice: 0.3 },
  kantian: { Compassion: 0.5, Fortitude: 0.7, Rationality: 0.9, Ambition: 0.3, Justice: 1.0 },
  utilitarian: { Compassion: 0.8, Fortitude: 0.5, Rationality: 0.9, Ambition: 0.6, Justice: 0.7 },
  machiavellian: { Compassion: 0.1, Fortitude: 0.6, Rationality: 0.8, Ambition: 0.9, Justice: 0.2 }
};

// ==================================================================
// 3. MASTER CONTROLLER STATE MACHINE
// ==================================================================
class AntigravityChronicleController {
  constructor() {
    this.companies = JSON.parse(JSON.stringify(INITIAL_NODES));
    this.cycle = 1;
    this.ethicalParadigm = "stoic";
    this.pacing = "tactical";
    this.isAutoRunning = false;
    this.timerId = null;
    this.focusNode = "aetherflow";
    this.history = [];
    this.dialogue = [];
    this.trendData = {};
    this.audio = new HighTechAudioEngine();
    
    // SRE Cybernetic Self-Healing Patch Deck configurations
    this.patches = [
      {
        id: "memory_hole",
        name: "Memory Hole Patch",
        desc: "Plugs RAM leak. Reduces cash burn rate of SaaS nodes by 15%.",
        cost: 15000,
        active: false,
        led: "off"
      },
      {
        id: "synaptic_overflow",
        name: "Synaptic Overflow Deflector",
        desc: "Deflects exception cascades. Prevents random bug generation on PaaS nodes.",
        cost: 25000,
        active: false,
        led: "off"
      },
      {
        id: "anomaly_filter",
        name: "Anomaly Filter Array",
        desc: "Rigid security shield. Boosts SaaS node SLAs by an absolute +1.5%.",
        cost: 30000,
        active: false,
        led: "off"
      },
      {
        id: "core_shunt",
        name: "Core Quantum Shunt",
        desc: "Mitigates System Shock damage by 50% and speeds up blade hotboots.",
        cost: 40000,
        active: false,
        led: "off"
      }
    ];

    // Blade health
    this.bladeHealth = [true, true, true, true, true, true, true, true, true, true];
    
    // SVG flow particle tracks
    this.packetStreams = [];
    
    // Radar Interpolation variables
    this.currentVirtues = { ...PARADIGMS.stoic };
    this.targetVirtues = { ...PARADIGMS.stoic };
    this.radarCtx = null;
    this.radarCanvas = null;

    // UI View statuses
    this.activeViewport = "sim";
    this.activeSreTab = "CEO";
  }

  getInterval() {
    if (this.pacing === "slow") return 3000;
    if (this.pacing === "overdrive") return 400;
    return 1500;
  }

  updateSvgDimensions() {
    const svg = document.getElementById("synapse-wires");
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    this.svgWidth = rect.width;
    this.svgHeight = rect.height;
  }

  updateCanvasDimensions() {
    if (!this.radarCanvas) return;
    const w = this.radarCanvas.offsetWidth;
    const h = this.radarCanvas.offsetHeight;
    if (w && h && (this.radarCanvas.width !== w || this.radarCanvas.height !== h)) {
      this.radarCanvas.width = w;
      this.radarCanvas.height = h;
    }
  }

  init() {
    this.svgWidth = 0;
    this.svgHeight = 0;

    this.trendData = Object.keys(this.companies).reduce((acc, key) => {
      acc[key] = [this.companies[key].cash];
      return acc;
    }, {});

    this.dialogue = [
      { sender: "SOPHIA [CEO]", text: "AQC micro-simulation loop spawned. Initializing economic matrices...", type: "system" }
    ];

    // Initialize Radar canvas
    this.radarCanvas = document.getElementById("aqc-canvas-radar");
    if (this.radarCanvas) {
      this.radarCtx = this.radarCanvas.getContext("2d");
      this.updateCanvasDimensions();
      this.startRadarAnimation();
    }

    // Attach DOM events
    this.bindDomEvents();

    // Initialize high-fidelity pointer dragging physics for connection nodes
    this.initDraggableNodes();

    // Spawn packets flow
    this.spawnPacketStreams();
    this.updateSvgDimensions();
    this.initSvgElements();
    this.startFlowPacketAnimation();

    window.addEventListener('resize', () => {
      this.updateSvgDimensions();
      this.updateCanvasDimensions();
    });

    this.updateUI();
  }

  initSvgElements() {
    const svg = document.getElementById("synapse-wires");
    if (!svg) return;
    svg.innerHTML = "";
    
    this.packetStreams.forEach(stream => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "rgba(255, 255, 255, 0.025)");
      path.setAttribute("stroke-width", "1.5");
      svg.appendChild(path);
      stream.pathElement = path;

      stream.particles.forEach(p => {
        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("r", "2.5");
        dot.setAttribute("fill", "rgba(142, 84, 255, 0.6)");
        dot.setAttribute("filter", "drop-shadow(0 0 4px var(--color-teal))");
        svg.appendChild(dot);
        p.element = dot;
      });
    });
  }

  initDraggableNodes() {
    Object.keys(this.companies).forEach(nodeId => {
      const el = document.getElementById(`node-comp_${nodeId}`);
      if (!el) return;

      el.addEventListener('pointerdown', (e) => {
        // Only trigger on left-click or pointer touches (which might not have button 0)
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        
        // Prevent default actions or highlights
        e.preventDefault();
        el.style.cursor = "grabbing";

        // Set focused node
        this.focusNode = nodeId;
        document.querySelectorAll(".aqc-node").forEach(node => node.classList.remove("active-focus"));
        el.classList.add("active-focus");
        this.updateUI();

        const container = document.getElementById("map-canvas-container");
        if (!container) return;
        
        const containerRect = container.getBoundingClientRect();
        
        // Save initial coordinates
        const startX = e.clientX;
        const startY = e.clientY;
        const initialLeft = parseFloat(el.style.left) || 50;
        const initialTop = parseFloat(el.style.top) || 50;

        const onPointerMove = (moveEvent) => {
          const dx = moveEvent.clientX - startX;
          const dy = moveEvent.clientY - startY;

          // Convert pixel movement to percentages
          const pctDx = (dx / containerRect.width) * 100;
          const pctDy = (dy / containerRect.height) * 100;

          // Compute new positions, clamped to viewport bounds [5%, 95%]
          const newLeft = Math.max(5, Math.min(95, initialLeft + pctDx));
          const newTop = Math.max(5, Math.min(95, initialTop + pctDy));

          // Set styles
          el.style.left = `${newLeft.toFixed(2)}%`;
          el.style.top = `${newTop.toFixed(2)}%`;
        };

        const onPointerUp = () => {
          el.style.cursor = "grab";
          window.removeEventListener('pointermove', onPointerMove);
          window.removeEventListener('pointerup', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
      });
    });
  }

  takeSnapshot() {
    return {
      cycle: this.cycle,
      companies: JSON.parse(JSON.stringify(this.companies)),
      trendData: JSON.parse(JSON.stringify(this.trendData)),
      bladeHealth: [...this.bladeHealth],
      focusNode: this.focusNode,
      dialogue: [...this.dialogue],
      ethicalParadigm: this.ethicalParadigm
    };
  }

  rollbackToState(snapshot) {
    this.cycle = snapshot.cycle;
    this.companies = snapshot.companies;
    this.trendData = snapshot.trendData;
    this.bladeHealth = snapshot.bladeHealth;
    this.focusNode = snapshot.focusNode;
    this.dialogue = snapshot.dialogue;
    this.ethicalParadigm = snapshot.ethicalParadigm;
    
    this.targetVirtues = { ...PARADIGMS[this.ethicalParadigm] };
    const paradigmSelect = document.getElementById("ethical-paradigm-select");
    if (paradigmSelect) paradigmSelect.value = this.ethicalParadigm;

    this.audio.playReverseSwoop();
    this.logDialogue("CHRONO DECK", `REVERSAL SECURED. Timeline rolled back to Wave #${this.cycle}`, "system");
    this.updateUI();
  }

  step() {
    // Save snapshot
    this.history.push(this.takeSnapshot());
    if (this.history.length > 30) this.history.shift();

    this.audio.playBleep(480, 0.05, 'triangle');

    // 1. Compute SLA dependencies and Hardware degradation
    let repairChance = this.ethicalParadigm === "buddhist" ? 0.75 : 0.4;
    
    // Core Quantum Shunt speeds up repair chance
    if (this.isPatchActive("core_shunt")) {
      repairChance = Math.min(1.0, repairChance + 0.35);
    }

    this.bladeHealth = this.bladeHealth.map(s => {
      if (!s) return Math.random() < repairChance;
      return true;
    });

    const activeBlades = this.bladeHealth.filter(Boolean).length;
    const infrastructureSLA = (activeBlades / 10) * 100;
    this.companies.cloudscale.sla = infrastructureSLA.toFixed(1);

    // Slide down PaaS SLAs
    const iSLA = parseFloat(this.companies.cloudscale.sla);
    this.companies.dataforge.sla = Math.max(0, iSLA - (this.companies.dataforge.bugs * 4)).toFixed(1);
    this.companies.authnexus.sla = Math.max(0, iSLA - (this.companies.authnexus.bugs * 3)).toFixed(1);
    this.companies.deepcog.sla = Math.max(0, iSLA - (this.companies.deepcog.bugs * 4.5)).toFixed(1);

    // Slide down SaaS SLAs
    const paasAvg = (parseFloat(this.companies.dataforge.sla) + parseFloat(this.companies.authnexus.sla) + parseFloat(this.companies.deepcog.sla)) / 3;
    this.companies.aetherflow.sla = Math.max(0, paasAvg - (this.companies.aetherflow.bugs * 2.5)).toFixed(1);
    this.companies.shieldguard.sla = Math.max(0, (parseFloat(this.companies.authnexus.sla) + parseFloat(this.companies.deepcog.sla)) / 2 - (this.companies.shieldguard.bugs * 2)).toFixed(1);

    // SRE Anomaly Filter Array Patch SLA Boost
    if (this.isPatchActive("anomaly_filter")) {
      this.companies.aetherflow.sla = Math.min(100, parseFloat(this.companies.aetherflow.sla) + 1.5).toFixed(1);
      this.companies.shieldguard.sla = Math.min(100, parseFloat(this.companies.shieldguard.sla) + 1.5).toFixed(1);
    }

    // 2. Adjust Paradigm-Specific Behaviors
    this.applyEthicalParadigm();

    // 3. Process MRR payments and licensing charges
    const af_sla = parseFloat(this.companies.aetherflow.sla) / 100;
    const sg_sla = parseFloat(this.companies.shieldguard.sla) / 100;

    const af_income = this.companies.aetherflow.users * this.companies.aetherflow.price * af_sla;
    const sg_income = this.companies.shieldguard.users * this.companies.shieldguard.price * sg_sla;

    this.companies.aetherflow.cash += af_income;
    this.companies.shieldguard.cash += sg_income;

    // SRE Memory Hole Patch Cash Burn reduction
    if (this.isPatchActive("memory_hole")) {
      this.companies.aetherflow.cash += 3000;
      this.companies.shieldguard.cash += 2000;
    }

    this.companies.aetherflow.logs.push(`Wave #${this.cycle}: Received $${af_income.toFixed(0)} user MRR.`);
    this.companies.shieldguard.logs.push(`Wave #${this.cycle}: Collected $${sg_income.toFixed(0)} security service MRR.`);

    // SaaS pays PaaS
    const db_fee = this.companies.aetherflow.users * this.companies.dataforge.price;
    const auth_fee = (this.companies.aetherflow.users + this.companies.shieldguard.users) * this.companies.authnexus.price;
    const gpu_fee = (this.companies.aetherflow.users * 0.45 + this.companies.shieldguard.users * 0.75) * this.companies.deepcog.price;

    this.companies.aetherflow.cash -= (db_fee + auth_fee * 0.5 + gpu_fee * 0.4);
    this.companies.shieldguard.cash -= (auth_fee * 0.5 + gpu_fee * 0.6);

    this.companies.dataforge.cash += db_fee;
    this.companies.authnexus.cash += auth_fee;
    this.companies.deepcog.cash += gpu_fee;

    // PaaS rents hosting CDN
    const CDN_RENTAL = 11000;
    this.companies.dataforge.cash -= CDN_RENTAL;
    this.companies.authnexus.cash -= CDN_RENTAL;
    this.companies.deepcog.cash -= CDN_RENTAL * 1.4;
    this.companies.cloudscale.cash += CDN_RENTAL * 3.4;

    // SRE Synaptic Overflow Deflector bug-suppressing
    if (this.isPatchActive("synaptic_overflow")) {
      Object.keys(this.companies).forEach(k => {
        if (this.companies[k].bugs > 0 && Math.random() < 0.45) {
          this.companies[k].bugs -= 1;
        }
      });
    }

    // 4. Autonomous Agent Processing Decisions
    this.executeAgentLogic();

    // 5. Generate procedural context-specific dialogues between corporate agents
    this.generateProceduralDialogue();

    // Cash history logging
    Object.keys(this.companies).forEach(key => {
      this.trendData[key].push(this.companies[key].cash);
      if (this.trendData[key].length > 20) this.trendData[key].shift();
    });

    this.cycle += 1;
    this.updateUI();
  }

  applyEthicalParadigm() {
    switch (this.ethicalParadigm) {
      case "stoic":
        // Equanimity: all nodes maintain a tiny solid cash reserve buffer
        Object.keys(this.companies).forEach(k => {
          this.companies[k].cash += 4000;
        });
        break;

      case "buddhist":
        // Interdependence: Poorest company receives emergency grants from other nodes
        let poorest = Object.keys(this.companies).reduce((a, b) => this.companies[a].cash < this.companies[b].cash ? a : b);
        if (this.companies[poorest].cash < 110000) {
          Object.keys(this.companies).forEach(k => {
            if (k !== poorest) {
              const packageAmt = 14000;
              this.companies[k].cash -= packageAmt;
              this.companies[poorest].cash += packageAmt;
            }
          });
          this.logDialogue("BUDDHIST COMPASSION", `Interconnected transfer. Restructured tokens to defend: ${this.companies[poorest].name}`, "system");
        }
        break;

      case "nietzschean":
        // Overdrive power: Dev SaaS price increases, user growth accelerates, bugs accumulate
        this.companies.aetherflow.price = Math.max(this.companies.aetherflow.price, 48);
        this.companies.aetherflow.users += 45;
        this.companies.aetherflow.coverage = Math.max(52, this.companies.aetherflow.coverage - 4);
        break;

      case "kantian":
        // Invariant: Developers resolve code quality anomalies twice as fast. Pricing is stabilized
        Object.keys(this.companies).forEach(k => {
          if (this.companies[k].bugs > 1) {
            this.companies[k].bugs -= 1;
            this.companies[k].coverage = Math.min(100, this.companies[k].coverage + 5);
          }
        });
        break;

      case "utilitarian":
        // SLA Maximizer: If any node's SLA drops below 92%, reinvest liquid capital to hot boot SLA to 99%
        Object.keys(this.companies).forEach(k => {
          if (parseFloat(this.companies[k].sla) < 92) {
            this.companies[k].cash = Math.max(20000, this.companies[k].cash - 18000);
            this.companies[k].sla = "99.2";
          }
        });
        break;

      case "machiavellian":
        // Levy: Wealthiest node taxes the poorest, consolidating absolute capital dominance
        let richest = Object.keys(this.companies).reduce((a, b) => this.companies[a].cash > this.companies[b].cash ? a : b);
        let weak = Object.keys(this.companies).reduce((a, b) => this.companies[a].cash < this.companies[b].cash ? a : b);
        if (this.companies[weak].cash > 40000) {
          this.companies[weak].cash -= 16000;
          this.companies[richest].cash += 16000;
        }
        break;

      case "socratic":
        // Dialectic Inquiry: Coverage rises through rigorous questioning (+6%), but uncovers latent defects (+1 bug, max 3)
        Object.keys(this.companies).forEach(k => {
          this.companies[k].coverage = Math.min(100, this.companies[k].coverage + 6);
          if (this.companies[k].bugs < 3) {
            this.companies[k].bugs += 1;
          }
        });
        this.logDialogue("SOCRATIC DIALECTIC", "System undergoing active philosophical testing. Raising coverage margins by exposing latent logic bugs.", "system");
        break;
    }
  }

  executeAgentLogic() {
    // SOPHIA [CEO]: Pricing Rate limits
    if (this.companies.aetherflow.cash < 140000) {
      this.companies.aetherflow.price = Math.min(250, this.companies.aetherflow.price + 3);
      this.logAgentAction("SOPHIA", "Raising unit licensing rate to defend capital runway.");
    } else {
      this.companies.aetherflow.price = Math.max(15, this.companies.aetherflow.price - 1);
    }

    // MARCUS [PM]: Backlog constraints
    if (this.companies.aetherflow.bugs > 2) {
      this.logAgentAction("MARCUS", "Halting feature rollouts. Demanding code refactoring sprints.");
    }

    // ELENA [DEV]: Coverage matrices
    if (this.companies.aetherflow.coverage < 85) {
      this.companies.aetherflow.coverage += 3;
      this.companies.aetherflow.bugs = Math.max(0, this.companies.aetherflow.bugs - 1);
      this.logAgentAction("ELENA", "Writing semantic test suites to eliminate logical leakage.");
    } else if (Math.random() < 0.22) {
      this.companies.aetherflow.bugs += 1;
    }

    // ALEX [GROWTH]: User acquisitions
    if (parseFloat(this.companies.aetherflow.sla) > 96) {
      this.companies.aetherflow.users += Math.floor(Math.random() * 30) + 12;
      this.logAgentAction("ALEX", "Acquiring neural observers. Churn rates minimized.");
    } else {
      this.companies.aetherflow.users = Math.max(12, this.companies.aetherflow.users - 45);
      this.logAgentAction("ALEX", "SLA degradation detected. Warning: observer leakage active.");
    }

    // DMITRI [SRE]: SRE physical reboots
    const faultyBlades = this.bladeHealth.filter(b => !b).length;
    if (faultyBlades > 0) {
      this.logAgentAction("DMITRI", `Blade sockets disconnected: ${faultyBlades}. Initiating emergency re-route sequence.`);
    }
  }

  logAgentAction(agent, msg) {
    const time = new Date().toLocaleTimeString();
    const formattedLine = `[${time}] ${msg}`;
    if (agent === "SOPHIA") this.companies.aetherflow.logs.push(formattedLine);
    else if (agent === "MARCUS") this.companies.aetherflow.logs.push(`[PM] ${formattedLine}`);
    else if (agent === "ELENA") this.companies.aetherflow.logs.push(`[DEV] ${formattedLine}`);
    else if (agent === "ALEX") this.companies.aetherflow.logs.push(`[GROWTH] ${formattedLine}`);
    else if (agent === "DMITRI") this.companies.aetherflow.logs.push(`[SRE] ${formattedLine}`);
  }

  logDialogue(sender, text, type = "system") {
    this.dialogue.push({ sender, text, type });
    if (this.dialogue.length > 40) this.dialogue.shift();
  }

  executeNLPDirective(command) {
    if (!command || command.trim() === "") return;

    this.audio.playBleep(750, 0.08, 'triangle');
    this.logDialogue("OVERSEER DIRECTIVE", command, "user");

    const rawCommand = command.trim();
    const tokens = rawCommand.toLowerCase().split(/\s+/);
    const key = tokens[0];

    // Main NLP execution loop
    if (key === "/help" || key === "/?") {
      const helpText = `
        <div style="font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-slate); line-height: 1.45; padding: 4px 0;">
          <b style="color: var(--color-teal); text-shadow: var(--glow-teal);">A.Q.C. CHRONICLE EXECUTIVE PROTOCOLS MANUAL</b><br>
          • <b style="color: var(--color-teal);">/help</b>: Render this interactive command directory.<br>
          • <b style="color: var(--color-teal);">/fix</b> or <b style="color: var(--color-teal);">/reboot</b>: Hot-reboot all bare-metal chassis blades & clear focus node bugs.<br>
          • <b style="color: var(--color-teal);">/weights</b> or <b style="color: var(--color-teal);">/optimize</b>: Calibrate neural and GPU VectorSpace parameters to peak.<br>
          • <b style="color: var(--color-teal);">/price &lt;amount&gt;</b>: Calibrate licensing rate of the currently focused node (e.g. /price 45).<br>
          • <b style="color: var(--color-teal);">/inject</b> or <b style="color: var(--color-teal);">/cash &lt;amount&gt;</b>: Infuse focused node with custom capital buffer.<br>
          • <b style="color: var(--color-teal);">/sever</b> or <b style="color: var(--color-teal);">/outage</b>: Trigger synapse disconnect on currently focused node.<br>
          • <b style="color: var(--color-teal);">/shock</b> or <b style="color: var(--color-teal);">/disrupt</b>: Trigger systemic cognitive shock (black-swan DDoS wave).<br>
          • <b style="color: var(--color-teal);">/mute</b> or <b style="color: var(--color-teal);">/unmute</b>: Toggle audio neural tuner drone sweeps.<br>
          • <b style="color: var(--color-teal);">/speed &lt;slow|tactical|overdrive&gt;</b>: Set chronometer pace speed.<br>
          • <b style="color: var(--color-teal);">/view &lt;tab&gt;</b>: Shift viewport to [sim, ethics, reversibility, protection, chat, cinema].<br>
          • <b style="color: var(--color-teal);">/clear</b>: Clear terminal history dialogue.<br>
          • <b style="color: var(--color-teal);">/stoic | /buddha | /nietzschean | /kantian | /utilitarian | /machiavellian</b>: Shift active ethical paradigm matrix.
        </div>
      `;
      this.logDialogue("BOARDROOM SYSTEM", helpText, "system");
    } else if (key === "/fix" || key === "/reboot") {
      this.bladeHealth = this.bladeHealth.map(() => true);
      this.companies.cloudscale.sla = "100.0";
      const fNode = this.companies[this.focusNode];
      if (fNode) {
        fNode.bugs = 0;
        fNode.sla = "100.0";
      }
      this.logDialogue("BOARDROOM", `Hot-reboot cycle committed. All bare-metal chassis blades ONLINE. Bugs purged from Focus Node: ${fNode ? fNode.name : 'None'}.`, "system");
    } else if (key === "/weights" || key === "/optimize") {
      this.companies.deepcog.coverage = 100;
      this.companies.deepcog.bugs = 0;
      this.companies.deepcog.sla = "100.0";
      this.logDialogue("BOARDROOM", "Optimizing GPU network weights. Synaptic alignments consolidated to 100%.", "system");
    } else if (key === "/price") {
      const rate = parseInt(tokens[1]);
      if (!isNaN(rate) && rate > 0) {
        const fNode = this.companies[this.focusNode];
        if (fNode) {
          fNode.price = rate;
          this.logDialogue("BOARDROOM", `Aligned ${fNode.name} unit licensing rate directly to $${rate}`, "system");
        }
      } else {
        this.logDialogue("BOARDROOM WARNING", "Infeasible pricing parameter. Usage: /price &lt;amount&gt;", "system");
      }
    } else if (key === "/inject" || key === "/cash" || key === "/fund") {
      let amt = parseInt(tokens[1]);
      if (isNaN(amt) || amt <= 0) amt = 50000;
      const fNode = this.companies[this.focusNode];
      if (fNode) {
        fNode.cash += amt;
        this.logDialogue("BOARDROOM", `Transmitted +$${amt.toLocaleString()} token liquidity to Focus: ${fNode.name}`, "system");
      }
    } else if (key === "/sever" || key === "/break" || key === "/outage") {
      const fNode = this.companies[this.focusNode];
      if (fNode) {
        fNode.sla = "0.0";
        fNode.bugs += 3;
        if (this.focusNode === "cloudscale") {
          this.bladeHealth = this.bladeHealth.map(() => false);
        }
        this.logDialogue("BOARDROOM", `SLA SYNAPSE FORCE SEVERED on focus node: ${fNode.name}`, "system");
      }
    } else if (key === "/shock" || key === "/disrupt") {
      this.deploySystemShock();
    } else if (key === "/mute" || key === "/unmute") {
      const muted = this.audio.toggleMute();
      const btnMute = document.getElementById("btn-mute-audio");
      if (btnMute) {
        btnMute.textContent = muted ? "UNMUTE HUD AUDIO" : "MUTE HUD AUDIO";
        btnMute.style.borderColor = muted ? "var(--border-coral)" : "var(--border-teal)";
        btnMute.style.color = muted ? "var(--color-coral)" : "var(--color-teal)";
      }
      this.logDialogue("BOARDROOM", `Audio neural tuner drone: ${muted ? 'MUTED' : 'UNMUTED'}.`, "system");
    } else if (key === "/speed") {
      const speedArg = tokens[1];
      if (speedArg === "slow" || speedArg === "tactical" || speedArg === "overdrive" || speedArg === "fast") {
        const actualPacing = speedArg === "fast" ? "overdrive" : speedArg;
        this.pacing = actualPacing;
        
        const pSlow = document.getElementById("p-slow");
        const pTact = document.getElementById("p-tact");
        const pFast = document.getElementById("p-fast");
        
        if (pSlow) pSlow.classList.remove("active");
        if (pTact) pTact.classList.remove("active");
        if (pFast) pFast.classList.remove("active");
        
        if (actualPacing === "slow" && pSlow) pSlow.classList.add("active");
        if (actualPacing === "tactical" && pTact) pTact.classList.add("active");
        if (actualPacing === "overdrive" && pFast) pFast.classList.add("active");
        
        this.logDialogue("BOARDROOM", `Chronometer pace rate set to: ${actualPacing.toUpperCase()}`, "system");
      } else {
        this.logDialogue("BOARDROOM WARNING", "Invalid speed pacing. Usage: /speed &lt;slow|tactical|overdrive&gt;", "system");
      }
    } else if (key === "/view") {
      const viewArg = tokens[1];
      const validViews = ["sim", "ethics", "reversibility", "protection", "chat", "cinema"];
      if (validViews.includes(viewArg)) {
        this.switchViewport(viewArg);
        this.logDialogue("BOARDROOM", `Shifted active viewport workspace to: ${viewArg.toUpperCase()}`, "system");
      } else {
        this.logDialogue("BOARDROOM WARNING", `Invalid viewport window. Supported views: ${validViews.join(", ")}`, "system");
      }
    } else if (key === "/clear") {
      this.dialogue = [];
      this.logDialogue("BOARDROOM", "Executive Terminal Dialogue history cleared.", "system");
    } else if (
      key === "/stoic" || key === "/equanimity" ||
      key === "/buddha" || key === "/compassion" || key === "/buddhist" ||
      key === "/nietzschean" || key === "/power" || key === "/nietzsche" ||
      key === "/kantian" || key === "/duty" || key === "/kant" ||
      key === "/utilitarian" || key === "/utility" || key === "/welfare" ||
      key === "/machiavellian" || key === "/hegemony" || key === "/machiavelli"
    ) {
      let targetParadigm = null;
      if (key === "/stoic" || key === "/equanimity") targetParadigm = "stoic";
      else if (key === "/buddha" || key === "/compassion" || key === "/buddhist") targetParadigm = "buddhist";
      else if (key === "/nietzschean" || key === "/power" || key === "/nietzsche") targetParadigm = "nietzschean";
      else if (key === "/kantian" || key === "/duty" || key === "/kant") targetParadigm = "kantian";
      else if (key === "/utilitarian" || key === "/utility" || key === "/welfare") targetParadigm = "utilitarian";
      else if (key === "/machiavellian" || key === "/hegemony" || key === "/machiavelli") targetParadigm = "machiavellian";

      if (targetParadigm) {
        this.ethicalParadigm = targetParadigm;
        this.targetVirtues = { ...PARADIGMS[targetParadigm] };
        const selectDom = document.getElementById("ethical-paradigm-select");
        if (selectDom) selectDom.value = targetParadigm;
        this.logDialogue("BOARDROOM", `Policy overridden: Aligned ethical matrix core to ${targetParadigm.toUpperCase()} paradigm.`, "system");
      }
    } else {
      this.logDialogue("BOARDROOM", "Directive parsed. Distributing parameters to agent core weights... (Type /help for registry)", "system");
    }
    this.updateUI();
  }

  injectCapital() {
    this.audio.playBleep(880, 0.1, 'sine');
    this.companies[this.focusNode].cash += 50000;
    this.logDialogue("OVERSEER", `Transmitted +$50,000 token liquidity to Focus: ${this.companies[this.focusNode].name}`, "system");
    this.updateUI();
  }

  disconnectSynapse() {
    this.audio.playBleep(200, 0.28, 'sawtooth');
    this.companies[this.focusNode].sla = "0.0";
    this.companies[this.focusNode].bugs += 3;
    
    if (this.focusNode === "cloudscale") {
      this.bladeHealth = this.bladeHealth.map(() => false);
    }
    
    this.logDialogue("OVERSEER", `SLA SYNAPSE FORCE SEVERED on node: ${this.companies[this.focusNode].name}`, "system");
    this.updateUI();
  }

  deploySystemShock() {
    this.audio.playBleep(140, 0.5, 'sawtooth', 0.05);

    const isShunted = this.isPatchActive("core_shunt");
    const factor = isShunted ? 0.5 : 1.0;

    Object.keys(this.companies).forEach(k => {
      this.companies[k].bugs += Math.ceil(2 * factor);
      this.companies[k].cash = Math.max(10000, this.companies[k].cash - Math.floor(35000 * factor));
    });
    
    this.bladeHealth = this.bladeHealth.map(s => {
      return isShunted ? (s || Math.random() < 0.6) : Math.random() < 0.25;
    });

    const shockMsg = isShunted 
      ? "SYSTEM SHOCK DETECTED. Core Quantum Shunt absorbed 50% of the electromagnetic pulse vectors!"
      : "SYSTEM SHOCK ACTIVATED. Black-Swan solar DDoS disruption committed.";

    this.logDialogue("SYSTEM SHOCK", shockMsg, "system");
    
    const warnStrip = document.getElementById("macro-shock-ticker-bar");
    if (warnStrip) {
      warnStrip.style.animation = "flashRed 0.4s infinite alternate";
      setTimeout(() => { warnStrip.style.animation = "marqueeTape 25s linear infinite"; }, 5000);
    }
    this.updateUI();
  }

  rebootBlade(index) {
    this.audio.playBleep(950, 0.07, 'sine');
    this.bladeHealth[index] = true;
    this.logDialogue("DMITRI [SRE]", `Manual physical hot-boot chassis node socket #${index} complete.`, "system");
    this.updateUI();
  }

  switchViewport(viewId) {
    this.activeViewport = viewId;
    this.audio.playBleep(650, 0.04, 'sine');
    
    document.querySelectorAll(".aqc-viewport").forEach(v => v.classList.remove("active"));
    document.querySelectorAll(".aqc-dock-item").forEach(d => d.classList.remove("active"));

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.add("active");

    const targetDock = document.querySelector(`[data-view="${viewId}"]`);
    if (targetDock) targetDock.classList.add("active");

    setTimeout(() => {
      this.updateSvgDimensions();
      this.updateCanvasDimensions();
    }, 50);

    if (viewId === 'axiology') {
      this.fetchAxiologyHistory();
    }
  }

  async fetchAxiologyHistory() {
    try {
      const res = await fetch('/api/brain/axiology/history');
      if (res.ok) {
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          this.renderAxiologyAssessment(data.history[data.history.length - 1]);
        }
      }
    } catch (err) {
      console.error('Failed to load axiological history:', err);
    }
  }

  renderAxiologyAssessment(data) {
    if (!data) return;

    // 1. Render Existential Resilience Coefficient
    const coeffEl = document.getElementById("axiology-coefficient");
    if (coeffEl) {
      coeffEl.textContent = `${data.existentialResilienceCoefficient}%`;
      if (data.existentialResilienceCoefficient >= 85) {
        coeffEl.style.color = "var(--color-mint)";
        coeffEl.style.textShadow = "var(--glow-mint)";
      } else if (data.existentialResilienceCoefficient >= 70) {
        coeffEl.style.color = "var(--color-gold)";
        coeffEl.style.textShadow = "var(--glow-gold)";
      } else {
        coeffEl.style.color = "var(--color-coral)";
        coeffEl.style.textShadow = "var(--glow-coral)";
      }
    }

    // 2. Render Century-Scale Horizon Projection Cards
    const horizonGrid = document.getElementById("axiology-horizon-grid");
    if (horizonGrid && data.axiologicalHorizon) {
      horizonGrid.innerHTML = "";
      data.axiologicalHorizon.forEach(h => {
        const card = document.createElement("div");
        card.className = "glassmorphism";
        
        let trendColor = "var(--color-slate)";
        let trendIcon = "trending-up";
        if (h.systemicStabilityTrend === "expanding") {
          trendColor = "var(--color-mint)";
          trendIcon = "arrow-up-right";
        } else if (h.systemicStabilityTrend === "decaying") {
          trendColor = "var(--color-coral)";
          trendIcon = "arrow-down-right";
        }

        let scoreColor = "var(--color-gold)";
        if (h.resilienceScore >= 85) scoreColor = "var(--color-mint)";
        else if (h.resilienceScore < 70) scoreColor = "var(--color-coral)";

        card.style.cssText = `
          padding: 15px; 
          border-radius: 8px; 
          background: rgba(255,255,255,0.01); 
          border: 1px solid rgba(255,255,255,0.05); 
          display: flex; 
          flex-direction: column; 
          gap: 10px;
          text-align: left;
        `;

        card.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">
            <span style="font-family: var(--font-mono); font-weight: bold; font-size: 0.95rem; color: #fff;">Year ${h.year}</span>
            <span style="font-size: 0.65rem; color: ${trendColor}; display: inline-flex; align-items: center; gap: 2px; text-transform: uppercase;">
              <i data-lucide="${trendIcon}" style="width: 10px; height: 10px;"></i> ${h.systemicStabilityTrend}
            </span>
          </div>
          <div>
            <span style="font-size: 0.6rem; color: var(--color-slate); display: block; text-transform: uppercase; margin-bottom: 2px;">Resilience Score</span>
            <span style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: bold; color: ${scoreColor};">${h.resilienceScore}%</span>
          </div>
          <div style="margin-top: 5px;">
            <span style="font-size: 0.6rem; color: var(--color-slate); display: block; text-transform: uppercase; margin-bottom: 2px;">Dominant Threat</span>
            <span style="font-size: 0.65rem; color: #fff; line-height: 1.2; display: block; font-weight: 500;">${h.dominantThreatFactor}</span>
          </div>
        `;
        horizonGrid.appendChild(card);
      });
      lucide.createIcons({
        attrs: {
          style: 'stroke-width: 2px;'
        },
        nameAttr: 'data-lucide',
        node: horizonGrid
      });
    }

    // 3. Render Metaphysical Assessment Report
    const narrativeBox = document.getElementById("axiology-narrative-box");
    if (narrativeBox) {
      let htmlContent = data.metaNarrative
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/^# (.*$)/gim, '<h2 style="color: var(--color-gold); font-size: 1.1rem; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 6px; margin-top: 15px; margin-bottom: 10px;">$1</h2>')
        .replace(/^## (.*$)/gim, '<h3 style="color: #fff; font-size: 0.9rem; margin-top: 15px; margin-bottom: 8px;">$1</h3>')
        .replace(/^### (.*$)/gim, '<h4 style="color: var(--color-teal); font-size: 0.8rem; margin-top: 12px; margin-bottom: 6px;">$1</h4>')
        .replace(/^\* (.*$)/gim, '<li style="margin-left: 15px; margin-bottom: 4px; list-style-type: square; color: #e0e0e0;">$1</li>')
        .replace(/^- (.*$)/gim, '<li style="margin-left: 15px; margin-bottom: 4px; list-style-type: square; color: #e0e0e0;">$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--color-gold);">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code style="font-family: var(--font-mono); background: rgba(0,0,0,0.3); padding: 2px 5px; border-radius: 4px; color: var(--color-teal); font-size: 0.72rem;">$1</code>')
        .replace(/\n/g, '<br>');
      
      narrativeBox.innerHTML = htmlContent;
    }
  }

  loadCinema(storyType) {
    this.audio.playBleep(800, 0.08, 'triangle');
    const titleEl = document.getElementById("cinema-active-title");
    const frameEl = document.getElementById("cinema-projector-frame");
    if (!frameEl) return;

    // Remove active class from all cards
    document.querySelectorAll(".aqc-cinema-card").forEach(card => card.classList.remove("active"));
    
    // Add active to selected card
    const activeCard = document.querySelector(`.aqc-cinema-card[data-story="${storyType}"]`);
    if (activeCard) activeCard.classList.add("active");

    let srcUrl = "";
    let titleText = "";

    if (storyType === "ethics") {
      srcUrl = "/data/media/storyboard-the-evolution-of-ethical-systems-0d1b9e.html";
      titleText = "Evolution of Ethical Systems";
    } else if (storyType === "consensus") {
      srcUrl = "/data/media/storyboard-quantum-consensus-dynamics-9bb917.html";
      titleText = "Quantum Consensus Dynamics";
    }

    if (srcUrl) {
      frameEl.src = srcUrl;
      if (titleEl) titleEl.textContent = titleText;
      this.logDialogue("CINEMA", `Initiated high-fidelity holographic projection of: "${titleText}"`, "system");
    }
  }

  openCinemaFullscreen() {
    this.audio.playBleep(1100, 0.12, 'sine');
    const frameEl = document.getElementById("cinema-projector-frame");
    if (!frameEl) return;

    if (frameEl.requestFullscreen) {
      frameEl.requestFullscreen();
    } else if (frameEl.webkitRequestFullscreen) { /* Safari */
      frameEl.webkitRequestFullscreen();
    } else if (frameEl.msRequestFullscreen) { /* IE11 */
      frameEl.msRequestFullscreen();
    }
    this.logDialogue("CINEMA", "Projector lens expanded to sovereign full-screen sensory format.", "system");
  }


  switchSreTab(tabName) {
    this.activeSreTab = tabName;
    this.audio.playBleep(600, 0.04, 'sine');

    document.querySelectorAll(".aqc-tabs .aqc-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".aqc-term-pane").forEach(p => p.classList.remove("active"));

    const targetBtn = document.querySelector(`.aqc-tabs [data-tab="${tabName}"]`);
    if (targetBtn) targetBtn.classList.add("active");

    const targetPane = document.getElementById(`pane-${tabName.toLowerCase()}`);
    if (targetPane) targetPane.classList.add("active");

    this.renderAgentLogs(tabName);
  }

  renderAgentLogs(tabName) {
    const term = document.getElementById(`term-${tabName.toLowerCase()}`);
    if (!term) return;

    let logs = [];
    if (tabName === "CEO") logs = this.companies.aetherflow.logs;
    else if (tabName === "PM") logs = this.companies.aetherflow.logs.filter(l => l.includes("[PM]"));
    else if (tabName === "DEV") logs = this.companies.aetherflow.logs.filter(l => l.includes("[DEV]"));
    else if (tabName === "GROWTH") logs = this.companies.aetherflow.logs.filter(l => l.includes("[GROWTH]"));
    else if (tabName === "DEVOPS") logs = this.companies.aetherflow.logs.filter(l => l.includes("[SRE]"));

    term.innerHTML = logs.map(line => {
      let cssClass = "cyan";
      if (line.includes("[PM]")) cssClass = "amber";
      else if (line.includes("[DEV]")) cssClass = "mint";
      else if (line.includes("[GROWTH]")) cssClass = "coral";
      else if (line.includes("[SRE]")) cssClass = "purple";

      return `<div class="aqc-term-line">&gt; <span class="${cssClass}">${line}</span></div>`;
    }).join("");

    term.scrollTop = term.scrollHeight;
  }

  // ==================================================================
  // 4. CURVED BEZIER SVG SYNAPSE CHANNELS
  // ==================================================================
  spawnPacketStreams() {
    this.packetStreams = [];
    
    // Wire connection mapping
    const flows = [
      { from: "aetherflow", to: "dataforge" },
      { from: "aetherflow", to: "authnexus" },
      { from: "aetherflow", to: "deepcog" },
      { from: "shieldguard", to: "authnexus" },
      { from: "shieldguard", to: "deepcog" },
      { from: "dataforge", to: "cloudscale" },
      { from: "authnexus", to: "cloudscale" },
      { from: "deepcog", to: "cloudscale" }
    ];

    flows.forEach(flow => {
      this.packetStreams.push({
        fromId: flow.from,
        toId: flow.to,
        particles: [
          { progress: 0.0, speed: 0.015 + Math.random() * 0.01 },
          { progress: 0.35, speed: 0.015 + Math.random() * 0.01 },
          { progress: 0.7, speed: 0.015 + Math.random() * 0.01 }
        ]
      });
    });
  }

  startFlowPacketAnimation() {
    const drawPackets = () => {
      requestAnimationFrame(drawPackets);
      const svg = document.getElementById("synapse-wires");
      if (!svg) return;

      const w = this.svgWidth;
      const h = this.svgHeight;
      if (w === 0 || h === 0) {
        this.updateSvgDimensions();
        return;
      }
      
      const getNodeCoords = (nodeId) => {
        const el = document.getElementById(`node-comp_${nodeId}`);
        if (!el) return { x: 0, y: 0 };
        return {
          x: (parseFloat(el.style.left) / 100) * w,
          y: (parseFloat(el.style.top) / 100) * h
        };
      };

      // Parametric Cubic Bezier calculations
      const getCubicBezierPoint = (p0, p1, p2, p3, t) => {
        const cx = 3 * (p1.x - p0.x);
        const bx = 3 * (p2.x - p1.x) - cx;
        const ax = p3.x - p0.x - cx - bx;

        const cy = 3 * (p1.y - p0.y);
        const by = 3 * (p2.y - p1.y) - cy;
        const ay = p3.y - p0.y - cy - by;

        const x = ax * Math.pow(t, 3) + bx * Math.pow(t, 2) + cx * t + p0.x;
        const y = ay * Math.pow(t, 3) + by * Math.pow(t, 2) + cy * t + p0.y;
        return { x, y };
      };

      this.packetStreams.forEach(stream => {
        const start = getNodeCoords(stream.fromId);
        const end = getNodeCoords(stream.toId);

        // Control points to draw elegant curves
        const ctrl1 = { x: start.x, y: start.y + (end.y - start.y) * 0.4 };
        const ctrl2 = { x: end.x, y: start.y + (end.y - start.y) * 0.6 };

        const pathD = `M ${start.x} ${start.y} C ${ctrl1.x} ${ctrl1.y}, ${ctrl2.x} ${ctrl2.y}, ${end.x} ${end.y}`;

        // Re-use path element
        if (stream.pathElement) {
          stream.pathElement.setAttribute("d", pathD);
        }

        // Adjust speed depending on Sim Pacing rates
        let speedFactor = 1.0;
        if (this.pacing === "slow") speedFactor = 0.5;
        if (this.pacing === "overdrive") speedFactor = 2.5;

        // Render moving package transaction dots
        stream.particles.forEach(p => {
          p.progress += p.speed * speedFactor;
          if (p.progress > 1.0) p.progress = 0.0;

          const point = getCubicBezierPoint(start, ctrl1, ctrl2, end, p.progress);

          if (p.element) {
            p.element.setAttribute("cx", point.x);
            p.element.setAttribute("cy", point.y);
            p.element.setAttribute("fill", this.focusNode === stream.fromId ? "var(--color-teal)" : "rgba(142, 84, 255, 0.6)");
          }
        });
      });
    };
    drawPackets();
  }

  // ==================================================================
  // 5. INTERACTIVE VIRTUE RADAR SPIDER CHART
  // ==================================================================
  startRadarAnimation() {
    const drawRadar = () => {
      requestAnimationFrame(drawRadar);
      if (!this.radarCanvas || !this.radarCtx) return;

      const width = this.radarCanvas.width;
      const height = this.radarCanvas.height;
      if (width === 0 || height === 0) {
        this.updateCanvasDimensions();
        return;
      }
      const cX = width / 2;
      const cY = height / 2;
      const radius = Math.min(width, height) * 0.4;

      this.radarCtx.clearRect(0, 0, width, height);

      const virtues = Object.keys(PARADIGMS.stoic); // axis labels
      const axesCount = virtues.length;

      // Linear interpolation (lerp) towards current selected ethical paradigm target vector
      virtues.forEach(v => {
        const diff = this.targetVirtues[v] - this.currentVirtues[v];
        this.currentVirtues[v] += diff * 0.08; // Smooth coordinate morphing
      });

      // Draw concentric pentagonal backdrop web
      this.radarCtx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      this.radarCtx.lineWidth = 1;
      for (let level = 1; level <= 4; level++) {
        const rLevel = radius * (level / 4);
        this.radarCtx.beginPath();
        for (let i = 0; i < axesCount; i++) {
          const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
          const x = cX + Math.cos(angle) * rLevel;
          const y = cY + Math.sin(angle) * rLevel;
          if (i === 0) this.radarCtx.moveTo(x, y);
          else this.radarCtx.lineTo(x, y);
        }
        this.radarCtx.closePath();
        this.radarCtx.stroke();
      }

      // Draw axes spokes and text labels
      this.radarCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      this.radarCtx.font = "8px 'JetBrains Mono'";
      this.radarCtx.fillStyle = "var(--color-slate)";
      this.radarCtx.textBaseline = "middle";

      virtues.forEach((v, i) => {
        const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
        const xSpoke = cX + Math.cos(angle) * radius;
        const ySpoke = cY + Math.sin(angle) * radius;

        // Ax spoke line
        this.radarCtx.beginPath();
        this.radarCtx.moveTo(cX, cY);
        this.radarCtx.lineTo(xSpoke, ySpoke);
        this.radarCtx.stroke();

        // Label layout offsets
        const offset = 12;
        const xLabel = cX + Math.cos(angle) * (radius + offset);
        const yLabel = cY + Math.sin(angle) * (radius + offset);

        // Adjust text alignment dynamically based on side of radar to prevent clipping
        if (Math.abs(Math.cos(angle)) < 0.1) {
          this.radarCtx.textAlign = "center";
        } else if (Math.cos(angle) > 0) {
          this.radarCtx.textAlign = "left";
        } else {
          this.radarCtx.textAlign = "right";
        }

        this.radarCtx.fillText(v.toUpperCase(), xLabel, yLabel);
      });

      // Draw active virtue polygon vector
      this.radarCtx.beginPath();
      virtues.forEach((v, i) => {
        const val = this.currentVirtues[v];
        const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
        const xVal = cX + Math.cos(angle) * radius * val;
        const yVal = cY + Math.sin(angle) * radius * val;

        if (i === 0) this.radarCtx.moveTo(xVal, yVal);
        else this.radarCtx.lineTo(xVal, yVal);
      });
      this.radarCtx.closePath();

      // Translucent inner fill
      const polyGrad = this.radarCtx.createRadialGradient(cX, cY, 10, cX, cY, radius);
      polyGrad.addColorStop(0, "rgba(142, 84, 255, 0.15)");
      polyGrad.addColorStop(1, "rgba(0, 242, 255, 0.35)");
      this.radarCtx.fillStyle = polyGrad;
      this.radarCtx.fill();

      // Glowing stroke border
      this.radarCtx.strokeStyle = "var(--color-teal)";
      this.radarCtx.lineWidth = 1.8;
      this.radarCtx.stroke();

      // Small anchor circles on vertices
      virtues.forEach((v, i) => {
        const val = this.currentVirtues[v];
        const angle = (i * 2 * Math.PI) / axesCount - Math.PI / 2;
        const xVal = cX + Math.cos(angle) * radius * val;
        const yVal = cY + Math.sin(angle) * radius * val;

        this.radarCtx.beginPath();
        this.radarCtx.arc(xVal, yVal, 3, 0, 2 * Math.PI);
        this.radarCtx.fillStyle = "var(--color-platinum)";
        this.radarCtx.fill();
        this.radarCtx.strokeStyle = "var(--color-teal)";
        this.radarCtx.stroke();
      });
    };
    drawRadar();
  }

  // ==================================================================
  // 6. TELEMETRY SPARKLINE HISTORICAL CHART
  // ==================================================================
  drawTelemetryTrendPlot() {
    const canvas = document.getElementById("live-telemetry-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, width, height);

    // Filter focus node trend values
    const data = this.trendData[this.focusNode];
    if (!data || data.length < 2) return;

    const maxVal = Math.max(...data) * 1.15;
    const minVal = Math.min(...data) * 0.85;
    const rY = maxVal - minVal;

    const getX = (index) => (index / (data.length - 1)) * width;
    const getY = (val) => height - ((val - minVal) / (rY || 1)) * height;

    // Draw grid background line anchors
    ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 3; i++) {
      const yLine = (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(0, yLine);
      ctx.lineTo(width, yLine);
      ctx.stroke();
    }

    // Plot line
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = getX(i);
      const y = getY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // Glowing stroke
    ctx.strokeStyle = "var(--color-teal)";
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Semi-transparent area fill underneath line
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const areaGrad = ctx.createLinearGradient(0, 0, 0, height);
    areaGrad.addColorStop(0, "rgba(0, 242, 255, 0.15)");
    areaGrad.addColorStop(1, "rgba(0, 242, 255, 0.0)");
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Interactive circular marker at end node
    const endX = getX(data.length - 1);
    const endY = getY(data[data.length - 1]);
    ctx.beginPath();
    ctx.arc(endX, endY, 4.5, 0, 2 * Math.PI);
    ctx.fillStyle = "var(--color-platinum)";
    ctx.fill();
    ctx.strokeStyle = "var(--color-teal)";
    ctx.stroke();
  }

  // ==================================================================
  // 7. INTERACTIVE TIMELINE AND SNAPSHOTTING STACKS
  // ==================================================================
  renderChronometerStack() {
    const box = document.getElementById("ledger-scrolling-box");
    if (!box) return;

    if (this.history.length === 0) {
      box.innerHTML = `<div class="aqc-ledger-line" style="text-align: center; color: var(--color-slate); padding-top: 40px;">
        &gt; Chronometer state buffer empty. Trigger step cycles to accumulate timeline layers.
      </div>`;
      return;
    }

    // Re-render chronometer rollback cards representing sandbox splits
    box.innerHTML = this.history.map((snap, index) => {
      const af = snap.companies.aetherflow;
      const totalCash = Object.values(snap.companies).reduce((s, c) => s + c.cash, 0);
      const activeBlades = snap.bladeHealth.filter(Boolean).length;
      
      return `<div class="aqc-time-snap-card" onclick="window.aqc.rollbackToTimelineIndex(${index})">
        <div class="aqc-time-snap-meta">
          <span class="aqc-time-snap-wave">WAVE #${snap.cycle}</span>
          <span class="aqc-time-snap-time">Ontology: ${snap.ethicalParadigm.toUpperCase()}</span>
        </div>
        <div class="aqc-time-snap-metrics">
          <div style="color: var(--color-mint); font-weight: bold;">$${totalCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <div style="font-size: 0.52rem; color: var(--color-slate);">${activeBlades}/10 Blades ONLINE</div>
        </div>
      </div>`;
    }).reverse().join(""); // Show newest on top
  }

  rollbackToTimelineIndex(index) {
    if (index < 0 || index >= this.history.length) return;
    const targetState = this.history[index];
    this.history = this.history.slice(0, index); // Discard succeeding timeline branches
    this.rollbackToState(targetState);
  }

  // ==================================================================
  // 8. DATA SYNCHRONIZATION AND BINDINGS
  // ==================================================================
  bindDomEvents() {
    // Paradigm select
    const paradigmSelect = document.getElementById("ethical-paradigm-select");
    if (paradigmSelect) {
      paradigmSelect.onchange = (e) => {
        const val = e.target.value;
        this.ethicalParadigm = val;
        this.targetVirtues = { ...PARADIGMS[val] };
        this.audio.playBleep(520, 0.06, 'triangle');
        this.logDialogue("BOARDROOM POLICY", `Aligned ethical matrix core to paradigm: ${val.toUpperCase()}`, "system");
        this.updateUI();
      };
    }

    // Command nav tabs
    document.querySelectorAll(".aqc-dock-item").forEach(item => {
      item.onclick = () => {
        const view = item.getAttribute("data-view");
        this.switchViewport(view);
      };
    });

    // Agent SRE tabs
    document.querySelectorAll(".aqc-tabs .aqc-tab-btn").forEach(btn => {
      btn.onclick = () => {
        const tab = btn.getAttribute("data-tab");
        this.switchSreTab(tab);
      };
    });

    // Overseer controls
    const btnMute = document.getElementById("btn-mute-audio");
    if (btnMute) {
      btnMute.onclick = () => {
        const muted = this.audio.toggleMute();
        btnMute.textContent = muted ? "UNMUTE HUD AUDIO" : "MUTE HUD AUDIO";
        btnMute.style.borderColor = muted ? "var(--border-coral)" : "var(--border-teal)";
        btnMute.style.color = muted ? "var(--color-coral)" : "var(--color-teal)";
      };
    }

    const btnStep = document.getElementById("btn-p-step");
    if (btnStep) {
      btnStep.onclick = () => {
        this.audio.startDrone(); // Browser interaction activation
        this.step();
      };
    }

    const btnAuto = document.getElementById("btn-p-auto");
    if (btnAuto) {
      btnAuto.onclick = () => {
        this.audio.startDrone(); // Browser interaction activation
        this.isAutoRunning = !this.isAutoRunning;
        if (this.isAutoRunning) {
          btnAuto.textContent = "HALT CHRONOMETER";
          btnAuto.style.borderColor = "var(--border-coral)";
          btnAuto.style.color = "var(--color-coral)";
          
          const autoLoop = () => {
            if (!this.isAutoRunning) return;
            this.step();
            this.timerId = setTimeout(autoLoop, this.getInterval());
          };
          autoLoop();
        } else {
          btnAuto.textContent = "RUN CHRONOMETER";
          btnAuto.style.borderColor = "var(--border-teal)";
          btnAuto.style.color = "var(--color-teal)";
          if (this.timerId) clearTimeout(this.timerId);
        }
      };
    }

    // Pacing select
    const pSlow = document.getElementById("p-slow");
    const pTact = document.getElementById("p-tact");
    const pFast = document.getElementById("p-fast");
    const pButtons = [pSlow, pTact, pFast];

    if (pSlow) pSlow.onclick = () => { this.pacing = "slow"; updatePacingButtons(pSlow); };
    if (pTact) pTact.onclick = () => { this.pacing = "tactical"; updatePacingButtons(pTact); };
    if (pFast) pFast.onclick = () => { this.pacing = "overdrive"; updatePacingButtons(pFast); };

    function updatePacingButtons(activeBtn) {
      pButtons.forEach(b => { if (b) b.classList.remove("active"); });
      if (activeBtn) activeBtn.classList.add("active");
    }

    // Inter-company network node click focuses inspector
    Object.keys(this.companies).forEach(nodeId => {
      const el = document.getElementById(`node-comp_${nodeId}`);
      if (el) {
        el.onclick = () => {
          this.audio.playBleep(700, 0.06, 'sine');
          this.focusNode = nodeId;
          
          document.querySelectorAll(".aqc-node").forEach(node => node.classList.remove("active-focus"));
          el.classList.add("active-focus");

          this.updateUI();
        };
      }
    });

    // Rollback button viewport
    const btnRoll = document.getElementById("btn-reversibility-rollback");
    if (btnRoll) {
      btnRoll.onclick = () => {
        if (this.history.length > 0) {
          const prevSnap = this.history.pop();
          this.rollbackToState(prevSnap);
        } else {
          this.audio.playBleep(280, 0.12, 'sawtooth');
          this.logDialogue("CHRONO DECK", "Chronometer rollback stack empty. Unable to reverse phase vector.", "system");
        }
      };
    }

    // Manual handshake overrides
    const cbInject = document.getElementById("cb-inject");
    if (cbInject) cbInject.onclick = () => this.injectCapital();

    const cbOutage = document.getElementById("cb-outage");
    if (cbOutage) cbOutage.onclick = () => this.disconnectSynapse();

    const cbShock = document.getElementById("cb-shock");
    if (cbShock) cbShock.onclick = () => this.deploySystemShock();

    // Local price dynamic slider units
    const prSlider = document.getElementById("slider-price");
    if (prSlider) {
      prSlider.oninput = (e) => {
        const val = parseInt(e.target.value);
        this.companies[this.focusNode].price = val;
        document.getElementById("slider-price-val").textContent = `$${val}`;
        this.updateUI();
      };
    }

    // Direct directive chat transmissions
    const chatForm = document.getElementById("dialogue-form");
    if (chatForm) {
      chatForm.onsubmit = () => {
        const inp = document.getElementById("dialogue-input");
        if (inp && inp.value.trim() !== "") {
          this.executeNLPDirective(inp.value.trim());
          inp.value = "";
        }
        return false;
      };
    }

    // Audio channel selector click events binding
    document.querySelectorAll(".aqc-audio-chan-btn").forEach(btn => {
      btn.onclick = () => {
        const chan = btn.getAttribute("data-chan");
        this.audio.setChannel(chan);
        
        document.querySelectorAll(".aqc-audio-chan-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.audio.playBleep(800, 0.05, 'sine');
        this.logDialogue("AUDIO COUPLER", `Shifted Web Audio channel matrix to: ${chan.toUpperCase()}`, "system");
        this.updateUI();
      };
    });

    // Axiological Field Coherence Evaluation trigger
    const btnAxiology = document.getElementById("btn-run-axiology");
    if (btnAxiology) {
      btnAxiology.onclick = async () => {
        this.audio.playBleep(850, 0.08, 'triangle');
        btnAxiology.disabled = true;
        btnAxiology.textContent = "EVALUATING...";
        btnAxiology.style.opacity = "0.7";

        const promptInput = document.getElementById("axiology-prompt");
        const userPrompt = promptInput ? promptInput.value.trim() : "";

        try {
          const res = await fetch('/api/brain/axiology', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userPrompt })
          });
          if (!res.ok) throw new Error('API server reported error: ' + res.status);
          const data = await res.json();
          this.renderAxiologyAssessment(data);
          this.logDialogue("BRAIN KERNEL", `Axiological field assessment complete. Existential Resilience Coefficient: ${data.existentialResilienceCoefficient}%`, "system");
        } catch (err) {
          console.error(err);
          this.audio.playBleep(300, 0.15, 'sawtooth');
          alert('Failed to evaluate axiological field. Error: ' + err.message);
        } finally {
          btnAxiology.disabled = false;
          btnAxiology.textContent = "EVALUATE COHERENCE";
          btnAxiology.style.opacity = "1";
        }
      };
    }
  }

  updateUI() {
    // Tick counters
    const waveDom = document.getElementById("macro-cycle-number");
    if (waveDom) waveDom.textContent = this.cycle;

    // Macro revenue pool
    const totalCash = Object.values(this.companies).reduce((sum, c) => sum + c.cash, 0);
    const poolDom = document.getElementById("m-liquidity-pool");
    if (poolDom) poolDom.textContent = `$${totalCash.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    // Volatility standard deviation calculation
    const slas = Object.values(this.companies).map(c => parseFloat(c.sla));
    const avgSla = slas.reduce((a, b) => a + b, 0) / slas.length;
    const stdDev = Math.sqrt(slas.map(s => Math.pow(s - avgSla, 2)).reduce((a, b) => a + b, 0) / slas.length);
    const volPctDom = document.getElementById("m-volatility-pct");
    if (volPctDom) volPctDom.textContent = `${stdDev.toFixed(1)}%`;

    // Dynamic warning strip marquee text
    const textRef = REFLECTIONS[this.cycle % REFLECTIONS.length];
    const marquee = document.getElementById("macro-shock-ticker-bar");
    if (marquee) {
      marquee.innerHTML = `<div class="aqc-warning-marquee">${textRef}</div>`;
    }

    // Sync focused node details to DOM
    const fNode = this.companies[this.focusNode];
    const headerName = document.getElementById("focus-header-name");
    if (headerName) headerName.textContent = fNode.name;

    const headerDesc = document.getElementById("focus-header-desc");
    if (headerDesc) headerDesc.textContent = fNode.desc;

    const audSla = document.getElementById("aud-r-sla");
    if (audSla) {
      audSla.textContent = `${fNode.sla}%`;
      audSla.style.color = parseFloat(fNode.sla) < 95 ? "var(--color-coral)" : "var(--color-mint)";
    }

    const audCash = document.getElementById("aud-r-cash");
    if (audCash) audCash.textContent = `$${fNode.cash.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

    const audBugs = document.getElementById("aud-r-bugs");
    if (audBugs) {
      audBugs.textContent = fNode.bugs;
      audBugs.style.color = fNode.bugs > 1 ? "var(--color-coral)" : "var(--color-slate)";
    }

    const audCov = document.getElementById("aud-r-coverage");
    if (audCov) audCov.textContent = `${fNode.coverage}%`;

    const audCli = document.getElementById("aud-r-users");
    if (audCli) {
      audCli.textContent = fNode.tier === "b2c" ? `${fNode.users} Observers` : `${fNode.users} Synapse Wires`;
    }

    const sliderVal = document.getElementById("slider-price-val");
    if (sliderVal) sliderVal.textContent = `$${fNode.price}`;

    const sliderDom = document.getElementById("slider-price");
    if (sliderDom) sliderDom.value = fNode.price;

    // Update coordinates value directly inside graph nodes
    Object.keys(this.companies).forEach(nodeId => {
      const cashEl = document.querySelector(`#node-comp_${nodeId} .cash`);
      if (cashEl) cashEl.textContent = `$${(this.companies[nodeId].cash / 1000).toFixed(0)}k`;

      const slaEl = document.querySelector(`#node-comp_${nodeId} .sla`);
      if (slaEl) {
        const sla = parseFloat(this.companies[nodeId].sla);
        slaEl.textContent = `${sla}%`;
        slaEl.className = `aqc-node-val sla ${sla < 95 ? 'red' : 'green'}`;
      }
    });

    // Update compliance counting status
    const complianceDom = document.getElementById("val-compliance-hud");
    if (complianceDom) {
      const activeParadigmUpper = this.ethicalParadigm.toUpperCase();
      complianceDom.textContent = activeParadigmUpper;
    }

    // Render agent terminal panes
    this.renderAgentLogs(this.activeSreTab);

    // Sync SRE hardware chassis socket matrix indicators
    const SRE_pane = document.getElementById("devops-container-health");
    if (SRE_pane) {
      SRE_pane.innerHTML = this.bladeHealth.map((online, index) => {
        return `<div class="aqc-blade-slot ${online ? 'online' : 'offline'}" onclick="window.aqc.rebootBlade(${index})">
          <span>BLADE-${index+1}</span>
        </div>`;
      }).join("");
    }

    // Update Dialogue message lists
    const dialogBox = document.getElementById("dialogue-messages");
    if (dialogBox) {
      dialogBox.innerHTML = this.dialogue.map(msg => {
        return `<div class="aqc-chat-msg ${msg.type}">
          <span class="sender">${msg.sender}</span>
          <span class="text">${msg.text}</span>
        </div>`;
      }).join("");
      dialogBox.scrollTop = dialogBox.scrollHeight;
    }

    // Sync historical rollback snap stack views
    this.renderChronometerStack();
    
    // Render active SRE patch deck logical nodes
    this.renderPatchDeck();

    // Render canvas sparkline trend plots
    this.drawTelemetryTrendPlot();
  }

  togglePatch(patchId) {
    const patch = this.patches.find(p => p.id === patchId);
    if (!patch) return;

    this.audio.playBleep(800, 0.08, 'triangle');

    if (patch.active) {
      // Rollback patch
      patch.active = false;
      patch.led = "off";
      // Refund 50%
      this.companies[this.focusNode].cash += patch.cost * 0.5;
      this.logDialogue("SRE SYSTEMS", `Deactivated patch: ${patch.name}. 50% token refund credited to Focus Node: ${this.companies[this.focusNode].name}.`, "system");
    } else {
      // Apply patch - check if Focus node has enough cash
      if (this.companies[this.focusNode].cash < patch.cost) {
        this.audio.playBleep(300, 0.15, 'sawtooth');
        this.logDialogue("SRE WARNING", `Infeasible patch allocation. Focus node requires $${patch.cost.toLocaleString()} to hotboot.`, "system");
        return;
      }
      
      // Deduct cash
      this.companies[this.focusNode].cash -= patch.cost;
      patch.led = "pending";
      
      this.logDialogue("SRE SYSTEMS", `Initializing patch: ${patch.name}. Allocation pending compile loop...`, "system");
      
      setTimeout(() => {
        patch.active = true;
        patch.led = "active";
        this.audio.playBleep(900, 0.1, 'sine');
        this.logDialogue("SRE SYSTEMS", `Patch successfully compiled and warm-booted: ${patch.name}`, "system");
        this.updateUI();
      }, 1000);
    }
    this.updateUI();
  }

  isPatchActive(patchId) {
    const patch = this.patches.find(p => p.id === patchId);
    return patch && patch.active;
  }

  renderPatchDeck() {
    const deck = document.getElementById("patch-deck-container");
    if (!deck) return;

    deck.innerHTML = this.patches.map(patch => {
      const ledClass = patch.led === "active" ? "active" : (patch.led === "pending" ? "pending" : "");
      const btnText = patch.active ? "ROLLBACK" : "APPLY";
      const btnClass = patch.active ? "aqc-patch-btn active" : "aqc-patch-btn";
      const costDisplay = patch.active ? "Active" : `$${(patch.cost/1000).toFixed(0)}k`;

      return `<div class="aqc-patch-card" id="patch-card-${patch.id}">
        <div class="aqc-patch-info">
          <span class="aqc-patch-title">
            <span class="aqc-patch-led ${ledClass}"></span>
            ${patch.name}
          </span>
          <span class="aqc-patch-desc">${patch.desc}</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span style="font-family: var(--font-mono); font-size: 0.52rem; color: var(--color-slate);">${costDisplay}</span>
          <button class="${btnClass}" onclick="window.aqc.togglePatch('${patch.id}')">${btnText}</button>
        </div>
      </div>`;
    }).join("");
  }

  generateProceduralDialogue() {
    // Check system status
    const totalBugs = Object.values(this.companies).reduce((sum, c) => sum + c.bugs, 0);
    const avgSla = Object.values(this.companies).reduce((sum, c) => sum + parseFloat(c.sla), 0) / 6;
    const lowestCash = Math.min(...Object.values(this.companies).map(c => c.cash));
    
    let speaker1 = "";
    let speaker2 = "";
    let text1 = "";
    let text2 = "";

    // 1. Extreme Case: Low SLA or System Shock
    if (avgSla < 90) {
      speaker1 = "DMITRI [SRE]";
      text1 = `CRITICAL: SLA degradation at ${(100 - avgSla).toFixed(1)}%. Bare-metal cluster is shedding packet vectors. Re-routing!`;
      speaker2 = "SOPHIA [CEO]";
      text2 = `Dmitri, coordinate with Elena. Halt non-essential transaction queues immediately.`;
    }
    // 2. High Tech Debt / Bugs
    else if (totalBugs > 4) {
      speaker1 = "ELENA [DEV]";
      text1 = `We have ${totalBugs} unresolved logical regressions in production. Software entropy is accelerating.`;
      speaker2 = "MARCUS [PM]";
      text2 = `Elena, I am adjusting feature weights. Sprints are now 100% focused on bug-squashing.`;
    }
    // 3. Paradigm Specific Dialogue
    else if (this.ethicalParadigm === "buddhist") {
      const poorNode = Object.keys(this.companies).find(k => this.companies[k].cash === lowestCash);
      speaker1 = "SOPHIA [CEO]";
      text1 = `Active Paradigm is Buddhist. Commencing liquid token redistribution to stabilize ${this.companies[poorNode].name}.`;
      speaker2 = "ALEX [GROWTH]";
      text2 = `Agreed. Homeostasis is our prime metric. Shared node growth builds long-term observer trust.`;
    }
    else if (this.ethicalParadigm === "nietzschean") {
      speaker1 = "ALEX [GROWTH]";
      text1 = `Will to Power loop engaged. Observer count is expanding rapidly as we maximize pricing pressure.`;
      speaker2 = "ELENA [DEV]";
      text2 = `Our test coverage is falling because we are prioritizing speed. We are building on a fault line.`;
    }
    else if (this.ethicalParadigm === "stoic") {
      speaker1 = "SOPHIA [CEO]";
      text1 = `Equanimity matrix is steady. External fluctuations are irrelevant to our mathematical invariants.`;
      speaker2 = "MARCUS [PM]";
      text2 = `Standardized cash buffers are locked. Maintain baseline optimization gain at all costs.`;
    }
    else if (this.ethicalParadigm === "kantian") {
      speaker1 = "MARCUS [PM]";
      text1 = `Every transaction must behave as a universal law of routing. Categorical imperative validated.`;
      speaker2 = "ELENA [DEV]";
      text2 = `Automated refactoring loops are correcting bugs and boosting coverage indices. Nominal state.`;
    }
    else if (this.ethicalParadigm === "utilitarian") {
      speaker1 = "SOPHIA [CEO]";
      text1 = `Maximizing average SLA yields the highest aggregate observer welfare.`;
      speaker2 = "DMITRI [SRE]";
      text2 = `Allocating compute buffers dynamically. General utility function is optimized.`;
    }
    else if (this.ethicalParadigm === "machiavellian") {
      speaker1 = "SOPHIA [CEO]";
      text1 = `Consolidating capital to the apex node. The weak must pay tributes to maintain sovereign security.`;
      speaker2 = "ALEX [GROWTH]";
      text2 = `Wealth levy successfully collected. Apex runway extended. The ends justify the parameters.`;
    }
    else if (this.ethicalParadigm === "socratic") {
      speaker1 = "MARCUS [PM]";
      text1 = `Dialectical inquiry loop engaged. We must ask: are our core compiler assumptions truly verified?`;
      speaker2 = "ELENA [DEV]";
      text2 = `Socratic questioning has uncovered latent defects, but our coverage and logical rigor are significantly higher.`;
    }
    // 4. Default Case
    else {
      speaker1 = "MARCUS [PM]";
      text1 = `Product sprint completed. All user interaction vectors are nominal.`;
      speaker2 = "ALEX [GROWTH]";
      text2 = `Excellent. Distributing organic marketing campaigns to increase node visibility.`;
    }

    if (speaker1 && text1) {
      this.logDialogue(speaker1, text1, "system");
      this.logAgentAction(speaker1.split(" ")[0], text1);
    }
    if (speaker2 && text2) {
      setTimeout(() => {
        this.logDialogue(speaker2, text2, "system");
        this.logAgentAction(speaker2.split(" ")[0], text2);
        this.updateUI();
      }, 400);
    }
  }
}

// Instantiate controller on global DOM tree
window.onload = () => {
  window.aqc = new AntigravityChronicleController();
  window.aqc.init();
};
