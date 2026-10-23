/**
 * EduGenie AI — Core Application Logic
 * Pure Client-side SPA, UI Animations, Web Audio API synthesis, & LocalStorage Sync
 */

// --- GLOBAL APPLICATION STATE ---
let state = {
  streakCount: 1,
  lastActivityDate: '',
  notesCount: 0,
  quizzesCount: 0,
  cardsMasteredCount: 0,
  studyMinutes: 0,
  dailyTargetMinutes: 30,
  activityLog: [],
  audioEnabled: true,
  flashcardDeck: [],
  activeSummary: null,
  activeQuiz: null,
  currentQuizIndex: 0,
  quizAnswers: [], // stores user choice indices
  quizScore: 0,
  quizTimerInterval: null,
  quizTimeElapsed: 0,
  
  // Active study session timer
  sessionTimerInterval: null,
  sessionSecondsElapsed: 0,
  sessionIsRunning: false,
  
  // Flashcard carousel active index
  currentCardIndex: 0
};

// --- PRESET TEXT DATABASE ---
const TEXT_PRESETS = {
  photosynthesis: {
    title: "Cell Biology & Photosynthesis",
    text: `Photosynthesis is a chemical process that occurs in plants, algae, and some bacteria. It converts light energy into chemical energy, which is stored in bonds of sugar molecules. This crucial biochemical pathway takes place primarily inside organelles called chloroplasts. 

The process is divided into two primary stages: the Light-Dependent Reactions and the Light-Independent Reactions (also known as the Calvin Cycle).

1. Light-Dependent Reactions:
These reactions take place in the thylakoid membranes of chloroplasts. Chlorophyll molecules absorb sunlight (photons), excitation splits water molecules (photolysis) releasing oxygen (O2) as a byproduct. This electron transport chain generates cellular energy carriers: Adenosine Triphosphate (ATP) and Nicotinamide Adenine Dinucleotide Phosphate (NADPH).

2. Light-Independent Reactions (Calvin Cycle):
These reactions occur in the stroma, the fluid-filled region of the chloroplast. This process does not require direct light. It uses the ATP and NADPH generated in the light reactions to fix Carbon Dioxide (CO2) from the air into glucose. This cycle utilizes the enzyme Rubisco (ribulose bisphosphate carboxylase) to catalyze the carbon fixation process.

Overall Equation:
6CO2 + 6H2O + Light Energy → C6H12O6 + 6O2

Photosynthesis is the primary engine of organic energy on Earth, responsible for producing oxygen and forming the base of almost all biological food webs.`,
    summary: {
      abstract: "Photosynthesis is the essential biological process by which plants, algae, and some bacteria synthesize glucose and oxygen from carbon dioxide, water, and sunlight. Taking place inside the chloroplasts, it consists of two distinct stages: light-dependent reactions within thylakoid membranes (generating energy carriers ATP and NADPH while releasing oxygen), and the stroma-based Calvin Cycle (which fixes atmospheric carbon dioxide into glucose using Rubisco).",
      bullets: [
        "Converts light energy into chemical energy (glucose), releasing oxygen as a key byproduct.",
        "Takes place inside chloroplasts, split into light-dependent and light-independent phases.",
        "Light-Dependent Reactions occur in thylakoid membranes, utilizing photolysis (splitting of water) to generate ATP, NADPH, and O2.",
        "Light-Independent Reactions (Calvin Cycle) occur in the stroma, using Rubisco to fix CO2 into sugars.",
        "The overall balanced equation is 6CO2 + 6H2O + Light → C6H12O6 + 6O2."
      ],
      glossary: [
        { term: "Chloroplast", definition: "A double-membraned organelle in plant cells that contains chlorophyll and is the site of photosynthesis." },
        { term: "Thylakoid Membrane", definition: "Internal sheet-like membranes in chloroplasts where the light-dependent reactions of photosynthesis occur." },
        { term: "Calvin Cycle", definition: "A metabolic pathway in the stroma of chloroplasts that fixes CO2 into sugar using ATP and NADPH." },
        { term: "Rubisco", definition: "An enzyme that catalyzes the primary step of carbon fixation in the Calvin Cycle." },
        { term: "Photolysis", definition: "The chemical process of splitting water molecules into hydrogen ions, electrons, and oxygen using light energy." }
      ],
      quiz: [
        {
          question: "Where do the Light-Dependent Reactions of photosynthesis take place?",
          options: ["Stroma", "Thylakoid Membranes", "Mitochondrial Matrix", "Cytoplasm"],
          answerIndex: 1,
          explanation: "The light-dependent reactions rely on chlorophyll molecules embedded in the thylakoid membranes to capture photons."
        },
        {
          question: "Which enzyme catalyzes the primary step of carbon dioxide fixation in the Calvin Cycle?",
          options: ["Amylase", "ATP Synthase", "Rubisco", "Helicase"],
          answerIndex: 2,
          explanation: "Rubisco (ribulose bisphosphate carboxylase) is the core enzyme responsible for fixing carbon dioxide into organic molecules."
        },
        {
          question: "What is the primary gaseous byproduct released during photolysis?",
          options: ["Carbon Dioxide (CO2)", "Hydrogen Gas (H2)", "Nitrogen (N2)", "Oxygen (O2)"],
          answerIndex: 3,
          explanation: "Photolysis splits water molecules (H2O), producing oxygen (O2) which is released into the atmosphere."
        },
        {
          question: "Which energy carriers are generated in the light reactions to fuel the Calvin Cycle?",
          options: ["ATP and NADPH", "NADH and FADH2", "ADP and NADP+", "Glucose and Oxygen"],
          answerIndex: 0,
          explanation: "ATP and NADPH act as chemical batteries, transporting energy from the thylakoids to the stroma."
        },
        {
          question: "Photosynthesis converts carbon dioxide and water into which chemical compounds?",
          options: ["Glucose and Carbon Dioxide", "Glucose and Oxygen", "Water and Carbon Dioxide", "Sucrose and Nitrogen"],
          answerIndex: 1,
          explanation: "The overall photosynthetic reaction synthesizes glucose (C6H12O6) and releases oxygen (O2) gas."
        }
      ],
      flashcards: [
        { front: "What is Photosynthesis?", back: "The chemical process that converts carbon dioxide, water, and light energy into glucose and oxygen." },
        { front: "Where is the Calvin Cycle located?", back: "In the stroma (fluid-filled region) of the chloroplast." },
        { front: "What does Rubisco stand for and do?", back: "Ribulose bisphosphate carboxylase. It is the enzyme that catalyzes carbon fixation in the Calvin Cycle." },
        { front: "What is Photolysis?", back: "The splitting of water molecules into hydrogen ions, electrons, and oxygen, powered by light energy." },
        { front: "Which pigments absorb light in plants?", back: "Chlorophyll molecules, primarily absorbing blue and red light wavelengths." }
      ]
    }
  },
  
  neuroscience: {
    title: "Neurobiology & Synaptic Networks",
    text: `Synaptic plasticity is the biological process by which synaptic connections between neurons change in strength in response to increases or decreases in their activity. It is the cellular mechanism underlying learning and memory formation. 

The two primary forms of synaptic plasticity are Long-Term Potentiation (LTP) and Long-Term Depression (LTD).

1. Long-Term Potentiation (LTP):
LTP is a persistent strengthening of synapses based on recent patterns of activity. This often involves high-frequency stimulation. In the hippocampus, LTP is heavily dependent on the NMDA (N-methyl-D-aspartate) receptor, a subtype of glutamate receptor. When the postsynaptic neuron is strongly depolarized, magnesium ions (Mg2+) blocking the NMDA channel are expelled. This allows calcium ions (Ca2+) to enter the cell, triggering intracellular cascades that insert additional AMPA receptors into the postsynaptic membrane, strengthening the synaptic response.

2. Long-Term Depression (LTD):
LTD is the opposite of LTP, characterized by a long-lasting decrease in synaptic strength. It typically results from low-frequency, persistent stimulation. The slow, modest rise in calcium concentration activates protein phosphatases (rather than kinases), which internalize AMPA receptors from the membrane.

According to Hebbian theory, 'neurons that fire together, wire together,' describing how activity-dependent changes in synaptic connectivity form memory traces or engrams in neural circuits.`,
    summary: {
      abstract: "Synaptic plasticity is the activity-dependent modification of synaptic strength, serving as the neural foundation for learning and memory. Its key manifestations are Long-Term Potentiation (LTP), which strengthens connections via high-frequency stimulation and calcium-induced insertion of AMPA receptors, and Long-Term Depression (LTD), which weakens connections via low-frequency stimulation and internalization of AMPA receptors. Hippocampal LTP relies on clearing Mg2+ blocks from NMDA receptors to permit calcium entry.",
      bullets: [
        "Underlies the physical mechanism of learning, conditioning, and memory storage.",
        "Long-Term Potentiation (LTP) permanently strengthens synapses following high-frequency activation.",
        "Long-Term Depression (LTD) weakens synapses following prolonged low-frequency activation.",
        "NMDA receptors act as coincidence detectors, requiring both glutamate binding and postsynaptic depolarization to expel Mg2+ blocks.",
        "Calcium entry via NMDA channels acts as the key signal to either add (LTP) or remove (LTD) postsynaptic AMPA receptors."
      ],
      glossary: [
        { term: "Synaptic Plasticity", definition: "The ability of synapses to strengthen or weaken over time in response to increases or decreases in their activity." },
        { term: "LTP (Long-Term Potentiation)", definition: "A persistent, activity-dependent increase in synaptic efficiency." },
        { term: "NMDA Receptor", definition: "A glutamate receptor channel that acts as a coincidence detector, blocked by magnesium at resting potential." },
        { term: "AMPA Receptor", definition: "A ligand-gated ionotropic glutamate receptor that mediates fast synaptic transmission." },
        { term: "Hebbian Theory", definition: "A neuroscientific theory stating that an increase in synaptic efficacy arises from a presynaptic cell's repeated excitation of a postsynaptic cell." }
      ],
      quiz: [
        {
          question: "What is the primary cellular mechanism that explains how memories are stored?",
          options: ["Axonal conduction", "Synaptic plasticity", "Myelination", "Neurogenesis"],
          answerIndex: 1,
          explanation: "Synaptic plasticity (changing the connection strength between existing neurons) is widely accepted as the physical basis of learning and memory."
        },
        {
          question: "Which ion blocks the NMDA receptor channel when the postsynaptic cell is at rest?",
          options: ["Sodium (Na+)", "Calcium (Ca2+)", "Potassium (K+)", "Magnesium (Mg2+)"],
          answerIndex: 3,
          explanation: "At resting potential, magnesium ions physically block the NMDA channel. Depolarization is required to expel this magnesium block."
        },
        {
          question: "During LTP, which receptors are inserted into the postsynaptic membrane to increase sensitivity?",
          options: ["AMPA receptors", "NMDA receptors", "Dopamine receptors", "GABA receptors"],
          answerIndex: 0,
          explanation: "Intracellular calcium cascades trigger the transport and insertion of AMPA receptors, increasing sodium entry and depolarizing potential."
        },
        {
          question: "What type of stimulation typically triggers Long-Term Depression (LTD)?",
          options: ["High-frequency burst stimulation", "Low-frequency, persistent stimulation", "Absolute silence", "Chemical shock"],
          answerIndex: 1,
          explanation: "LTD is induced by low-frequency, persistent stimulation which causes a slow, low-amplitude rise in calcium, activating phosphatases."
        },
        {
          question: "Hebbian learning theory is often summarized by which phrase?",
          options: ["Use it or lose it", "Neurons that fire together, wire together", "Survival of the fittest synapse", "All-or-none connection"],
          answerIndex: 1,
          explanation: "Donald Hebb's theory states that synapses are strengthened when pre- and post-synaptic neurons fire synchronously."
        }
      ],
      flashcards: [
        { front: "Define Synaptic Plasticity", back: "The ability of connection strengths between neurons to change based on active signaling levels." },
        { front: "What is the role of Calcium in LTP?", back: "It acts as a second messenger that triggers protein kinases to phosphorylate and insert AMPA receptors." },
        { front: "How is NMDA receptor activated?", back: "It requires both presynaptic glutamate release and postsynaptic depolarization to clear its Mg2+ blocker." },
        { front: "What is LTD?", back: "Long-Term Depression: a persistent, long-lasting reduction in synaptic strength." },
        { front: "Where is memory consolidation studied most?", back: "The Hippocampus, a primary temporal lobe brain structure." }
      ]
    }
  },
  
  artificial_intelligence: {
    title: "Computer Science & AI Foundations",
    text: `Machine learning is a subset of artificial intelligence focused on building systems that learn from data to improve performance. The core methodology splits algorithms into Supervised Learning, Unsupervised Learning, and Reinforcement Learning.

1. Supervised Learning:
Supervised learning algorithms are trained on labeled datasets. Each input data point is paired with its corresponding correct output label. The model makes predictions, measures its error relative to the label, and updates its internal parameters to minimize this deviation. Examples include linear regression, support vector machines, and deep neural networks.

2. Unsupervised Learning:
Unsupervised learning models receive unlabeled data. The system attempts to self-discover underlying structural patterns, clusters, or distributions within the data without human intervention. Standard tasks include clustering (e.g., K-Means) and dimensionality reduction (e.g., Principal Component Analysis).

3. Core Optimization (Gradient Descent):
Most machine learning systems optimize parameters using Gradient Descent. A mathematical loss function calculates prediction errors. The algorithm calculates the gradient (derivative) of the loss function with respect to weights, taking iterative steps in the direction of steepest descent (negative gradient) to find the minimum error configuration. The step size is controlled by a parameter called the learning rate.`,
    summary: {
      abstract: "Machine learning is the branch of AI that develops systems capable of learning patterns directly from data. It is categorized into supervised learning (training on labeled inputs to mapping outputs) and unsupervised learning (analyzing unlabeled datasets to reveal hidden clusters/structures). Optimization is driven by Gradient Descent, an algorithm that iteratively shifts model parameters in the direction of the negative gradient of a loss function to locate minimum error, with step size governed by the learning rate.",
      bullets: [
        "Subfield of AI focusing on data-driven model learning and adaptation.",
        "Supervised learning trains models on input-label pairings to perform prediction/classification.",
        "Unsupervised learning processes unlabeled data to identify clusters or patterns.",
        "Gradient Descent iteratively minimizes a loss function by adjusting parameters.",
        "The learning rate determines the size of the steps taken toward the loss function minimum."
      ],
      glossary: [
        { term: "Supervised Learning", definition: "A type of machine learning where models are trained using labeled training datasets." },
        { term: "Unsupervised Learning", definition: "Machine learning models trained on raw, unlabeled datasets to discover structures." },
        { term: "Gradient Descent", definition: "An optimization algorithm used to minimize a loss function by adjusting parameters." },
        { term: "Loss Function", definition: "A mathematical function that quantifies the difference between predictions and actual labels." },
        { term: "Learning Rate", definition: "A hyperparameter that controls how much the model's weights adjust in response to estimated error gradients." }
      ],
      quiz: [
        {
          question: "Which branch of machine learning trains models using predefined target labels?",
          options: ["Unsupervised Learning", "Supervised Learning", "Reinforcement Learning", "Heuristic Optimization"],
          answerIndex: 1,
          explanation: "Supervised learning relies on training data that contains both inputs and their corresponding correct output labels."
        },
        {
          question: "Gradient descent is designed to achieve which mathematical objective?",
          options: ["Maximize the learning rate", "Minimize a loss function", "Perform cluster grouping", "Label data points"],
          answerIndex: 1,
          explanation: "Gradient descent calculates weight adjustments to reduce errors, effectively minimizing the output of the loss function."
        },
        {
          question: "K-Means clustering is classified under which category of machine learning?",
          options: ["Supervised Learning", "Semi-supervised Learning", "Unsupervised Learning", "Neural Networks"],
          answerIndex: 2,
          explanation: "K-Means groups unlabeled data based on structural similarity, making it a classic unsupervised learning technique."
        },
        {
          question: "What hyperparameter regulates the step sizes taken in Gradient Descent?",
          options: ["Loss function weight", "Learning rate", "Epoch limit", "Activation slope"],
          answerIndex: 1,
          explanation: "The learning rate (often denoted by alpha) controls the magnitude of parameter adjustments during gradient descent iterations."
        },
        {
          question: "What is a major risk of set learning rates that are configured too high?",
          options: ["Model will freeze immediately", "Gradient will vanish to zero", "Algorithm may overshoot the minimum and fail to converge", "Training will take too long"],
          answerIndex: 2,
          explanation: "If the learning rate is too large, parameter updates can overshoot the target minimum, causing divergence and instability."
        }
      ],
      flashcards: [
        { front: "What is Supervised Learning?", back: "Training algorithms on datasets where inputs are paired with correct, verified output labels." },
        { front: "Define Gradient Descent", back: "An iterative optimization algorithm that shifts parameters to minimize a mathematical loss function." },
        { front: "What is a Loss Function?", back: "An equation measuring how far off a model's prediction is from the target label." },
        { front: "What does learning rate control?", back: "The step size taken towards the minimum error gradient in training." },
        { front: "Give an unsupervised task example", back: "Clustering raw consumer purchasing profiles without predefined labels." }
      ]
    }
  }
};


