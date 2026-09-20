const main = document.getElementById('main');
const toast = document.getElementById('toast');
const starCount = document.getElementById('starCount');

const objectAsset = file => `assets%20images%20objects/${file}`;
const shuffle = items => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

let stars = Number(localStorage.getItem('foxQuestStars') || 3);
let currentScreen = 'home';

const completionStorageKey = 'foxQuestCompletedGames';
const loadCompletedGames = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(completionStorageKey) || '{}');
    return saved && typeof saved === 'object' && !Array.isArray(saved) ? saved : {};
  } catch {
    return {};
  }
};
let completedGames = loadCompletedGames();

const markGameComplete = game => {
  if (completedGames[game]) return;
  completedGames = { ...completedGames, [game]: true };
  localStorage.setItem(completionStorageKey, JSON.stringify(completedGames));
};

const voiceFiles = {
  words: {
    pen: 'assets/audio/words/pen.mp3',
    pencil: 'assets/audio/words/pencil.mp3',
    book: 'assets/audio/words/book.mp3',
    bag: 'assets/audio/words/bag.mp3',
    ruler: 'assets/audio/words/ruler.mp3',
    rubber: 'assets/audio/words/rubber.mp3',
    notebook: 'assets/audio/words/notebook.mp3',
    crayon: 'assets/audio/words/crayon.mp3',
    scissors: 'assets/audio/words/scissors.mp3',
    sharpener: 'assets/audio/words/sharpener.mp3'
  },
  tapFind: {
    pen: 'assets/audio/tap-find/find-the-pen.mp3',
    pencil: 'assets/audio/tap-find/find-the-pencil.mp3',
    book: 'assets/audio/tap-find/find-the-book.mp3',
    bag: 'assets/audio/tap-find/find-the-bag.mp3',
    ruler: 'assets/audio/tap-find/find-the-ruler.mp3',
    rubber: 'assets/audio/tap-find/find-the-rubber.mp3',
    notebook: 'assets/audio/tap-find/find-the-notebook.mp3',
    crayon: 'assets/audio/tap-find/find-the-crayon.mp3',
    scissors: 'assets/audio/tap-find/find-the-scissors.mp3',
    sharpener: 'assets/audio/tap-find/find-the-sharpener.mp3'
  },
  colourMission: {
    pencilRed: 'assets/audio/colour-mission/paint-the-pencil-red.mp3',
    penBlue: 'assets/audio/colour-mission/paint-the-pen-blue.mp3',
    bookGreen: 'assets/audio/colour-mission/paint-the-book-green.mp3',
    rulerYellow: 'assets/audio/colour-mission/paint-the-ruler-yellow.mp3',
    rubberRed: 'assets/audio/colour-mission/paint-the-rubber-red.mp3',
    crayonBlue: 'assets/audio/colour-mission/paint-the-crayon-blue.mp3',
    bagGreen: 'assets/audio/colour-mission/paint-the-bag-green.mp3',
    notebookYellow: 'assets/audio/colour-mission/paint-the-notebook-yellow.mp3',
    scissorsRed: 'assets/audio/colour-mission/paint-the-scissors-red.mp3',
    sharpenerBlue: 'assets/audio/colour-mission/paint-the-sharpener-blue.mp3'
  },
  feedback: {
    greatJob: 'assets/audio/feedback/great-job.mp3',
    wellDone: 'assets/audio/feedback/well-done.mp3',
    tryAgain: 'assets/audio/feedback/try-again.mp3',
    youDidIt: 'assets/audio/feedback/you-did-it.mp3',
    missionComplete: 'assets/audio/feedback/mission-complete.mp3',
    newBest: 'assets/audio/feedback/new-best.mp3'
  }
};

const paintColours = ['red', 'blue', 'yellow', 'green'];
const colourItems = [
  { id: 'pencil', word: 'PENCIL', image: 'pencil.png', correctColor: 'red', voiceFile: voiceFiles.colourMission.pencilRed },
  { id: 'pen', word: 'PEN', image: 'pen.png', correctColor: 'blue', voiceFile: voiceFiles.colourMission.penBlue },
  { id: 'book', word: 'BOOK', image: 'book.png', correctColor: 'green', voiceFile: voiceFiles.colourMission.bookGreen },
  { id: 'ruler', word: 'RULER', image: 'ruler.png', correctColor: 'yellow', voiceFile: voiceFiles.colourMission.rulerYellow },
  { id: 'rubber', word: 'RUBBER', image: 'rubber.png', correctColor: 'red', voiceFile: voiceFiles.colourMission.rubberRed },
  { id: 'crayon', word: 'CRAYON', image: 'crayon.png', correctColor: 'blue', voiceFile: voiceFiles.colourMission.crayonBlue },
  { id: 'bag', word: 'BAG', image: 'bag.png', correctColor: 'green', voiceFile: voiceFiles.colourMission.bagGreen },
  { id: 'notebook', word: 'NOTEBOOK', image: 'notebook.png', correctColor: 'yellow', voiceFile: voiceFiles.colourMission.notebookYellow },
  { id: 'scissors', word: 'SCISSORS', image: 'scissors.png', correctColor: 'red', voiceFile: voiceFiles.colourMission.scissorsRed },
  { id: 'sharpener', word: 'SHARPENER', image: 'sharpener.png', correctColor: 'blue', voiceFile: voiceFiles.colourMission.sharpenerBlue }
];
const currentColourItem = () => colourItems[colourRound];
let colourRound = 0;
let selectedPaint = '';
let colourSolved = false;
let colourFeedback = '';
let colourMissionComplete = false;
let colourAnnouncedRound = -1;

const wordRounds = [
  { word: 'PEN', image: 'pen.png' }, { word: 'BAG', image: 'bag.png' },
  { word: 'BOOK', image: 'book.png' }, { word: 'PENCIL', image: 'pencil.png' },
  { word: 'RULER', image: 'ruler.png' }, { word: 'RUBBER', image: 'rubber.png' },
  { word: 'CRAYON', image: 'crayon.png' }, { word: 'NOTEBOOK', image: 'notebook.png' },
  { word: 'SCISSORS', image: 'scissors.png' }, { word: 'SHARPENER', image: 'sharpener.png' }
];
let wordRound = 0;
let wordLetters = [];
let wordBank = [];
let usedLetterIds = [];
let wordCompleted = false;
let wordMissionComplete = false;
let wordHintVisible = true;
let wordHintTimer = null;
let wordAnnouncedRound = -1;