// --- WEB AUDIO SYNTHESIZED SOUND ENGINE ---
const SoundFX = {
  ctx: null,

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  },

  playClick() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  },

  playFlip() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(250, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  },

  playSuccess() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Play a happy major triad arpeggio (C4, E4, G4, C5)
    const notes = [261.63, 329.63, 392.00, 523.25];
    const duration = 0.12;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.08, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.001, now + idx * 0.07 + duration);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + duration);
    });
  },

  playError() {
    if (!state.audioEnabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    // Play a low dissonant slide
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }
};


// --- LOCALSTORAGE SYNC & INITIALIZATION ---
function loadStateFromStorage() {
  const stored = localStorage.getItem('edugenie_state');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      state = { ...state, ...parsed };
      
      // Reset session-running states on refresh
      state.sessionIsRunning = false;
      state.sessionSecondsElapsed = 0;
      state.sessionTimerInterval = null;
      state.quizTimerInterval = null;
    } catch (e) {
      console.error("Failed to parse local storage state", e);
    }
  }
  
  // Date check for streak validation
  checkStreakProgression();
  saveStateToStorage();
}

function saveStateToStorage() {
  const serializable = {
    streakCount: state.streakCount,
    lastActivityDate: state.lastActivityDate,
    notesCount: state.notesCount,
    quizzesCount: state.quizzesCount,
    cardsMasteredCount: state.cardsMasteredCount,
    studyMinutes: state.studyMinutes,
    dailyTargetMinutes: state.dailyTargetMinutes,
    activityLog: state.activityLog,
    audioEnabled: state.audioEnabled,
    flashcardDeck: state.flashcardDeck,
    activeSummary: state.activeSummary
  };
  localStorage.setItem('edugenie_state', JSON.stringify(serializable));
}

function checkStreakProgression() {
  const todayStr = new Date().toISOString().split('T')[0];
  
  if (!state.lastActivityDate) {
    state.streakCount = 1;
    state.lastActivityDate = todayStr;
    logActivity('welcome', 'Registered your first day of EduGenie AI study!');
    return;
  }
  
  if (state.lastActivityDate === todayStr) {
    // Already did work today, streak intact
    return;
  }
  
  // Check if yesterday
  const lastDate = new Date(state.lastActivityDate);
  const todayDate = new Date(todayStr);
  const diffTime = Math.abs(todayDate - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    state.streakCount += 1;
    state.lastActivityDate = todayStr;
    logActivity('streak', `Streak extended! Day ${state.streakCount} is active.`);
    showToast('flame', `Streak extended! Day ${state.streakCount} streak active.`, 'warning');
  } else if (diffDays > 1) {
    // Reset streak
    state.streakCount = 1;
    state.lastActivityDate = todayStr;
    logActivity('streak-reset', 'Study gap detected. Day 1 streak restarted.');
    showToast('flame', 'New streak started! Stay consistent.', 'info');
  }
}

function updateDashboardStats() {
  document.getElementById('stat-notes-summarized').textContent = state.notesCount;
  document.getElementById('stat-quizzes-taken').textContent = state.quizzesCount;
  document.getElementById('stat-cards-mastered').textContent = state.cardsMasteredCount;
  document.getElementById('stat-study-time').textContent = `${Math.round(state.studyMinutes)}m`;
  
  document.getElementById('mini-streak-count').textContent = state.streakCount;
  document.getElementById('streak-count-value').textContent = state.streakCount;
  
  // Progress circles
  const target = state.dailyTargetMinutes;
  const current = state.studyMinutes;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  
  // Header circle (Radius = 16, Circumference = 2 * PI * 16 = 100.5)
  const headerCircle = document.getElementById('header-goal-circle');
  const headerOffset = 100.5 - (percentage / 100) * 100.5;
  headerCircle.style.strokeDashoffset = headerOffset;
  document.getElementById('header-goal-pct').textContent = `${percentage}%`;
  document.getElementById('header-goal-text').textContent = `${Math.round(current)}m / ${target}m`;
  
  // Dashboard circle (Radius = 65, Circumference = 2 * PI * 65 = 408.4)
  const dashCircle = document.getElementById('dashboard-goal-circle');
  const dashOffset = 408.4 - (percentage / 100) * 408.4;
  dashCircle.style.strokeDashoffset = dashOffset;
  document.getElementById('dashboard-goal-pct').textContent = `${percentage}%`;
  document.getElementById('dashboard-goal-val').textContent = `${Math.round(current)} / ${target} mins`;
  
  // Activity Log
  renderActivityLog();
  
  // Sync Flashcard Deck layout counters
  document.getElementById('deck-card-count').textContent = state.flashcardDeck.length;
  const mastered = state.flashcardDeck.filter(c => c.mastered).length;
  const deckPct = state.flashcardDeck.length > 0 ? Math.round((mastered / state.flashcardDeck.length) * 100) : 0;
  document.getElementById('deck-mastery-rate').textContent = `${deckPct}%`;
  document.getElementById('deck-progress-bar').style.width = `${deckPct}%`;
}

function logActivity(type, description) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const logItem = {
    id: 'act_' + Date.now(),
    type: type, // summarize, quiz, card, timer, welcome
    description: description,
    time: timeStr,
    timestamp: Date.now()
  };
  state.activityLog.unshift(logItem);
  if (state.activityLog.length > 25) {
    state.activityLog.pop();
  }
  saveStateToStorage();
}