const findRounds = [
  { target: 'PEN', choices: ['PEN', 'RULER', 'BOOK'] },
  { target: 'PENCIL', choices: ['PENCIL', 'BAG', 'CRAYON'] },
  { target: 'BOOK', choices: ['BOOK', 'BAG', 'PEN'] },
  { target: 'RULER', choices: ['RULER', 'RUBBER', 'PENCIL'] },
  { target: 'RUBBER', choices: ['RUBBER', 'SHARPENER', 'BOOK'] },
  { target: 'CRAYON', choices: ['CRAYON', 'PENCIL', 'SCISSORS'] },
  { target: 'SCISSORS', choices: ['SCISSORS', 'RULER', 'NOTEBOOK'] },
  { target: 'SHARPENER', choices: ['SHARPENER', 'RUBBER', 'BAG'] },
  { target: 'NOTEBOOK', choices: ['NOTEBOOK', 'BOOK', 'PEN'] },
  { target: 'BAG', choices: ['BAG', 'NOTEBOOK', 'RULER'] }
];
let findRound = 0;
let findOptions = [];
let findSolved = false;
let findFeedback = '';
let findAnnouncedRound = -1;
let findMissionComplete = false;

const pairSets = [
  ['BOOK', 'BAG', 'PENCIL', 'RULER'],
  ['PEN', 'RUBBER', 'CRAYON', 'NOTEBOOK'],
  ['SCISSORS', 'SHARPENER']
];
let pairSet = 0;
let pairCards = [];
let pairFirst = null;
let pairFlipped = [];
let pairMatched = [];
let pairBusy = false;
let announcementToken = 0;

const successMessages = ['Great!', 'Super!', 'Well done!'];

const gameModeConfig = {
  word: { title: 'Build a Word', bestKey: 'bestTime_buildWord', next: 'colour' },
  colour: { title: 'Colour Mission', bestKey: 'bestTime_colourMission', next: 'find' },
  find: { title: 'Tap & Find', bestKey: 'bestTime_tapFind', next: 'pairs' },
  pairs: { title: 'Match Pairs', bestKey: 'bestTime_matchPairs', next: 'backpack' }
};
let activeGameMode = null;
const timeChallenge = {
  game: null,
  phase: 'idle',
  startedAt: 0,
  elapsedMs: 0,
  intervalId: null,
  countdownId: null,
  result: null
};

const musicController = (() => {
  const normalVolume = 0.27;
  const duckedVolume = 0.07;
  const sourceCandidates = [
    'assets/audio/background-music.mp3',
    'assets/audio/audio.mp3',
    'assets%20audio%20background-music.mp3/audio.mp3'
  ];
  let enabled = localStorage.getItem('foxQuestMusicEnabled') !== 'false';
  let audio = null;
  let sourcePromise = null;
  let volumeRampTimer = null;

  const updateButton = () => {
    const button = document.getElementById('musicToggle');
    if (!button) return;
    button.innerHTML = `<span aria-hidden="true">♪</span> MUSIC ${enabled ? 'ON' : 'OFF'}`;
    button.setAttribute('aria-pressed', String(enabled));
    button.classList.toggle('is-off', !enabled);
  };

  const findSource = async () => {
    for (const source of sourceCandidates) {
      try {
        const response = await fetch(source, { method: 'HEAD', cache: 'no-store' });
        if (response.ok) return source;
      } catch {
        // A missing optional track should never interrupt a game.
      }
    }
    return '';
  };

  const prepare = () => {
    if (sourcePromise) return sourcePromise;
    sourcePromise = findSource().then(source => {
      if (!source) return null;
      audio = new Audio(source);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = normalVolume;
      return audio;
    });
    return sourcePromise;
  };

  const play = async () => {
    if (!enabled) return;
    const track = await prepare();
    if (!track || !enabled) return;
    track.volume = normalVolume;
    try {
      await track.play();
    } catch {
      // Browsers may wait for the next user gesture before allowing playback.
    }
  };

  const pause = () => {
    clearInterval(volumeRampTimer);
    if (audio) audio.pause();
  };

  const rampVolume = target => {
    clearInterval(volumeRampTimer);
    if (!audio) return;
    const steps = 10;
    const change = (target - audio.volume) / steps;
    let step = 0;
    volumeRampTimer = setInterval(() => {
      step += 1;
      audio.volume = Math.max(0, Math.min(1, step === steps ? target : audio.volume + change));
      if (step === steps) clearInterval(volumeRampTimer);
    }, 30);
  };

  const duck = shouldDuck => {
    document.documentElement.dataset.musicDucked = String(shouldDuck);
    rampVolume(shouldDuck ? duckedVolume : normalVolume);
  };

  const toggle = () => {
    enabled = !enabled;
    localStorage.setItem('foxQuestMusicEnabled', String(enabled));
    updateButton();
    if (!enabled) pause();
    else if (gameModeConfig[currentScreen] && activeGameMode) play();
  };

  prepare();
  updateButton();
  return { play, pause, duck, toggle, updateButton };
})();

let soundEnabled = localStorage.getItem('foxQuestSoundEnabled') !== 'false';
const updateSoundButton = () => {
  const button = document.getElementById('soundToggle');
  if (!button) return;
  button.textContent = `SOUND ${soundEnabled ? 'ON' : 'OFF'}`;
  button.setAttribute('aria-pressed', String(soundEnabled));
  button.classList.toggle('is-off', !soundEnabled);
};

const speakFallback = text => new Promise(resolve => {
  if (!soundEnabled || !text || !('speechSynthesis' in window)) {
    musicController.duck(false);
    resolve();
    return;
  }
  speechSynthesis.cancel();
  musicController.duck(true);
  const utterance = new SpeechSynthesisUtterance(text.toLowerCase());
  utterance.lang = 'en-GB';
  utterance.rate = 0.82;
  utterance.onend = () => { musicController.duck(false); resolve(); };
  utterance.onerror = () => { musicController.duck(false); resolve(); };
  speechSynthesis.speak(utterance);
});