function renderActivityLog() {
  const container = document.getElementById('activity-log-list');
  if (state.activityLog.length === 0) {
    container.innerHTML = `
      <li class="empty-activity">
        <i data-lucide="calendar"></i>
        <p>No study activity logged today. Complete a task to begin tracking!</p>
      </li>
    `;
    lucide.createIcons();
    return;
  }
  
  container.innerHTML = state.activityLog.map(act => {
    let iconClass = 'act-timer';
    let iconName = 'timer';
    
    if (act.type === 'summarize') {
      iconClass = 'act-summarize';
      iconName = 'file-text';
    } else if (act.type === 'quiz') {
      iconClass = 'act-quiz';
      iconName = 'award';
    } else if (act.type === 'card' || act.type === 'card-mastery') {
      iconClass = 'act-card';
      iconName = 'layers';
    } else if (act.type === 'streak' || act.type === 'welcome') {
      iconClass = 'act-quiz';
      iconName = 'sparkles';
    }
    
    return `
      <li class="activity-item">
        <div class="activity-item-icon ${iconClass}">
          <i data-lucide="${iconName}"></i>
        </div>
        <div class="activity-item-content">
          <p>${act.description}</p>
          <div class="activity-item-time">${act.time}</div>
        </div>
      </li>
    `;
  }).join('');
  
  lucide.createIcons();
}


// --- TOAST NOTIFICATIONS UTILITY ---
function showToast(icon, message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  toast.innerHTML = `
    <div class="toast-icon">
      <i data-lucide="${icon}"></i>
    </div>
    <div class="toast-message">${message}</div>
  `;
  
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}


// --- SPA ROUTER & NAVIGATION ---
const PAGE_TITLES = {
  dashboard: { title: "Dashboard Overview", subtitle: "Welcome back. Ready to accelerate your learning?" },
  summarizer: { title: "AI Notes Summarizer", subtitle: "Convert heavy articles and notes into clear outlines & key terms." },
  quiz: { title: "Quiz Generator", subtitle: "Test your synthesis and solidify pathways in memory." },
  flashcards: { title: "3D Flashcard Deck", subtitle: "Utilize active recall and the Leitner progression system." }
};

function switchTab(tabId) {
  SoundFX.playClick();
  
  // Remove active flags
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mobile-nav-item').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-section').forEach(sec => sec.classList.remove('active'));
  
  // Set active flags
  const sidebarBtn = document.querySelector(`.sidebar-nav [data-tab="${tabId}"]`);
  if (sidebarBtn) sidebarBtn.classList.add('active');
  
  const mobBtn = document.querySelector(`.mobile-nav [data-tab="${tabId}"]`);
  if (mobBtn) mobBtn.classList.add('active');
  
  const targetSection = document.getElementById(`tab-${tabId}`);
  if (targetSection) targetSection.classList.add('active');
  
  // Update titles
  const textInfo = PAGE_TITLES[tabId];
  if (textInfo) {
    document.getElementById('page-title').textContent = textInfo.title;
    document.getElementById('page-subtitle').textContent = textInfo.subtitle;
  }
  
  // Extra page-specific layouts adjustment
  if (tabId === 'quiz') {
    syncQuizSourceUI();
  } else if (tabId === 'flashcards') {
    syncFlashcardsUI();
  }
}

// Bind routing listeners
document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(elem => {
  elem.addEventListener('click', (e) => {
    const tabId = elem.getAttribute('data-tab');
    switchTab(tabId);
  });
});


// --- SOUND EFFECTS SETTINGS TRIGGER ---
document.getElementById('toggle-audio-btn').addEventListener('click', () => {
  state.audioEnabled = !state.audioEnabled;
  const audioBtn = document.getElementById('toggle-audio-btn');
  const audioIcon = document.getElementById('audio-icon');
  
  if (state.audioEnabled) {
    audioBtn.classList.remove('muted');
    audioIcon.setAttribute('data-lucide', 'volume-2');
    showToast('volume-2', 'Sound effects enabled.', 'info');
    SoundFX.playClick();
  } else {
    audioBtn.classList.add('muted');
    audioIcon.setAttribute('data-lucide', 'volume-x');
    showToast('volume-x', 'Sound effects muted.', 'info');
  }
  lucide.createIcons();
  saveStateToStorage();
});


// --- DASHBOARD FOCUS TIMER LOGIC ---
const startSessionBtn = document.getElementById('start-session-btn');
const pauseSessionBtn = document.getElementById('pause-session-btn');
const stopSessionBtn = document.getElementById('stop-session-btn');
const activeTimerDisplay = document.getElementById('active-timer-display');