const voiceController = (() => {
  const audio = new Audio();
  audio.preload = 'auto';
  const availability = new Map();
  const warnedMissing = new Set();
  let requestId = 0;
  let releaseCurrent = null;

  const cancelCurrent = (restoreMusic = true) => {
    audio.pause();
    audio.currentTime = 0;
    audio.onended = null;
    audio.onerror = null;
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (releaseCurrent) releaseCurrent('cancelled');
    releaseCurrent = null;
    if (restoreMusic) musicController.duck(false);
  };

  const fileExists = file => {
    if (!availability.has(file)) {
      availability.set(file, fetch(file, { method: 'HEAD', cache: 'no-store' })
        .then(response => response.ok)
        .catch(() => false));
    }
    return availability.get(file);
  };

  const playEntry = async (entry, token) => {
    if (!entry || token !== requestId || !soundEnabled) return;
    const exists = await fileExists(entry.file);
    if (token !== requestId || !soundEnabled) return;
    if (!exists) {
      document.documentElement.dataset.voiceMode = 'fallback';
      document.documentElement.dataset.voiceSource = entry.file;
      if (!warnedMissing.has(entry.file)) {
        warnedMissing.add(entry.file);
        console.warn(`[Fox School Quest] Voice file missing; using browser fallback: ${entry.file}`);
      }
      await speakFallback(entry.fallback);
      return;
    }
    musicController.duck(true);
    document.documentElement.dataset.voiceMode = 'mp3';
    document.documentElement.dataset.voiceSource = entry.file;
    audio.src = entry.file;
    audio.currentTime = 0;
    const outcome = await new Promise(resolve => {
      releaseCurrent = resolve;
      audio.onended = () => resolve('ended');
      audio.onerror = () => resolve('error');
      audio.play().catch(() => resolve('blocked'));
    });
    releaseCurrent = null;
    audio.onended = null;
    audio.onerror = null;
    if (token !== requestId) return;
    if (outcome === 'error') {
      console.warn(`[Fox School Quest] Voice file could not be played; using browser fallback: ${entry.file}`);
      await speakFallback(entry.fallback);
      return;
    }
    musicController.duck(false);
  };

  const playSequence = async entries => {
    if (!soundEnabled || !entries?.length) return;
    requestId += 1;
    const token = requestId;
    cancelCurrent(false);
    for (const entry of entries) {
      if (token !== requestId || !soundEnabled) break;
      await playEntry(entry, token);
    }
    if (token === requestId) musicController.duck(false);
  };

  const stop = () => {
    requestId += 1;
    cancelCurrent(true);
    document.documentElement.dataset.voiceMode = 'idle';
    document.documentElement.dataset.voiceSource = '';
  };

  return { play: entry => playSequence([entry]), playSequence, stop };
})();

const wordVoice = word => ({ file: voiceFiles.words[word.toLowerCase()], fallback: word });
const findVoice = word => ({ file: voiceFiles.tapFind[word.toLowerCase()], fallback: `Find the ${word}` });
const colourVoice = item => ({ file: item.voiceFile, fallback: `Paint the ${item.word} ${item.correctColor}` });
const feedbackVoice = key => {
  const fallback = {
    greatJob: 'Great job', wellDone: 'Well done', tryAgain: 'Try again',
    youDidIt: 'You did it', missionComplete: 'Mission complete', newBest: 'New best'
  }[key];
  return { file: voiceFiles.feedback[key], fallback };
};
const cancelPendingAnnouncement = () => { announcementToken += 1; };
const playWord = word => voiceController.play(wordVoice(word));
const playFindInstruction = word => voiceController.play(findVoice(word));
const playColourInstruction = item => voiceController.play(colourVoice(item));
const playPositiveFeedback = () => { cancelPendingAnnouncement(); voiceController.play(feedbackVoice(Math.random() < .5 ? 'greatJob' : 'wellDone')); };
const playRetryFeedback = () => { cancelPendingAnnouncement(); voiceController.play(feedbackVoice('tryAgain')); };
const completionVoice = () => feedbackVoice(timeChallenge.result?.isNewBest ? 'newBest' : 'missionComplete');
const playCompletionFeedback = () => { cancelPendingAnnouncement(); voiceController.play(completionVoice()); };

const clearWordHintCycle = () => {
  clearTimeout(wordHintTimer);
  wordHintTimer = null;
};

const applyWordHintVisibility = () => {
  const target = document.querySelector('.word-game .target-word');
  if (!target) return;
  target.classList.toggle('is-hidden', !wordHintVisible && !wordCompleted);
};

const scheduleWordHintToggle = () => {
  clearWordHintCycle();
  cancelPendingAnnouncement();
  if (currentScreen !== 'word' || !activeGameMode || wordCompleted || wordMissionComplete) return;
  wordHintTimer = setTimeout(() => {
    if (currentScreen !== 'word' || !activeGameMode || wordCompleted || wordMissionComplete) return;
    wordHintVisible = !wordHintVisible;
    applyWordHintVisibility();
    scheduleWordHintToggle();
  }, 5000);
};

const startWordHintCycle = () => {
  wordHintVisible = true;
  applyWordHintVisibility();
  scheduleWordHintToggle();
};

const formatTime = milliseconds => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
};

const getBestTime = game => Number(localStorage.getItem(gameModeConfig[game].bestKey) || 0);
const currentElapsedTime = () => timeChallenge.phase === 'running'
  ? timeChallenge.elapsedMs + performance.now() - timeChallenge.startedAt
  : timeChallenge.elapsedMs;

const clearChallengeTimers = () => {
  clearInterval(timeChallenge.intervalId);
  clearTimeout(timeChallenge.countdownId);
  timeChallenge.intervalId = null;
  timeChallenge.countdownId = null;
};

const removeCountdown = () => {
  document.querySelector('.challenge-countdown')?.remove();
  document.body.classList.remove('challenge-countdown-active');
};

const leaveGameMode = () => {
  clearChallengeTimers();
  clearWordHintCycle();
  wordHintVisible = true;
  voiceController.stop();
  musicController.pause();
  removeCountdown();
  timeChallenge.game = null;
  timeChallenge.phase = 'idle';
  timeChallenge.startedAt = 0;
  timeChallenge.elapsedMs = 0;
  timeChallenge.result = null;
  activeGameMode = null;
};

const updateTimerDisplay = () => {
  const timer = document.getElementById('challengeTimer');
  if (timer) timer.textContent = formatTime(currentElapsedTime());
};

const challengeTimerPanel = game => {
  if (activeGameMode !== 'timed') return '';
  const best = getBestTime(game);
  return `<div class="challenge-timer-panel" aria-label="Time challenge timer">
    <span class="challenge-timer-label"><span aria-hidden="true">◷</span> BEAT YOUR BEST!</span>
    <strong id="challengeTimer">${formatTime(currentElapsedTime())}</strong>
    <small>${best ? `Best: ${formatTime(best)}` : 'Set your first record!'}</small>
  </div>`;
};

const showCountdownStep = value => {
  let overlay = document.querySelector('.challenge-countdown');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'challenge-countdown';
    overlay.setAttribute('role', 'status');
    overlay.setAttribute('aria-live', 'assertive');
    overlay.innerHTML = '<div><span></span><small>Ready for your quest?</small></div>';
    document.body.appendChild(overlay);
  }
  overlay.querySelector('span').textContent = value;
  overlay.classList.toggle('is-go', value === 'GO!');
};

const startChallengeClock = game => {
  if (timeChallenge.game !== game || activeGameMode !== 'timed') return;
  removeCountdown();
  timeChallenge.phase = 'running';
  timeChallenge.startedAt = performance.now();
  timeChallenge.elapsedMs = 0;
  updateTimerDisplay();
  timeChallenge.intervalId = setInterval(updateTimerDisplay, 250);
  if (game === 'word') { startWordHintCycle(); announceWordRound(); }
  if (game === 'colour') announceColourRound();
  if (game === 'find') announceFindRound();
};

const startChallengeCountdown = game => {
  clearChallengeTimers();
  removeCountdown();
  timeChallenge.game = game;
  timeChallenge.phase = 'countdown';
  timeChallenge.startedAt = 0;
  timeChallenge.elapsedMs = 0;
  timeChallenge.result = null;
  document.body.classList.add('challenge-countdown-active');
  render();
  const steps = ['3', '2', '1', 'GO!'];
  let step = 0;
  const advance = () => {
    if (timeChallenge.game !== game || timeChallenge.phase !== 'countdown') return;
    showCountdownStep(steps[step]);
    step += 1;
    if (step < steps.length) timeChallenge.countdownId = setTimeout(advance, 650);
    else timeChallenge.countdownId = setTimeout(() => startChallengeClock(game), 650);
  };
  advance();
};

const finishChallenge = game => {
  if (activeGameMode !== 'timed' || timeChallenge.game !== game || timeChallenge.phase !== 'running') return;
  timeChallenge.elapsedMs = Math.max(1, Math.round(currentElapsedTime()));
  clearChallengeTimers();
  timeChallenge.phase = 'stopped';
  const previousBest = getBestTime(game);
  const isFirstRecord = !previousBest;
  const isNewBest = isFirstRecord || timeChallenge.elapsedMs < previousBest;
  const bestTime = isNewBest ? timeChallenge.elapsedMs : previousBest;
  if (isNewBest) localStorage.setItem(gameModeConfig[game].bestKey, String(bestTime));
  timeChallenge.result = { elapsedMs: timeChallenge.elapsedMs, bestTime, previousBest, isFirstRecord, isNewBest };
};

const addStar = () => {
  stars += 1;
  localStorage.setItem('foxQuestStars', stars);
  starCount.textContent = stars;
  sparkle();
};

const sparkle = () => {
  for (let index = 0; index < 4; index += 1) {
    const element = document.createElement('span');
    element.className = 'sparkle';
    element.textContent = '✦';
    element.style.left = `${42 + Math.random() * 18}%`;
    element.style.top = `${30 + Math.random() * 25}%`;
    document.body.appendChild(element);
    setTimeout(() => element.remove(), 700);
  }
};

let toastTimer;
const notify = message => {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
};

const screenHead = (title, text, voice, buttonLabel = 'SAY IT') => `
  <div class="screen-head">
    <div><p class="kicker">FOX SCHOOL QUEST</p><h1>${title}</h1><p>${text}</p></div>
    ${voice ? `<button class="sound-btn" data-voice-type="${voice.type}" data-voice-key="${voice.key}" aria-label="${voice.label || `Hear ${voice.key}`}">${buttonLabel}</button>` : ''}
  </div>`;

const completionPanel = ({ message, replayId, nextScreen }) => {
  const result = activeGameMode === 'timed' ? timeChallenge.result : null;
  if (result) {
    const resultTitle = result.isFirstRecord ? 'FIRST RECORD!' : result.isNewBest ? 'NEW BEST!' : 'GREAT JOB!';
    const resultMessage = result.isNewBest
      ? 'You set a wonderful new personal best!'
      : 'You finished the mission. Try again whenever you want!';
    return `<div class="mission-complete game-mission-complete challenge-result${result.isNewBest ? ' is-new-best' : ''}" aria-live="polite">
      <img class="completion-fox" src="assets%20images%20fox/Fox-happy.jpg" alt="Happy fox mascot">
      <div class="completion-copy">
        <small>MISSION COMPLETE!</small>
        <p>${resultTitle}</p>
        <span>${resultMessage}</span>
        <div class="challenge-times"><span>YOUR TIME <strong>${formatTime(result.elapsedMs)}</strong></span><span>BEST TIME <strong>${formatTime(result.bestTime)}</strong></span></div>
      </div>
      <div class="complete-actions">
        <button class="primary-btn next-btn" id="${replayId}">TRY AGAIN</button>
        <button class="secondary-btn" data-screen="${nextScreen}">NEXT</button>
        <button class="secondary-btn" data-screen="home">HOME</button>
      </div>
    </div>`;
  }
  return `<div class="mission-complete game-mission-complete" aria-live="polite">
      <img class="completion-fox" src="assets%20images%20fox/Fox-happy.jpg" alt="Happy fox mascot">
      <div class="completion-copy">
        <p>MISSION COMPLETE!</p>
        <span>${message}</span>
      </div>
      <div class="complete-actions">
        <button class="primary-btn next-btn" id="${replayId}">PLAY AGAIN</button>
        <button class="secondary-btn" data-screen="${nextScreen}">NEXT</button>
        <button class="secondary-btn" data-screen="home">HOME</button>
      </div>
    </div>`;
};