function formatSeconds(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

startSessionBtn.addEventListener('click', () => {
  SoundFX.playClick();
  state.sessionIsRunning = true;
  
  startSessionBtn.classList.add('hidden');
  pauseSessionBtn.classList.remove('hidden');
  stopSessionBtn.classList.remove('hidden');
  activeTimerDisplay.classList.remove('hidden');
  
  showToast('timer', 'Study timer session started. Focus hard!', 'info');
  
  state.sessionTimerInterval = setInterval(() => {
    state.sessionSecondsElapsed++;
    activeTimerDisplay.textContent = formatSeconds(state.sessionSecondsElapsed);
  }, 1000);
});

pauseSessionBtn.addEventListener('click', () => {
  SoundFX.playClick();
  state.sessionIsRunning = false;
  clearInterval(state.sessionTimerInterval);
  
  startSessionBtn.classList.remove('hidden');
  startSessionBtn.innerHTML = `<i data-lucide="play"></i> Resume Session`;
  pauseSessionBtn.classList.add('hidden');
  
  showToast('pause', 'Session paused.', 'info');
  lucide.createIcons();
});

stopSessionBtn.addEventListener('click', () => {
  SoundFX.playSuccess();
  state.sessionIsRunning = false;
  clearInterval(state.sessionTimerInterval);
  
  const elapsedMins = state.sessionSecondsElapsed / 60;
  if (elapsedMins >= 0.05) { // Minimum 3 seconds to log
    state.studyMinutes += elapsedMins;
    logActivity('timer', `Completed study session: studied for ${Math.round(elapsedMins * 10) / 10}m`);
    showToast('award', `Great work! Added ${Math.round(elapsedMins * 10) / 10}m to focus time.`, 'success');
  } else {
    showToast('info', 'Session ended (too short to log).', 'info');
  }
  
  state.sessionSecondsElapsed = 0;
  
  startSessionBtn.classList.remove('hidden');
  startSessionBtn.innerHTML = `<i data-lucide="play"></i> Start Session`;
  pauseSessionBtn.classList.add('hidden');
  stopSessionBtn.classList.add('hidden');
  activeTimerDisplay.classList.add('hidden');
  activeTimerDisplay.textContent = "00:00";
  
  lucide.createIcons();
  updateDashboardStats();
  saveStateToStorage();
});

// Edit Goal Modal toggles
const goalModal = document.getElementById('goal-modal');
document.getElementById('edit-goal-btn').addEventListener('click', () => {
  SoundFX.playClick();
  document.getElementById('goal-input-field').value = state.dailyTargetMinutes;
  goalModal.classList.remove('hidden');
});

function closeGoalModal() {
  SoundFX.playClick();
  goalModal.classList.add('hidden');
}

document.getElementById('close-goal-modal-btn').addEventListener('click', closeGoalModal);
document.getElementById('cancel-goal-btn').addEventListener('click', closeGoalModal);

document.getElementById('save-goal-btn').addEventListener('click', () => {
  const newVal = parseInt(document.getElementById('goal-input-field').value);
  if (newVal >= 5 && newVal <= 480) {
    state.dailyTargetMinutes = newVal;
    showToast('settings', `Focus target updated to ${newVal} minutes!`, 'success');
    closeGoalModal();
    updateDashboardStats();
    saveStateToStorage();
  } else {
    showToast('alert-triangle', 'Please choose a target between 5 and 480 minutes.', 'warning');
  }
});


// --- NOTES SUMMARIZER CORE LOGIC ---
const summarizerInput = document.getElementById('summarizer-input');
const charCounter = document.getElementById('char-counter');
const summarizeBtn = document.getElementById('summarize-btn');
const loaderBox = document.getElementById('summarizer-loader');
const emptyBox = document.getElementById('summarizer-empty');
const resultsBox = document.getElementById('summarizer-results');

summarizerInput.addEventListener('input', () => {
  const current = summarizerInput.value.length;
  charCounter.textContent = `${current.toLocaleString()} / 10,000 characters`;
});

function clearSummarizerInput() {
  SoundFX.playClick();
  summarizerInput.value = '';
  charCounter.textContent = '0 / 10,000 characters';
  summarizerInput.focus();
}

function loadPresetText(key) {
  SoundFX.playClick();
  const preset = TEXT_PRESETS[key];
  if (preset) {
    summarizerInput.value = preset.text;
    charCounter.textContent = `${preset.text.length.toLocaleString()} / 10,000 characters`;
    showToast('file-text', `Loaded "${preset.title}" preset.`, 'info');
  }
}

// Dynamic parser algorithm for user's custom notes
function parseCustomNotesText(rawText, tone, length) {
  // Simple heuristic text processor for custom inputs
  const cleaned = rawText.trim().replace(/\s+/g, ' ');
  const sentences = cleaned.split(/(?<=[.!?])\s+/);
  
  let abstract = "";
  let bullets = [];
  let glossary = [];
  
  if (sentences.length <= 2) {
    abstract = cleaned;
    bullets = [cleaned];
    glossary = [{ term: "Concept Focus", definition: "Defined concept based on short notes summary." }];
  } else {
    // Executive summary from first two sentences
    abstract = sentences[0] + " " + (sentences[1] || "");
    
    // Scan for key points (sentences with connectors or longer lengths)
    const keywords = ["important", "because", "implies", "key", "processes", "defined", "therefore", "essential", "crucial"];
    sentences.forEach((sent) => {
      if (bullets.length < 5) {
        const containsKeyword = keywords.some(k => sent.toLowerCase().includes(k));
        if (containsKeyword && sent.length > 20 && sent.length < 180) {
          bullets.push(sent);
        }
      }
    });
    
    // Fill bullets if too empty
    let sIdx = 2;
    while (bullets.length < 4 && sIdx < sentences.length) {
      if (sentences[sIdx].length > 25 && !bullets.includes(sentences[sIdx])) {
        bullets.push(sentences[sIdx]);
      }
      sIdx++;
    }
    
    // Scan for glossary terms (capitalized words before "is/are/refers to" or colon)
    const definitionRegex = /\b([A-Z][a-zA-Z\s]{2,25})\b\s+(?:is|are|refers to|denotes)\s+([^.]+)/;
    sentences.forEach(sent => {
      const match = sent.match(definitionRegex);
      if (match && glossary.length < 5) {
        const term = match[1].trim();
        const definition = match[2].trim() + ".";
        // Check duplication
        if (!glossary.some(item => item.term.toLowerCase() === term.toLowerCase())) {
          glossary.push({ term, definition });
        }
      }
    });
    
    // Glossary fallbacks: pick notable nouns
    if (glossary.length < 3) {
      const fallbackPairs = [
        { term: "Critical Target", definition: "A principal key element defined within your study notes." },
        { term: "System Process", definition: "A sequence of actions parsed directly from text context." },
        { term: "Core Variable", definition: "An essential component influencing behavior in this topic." }
      ];
      fallbackPairs.forEach(pair => {
        if (glossary.length < 4) glossary.push(pair);
      });
    }
  }

  // Set tone adjustments to outputs
  if (tone === 'simple') {
    abstract = "Simply put: " + abstract.replace(/biochemical|organelles|compartment|stimulation|depolarized|methodology|dimensionality/gi, "important structure");
  } else if (tone === 'creative') {
    abstract = "🧠 Think of this topic like an intricate, automated machine. " + abstract;
  }
  
  // Format outputs into proper preset structures
  // Since we also need mock quizzes and flashcards for custom notes, synthesize them dynamically!
  const mockQuiz = glossary.map((g, idx) => {
    const distractors = glossary.filter((_, i) => i !== idx).map(item => item.term);
    while (distractors.length < 3) {
      distractors.push(`Secondary Parameter ${distractors.length + 1}`);
    }
    const options = [g.term, distractors[0], distractors[1], distractors[2]];
    
    // Shuffle options
    const shuffled = [...options];
    let ansIdx = 0;
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    ansIdx = shuffled.indexOf(g.term);

    return {
      question: `Which terms relates directly to the definition: "${g.definition}"?`,
      options: shuffled,
      answerIndex: ansIdx,
      explanation: `"${g.term}" is defined precisely as: ${g.definition}`
    };
  });

  const mockCards = glossary.map(g => ({
    front: `What is the definition of "${g.term}"?`,
    back: g.definition
  }));

  return {
    abstract,
    bullets,
    glossary,
    quiz: mockQuiz,
    flashcards: mockCards
  };
}

summarizeBtn.addEventListener('click', () => {
  const text = summarizerInput.value.trim();
  if (!text) {
    showToast('alert-triangle', 'Please paste study notes or load a preset first.', 'warning');
    SoundFX.playError();
    return;
  }
  
  SoundFX.playClick();
  
  // Hide panels and start loader
  emptyBox.classList.add('hidden');
  resultsBox.classList.add('hidden');
  loaderBox.classList.remove('hidden');
  
  const tone = document.getElementById('summarizer-tone').value;
  const length = document.getElementById('summarizer-length').value;
  
  // Loading Simulation Phases
  const phases = [
    { pct: 25, title: "Parsing input syntax...", detail: "Dividing clauses and tokenizing keywords" },
    { pct: 55, title: "Evaluating semantic weights...", detail: "Detecting connections and definition tags" },
    { pct: 80, title: "Structuring outline guide...", detail: "Drafting abstract summary & key takeaways" },
    { pct: 100, title: "Compiling glossary matrices...", detail: "Optimizing flashcard terms & generating quiz questions" }
  ];
  
  let currentPhaseIdx = 0;
  
  const timer = setInterval(() => {
    if (currentPhaseIdx < phases.length) {
      const phase = phases[currentPhaseIdx];
      document.getElementById('loader-phase').textContent = phase.title;
      document.getElementById('loader-details').textContent = phase.detail;
      document.getElementById('loader-progress-bar').style.width = `${phase.pct}%`;
      currentPhaseIdx++;
    } else {
      clearInterval(timer);
      
      // Look up preset or dynamically parse
      let processed = null;
      let matchedKey = null;
      
      // Check if matches preset
      for (const [key, preset] of Object.entries(TEXT_PRESETS)) {
        if (text.substring(0, 100) === preset.text.substring(0, 100)) {
          processed = preset.summary;
          matchedKey = key;
          break;
        }
      }
      
      if (!processed) {
        processed = parseCustomNotesText(text, tone, length);
      }
      
      // Store in active summary state
      state.activeSummary = {
        text: text,
        abstract: processed.abstract,
        bullets: processed.bullets,
        glossary: processed.glossary,
        quiz: processed.quiz,
        flashcards: processed.flashcards
      };
      
      // Render output views
      document.getElementById('summary-abstract-output').textContent = processed.abstract;
      document.getElementById('summary-bullets-output').innerHTML = processed.bullets.map(b => `<li>${b}</li>`).join('');
      document.getElementById('summary-glossary-output').innerHTML = processed.glossary.map(g => `
        <div class="glossary-item">
          <div class="glossary-term">${g.term}</div>
          <div class="glossary-definition">${g.definition}</div>
        </div>
      `).join('');
      
      // Hide loader, show results
      loaderBox.classList.add('hidden');
      resultsBox.classList.remove('hidden');
      
      state.notesCount++;
      logActivity('summarize', `Summarized study guide: "${text.substring(0, 30)}..."`);
      showToast('sparkles', 'AI study summary generated successfully!', 'success');
      SoundFX.playSuccess();
      updateDashboardStats();
      saveStateToStorage();
    }
  }, 600);
});

// Copy / Export action buttons
document.getElementById('copy-summary-btn').addEventListener('click', () => {
  if (!state.activeSummary) return;
  
  const textToCopy = `SUMMARY GUIDE
${state.activeSummary.abstract}

KEY TAKEAWAYS
${state.activeSummary.bullets.map(b => `- ${b}`).join('\n')}

GLOSSARY DEFINITIONS
${state.activeSummary.glossary.map(g => `${g.term}: ${g.definition}`).join('\n')}`;

  navigator.clipboard.writeText(textToCopy).then(() => {
    SoundFX.playClick();
    showToast('check', 'Copied study summary to clipboard!', 'success');
  });
});

document.getElementById('download-summary-btn').addEventListener('click', () => {
  if (!state.activeSummary) return;
  
  const textContent = `EDUGENIE AI STUDY WORKSPACE SUMMARY
Generated: ${new Date().toLocaleString()}

SUMMARY ABSTRACT
===========================================
${state.activeSummary.abstract}

KEY TAKEAWAYS
===========================================
${state.activeSummary.bullets.map(b => `- ${b}`).join('\n')}

GLOSSARY TERMS
===========================================
${state.activeSummary.glossary.map(g => `${g.term}: ${g.definition}`).join('\n')}`;

  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `edugenie_summary_${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  SoundFX.playClick();
  showToast('download', 'Exported study guide text file.', 'success');
});

// Auto-route conversions
document.getElementById('convert-to-quiz-btn').addEventListener('click', () => {
  switchTab('quiz');
  document.getElementById('source-active-notes-btn').click();
});

document.getElementById('convert-to-cards-btn').addEventListener('click', () => {
  switchTab('flashcards');
  document.getElementById('cards-generate-notes-btn').click();
});


// --- QUIZ GENERATOR CORE LOGIC ---
const quizSetupPanel = document.getElementById('quiz-setup-panel');
const quizArenaPanel = document.getElementById('quiz-arena-panel');
const quizResultsPanel = document.getElementById('quiz-results-panel');

const sourceActiveNotesBtn = document.getElementById('source-active-notes-btn');
const sourcePresetBtn = document.getElementById('source-preset-btn');
const quizPresetsDropdownGroup = document.getElementById('quiz-presets-dropdown-group');

let quizSource = "active-notes";

function syncQuizSourceUI() {
  const activeStatus = document.getElementById('active-notes-status-text');
  const activeWarning = document.getElementById('active-notes-warning-text');
  const startBtn = document.getElementById('generate-quiz-btn');
  
  if (state.activeSummary) {
    activeStatus.classList.remove('hidden');
    activeWarning.classList.add('hidden');
    startBtn.disabled = false;
  } else {
    activeStatus.classList.add('hidden');
    activeWarning.classList.remove('hidden');
    if (quizSource === 'active-notes') {
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  }
}

sourceActiveNotesBtn.addEventListener('click', () => {
  SoundFX.playClick();
  quizSource = "active-notes";
  sourceActiveNotesBtn.classList.add('active');
  sourcePresetBtn.classList.remove('active');
  quizPresetsDropdownGroup.classList.add('hidden');
  syncQuizSourceUI();
});

sourcePresetBtn.addEventListener('click', () => {
  SoundFX.playClick();
  quizSource = "presets";
  sourcePresetBtn.classList.add('active');
  sourceActiveNotesBtn.classList.remove('active');
  quizPresetsDropdownGroup.classList.remove('hidden');
  document.getElementById('generate-quiz-btn').disabled = false;
  syncQuizSourceUI();
});

// STARTING THE QUIZ
document.getElementById('generate-quiz-btn').addEventListener('click', () => {
  SoundFX.playClick();
  
  const size = parseInt(document.getElementById('quiz-size').value);
  const difficulty = document.getElementById('quiz-difficulty').value;
  
  let qBank = [];
  
  if (quizSource === 'active-notes') {
    if (!state.activeSummary || !state.activeSummary.quiz) {
      showToast('alert-triangle', 'No active notes found to compile questions.', 'warning');
      return;
    }
    qBank = [...state.activeSummary.quiz];
  } else {
    // Load presets question list
    const key = document.getElementById('quiz-preset-topic').value;
    qBank = [...TEXT_PRESETS[key].summary.quiz];
  }
  
  // Truncate based on size limits
  state.activeQuiz = qBank.slice(0, size);
  
  // Reset game states
  state.currentQuizIndex = 0;
  state.quizAnswers = Array(state.activeQuiz.length).fill(null);
  state.quizScore = 0;
  state.quizTimeElapsed = 0;
  
  // Swap Panels
  quizSetupPanel.classList.add('hidden');
  quizArenaPanel.classList.remove('hidden');
  
  // Start Timer
  document.getElementById('quiz-timer-text').textContent = "00:00";
  state.quizTimerInterval = setInterval(() => {
    state.quizTimeElapsed++;
    document.getElementById('quiz-timer-text').textContent = formatSeconds(state.quizTimeElapsed);
  }, 1000);
  
  loadQuizQuestion(0);
});

function loadQuizQuestion(index) {
  const qData = state.activeQuiz[index];
  
  // Tracker progress bar (Current / Total)
  document.getElementById('current-question-num').textContent = index + 1;
  document.getElementById('total-questions-num').textContent = state.activeQuiz.length;
  
  const pct = ((index + 1) / state.activeQuiz.length) * 100;
  document.getElementById('quiz-progress-bar').style.width = `${pct}%`;
  
  // Text details
  document.getElementById('quiz-question-text').textContent = qData.question;
  
  // Render options list
  const container = document.getElementById('quiz-options-list');
  container.innerHTML = qData.options.map((opt, oIdx) => {
    const marker = String.fromCharCode(65 + oIdx); // A, B, C, D
    return `
      <button class="quiz-option-item" onclick="selectQuizOption(${oIdx})">
        <span class="option-marker">${marker}</span>
        <span class="option-text">${opt}</span>
      </button>
    `;
  }).join('');
  
  // Reset button state
  document.getElementById('submit-answer-btn').classList.remove('hidden');
  document.getElementById('submit-answer-btn').disabled = true;
  document.getElementById('next-question-btn').classList.add('hidden');
  document.getElementById('quiz-feedback-panel').classList.add('hidden');
}

function selectQuizOption(optionIdx) {
  if (state.quizAnswers[state.currentQuizIndex] !== null) return; // Answer already submitted
  
  SoundFX.playClick();
  state.quizAnswers[state.currentQuizIndex] = optionIdx;
  
  const items = document.querySelectorAll('#quiz-options-list .quiz-option-item');
  items.forEach((item, idx) => {
    if (idx === optionIdx) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });
  
  document.getElementById('submit-answer-btn').disabled = false;
}

// Global scope window triggers for inline html click options
window.selectQuizOption = selectQuizOption;

// SUBMIT ANSWER CHECK
document.getElementById('submit-answer-btn').addEventListener('click', () => {
  const qIndex = state.currentQuizIndex;
  const qData = state.activeQuiz[qIndex];
  const userChoice = state.quizAnswers[qIndex];
  
  if (userChoice === null) return;
  
  const isCorrect = userChoice === qData.answerIndex;
  
  const optionItems = document.querySelectorAll('#quiz-options-list .quiz-option-item');
  
  // Mark answer cards
  optionItems.forEach((item, idx) => {
    item.classList.remove('selected');
    if (idx === qData.answerIndex) {
      item.classList.add('correct');
    } else if (idx === userChoice) {
      item.classList.add('incorrect');
    }
  });
  
  // Feedback details
  const fbPanel = document.getElementById('quiz-feedback-panel');
  const fbTitle = document.getElementById('feedback-status-title');
  const fbExplanation = document.getElementById('feedback-explanation-text');
  
  if (isCorrect) {
    state.quizScore++;
    fbTitle.innerHTML = `<i data-lucide="check-circle-2" class="text-green"></i> <span>Correct Answer!</span>`;
    SoundFX.playSuccess();
    showToast('check', 'Correct!', 'success');
  } else {
    fbTitle.innerHTML = `<i data-lucide="x-circle" class="text-red"></i> <span>Incorrect Answer</span>`;
    SoundFX.playError();
    showToast('x', 'Incorrect answer selection.', 'warning');
  }
  fbExplanation.textContent = qData.explanation;
  fbPanel.classList.remove('hidden');
  
  // Adjust footer buttons
  document.getElementById('submit-answer-btn').classList.add('hidden');
  document.getElementById('next-question-btn').classList.remove('hidden');
  
  if (qIndex === state.activeQuiz.length - 1) {
    document.getElementById('next-question-btn').innerHTML = `View Evaluation <i data-lucide="award"></i>`;
  } else {
    document.getElementById('next-question-btn').innerHTML = `Next Question <i data-lucide="chevron-right"></i>`;
  }
  lucide.createIcons();
});

// NEXT QUESTION CLICK
document.getElementById('next-question-btn').addEventListener('click', () => {
  SoundFX.playClick();
  
  if (state.currentQuizIndex < state.activeQuiz.length - 1) {
    state.currentQuizIndex++;
    loadQuizQuestion(state.currentQuizIndex);
  } else {
    // End Quiz, show scorecard
    clearInterval(state.quizTimerInterval);
    renderQuizScorecard();
  }
});

// QUIT QUIZ TERMINATION
document.getElementById('quit-quiz-btn').addEventListener('click', () => {
  SoundFX.playClick();
  if (confirm("Are you sure you want to quit the current practice test? Your scores will not be logged.")) {
    clearInterval(state.quizTimerInterval);
    quizArenaPanel.classList.add('hidden');
    quizSetupPanel.classList.remove('hidden');
  }
});

// SCORECARD RENDERING
function renderQuizScorecard() {
  quizArenaPanel.classList.add('hidden');
  quizResultsPanel.classList.remove('hidden');
  
  const score = state.quizScore;
  const total = state.activeQuiz.length;
  const pct = Math.round((score / total) * 100);
  
  // Circle graphic (Circumference = 2 * PI * 75 = 471.2)
  const resultsCircle = document.getElementById('results-score-circle');
  const offset = 471.2 - (pct / 100) * 471.2;
  resultsCircle.style.strokeDashoffset = offset;
  
  document.getElementById('results-score-pct').textContent = `${pct}%`;
  document.getElementById('results-score-fraction').textContent = `${score} / ${total} Correct`;
  
  // Headline feedback
  const headline = document.getElementById('results-headline');
  const summaryText = document.getElementById('results-summary-text');
  
  if (pct === 100) {
    headline.textContent = "🏆 Perfect Score!";
    summaryText.textContent = `Brilliant! You mastered all ${total} concepts without error. Excellent cognitive pathing.`;
  } else if (pct >= 80) {
    headline.textContent = "⭐ Excellent Performance!";
    summaryText.textContent = `Outstanding work. You answered ${score} out of ${total} correctly. You're ready to teach this material!`;
  } else if (pct >= 50) {
    headline.textContent = "📚 Nice Effort!";
    summaryText.textContent = `Solid work. You scored ${score} out of ${total}. Review incorrect terms in flashcards to master the topic fully.`;
  } else {
    headline.textContent = "🔍 Needs Revision";
    summaryText.textContent = `You got ${score} of ${total} correct. Take active summaries of your notes again to rebuild memory blocks.`;
  }
  
  // Render questions review breakdown list
  const reviewList = document.getElementById('results-review-list');
  reviewList.innerHTML = state.activeQuiz.map((q, idx) => {
    const userChoice = state.quizAnswers[idx];
    const isCorrect = userChoice === q.answerIndex;
    const badgeClass = isCorrect ? 'success' : 'danger';
    const badgeText = isCorrect ? 'Correct' : 'Incorrect';
    
    return `
      <div class="review-question-card">
        <div class="review-card-header">
          <h4>Q${idx + 1}: ${q.question}</h4>
          <span class="badge-outline ${badgeClass}">${badgeText}</span>
        </div>
        <div class="review-answers-box">
          <div class="review-ans-item"><strong>Your Answer:</strong> ${userChoice !== null ? q.options[userChoice] : "None"}</div>
          <div class="review-ans-item"><strong>Correct Answer:</strong> ${q.options[q.answerIndex]}</div>
          <div class="review-ans-item" style="color:var(--text-muted); font-size:0.75rem; margin-top:4px;">
            <i>${q.explanation}</i>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  // Stats additions
  state.quizzesCount++;
  state.studyMinutes += state.quizTimeElapsed / 60; // Add quiz study time
  logActivity('quiz', `Completed practice test: scored ${pct}% (${score}/${total})`);
  updateDashboardStats();
  saveStateToStorage();
}

// Results Action events
document.getElementById('results-retry-btn').addEventListener('click', () => {
  SoundFX.playClick();
  quizResultsPanel.classList.add('hidden');
  quizSetupPanel.classList.remove('hidden');
  document.getElementById('generate-quiz-btn').click();
});

document.getElementById('results-flashcard-link-btn').addEventListener('click', () => {
  SoundFX.playClick();
  quizResultsPanel.classList.add('hidden');
  switchTab('flashcards');
});

document.getElementById('results-dashboard-btn').addEventListener('click', () => {
  SoundFX.playClick();
  quizResultsPanel.classList.add('hidden');
  quizSetupPanel.classList.remove('hidden');
  switchTab('dashboard');
});


// --- FLASHCARDS CORE LOGIC ---
const flashcardEmptyView = document.getElementById('flashcard-empty-view');
const flashcardStudyView = document.getElementById('flashcard-study-view');
const flashcardElement = document.getElementById('active-flashcard-element');

function syncFlashcardsUI() {
  const warn = document.getElementById('cards-notes-warning');
  const genBtn = document.getElementById('cards-generate-notes-btn');
  
  if (state.activeSummary) {
    warn.classList.add('hidden');
    genBtn.disabled = false;
  } else {
    warn.classList.remove('hidden');
    genBtn.disabled = true;
  }
  
  if (state.flashcardDeck.length === 0) {
    flashcardEmptyView.classList.remove('hidden');
    flashcardStudyView.classList.add('hidden');
  } else {
    flashcardEmptyView.classList.add('hidden');
    flashcardStudyView.classList.remove('hidden');
    loadActiveFlashcard(state.currentCardIndex);
  }
}

// Rotate Card interaction
document.getElementById('flashcard-scene-container').addEventListener('click', () => {
  SoundFX.playFlip();
  flashcardElement.classList.toggle('flipped');
});

function loadActiveFlashcard(index) {
  if (state.flashcardDeck.length === 0) return;
  if (index >= state.flashcardDeck.length) {
    index = 0;
    state.currentCardIndex = 0;
  }
  
  // Unflip first
  flashcardElement.classList.remove('flipped');
  
  const card = state.flashcardDeck[index];
  
  // Front details
  document.getElementById('card-index-indicator').textContent = `Card ${index + 1} of ${state.flashcardDeck.length}`;
  document.getElementById('card-front-text').textContent = card.front;
  
  // Back details
  document.getElementById('card-index-indicator-back').textContent = `Card ${index + 1} of ${state.flashcardDeck.length}`;
  document.getElementById('card-back-text').textContent = card.back;
  
  // Navigation counter
  document.getElementById('carousel-indicator-text').textContent = `${index + 1} / ${state.flashcardDeck.length} Cards`;
  
  // Evaluate style updates based on mastered state
  const practiceBtn = document.getElementById('btn-needs-practice');
  const gotItBtn = document.getElementById('btn-got-it');
  
  if (card.mastered) {
    gotItBtn.style.borderColor = 'var(--success)';
    gotItBtn.style.background = 'rgba(16, 185, 129, 0.1)';
    practiceBtn.style.borderColor = '';
    practiceBtn.style.background = '';
  } else {
    practiceBtn.style.borderColor = '';
    practiceBtn.style.background = '';
    gotItBtn.style.borderColor = '';
    gotItBtn.style.background = '';
  }
}

// Navigation arrows
document.getElementById('card-prev-btn').addEventListener('click', (e) => {
  e.stopPropagation(); // Stop flipping trigger
  SoundFX.playClick();
  if (state.flashcardDeck.length === 0) return;
  
  state.currentCardIndex--;
  if (state.currentCardIndex < 0) {
    state.currentCardIndex = state.flashcardDeck.length - 1;
  }
  loadActiveFlashcard(state.currentCardIndex);
});

document.getElementById('card-next-btn').addEventListener('click', (e) => {
  e.stopPropagation();
  SoundFX.playClick();
  if (state.flashcardDeck.length === 0) return;
  
  state.currentCardIndex++;
  if (state.currentCardIndex >= state.flashcardDeck.length) {
    state.currentCardIndex = 0;
  }
  loadActiveFlashcard(state.currentCardIndex);
});

// Review Evaluation triggers (Got it / Needs practice)
document.getElementById('btn-got-it').addEventListener('click', (e) => {
  e.stopPropagation();
  if (state.flashcardDeck.length === 0) return;
  
  SoundFX.playSuccess();
  const card = state.flashcardDeck[state.currentCardIndex];
  
  if (!card.mastered) {
    card.mastered = true;
    state.cardsMasteredCount++;
    logActivity('card-mastery', `Mastered flashcard: "${card.front.substring(0, 20)}..."`);
    showToast('check-circle', 'Card marked as mastered! Added to knowledge base.', 'success');
  } else {
    showToast('check-circle', 'Already mastered!', 'info');
  }
  
  // Transition forward
  setTimeout(() => {
    document.getElementById('card-next-btn').click();
    updateDashboardStats();
    saveStateToStorage();
  }, 300);
});

document.getElementById('btn-needs-practice').addEventListener('click', (e) => {
  e.stopPropagation();
  if (state.flashcardDeck.length === 0) return;
  
  SoundFX.playClick();
  const card = state.flashcardDeck[state.currentCardIndex];
  
  if (card.mastered) {
    card.mastered = false;
    state.cardsMasteredCount = Math.max(0, state.cardsMasteredCount - 1);
    logActivity('card', `Re-evaluating flashcard: "${card.front.substring(0, 20)}..."`);
    showToast('rotate-cw', 'Card returned to active study pile.', 'info');
  } else {
    showToast('help-circle', 'Keep practicing! Reviewing helps consolidate.', 'info');
  }
  
  setTimeout(() => {
    document.getElementById('card-next-btn').click();
    updateDashboardStats();
    saveStateToStorage();
  }, 300);
});

// Extraction from active summarizer outline
document.getElementById('cards-generate-notes-btn').addEventListener('click', () => {
  if (!state.activeSummary) return;
  
  SoundFX.playSuccess();
  const cards = state.activeSummary.flashcards.map((c, idx) => ({
    id: `fc_${Date.now()}_${idx}`,
    front: c.front,
    back: c.back,
    mastered: false
  }));
  
  state.flashcardDeck = [...cards];
  state.currentCardIndex = 0;
  
  logActivity('card', `Generated deck with ${cards.length} cards from study summary.`);
  showToast('layers', `Synthesized ${cards.length} flashcards from notes!`, 'success');
  
  syncFlashcardsUI();
  updateDashboardStats();
  saveStateToStorage();
});

// Manual flashcard inputs add
document.getElementById('manual-card-add-btn').addEventListener('click', () => {
  const frontInput = document.getElementById('manual-card-front');
  const backInput = document.getElementById('manual-card-back');
  
  const frontText = frontInput.value.trim();
  const backText = backInput.value.trim();
  
  if (!frontText || !backText) {
    SoundFX.playError();
    showToast('alert-triangle', 'Please fill in both sides of the flashcard.', 'warning');
    return;
  }
  
  SoundFX.playSuccess();
  const newCard = {
    id: `fc_${Date.now()}`,
    front: frontText,
    back: backText,
    mastered: false
  };
  
  state.flashcardDeck.push(newCard);
  
  frontInput.value = '';
  backInput.value = '';
  
  logActivity('card', `Manually added card: "${frontText.substring(0, 20)}..."`);
  showToast('plus', 'Custom flashcard added to deck!', 'success');
  
  syncFlashcardsUI();
  updateDashboardStats();
  saveStateToStorage();
});

// Load sample biology card decks
document.getElementById('load-sample-cards-btn').addEventListener('click', () => {
  SoundFX.playSuccess();
  const samples = TEXT_PRESETS.photosynthesis.summary.flashcards.map((c, idx) => ({
    id: `fc_sample_${Date.now()}_${idx}`,
    front: c.front,
    back: c.back,
    mastered: false
  }));
  
  state.flashcardDeck = samples;
  state.currentCardIndex = 0;
  
  showToast('layers', 'Loaded biology sample deck.', 'info');
  syncFlashcardsUI();
  updateDashboardStats();
  saveStateToStorage();
});

// Clear Deck
document.getElementById('clear-deck-btn').addEventListener('click', () => {
  SoundFX.playClick();
  if (confirm("Are you sure you want to empty the active flashcard deck? All custom cards will be lost.")) {
    state.flashcardDeck = [];
    state.currentCardIndex = 0;
    showToast('trash-2', 'Flashcard deck cleared.', 'info');
    syncFlashcardsUI();
    updateDashboardStats();
    saveStateToStorage();
  }
});


// --- INITIALIZATION ON DOCUMENT LOAD ---
window.addEventListener('DOMContentLoaded', () => {
  // Sync state
  loadStateFromStorage();
  updateDashboardStats();
  
  // Render default dashboard views
  switchTab('dashboard');
  
  // Load preset warning triggers
  syncQuizSourceUI();
  syncFlashcardsUI();
  
  // Clean initialization log if first time
  if (state.activityLog.length === 0) {
    logActivity('welcome', 'Registered your first day of EduGenie AI study!');
  }
  
  // Trigger Lucide icons replacing
  lucide.createIcons();
});