const setScreen = screen => {
  leaveGameMode();
  currentScreen = screen;
  document.querySelectorAll('[data-screen]').forEach(button => button.classList.toggle('active', button.dataset.screen === screen));
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const currentWordRound = () => wordRounds[wordRound % wordRounds.length];
const currentFindRound = () => findRounds[findRound % findRounds.length];

const resetWordRound = () => {
  const word = currentWordRound().word;
  wordLetters = [];
  usedLetterIds = [];
  wordCompleted = false;
  wordHintVisible = true;
  wordBank = shuffle([...word].map((letter, index) => ({ letter, id: `${wordRound}-${index}` })));
};

const resetFindRound = () => {
  findOptions = shuffle(currentFindRound().choices);
  findSolved = false;
  findFeedback = '';
};

const resetPairSet = () => {
  pairCards = shuffle(pairSets[pairSet].flatMap(word => [
    { key: `${word}-picture`, word, type: 'picture' },
    { key: `${word}-word`, word, type: 'word' }
  ]));
  pairFirst = null;
  pairFlipped = [];
  pairMatched = [];
  pairBusy = false;
};

const resetMission = game => {
  if (game === 'word') {
    wordRound = 0;
    wordAnnouncedRound = -1;
    wordMissionComplete = false;
    resetWordRound();
  }
  if (game === 'colour') {
    colourRound = 0;
    colourAnnouncedRound = -1;
    selectedPaint = '';
    colourSolved = false;
    colourFeedback = '';
    colourMissionComplete = false;
  }
  if (game === 'find') {
    findRound = 0;
    findAnnouncedRound = -1;
    findMissionComplete = false;
    resetFindRound();
  }
  if (game === 'pairs') {
    pairSet = 0;
    resetPairSet();
  }
};

const startGameMode = (game, mode) => {
  if (!gameModeConfig[game] || !['normal', 'timed'].includes(mode)) return;
  clearChallengeTimers();
  removeCountdown();
  activeGameMode = mode;
  resetMission(game);
  musicController.play();
  if (mode === 'timed') startChallengeCountdown(game);
  else {
    timeChallenge.game = null;
    timeChallenge.phase = 'idle';
    timeChallenge.result = null;
    render();
    if (game === 'word') { startWordHintCycle(); announceWordRound(); }
    if (game === 'colour') announceColourRound();
    if (game === 'find') announceFindRound();
  }
};

const restartCurrentGame = game => startGameMode(game, activeGameMode || 'normal');

const renderModeChoice = game => {
  const config = gameModeConfig[game];
  const best = getBestTime(game);
  main.innerHTML = `<div class="game-board mode-choice-screen">
    ${screenHead(config.title, 'Choose how you would like to play.', '')}
    <div class="mode-choice-panel">
      <div class="mode-choice-intro"><img src="assets%20images%20fox/Fox-happy.jpg" alt="Smiling fox"><div><h2>Ready for a mission?</h2><p>Play calmly, or try to beat your own best time.</p></div></div>
      <div class="mode-choice-grid">
        <button class="mode-choice normal-mode" data-game="${game}" data-game-mode="normal"><span class="mode-icon" aria-hidden="true">★</span><strong>NORMAL MODE</strong><small>Play with no timer</small><em>PLAY</em></button>
        <button class="mode-choice timed-mode" data-game="${game}" data-game-mode="timed"><span class="mode-icon" aria-hidden="true">◷</span><strong>BEAT YOUR BEST!</strong><small>${best ? `Best: ${formatTime(best)}` : 'Set your first record!'}</small><em>TIME CHALLENGE</em></button>
      </div>
    </div>
  </div>`;
};

function render() {
  document.body.classList.toggle('is-home', currentScreen === 'home');
  if (currentScreen === 'home') renderHome();
  if (gameModeConfig[currentScreen] && !activeGameMode) renderModeChoice(currentScreen);
  else if (currentScreen === 'word') renderWord();
  else if (currentScreen === 'colour') renderColour();
  else if (currentScreen === 'find') renderFind();
  else if (currentScreen === 'pairs') renderPairs();
  if (currentScreen === 'backpack') renderBackpack();
}

const bestTimeLine = game => {
  const best = getBestTime(game);
  return best ? `<span class="card-best-time">Best: ${formatTime(best)}</span>` : '';
};

function renderHome() {
  main.innerHTML = `<section class="welcome"><video class="home-hero-video" autoplay muted loop playsinline preload="metadata" poster="asset%20images%20scenes/home-scene.jpg" aria-hidden="true"><source src="assets/video/home-hero.mp4" type="video/mp4"></video></section>
    <div class="home-scene-caption"><strong>Explore, play and learn!</strong></div>
    <div class="quest-grid">
      <button class="quest-card card-word" data-screen="word"><span class="card-copy"><span class="small-number">LEVEL 01</span><span class="card-title-row"><h3>Build a Word</h3><span class="play-label">PLAY</span></span><p>Put the letters in order.</p>${bestTimeLine('word')}</span></button>
      <button class="quest-card card-colour" data-screen="colour"><span class="card-copy"><span class="small-number">LEVEL 02</span><span class="card-title-row"><h3>Colour Mission</h3><span class="play-label">PLAY</span></span><p>Paint the right colour.</p>${bestTimeLine('colour')}</span></button>
      <button class="quest-card card-find" data-screen="find"><span class="card-copy"><span class="small-number">LEVEL 03</span><span class="card-title-row"><h3>Tap &amp; Find</h3><span class="play-label">PLAY</span></span><p>Find what you hear.</p>${bestTimeLine('find')}</span></button>
      <button class="quest-card card-pairs" data-screen="pairs"><span class="card-copy"><span class="small-number">LEVEL 04</span><span class="card-title-row"><h3>Match Pairs</h3><span class="play-label">PLAY</span></span><p>Find the word twins.</p>${bestTimeLine('pairs')}</span></button>
    </div>
    <div class="home-lower"><div class="progress-panel"><div class="progress-label"><span>Quest progress</span><span>${Math.min(stars, 9)} stars collected</span></div><div class="progress-track"><span style="width:${Math.min(stars * 10 + 12, 100)}%"></span></div></div><button class="reward-panel" data-screen="backpack"><h3>My Backpack</h3><p>See your game rewards →</p></button></div>`;
}

function renderWord() {
  if (wordMissionComplete) {
    clearWordHintCycle();
    main.innerHTML = `<div class="game-board word-game">${screenHead('Build a Word', 'All ten words built — brilliant work!', '')}${completionPanel({ message: 'You built every vocabulary word and earned your reward.', replayId: 'wordPlayAgain', nextScreen: 'colour' })}</div>`;
    return;
  }
  const round = currentWordRound();
  if (!wordBank.length) resetWordRound();
  const reveal = wordCompleted ? 100 : (wordLetters.length / round.word.length) * 100;
  main.innerHTML = `
    <div class="game-board word-game">
      ${screenHead('Build a Word', 'Tap the letters in the right order.', { type: 'word', key: round.word, label: `Hear ${round.word}` }, 'HEAR WORD')}
      ${challengeTimerPanel('word')}
      <div class="word-layout${wordCompleted ? ' completed' : ''}${round.word.length > 7 ? ' long-word' : ''}">
        <div class="word-prompt-line"><span class="word-prompt-label">MAKE THIS WORD:</span><strong class="target-word${!wordHintVisible && !wordCompleted ? ' is-hidden' : ''}${wordCompleted ? ' is-completed' : ''}">${round.word}</strong></div>
        <div class="object-reveal" style="--reveal-progress:${reveal}%">
          <img src="${objectAsset(round.image)}" alt="${round.word}"><span class="reveal-cover" aria-hidden="true"></span>
        </div>
        <div class="letter-row${wordCompleted ? ' word-complete' : ''}" id="chosenLetters" aria-label="Your word">
          ${wordLetters.map(letter => `<span class="tile chosen">${letter}</span>`).join('')}
          ${Array.from({ length: round.word.length - wordLetters.length }, () => '<span class="tile empty" aria-hidden="true"></span>').join('')}
        </div>
        <div class="letter-bank" aria-label="Letter choices">
          ${wordBank.map(item => `<button class="tile bank${usedLetterIds.includes(item.id) ? ' used' : ''}" data-letter-id="${item.id}" ${usedLetterIds.includes(item.id) || wordCompleted ? 'disabled' : ''}>${item.letter}</button>`).join('')}
        </div>
        <div class="game-feedback success" aria-live="polite">${wordCompleted ? successMessages[wordRound % successMessages.length] : '&nbsp;'}</div>
        <div class="word-actions">${wordCompleted ? '<button class="primary-btn next-btn" id="wordNext">NEXT</button>' : ''}<button class="secondary-btn" id="wordReset">START AGAIN</button></div>
      </div>
    </div>`;
}

function renderColour() {
  if (colourMissionComplete) {
    main.innerHTML = `<div class="game-board colour-game">${screenHead('Colour Mission', 'Pick the right paint and colour the object.', '')}${completionPanel({ message: `You coloured all ${colourItems.length} school objects perfectly.`, replayId: 'colourPlayAgain', nextScreen: 'find' })}</div>`;
    return;
  }
  const item = currentColourItem();
  main.innerHTML = `
    <div class="game-board colour-game" data-colour-item="${item.id}" data-correct-colour="${item.correctColor}">
      ${screenHead('Colour Mission', 'Pick the right paint and colour the object.', { type: 'colour', key: item.id, label: `Hear the ${item.word} instruction again` }, 'HEAR AGAIN')}
      ${challengeTimerPanel('colour')}
      <div class="colour-round-label">TASK ${colourRound + 1} OF ${colourItems.length}</div>
      <div class="colour-instruction">Paint the <strong class="colour-target-word">${item.correctColor.toUpperCase()}</strong> <span class="colour-object-word">${item.word}</span>.</div>
      <div class="colour-board">
        <div class="colour-object-card${colourSolved ? ` is-solved target-${item.correctColor}` : ''}">
          <div class="colour-object-stage">
            <canvas class="colour-object-image object-${item.id}" data-object-src="${objectAsset(item.image)}" data-object-colour="${colourSolved ? item.correctColor : ''}" role="img" aria-label="${item.word}"></canvas>
          </div>
          <span>${item.word}</span>
        </div>
        <div class="colour-controls">
          <h2>Pick a paint colour</h2>
          <div class="paint-grid" aria-label="Paint colours">
            ${paintColours.map(colour => `<button class="paint-choice paint-${colour}${selectedPaint === colour ? ' selected' : ''}${colourSolved && colour === item.correctColor ? ' correct' : ''}" data-paint="${colour}" aria-label="${colour} paint" ${colourSolved ? 'disabled' : ''}><span class="paint-blob" aria-hidden="true"></span></button>`).join('')}
          </div>
          <div class="colour-feedback${colourSolved ? ' success' : colourFeedback ? ' retry' : ''}" aria-live="polite">
            ${colourSolved ? '<img src="assets%20images%20fox/Fox-happy.jpg" alt=""><strong>Great!</strong><span aria-hidden="true">✓</span>' : colourFeedback || '&nbsp;'}
          </div>
          <button class="primary-btn colour-next" id="colourNext" ${colourSolved ? '' : 'disabled'}>NEXT</button>
        </div>
      </div>
    </div>`;
  drawColourObject(document.querySelector('.colour-object-image'));
}

const colourRgb = {
  red: [237, 103, 92],
  blue: [77, 155, 221],
  yellow: [244, 200, 76],
  green: [85, 185, 124]
};

function drawColourObject(canvas) {
  if (!canvas) return;
  const image = new Image();
  image.decoding = 'async';
  image.onload = () => {
    if (!canvas.isConnected) return;
    const size = 720;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.clearRect(0, 0, size, size);
    context.drawImage(image, 0, 0, size, size);
    const pixels = context.getImageData(0, 0, size, size);
    const data = pixels.data;
    const tint = colourRgb[canvas.dataset.objectColour];
    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const distanceFromWhite = Math.sqrt((255 - red) ** 2 + (255 - green) ** 2 + (255 - blue) ** 2);
      if (distanceFromWhite < 12) {
        data[index + 3] = 0;
        continue;
      }
      if (distanceFromWhite < 48) {
        data[index + 3] = Math.round(data[index + 3] * ((distanceFromWhite - 12) / 36));
      }
      const luminance = (red * .2126) + (green * .7152) + (blue * .0722);
      if (tint) {
        const shade = .34 + (luminance / 255) * .78;
        data[index] = Math.min(255, Math.round(tint[0] * shade));
        data[index + 1] = Math.min(255, Math.round(tint[1] * shade));
        data[index + 2] = Math.min(255, Math.round(tint[2] * shade));
      } else {
        const grey = Math.round(luminance);
        data[index] = grey;
        data[index + 1] = grey;
        data[index + 2] = grey;
      }
    }
    context.putImageData(pixels, 0, 0);
  };
  image.src = canvas.dataset.objectSrc;
}

function renderFind() {
  if (findMissionComplete) {
    main.innerHTML = `<div class="game-board find-game">${screenHead('Tap & Find', 'All ten picture rounds complete — fantastic!', '')}${completionPanel({ message: 'You found every school object in this mission.', replayId: 'findPlayAgain', nextScreen: 'pairs' })}</div>`;
    return;
  }
  const round = currentFindRound();
  if (!findOptions.length) resetFindRound();
  main.innerHTML = `
    <div class="game-board find-game">
      ${screenHead('Tap & Find', 'Listen, look, and choose the picture.', { type: 'find', key: round.target, label: `Hear the ${round.target} instruction again` }, 'HEAR IT AGAIN')}
      ${challengeTimerPanel('find')}
      <div class="find-panel">
        <div class="find-round-label">ROUND ${findRound + 1} OF ${findRounds.length}</div>
        <div class="find-instruction">Find the <strong>${round.target}</strong></div>
        <div class="object-grid" aria-label="Picture choices">
          ${findOptions.map(word => `<button class="object-card${findSolved && word === round.target ? ' correct' : ''}" data-find-choice="${word}" aria-label="Picture option"><img src="${objectAsset(`${word.toLowerCase()}.png`)}" alt=""></button>`).join('')}
        </div>
        <div class="game-feedback find-feedback${findSolved ? ' success' : findFeedback ? ' retry' : ''}" id="findMessage" aria-live="polite">${findSolved ? '<img src="assets%20images%20fox/Fox-happy.jpg" alt=""><strong>Great!</strong><span aria-hidden="true">✓</span>' : findFeedback || '&nbsp;'}</div>
        <button class="primary-btn next-btn find-next" id="findNext" ${findSolved ? '' : 'disabled'}>NEXT</button>
      </div>
    </div>`;
}

function renderPairs() {
  if (!pairCards.length) resetPairSet();
  const complete = pairMatched.length === pairSets[pairSet].length;
  const finalSet = pairSet === pairSets.length - 1;
  const setsRemaining = pairSets.length - pairSet - 1;
  main.innerHTML = `
    <div class="game-board pairs-game">
      ${screenHead('Match Pairs', 'Match each picture to its English word.', pairFirst ? { type: 'word', key: pairFirst.word, label: `Hear ${pairFirst.word}` } : null)}
      ${complete ? '' : challengeTimerPanel('pairs')}
      <div class="set-label">SET ${pairSet + 1} OF ${pairSets.length}</div>
      ${complete ? (finalSet
        ? completionPanel({ message: 'You matched all ten picture and word pairs.', replayId: 'pairPlayAgain', nextScreen: 'backpack' })
        : `<div class="mission-complete set-complete" aria-live="polite"><p>SET COMPLETE!</p><span>${setsRemaining} more set${setsRemaining === 1 ? '' : 's'} to finish the mission.</span><div class="complete-actions"><button class="primary-btn next-btn" id="pairNextSet">NEXT SET</button><button class="secondary-btn" data-screen="home">HOME</button></div></div>`
      ) : `
        <div class="pairs-grid" aria-label="Matching cards">
          ${pairCards.map(card => {
            const isOpen = pairFlipped.includes(card.key) || pairMatched.includes(card.word);
            const isMatched = pairMatched.includes(card.word);
            const longWord = card.type === 'word' && card.word.length > 8 ? ' long-word' : '';
            return `<button class="pair-card ${card.type}${longWord}${isOpen ? ' flipped' : ''}${isMatched ? ' matched' : ''}" data-pair-key="${card.key}" ${isMatched || pairBusy ? 'disabled' : ''} aria-label="Matching card"><span class="pair-card-back" aria-hidden="true">FOX</span><span class="pair-card-front">${card.type === 'picture' ? `<img src="${objectAsset(`${card.word.toLowerCase()}.png`)}" alt="${card.word}">` : `<strong>${card.word}</strong>`}</span></button>`;
          }).join('')}
        </div><div class="game-feedback pairs-feedback" aria-live="polite">${pairMatched.length ? `${pairMatched.length} of ${pairSets[pairSet].length} pairs found` : '&nbsp;'}</div>`}
    </div>`;
}

function renderBackpack() {
  const rewards = [
    { key: 'word', title: 'Build a Word', image: 'great-job.jpg' },
    { key: 'colour', title: 'Colour Mission', image: 'star-reward.jpg' },
    { key: 'find', title: 'Tap & Find', image: 'confetti-fox.jpg' },
    { key: 'pairs', title: 'Match Pairs', image: 'completed%20-check.jpg' }
  ];
  main.innerHTML = `
    <div class="game-board backpack-game">
      ${screenHead('MY BACKPACK', 'My game rewards', '')}
      <p class="backpack-explainer">Finish a game and its reward will light up here!</p>
      <div class="game-reward-grid" aria-label="Game rewards">
        ${rewards.map(reward => {
          const completed = Boolean(completedGames[reward.key]);
          const best = getBestTime(reward.key);
          return `<article class="game-reward-card ${completed ? 'completed' : 'not-completed'}" aria-label="${reward.title}${completed ? ', completed' : ''}">
            <div class="reward-art"><img src="assets%20images%20rewards/${reward.image}" alt=""></div>
            <div class="reward-copy"><h2>${reward.title}</h2>${completed ? `<strong class="reward-completed"><span aria-hidden="true">✓</span> COMPLETED!</strong>${best ? `<small class="reward-best-time">Best Time: ${formatTime(best)}</small>` : ''}` : '<span class="reward-pending">Finish the game to earn this reward</span>'}</div>
          </article>`;
        }).join('')}
      </div>
    </div>`;
}

const announceWordRound = () => {
  if (wordAnnouncedRound === wordRound) return;
  const announcedRound = wordRound;
  const token = ++announcementToken;
  wordAnnouncedRound = announcedRound;
  setTimeout(() => {
    if (token === announcementToken && currentScreen === 'word' && activeGameMode && wordRound === announcedRound && !wordCompleted) {
      playWord(currentWordRound().word);
    }
  }, 250);
};

const announceColourRound = () => {
  if (colourAnnouncedRound === colourRound) return;
  const announcedRound = colourRound;
  const token = ++announcementToken;
  colourAnnouncedRound = announcedRound;
  setTimeout(() => {
    if (token === announcementToken && currentScreen === 'colour' && activeGameMode && colourRound === announcedRound && !colourSolved) {
      playColourInstruction(currentColourItem());
    }
  }, 250);
};

const announceFindRound = () => {
  if (findAnnouncedRound === findRound) return;
  const announcedRound = findRound;
  const token = ++announcementToken;
  findAnnouncedRound = announcedRound;
  setTimeout(() => {
    if (token === announcementToken && currentScreen === 'find' && activeGameMode && findRound === announcedRound && !findSolved) {
      playFindInstruction(currentFindRound().target);
    }
  }, 250);
};

const replayVoice = button => {
  cancelPendingAnnouncement();
  const key = button.dataset.voiceKey;
  if (button.dataset.voiceType === 'word') playWord(key);
  if (button.dataset.voiceType === 'find') playFindInstruction(key);
  if (button.dataset.voiceType === 'colour') {
    const item = colourItems.find(candidate => candidate.id === key);
    if (item) playColourInstruction(item);
  }
};

const handleWordLetter = button => {
  if (wordCompleted) return;
  const item = wordBank.find(candidate => candidate.id === button.dataset.letterId);
  const target = currentWordRound().word;
  if (!item) return;
  if (item.letter !== target[wordLetters.length]) {
    button.classList.add('shake');
    notify('Try the next letter');
    playRetryFeedback();
    setTimeout(() => button.classList.remove('shake'), 400);
    return;
  }
  wordLetters.push(item.letter);
  usedLetterIds.push(item.id);
  if (wordLetters.length === target.length) {
    wordCompleted = true;
    clearWordHintCycle();
    wordHintVisible = true;
    cancelPendingAnnouncement();
    addStar();
    let completedMission = false;
    if (activeGameMode === 'timed' && wordRound === wordRounds.length - 1) {
      finishChallenge('word');
      wordMissionComplete = true;
      markGameComplete('word');
      completedMission = true;
    }
    renderWord();
    voiceController.playSequence(completedMission ? [wordVoice(target), completionVoice()] : [wordVoice(target)]);
    return;
  }
  renderWord();
};

const handleFindChoice = button => {
  if (findSolved) return;
  const choice = button.dataset.findChoice;
  const target = currentFindRound().target;
  if (choice === target) {
    cancelPendingAnnouncement();
    findSolved = true;
    findFeedback = 'Great!';
    addStar();
    let completedMission = false;
    if (activeGameMode === 'timed' && findRound === findRounds.length - 1) {
      finishChallenge('find');
      findMissionComplete = true;
      markGameComplete('find');
      completedMission = true;
    }
    renderFind();
    if (completedMission) playCompletionFeedback();
    else playPositiveFeedback();
    return;
  }
  button.classList.add('shake');
  findFeedback = 'Try again';
  document.getElementById('findMessage').textContent = findFeedback;
  playRetryFeedback();
  setTimeout(() => button.classList.remove('shake'), 420);
};

const handlePairCard = button => {
  if (pairBusy) return;
  const card = pairCards.find(candidate => candidate.key === button.dataset.pairKey);
  if (!card || pairMatched.includes(card.word) || pairFlipped.includes(card.key)) return;
  pairFlipped.push(card.key);
  if (!pairFirst) {
    pairFirst = card;
    renderPairs();
    return;
  }
  const first = pairFirst;
  if (first.word === card.word && first.type !== card.type) {
    cancelPendingAnnouncement();
    pairMatched.push(card.word);
    let completedMission = false;
    if (pairSet === pairSets.length - 1 && pairMatched.length === pairSets[pairSet].length) {
      finishChallenge('pairs');
      markGameComplete('pairs');
      completedMission = true;
    }
    pairFirst = null;
    pairFlipped = [];
    addStar();
    renderPairs();
    voiceController.playSequence(completedMission ? [wordVoice(card.word), completionVoice()] : [wordVoice(card.word)]);
    return;
  }
  pairBusy = true;
  renderPairs();
  playRetryFeedback();
  setTimeout(() => {
    if (currentScreen !== 'pairs') {
      pairFirst = null;
      pairFlipped = [];
      pairBusy = false;
      return;
    }
    document.querySelectorAll('.pair-card.flipped').forEach(element => element.classList.add('flipping-back'));
    setTimeout(() => {
      pairFirst = null;
      pairFlipped = [];
      pairBusy = false;
      if (currentScreen === 'pairs') renderPairs();
    }, 300);
  }, 650);
};

document.addEventListener('click', event => {
  const screenButton = event.target.closest('[data-screen]');
  if (screenButton) { setScreen(screenButton.dataset.screen); return; }
  const modeButton = event.target.closest('[data-game-mode]');
  if (modeButton) { startGameMode(modeButton.dataset.game, modeButton.dataset.gameMode); return; }
  if (event.target.closest('#wordPlayAgain')) { restartCurrentGame('word'); return; }
  if (event.target.closest('#colourPlayAgain')) { restartCurrentGame('colour'); return; }
  if (event.target.closest('#findPlayAgain')) { restartCurrentGame('find'); return; }
  if (event.target.closest('#pairPlayAgain')) { restartCurrentGame('pairs'); return; }
  if (activeGameMode === 'timed' && timeChallenge.phase !== 'running') return;
  const voiceButton = event.target.closest('[data-voice-type]');
  if (voiceButton) { replayVoice(voiceButton); return; }
  const letterButton = event.target.closest('[data-letter-id]');
  if (letterButton) { handleWordLetter(letterButton); return; }
  if (event.target.closest('#wordReset')) {
    wordAnnouncedRound = -1;
    resetWordRound();
    renderWord();
    startWordHintCycle();
    announceWordRound();
    return;
  }
  if (event.target.closest('#wordNext')) {
    if (wordRound === wordRounds.length - 1) {
      finishChallenge('word');
      wordMissionComplete = true;
      markGameComplete('word');
    } else {
      wordRound += 1;
      wordAnnouncedRound = -1;
      resetWordRound();
    }
    renderWord();
    if (!wordMissionComplete) { startWordHintCycle(); announceWordRound(); }
    else playCompletionFeedback();
    return;
  }
  const paintButton = event.target.closest('[data-paint]');
  if (paintButton) {
    if (colourSolved) return;
    selectedPaint = paintButton.dataset.paint;
    if (selectedPaint === currentColourItem().correctColor) {
      colourSolved = true;
      colourFeedback = 'Great!';
      addStar();
      let completedMission = false;
      if (activeGameMode === 'timed' && colourRound === colourItems.length - 1) {
        finishChallenge('colour');
        colourMissionComplete = true;
        markGameComplete('colour');
        completedMission = true;
      }
      renderColour();
      if (completedMission) playCompletionFeedback();
      else playPositiveFeedback();
      return;
    }
    colourFeedback = 'Try again!';
    renderColour();
    playRetryFeedback();
    return;
  }
  if (event.target.closest('#colourNext')) {
    if (!colourSolved) return;
    if (colourRound === colourItems.length - 1) {
      finishChallenge('colour');
      colourMissionComplete = true;
      markGameComplete('colour');
    }
    else {
      colourRound += 1;
      colourAnnouncedRound = -1;
      selectedPaint = '';
      colourSolved = false;
      colourFeedback = '';
    }
    renderColour();
    if (colourMissionComplete) playCompletionFeedback();
    else announceColourRound();
    return;
  }
  const findChoice = event.target.closest('[data-find-choice]');
  if (findChoice) { handleFindChoice(findChoice); return; }
  if (event.target.closest('#findNext')) {
    if (findRound === findRounds.length - 1) {
      finishChallenge('find');
      findMissionComplete = true;
      markGameComplete('find');
    }
    else findRound += 1;
    findAnnouncedRound = -1;
    if (!findMissionComplete) resetFindRound();
    renderFind();
    if (!findMissionComplete) announceFindRound();
    else playCompletionFeedback();
    return;
  }
  const pairCard = event.target.closest('[data-pair-key]');
  if (pairCard) { handlePairCard(pairCard); return; }
  if (event.target.closest('#pairNextSet')) { pairSet += 1; resetPairSet(); renderPairs(); return; }
});

document.getElementById('soundToggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem('foxQuestSoundEnabled', String(soundEnabled));
  if (!soundEnabled) voiceController.stop();
  updateSoundButton();
});
document.getElementById('musicToggle').addEventListener('click', () => musicController.toggle());
main.addEventListener('error', event => {
  if (event.target.matches('.home-hero-video')) event.target.classList.add('is-failed');
}, true);

resetWordRound();
resetFindRound();
resetPairSet();
starCount.textContent = stars;
updateSoundButton();
musicController.updateButton();
render();
