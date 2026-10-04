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
    crayon: 'assets%20audio%20words/crayon.mp3.mp3',
    scissors: 'assets%20audio%20words/scissors.mp3.mp3',
    sharpener: 'assets/audio/words/sharpener.mp3',
    folder: 'folder.mp3.mp3',
    bookcase: 'bookcase.mp3.mp3',
    door: 'door.mp3.mp3',
    window: 'window.mp3.mp3',
    yellow: 'assets%20audio%20colours/yellow.mp3.mp3',
    blue: 'assets%20audio%20colours/blue.mp3.mp3',
    brown: 'assets%20audio%20colours/brown.mp3.mp3',
    black: 'assets%20audio%20colours/black.mp3.mp3',
    white: 'assets%20audio%20colours/white.mp3.mp3',
    green: 'assets%20audio%20colours/green.mp3.mp3',
    purple: 'assets%20audio%20colours/purple.mp3.mp3',
    red: 'assets%20audio%20colours/red.mp3.mp3',
    orange: 'assets%20audio%20colours/orange.mp3.mp3',
    grey: 'assets%20audio%20colours/grey.mp3.mp3',
    one: 'assets%20audio%20numbers/one.mp3.mp3',
    two: 'assets%20audio%20numbers/two.mp3.mp3',
    three: 'assets%20audio%20numbers/three.mp3.mp3',
    four: 'assets%20audio%20numbers/four.mp3.mp3',
    five: 'assets%20audio%20numbers/five.mp3.mp3',
    six: 'assets%20audio%20numbers/six.mp3.mp3',
    seven: 'assets%20audio%20numbers/seven.mp3.mp3',
    eight: 'assets%20audio%20numbers/eight.mp3.mp3',
    nine: 'assets%20audio%20numbers/nine.mp3.mp3',
    ten: 'assets%20audio%20numbers/ten.mp3.mp3'
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
  },
  sentences: {
    rubber: 'make%20a%20sentence/audio/its-a-rubber.mp3.mp3',
    apple: 'make%20a%20sentence/audio/its-an-apple.mp3.mp3',
    redPencil: 'make%20a%20sentence/audio/its-a-red-pencil.mp3.mp3',
    orangeRuler: 'make%20a%20sentence/audio/its-an-orange-ruler.mp3.mp3',
    greenBagNotebook: 'make%20a%20sentence/audio/its-a-green-bag-and-a-yellow-notebook.mp3.mp3',
    sharpener: 'make%20a%20sentence/audio/this-is-a-sharpener.mp3.mp3',
    brownCrayon: 'make%20a%20sentence/audio/this-is-a-brown-crayon.mp3.mp3',
    folder: 'make%20a%20sentence/audio/this-is-a-folder.mp3.mp3',
    door: 'make%20a%20sentence/audio/this-is-a-door.mp3.mp3',
    window: 'make%20a%20sentence/audio/this-is-a-window.mp3.mp3',
    bookcase: 'make%20a%20sentence/audio/this-is-a-bookcase.mp3.mp3'
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

const schoolWordRounds = [
  { word: 'PEN', type: 'object', image: 'pen.png' }, { word: 'BAG', type: 'object', image: 'bag.png' },
  { word: 'BOOK', type: 'object', image: 'book.png' }, { word: 'PENCIL', type: 'object', image: 'pencil.png' },
  { word: 'RULER', type: 'object', image: 'ruler.png' }, { word: 'RUBBER', type: 'object', image: 'rubber.png' },
  { word: 'CRAYON', type: 'object', image: 'crayon.png' }, { word: 'NOTEBOOK', type: 'object', image: 'notebook.png' },
  { word: 'SCISSORS', type: 'object', image: 'scissors.png' }, { word: 'SHARPENER', type: 'object', image: 'sharpener.png' },
  { word: 'FOLDER', type: 'object', image: 'folder.png.png' }, { word: 'BOOKCASE', type: 'object', image: 'bookcase.png.png' },
  { word: 'DOOR', type: 'object', image: 'door.png.png' }, { word: 'WINDOW', type: 'object', image: 'window.png.png' }
];
const colourWordRounds = [
  { word: 'YELLOW', type: 'colour', colour: '#f4cf42' }, { word: 'BLUE', type: 'colour', colour: '#398bd2' },
  { word: 'BROWN', type: 'colour', colour: '#8a4f2d' }, { word: 'BLACK', type: 'colour', colour: '#20252b' },
  { word: 'WHITE', type: 'colour', colour: '#ffffff' }, { word: 'GREEN', type: 'colour', colour: '#4eb774' },
  { word: 'PURPLE', type: 'colour', colour: '#874dcc' }, { word: 'RED', type: 'colour', colour: '#ed5a54' },
  { word: 'ORANGE', type: 'colour', colour: '#f28b32' }, { word: 'GREY', type: 'colour', colour: '#8d969d' }
];
const numberWordRounds = [
  { word: 'ONE', type: 'number', digit: '1' }, { word: 'TWO', type: 'number', digit: '2' },
  { word: 'THREE', type: 'number', digit: '3' }, { word: 'FOUR', type: 'number', digit: '4' },
  { word: 'FIVE', type: 'number', digit: '5' }, { word: 'SIX', type: 'number', digit: '6' },
  { word: 'SEVEN', type: 'number', digit: '7' }, { word: 'EIGHT', type: 'number', digit: '8' },
  { word: 'NINE', type: 'number', digit: '9' }, { word: 'TEN', type: 'number', digit: '10' }
];
const mixWordNames = ['SHARPENER', 'SCISSORS', 'NOTEBOOK', 'BOOKCASE', 'FOLDER', 'WINDOW', 'PURPLE', 'ORANGE', 'YELLOW', 'BROWN', 'THREE', 'FIVE', 'SEVEN', 'EIGHT', 'NINE'];
const allWordRounds = [...schoolWordRounds, ...colourWordRounds, ...numberWordRounds];
const mixWordRounds = mixWordNames.map(word => allWordRounds.find(round => round.word === word));
const wordBlockConfig = {
  school: { title: 'School & Classroom', subtitle: '14 classroom words', rounds: schoolWordRounds },
  colours: { title: 'Colours', subtitle: '10 colour words', rounds: colourWordRounds },
  numbers: { title: 'Numbers 1–10', subtitle: '10 number words', rounds: numberWordRounds },
  mix: { title: 'Mix Challenge', subtitle: '15 mixed words', rounds: mixWordRounds }
};
let selectedWordBlock = null;
let wordRounds = [...schoolWordRounds];
let wordRound = 0;
let wordLetters = [];
let wordBank = [];
let usedLetterIds = [];
let wordCompleted = false;
let wordSuccessReady = false;
let wordMissionComplete = false;
let wordResetting = false;
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

const sentenceRounds = [
  { id: 'rubber', text: 'It’s a rubber.', words: ['IT’S', 'A', 'RUBBER'], clues: [{ image: 'rubber.png', label: 'rubber' }] },
  { id: 'apple', text: 'It’s an apple.', words: ['IT’S', 'AN', 'APPLE'], clues: [{ image: 'apple.png.png', label: 'apple' }] },
  { id: 'redPencil', text: 'It’s a red pencil.', words: ['IT’S', 'A', 'RED', 'PENCIL'], clues: [{ image: 'pencil.png', colour: 'red', label: 'red pencil' }] },
  { id: 'orangeRuler', text: 'It’s an orange ruler.', words: ['IT’S', 'AN', 'ORANGE', 'RULER'], clues: [{ image: 'ruler.png', colour: 'orange', label: 'orange ruler' }] },
  { id: 'sharpener', text: 'This is a sharpener.', words: ['THIS', 'IS', 'A', 'SHARPENER'], clues: [{ image: 'sharpener.png', label: 'sharpener' }] },
  { id: 'brownCrayon', text: 'This is a brown crayon.', words: ['THIS', 'IS', 'A', 'BROWN', 'CRAYON'], clues: [{ image: 'crayon.png', colour: 'brown', label: 'brown crayon' }] },
  { id: 'folder', text: 'This is a folder.', words: ['THIS', 'IS', 'A', 'FOLDER'], clues: [{ image: 'folder.png.png', label: 'folder' }] },
  { id: 'door', text: 'This is a door.', words: ['THIS', 'IS', 'A', 'DOOR'], clues: [{ image: 'door.png.png', label: 'door' }] },
  { id: 'window', text: 'This is a window.', words: ['THIS', 'IS', 'A', 'WINDOW'], clues: [{ image: 'window.png.png', label: 'window' }] },
  { id: 'bookcase', text: 'This is a bookcase.', words: ['THIS', 'IS', 'A', 'BOOKCASE'], clues: [{ image: 'bookcase.png.png', label: 'bookcase' }] },
  { id: 'greenBagNotebook', text: 'It’s a green bag and a yellow notebook.', words: ['IT’S', 'A', 'GREEN', 'BAG', 'AND', 'A', 'YELLOW', 'NOTEBOOK'], clues: [{ image: 'bag.png', colour: 'green', label: 'green bag' }, { image: 'notebook.png', colour: 'yellow', label: 'yellow notebook' }] }
];
let sentenceOrder = [];
let sentenceRound = 0;
let sentenceTokens = [];
let sentenceSlots = [];
let sentenceSolved = false;
let sentenceWrong = false;
let sentenceSuccessReady = false;
let sentenceMissionComplete = false;
let sentencePlacementHistory = [];
const previousWordOrders = new Map();

const finalColourChoices = [
  { id: 'yellow', colour: '#f4cf42' }, { id: 'blue', colour: '#398bd2' },
  { id: 'brown', colour: '#8a4f2d' }, { id: 'green', colour: '#4eb774' },
  { id: 'purple', colour: '#874dcc' }, { id: 'orange', colour: '#f28b32' }
];
const finalMissionQuestions = [
  { id: 'q1', type: 'listen-picture', category: 'listening', prompt: 'Listen and choose the picture.', audio: 'SHARPENER', choices: [
    { id: 'sharpener', image: 'sharpener.png' }, { id: 'pencil', image: 'pencil.png' }, { id: 'ruler', image: 'ruler.png' }, { id: 'rubber', image: 'rubber.png' }
  ], correctAnswer: 'sharpener' },
  { id: 'q2', type: 'build-word', category: 'words', prompt: 'Build the word.', target: 'WINDOW', image: 'window.png.png', correctAnswer: 'WINDOW' },
  { id: 'q3', type: 'sentence', category: 'sentences', prompt: 'Make the sentence.', target: ['IT’S', 'A', 'RED', 'PENCIL'], clues: [{ image: 'pencil.png', colour: 'red', label: 'red pencil' }], correctAnswer: ['IT’S', 'A', 'RED', 'PENCIL'] },
  { id: 'q4', type: 'listen-colour', category: 'coloursNumbers', prompt: 'Listen and choose the colour.', audio: 'PURPLE', choices: finalColourChoices, correctAnswer: 'purple' },
  { id: 'q5', type: 'reading-picture', category: 'reading', prompt: 'This is a bookcase.', choices: [
    { id: 'bookcase', image: 'bookcase.png.png' }, { id: 'door', image: 'door.png.png' }, { id: 'book', image: 'book.png' }, { id: 'bag', image: 'bag.png' }
  ], correctAnswer: 'bookcase' },
  { id: 'q6', type: 'build-word', category: 'words', prompt: 'Build the number word.', target: 'EIGHT', digit: '8', correctAnswer: 'EIGHT' },
  { id: 'q7', type: 'listen-picture', category: 'listening', prompt: 'Listen and choose the picture.', audio: 'NOTEBOOK', choices: [
    { id: 'notebook', image: 'notebook.png' }, { id: 'book', image: 'book.png' }, { id: 'folder', image: 'folder.png.png' }, { id: 'bag', image: 'bag.png' }
  ], correctAnswer: 'notebook' },
  { id: 'q8', type: 'sentence', category: 'sentences', prompt: 'Make the sentence.', target: ['THIS', 'IS', 'A', 'FOLDER'], clues: [{ image: 'folder.png.png', label: 'folder' }], correctAnswer: ['THIS', 'IS', 'A', 'FOLDER'] },
  { id: 'q9', type: 'listen-number', category: 'coloursNumbers', prompt: 'Listen and choose the number.', audio: 'SEVEN', choices: ['3', '5', '7', '9'], correctAnswer: '7' },
  { id: 'q10', type: 'reading-picture', category: 'reading', prompt: 'It’s an orange ruler.', choices: [
    { id: 'orange-ruler', image: 'ruler.png', colour: 'orange' }, { id: 'red-pencil', image: 'pencil.png', colour: 'red' },
    { id: 'green-bag', image: 'bag.png', colour: 'green' }, { id: 'yellow-notebook', image: 'notebook.png', colour: 'yellow' }
  ], correctAnswer: 'orange-ruler' },
  { id: 'q11', type: 'build-word', category: 'words', prompt: 'Build the word.', target: 'SHARPENER', image: 'sharpener.png', correctAnswer: 'SHARPENER' },
  { id: 'q12', type: 'listen-colour', category: 'coloursNumbers', prompt: 'Listen and choose the colour.', audio: 'BROWN', choices: finalColourChoices, correctAnswer: 'brown' },
  { id: 'q13', type: 'sentence', category: 'sentences', prompt: 'Make the sentence.', target: ['IT’S', 'A', 'GREEN', 'BAG', 'AND', 'A', 'YELLOW', 'NOTEBOOK'], clues: [
    { image: 'bag.png', colour: 'green', label: 'green bag' }, { image: 'notebook.png', colour: 'yellow', label: 'yellow notebook' }
  ], correctAnswer: ['IT’S', 'A', 'GREEN', 'BAG', 'AND', 'A', 'YELLOW', 'NOTEBOOK'] },
  { id: 'q14', type: 'listen-picture', category: 'listening', prompt: 'Listen and choose the picture.', audio: 'BOOKCASE', choices: [
    { id: 'bookcase', image: 'bookcase.png.png' }, { id: 'door', image: 'door.png.png' }, { id: 'window', image: 'window.png.png' }, { id: 'folder', image: 'folder.png.png' }
  ], correctAnswer: 'bookcase' },
  { id: 'q15', type: 'reading-group', category: 'reading', prompt: 'There is a pencil, a ruler and a rubber.', choices: [
    { id: 'pencil-ruler-rubber', images: ['pencil.png', 'ruler.png', 'rubber.png'] },
    { id: 'pencil-ruler-crayon', images: ['pencil.png', 'ruler.png', 'crayon.png'] },
    { id: 'pen-ruler-rubber', images: ['pen.png', 'ruler.png', 'rubber.png'] }
  ], correctAnswer: 'pencil-ruler-rubber' }
];
const finalCategoryLabels = {
  words: 'WORDS', listening: 'LISTENING', coloursNumbers: 'COLOURS & NUMBERS', sentences: 'SENTENCES', reading: 'READING'
};
let finalQuestionIndex = 0;
let finalScore = 0;
let finalBreakdown = {};
let finalResults = [];
let finalSubmitted = false;
let finalSelection = null;
let finalChoiceOrder = [];
let finalTokens = [];
let finalAnswerIds = [];
let finalAnnouncedQuestion = -1;
let finalIntroVisible = false;

const currentFinalQuestion = () => finalMissionQuestions[finalQuestionIndex];
const finalTokenValues = () => finalAnswerIds.map(id => finalTokens.find(token => token.id === id)?.value || '');
const finalShuffleTokens = (values, prefix) => {
  const correct = values.join('|');
  let result = [];
  for (let attempt = 0; attempt < 30; attempt += 1) {
    result = shuffle(values.map((value, index) => ({ id: `${prefix}-${index}`, value })));
    if (result.map(token => token.value).join('|') !== correct) return result;
  }
  result = values.map((value, index) => ({ id: `${prefix}-${index}`, value }));
  result.push(result.shift());
  return result;
};

function getFinalResult(score) {
  if (score <= 8) return { band: 'retry', grade: null, title: 'TRY AGAIN', message: 'Let’s try again!', image: 'fox-try-again.png.png', replayLabel: 'TRY AGAIN' };
  if (score <= 13) return { band: 'grade-4', grade: '4', title: 'GRADE 4', message: 'Great work!', image: 'fox-grade-4.png.png', replayLabel: 'PLAY AGAIN' };
  return { band: 'grade-5', grade: '5', title: 'GRADE 5', message: 'Fantastic work!', image: 'fox-grade-5.png.png', replayLabel: 'PLAY AGAIN' };
}

const prepareFinalQuestion = () => {
  const question = currentFinalQuestion();
  finalSubmitted = false;
  finalSelection = null;
  finalAnswerIds = [];
  finalChoiceOrder = question.choices ? shuffle(question.choices) : [];
  finalTokens = question.type === 'build-word'
    ? finalShuffleTokens([...question.target], question.id)
    : question.type === 'sentence' ? finalShuffleTokens(question.target, question.id) : [];
  finalAnnouncedQuestion = -1;
};

const resetFinalMission = () => {
  finalQuestionIndex = 0;
  finalScore = 0;
  finalBreakdown = Object.fromEntries(Object.keys(finalCategoryLabels).map(key => [key, 0]));
  finalResults = [];
  prepareFinalQuestion();
};

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
    if (!entry.file) {
      document.documentElement.dataset.voiceMode = 'fallback';
      document.documentElement.dataset.voiceSource = 'speech-synthesis';
      await speakFallback(entry.fallback);
      return;
    }
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

const wordVoice = word => ({ file: voiceFiles.words[word.toLowerCase()] || '', fallback: word });
const findVoice = word => ({ file: voiceFiles.tapFind[word.toLowerCase()], fallback: `Find the ${word}` });
const colourVoice = item => ({ file: item.voiceFile, fallback: `Paint the ${item.word} ${item.correctColor}` });
const feedbackVoice = key => {
  const fallback = {
    greatJob: 'Great job', wellDone: 'Well done', tryAgain: 'Try again',
    youDidIt: 'You did it', missionComplete: 'Mission complete', newBest: 'New best'
  }[key];
  return { file: voiceFiles.feedback[key], fallback };
};
const sentenceVoice = round => ({ file: voiceFiles.sentences[round.id], fallback: round.text });
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
  if (currentWordRound().type !== 'object') return;
  scheduleWordHintToggle();
};

const formatTime = milliseconds => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`;
};

const getBestTime = game => Number(gameModeConfig[game] ? localStorage.getItem(gameModeConfig[game].bestKey) || 0 : 0);
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
  if (screen === 'word') selectedWordBlock = null;
  if (screen === 'sentence') {
    resetSentenceMission();
    musicController.play();
  }
  if (screen === 'final') {
    finalIntroVisible = true;
  }
  document.querySelectorAll('[data-screen]').forEach(button => button.classList.toggle('active', button.dataset.screen === screen));
  render();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const currentWordRound = () => wordRounds[wordRound % wordRounds.length];
const currentFindRound = () => findRounds[findRound % findRounds.length];
const currentSentenceRound = () => sentenceRounds[sentenceOrder[sentenceRound]];

const shuffledSentenceWords = round => {
  const correct = round.words.join('|');
  const previous = previousWordOrders.get(round.id);
  let result = [];
  for (let attempt = 0; attempt < 30; attempt += 1) {
    result = shuffle(round.words.map((word, index) => ({ id: `${round.id}-${index}`, word })));
    const signature = result.map(item => item.word).join('|');
    if (signature !== correct && signature !== previous) break;
  }
  if (result.map(item => item.word).join('|') === correct || result.map(item => item.word).join('|') === previous) {
    result = round.words.map((word, index) => ({ id: `${round.id}-${index}`, word }));
    result.push(result.shift());
  }
  previousWordOrders.set(round.id, result.map(item => item.word).join('|'));
  return result;
};

const resetSentenceRound = () => {
  const round = currentSentenceRound();
  sentenceTokens = shuffledSentenceWords(round);
  sentenceSlots = Array(round.words.length).fill(null);
  sentenceSolved = false;
  sentenceWrong = false;
  sentenceSuccessReady = false;
  sentencePlacementHistory = [];
};

function resetSentenceMission() {
  sentenceOrder = sentenceRounds.map((_, index) => index);
  sentenceRound = 0;
  sentenceMissionComplete = false;
  resetSentenceRound();
}

const resetWordRound = (avoidBankOrder = '') => {
  const word = currentWordRound().word;
  wordLetters = [];
  usedLetterIds = [];
  wordCompleted = false;
  wordSuccessReady = false;
  wordResetting = false;
  wordHintVisible = true;
  const source = [...word].map((letter, index) => ({ letter, id: `${wordRound}-${index}` }));
  for (let attempt = 0; attempt < 30; attempt += 1) {
    wordBank = shuffle(source);
    const bankOrder = wordBank.map(item => item.letter).join('');
    if (bankOrder !== word && bankOrder !== avoidBankOrder) return;
  }
  wordBank = [...source.slice(1), source[0]];
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
    const block = wordBlockConfig[selectedWordBlock] || wordBlockConfig.school;
    wordRounds = selectedWordBlock === 'school' ? [...block.rounds] : shuffle(block.rounds);
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

const renderWordBlockChoice = () => {
  main.innerHTML = `<div class="game-board word-category-screen">
    ${screenHead('Build a Word', 'Choose a word block to practise.', '')}
    <section class="word-category-panel" aria-labelledby="wordCategoryTitle">
      <div class="word-category-intro"><img src="assets%20images%20fox/Fox-happy.jpg" alt="Smiling fox"><div><h2 id="wordCategoryTitle">CHOOSE YOUR WORDS</h2><p>Pick one block. You can return here at any time.</p></div></div>
      <div class="word-category-grid">
        <button class="word-category-card school-block" data-word-block="school" aria-label="Play School and Classroom"><img class="word-category-cover" src="asset%20images%20scenes/build-school-classroom.png.png" alt=""><span class="word-category-play">PLAY</span></button>
        <button class="word-category-card colours-block" data-word-block="colours" aria-label="Play Colours"><img class="word-category-cover" src="asset%20images%20scenes/build-colours.png.png" alt=""><span class="word-category-play">PLAY</span></button>
        <button class="word-category-card numbers-block" data-word-block="numbers" aria-label="Play Numbers 1 to 10"><img class="word-category-cover" src="asset%20images%20scenes/build-numbers.png.png" alt=""><span class="word-category-play">PLAY</span></button>
        <button class="word-category-card mix-block" data-word-block="mix" aria-label="Play Mix Challenge"><img class="word-category-cover" src="asset%20images%20scenes/build-mix-challenge.png.png" alt=""><span class="word-category-play">PLAY</span></button>
      </div>
    </section>
  </div>`;
};

const renderModeChoice = game => {
  const config = gameModeConfig[game];
  const best = getBestTime(game);
  const wordBlock = game === 'word' ? wordBlockConfig[selectedWordBlock] : null;
  main.innerHTML = `<div class="game-board mode-choice-screen">
    ${screenHead(config.title, wordBlock ? `${wordBlock.title} · ${wordBlock.subtitle}` : 'Choose how you would like to play.', '')}
    <div class="mode-choice-panel">
      <div class="mode-choice-intro"><img src="assets%20images%20fox/Fox-happy.jpg" alt="Smiling fox"><div><h2>Ready for a mission?</h2><p>Play calmly, or try to beat your own best time.</p></div></div>
      <div class="mode-choice-grid">
        <button class="mode-choice normal-mode" data-game="${game}" data-game-mode="normal"><span class="mode-icon" aria-hidden="true">★</span><strong>NORMAL MODE</strong><small>Play with no timer</small><em>PLAY</em></button>
        <button class="mode-choice timed-mode" data-game="${game}" data-game-mode="timed"><span class="mode-icon" aria-hidden="true">◷</span><strong>BEAT YOUR BEST!</strong><small>${best ? `Best: ${formatTime(best)}` : 'Set your first record!'}</small><em>TIME CHALLENGE</em></button>
      </div>
      ${wordBlock ? '<button class="secondary-btn choose-words-btn" id="wordChooseWords">CHOOSE OTHER WORDS</button>' : ''}
    </div>
  </div>`;
};

function render() {
  document.body.classList.toggle('is-home', currentScreen === 'home');
  if (currentScreen === 'home') renderHome();
  if (currentScreen === 'word' && !selectedWordBlock) renderWordBlockChoice();
  else if (gameModeConfig[currentScreen] && !activeGameMode) renderModeChoice(currentScreen);
  else if (currentScreen === 'word') renderWord();
  else if (currentScreen === 'colour') renderColour();
  else if (currentScreen === 'find') renderFind();
  else if (currentScreen === 'pairs') renderPairs();
  else if (currentScreen === 'sentence') renderSentence();
  else if (currentScreen === 'final') renderFinalMission();
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
      <button class="quest-card card-sentence" data-screen="sentence"><span class="card-copy"><span class="small-number">LEVEL 05</span><span class="card-title-row"><h3>Make a Sentence</h3><span class="play-label">PLAY</span></span><p>Put the words in order.</p></span></button>
      <button class="quest-card card-final" data-screen="final"><span class="card-copy"><span class="small-number">FINAL TEST</span><span class="card-title-row"><h3>Fox Final Mission</h3><span class="play-label">PLAY</span></span><p>Complete all 15 challenges!</p></span></button>
    </div>
    <div class="home-lower"><div class="progress-panel"><div class="progress-label"><span>Quest progress</span><span>${Math.min(stars, 9)} stars collected</span></div><div class="progress-track"><span style="width:${Math.min(stars * 10 + 12, 100)}%"></span></div></div><button class="reward-panel" data-screen="backpack"><h3>My Backpack</h3><p>See your game rewards →</p></button></div>`;
}

function renderWord() {
  const block = wordBlockConfig[selectedWordBlock] || wordBlockConfig.school;
  if (wordMissionComplete) {
    clearWordHintCycle();
    main.innerHTML = `<div class="game-board word-game">${screenHead('Build a Word', `${block.title} complete — brilliant work!`, '')}${completionPanel({ message: `You built all ${wordRounds.length} words and earned your reward.`, replayId: 'wordPlayAgain', nextScreen: 'colour' })}</div>`;
    return;
  }
  const round = currentWordRound();
  if (!wordBank.length) resetWordRound();
  const reveal = wordCompleted ? 100 : (wordLetters.length / round.word.length) * 100;
  const isObject = round.type === 'object';
  const completedColourClass = round.type === 'colour' && wordCompleted ? ` is-colour-result colour-word-${round.word.toLowerCase()}` : '';
  const completedColourStyle = round.type === 'colour' && wordCompleted ? ` style="--completed-word-colour:${round.colour}"` : '';
  const prompt = isObject
    ? `<span class="word-prompt-label">MAKE THIS WORD:</span><strong class="target-word${!wordHintVisible && !wordCompleted ? ' is-hidden' : ''}${wordCompleted ? ' is-completed' : ''}">${round.word}</strong>`
    : `<span class="word-prompt-label">${round.type === 'colour' ? 'BUILD THE COLOUR' : 'BUILD THE NUMBER'}</span>${wordCompleted ? `<strong class="target-word is-completed${completedColourClass}"${completedColourStyle}>${round.word}</strong>` : ''}`;
  const clue = isObject
    ? `<div class="object-reveal" style="--reveal-progress:${reveal}%"><img src="${objectAsset(round.image)}" alt="${round.word}"><span class="reveal-cover" aria-hidden="true"></span></div>`
    : round.type === 'colour'
      ? `<div class="word-colour-clue" style="--word-clue-colour:${round.colour}" role="img" aria-label="Colour swatch"></div>`
      : `<div class="word-number-clue" role="img" aria-label="Number ${round.digit}">${round.digit}</div>`;
  main.innerHTML = `
    <div class="game-board word-game">
      ${screenHead('Build a Word', `${block.title} · word ${wordRound + 1} of ${wordRounds.length}`, { type: 'word', key: round.word, label: `Hear ${round.word}` }, 'HEAR WORD')}
      ${challengeTimerPanel('word')}
      <div class="word-layout clue-${round.type}${wordCompleted ? ' completed' : ''}${round.word.length > 7 ? ' long-word' : ''}">
        <div class="word-prompt-line">${prompt}</div>
        ${clue}
        <div class="letter-row${wordCompleted ? ' word-complete' : ''}" id="chosenLetters" aria-label="Your word">
          ${wordLetters.map(letter => `<span class="tile chosen">${letter}</span>`).join('')}
          ${Array.from({ length: round.word.length - wordLetters.length }, () => '<span class="tile empty" aria-hidden="true"></span>').join('')}
        </div>
        <div class="letter-bank" aria-label="Letter choices">
          ${wordBank.map(item => `<button class="tile bank${usedLetterIds.includes(item.id) ? ' used' : ''}" data-letter-id="${item.id}" ${usedLetterIds.includes(item.id) || wordCompleted ? 'disabled' : ''}>${item.letter}</button>`).join('')}
        </div>
        <div class="game-feedback success" aria-live="polite">${wordCompleted && wordSuccessReady ? 'Great job!' : wordCompleted ? 'Listen…' : '&nbsp;'}</div>
        <div class="word-actions">${wordCompleted && wordSuccessReady ? '<button class="primary-btn next-btn" id="wordNext">NEXT</button>' : ''}${selectedWordBlock === 'colours' ? '' : '<button class="secondary-btn" id="wordReset">START AGAIN</button>'}</div>
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
  green: [85, 185, 124],
  orange: [239, 139, 52],
  brown: [142, 86, 53]
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

function renderSentence() {
  if (sentenceMissionComplete) {
    main.innerHTML = `<div class="game-board sentence-game">${screenHead('MAKE A SENTENCE', 'You built all eleven sentences!', '')}
      <div class="mission-complete game-mission-complete sentence-complete" aria-live="polite">
        <img class="completion-fox" src="assets%20images%20fox/Fox-happy.jpg" alt="Happy fox mascot">
        <div class="completion-copy"><p>MISSION COMPLETE!</p><span>Wonderful reading! You put every sentence in order.</span></div>
        <div class="complete-actions"><button class="primary-btn next-btn" id="sentencePlayAgain">PLAY AGAIN</button><button class="secondary-btn" data-screen="home">HOME</button></div>
      </div></div>`;
    return;
  }
  const round = currentSentenceRound();
  const placedIds = new Set(sentenceSlots.filter(Boolean));
  const clueSource = clue => clue.path || objectAsset(clue.image);
  const clueMarkup = round.clues.map(clue => clue.colour
    ? `<canvas class="sentence-clue-image" data-object-src="${clueSource(clue)}" data-object-colour="${clue.colour}" role="img" aria-label="${clue.label}"></canvas>`
    : `<img class="sentence-clue-image" src="${clueSource(clue)}" alt="${clue.label}">`).join('');
  main.innerHTML = `<div class="game-board sentence-game${round.words.length > 6 ? ' long-sentence' : ''}">
    ${screenHead('MAKE A SENTENCE', 'Put the words in order.', '')}
    <div class="sentence-progress" aria-label="Round ${sentenceRound + 1} of ${sentenceRounds.length}"><strong>${sentenceRound + 1} / ${sentenceRounds.length}</strong><span><i style="width:${((sentenceRound + (sentenceSolved ? 1 : 0)) / sentenceRounds.length) * 100}%"></i></span></div>
    <div class="sentence-board">
      <div class="sentence-clue${round.clues.length > 1 ? ' clue-pair' : ''}">${clueMarkup}</div>
      <p class="sentence-area-label">BUILD THE SENTENCE</p>
      <div class="sentence-slots${sentenceSolved ? ' is-correct' : ''}${sentenceWrong ? ' is-wrong' : ''}" aria-label="Sentence building slots">
        ${sentenceSlots.map((tokenId, index) => {
          const token = sentenceTokens.find(item => item.id === tokenId);
          return `<button class="sentence-slot${token ? ' is-filled' : ''}" data-sentence-slot="${index}" ${sentenceSolved ? 'disabled' : ''} draggable="${Boolean(token && !sentenceSolved)}" aria-label="${token ? `${token.word}, position ${index + 1}. Tap to return it.` : `Empty position ${index + 1}`}">${token ? token.word : '<span aria-hidden="true"></span>'}</button>`;
        }).join('')}
      </div>
      <div class="sentence-feedback${sentenceSuccessReady ? ' success' : sentenceWrong ? ' retry' : ''}" aria-live="polite">${sentenceSuccessReady ? '<strong>Great job!</strong><span aria-hidden="true">✓</span>' : sentenceSolved ? '<strong>Listen…</strong>' : sentenceWrong ? '<strong>Try again.</strong>' : '&nbsp;'}</div>
      <p class="sentence-area-label">WORD CARDS</p>
      <div class="sentence-bank" data-sentence-bank aria-label="Shuffled word cards">
        ${sentenceTokens.map(token => `<button class="sentence-word-card${placedIds.has(token.id) ? ' is-used' : ''}" data-sentence-token="${token.id}" ${placedIds.has(token.id) || sentenceSolved ? 'disabled' : ''} draggable="${!placedIds.has(token.id) && !sentenceSolved}">${token.word}</button>`).join('')}
      </div>
      <div class="sentence-actions"><button class="secondary-btn sentence-back" id="sentenceBack" ${sentenceSolved || !sentencePlacementHistory.length ? 'disabled' : ''}>BACK</button>${sentenceSuccessReady ? `<button class="secondary-btn hear-sentence" id="sentenceHearAgain">HEAR AGAIN</button><button class="primary-btn next-btn" id="sentenceNext">NEXT</button>` : ''}</div>
    </div>
  </div>`;
  document.querySelectorAll('.sentence-clue-image[data-object-colour]').forEach(drawColourObject);
}

const finalTaskTitle = type => ({
  'listen-picture': 'LISTEN & FIND', 'listen-colour': 'COLOUR LISTENING', 'listen-number': 'NUMBER LISTENING',
  'build-word': 'BUILD A WORD', sentence: 'MAKE A SENTENCE', 'reading-picture': 'READING', 'reading-group': 'READING CHALLENGE'
}[type]);

const finalChoicePicture = (choice, index) => choice.colour
  ? `<canvas class="final-choice-image" data-object-src="${objectAsset(choice.image)}" data-object-colour="${choice.colour}" role="img" aria-label="Picture option ${index + 1}"></canvas>`
  : `<img class="final-choice-image" src="${objectAsset(choice.image)}" alt="">`;

const finalCanSubmit = question => {
  if (finalSubmitted) return false;
  if (['listen-picture', 'listen-colour', 'listen-number', 'reading-picture', 'reading-group'].includes(question.type)) return finalSelection !== null;
  return finalAnswerIds.length === question.target.length;
};

const finalAnswerIsCorrect = question => {
  if (['listen-picture', 'listen-colour', 'listen-number', 'reading-picture', 'reading-group'].includes(question.type)) return finalSelection === question.correctAnswer;
  const answer = finalTokenValues();
  return answer.length === question.correctAnswer.length && answer.every((value, index) => value === question.correctAnswer[index]);
};

const finalQuestionClue = question => {
  if (question.type === 'build-word') {
    if (question.digit) return `<div class="final-number-clue" aria-label="Number ${question.digit}">${question.digit}</div>`;
    return `<div class="final-object-clue"><img src="${objectAsset(question.image)}" alt="Visual clue"></div>`;
  }
  if (question.type === 'sentence') {
    return `<div class="final-sentence-clues${question.clues.length > 1 ? ' is-pair' : ''}">${question.clues.map(clue => clue.colour
      ? `<canvas data-object-src="${objectAsset(clue.image)}" data-object-colour="${clue.colour}" role="img" aria-label="${clue.label}"></canvas>`
      : `<img src="${objectAsset(clue.image)}" alt="${clue.label}">`).join('')}</div>`;
  }
  return '';
};

const renderFinalChoiceTask = question => {
  if (question.type === 'listen-colour') {
    return `<div class="final-colour-grid" aria-label="Colour choices">${finalChoiceOrder.map((choice, index) => `<button class="final-colour-choice${finalSelection === choice.id ? ' selected' : ''}" data-final-choice="${choice.id}" style="--choice-colour:${choice.colour}" aria-label="Colour option ${index + 1}" ${finalSubmitted ? 'disabled' : ''}><span aria-hidden="true"></span></button>`).join('')}</div>`;
  }
  if (question.type === 'listen-number') {
    return `<div class="final-number-grid" aria-label="Number choices">${finalChoiceOrder.map(choice => `<button class="final-number-choice${finalSelection === choice ? ' selected' : ''}" data-final-choice="${choice}" ${finalSubmitted ? 'disabled' : ''}>${choice}</button>`).join('')}</div>`;
  }
  if (question.type === 'reading-group') {
    return `<div class="final-group-grid" aria-label="Picture groups">${finalChoiceOrder.map((choice, index) => `<button class="final-picture-group${finalSelection === choice.id ? ' selected' : ''}" data-final-choice="${choice.id}" aria-label="Picture group ${index + 1}" ${finalSubmitted ? 'disabled' : ''}>${choice.images.map(image => `<img src="${objectAsset(image)}" alt="">`).join('')}</button>`).join('')}</div>`;
  }
  return `<div class="final-picture-grid" aria-label="Picture choices">${finalChoiceOrder.map((choice, index) => `<button class="final-picture-choice${finalSelection === choice.id ? ' selected' : ''}" data-final-choice="${choice.id}" aria-label="Picture option ${index + 1}" ${finalSubmitted ? 'disabled' : ''}>${finalChoicePicture(choice, index)}</button>`).join('')}</div>`;
};

const renderFinalBuildTask = question => {
  const placedIds = new Set(finalAnswerIds);
  const answer = finalTokenValues();
  return `${finalQuestionClue(question)}
    <div class="final-build-answer" aria-label="Your answer">${answer.map((letter, index) => `<button data-final-answer-index="${index}" ${finalSubmitted ? 'disabled' : ''}>${letter}</button>`).join('')}${Array.from({ length: question.target.length - answer.length }, () => '<span aria-hidden="true"></span>').join('')}</div>
    <div class="final-letter-bank" aria-label="Scrambled letters">${finalTokens.map(token => `<button data-final-token-id="${token.id}" ${placedIds.has(token.id) || finalSubmitted ? 'disabled' : ''}>${token.value}</button>`).join('')}</div>`;
};

const renderFinalSentenceTask = question => {
  const placedIds = new Set(finalAnswerIds);
  const answer = finalTokenValues();
  return `${finalQuestionClue(question)}
    <div class="final-sentence-answer" aria-label="Your sentence">${answer.map(value => `<span>${value}</span>`).join('')}${Array.from({ length: question.target.length - answer.length }, () => '<i aria-hidden="true"></i>').join('')}</div>
    <div class="final-sentence-bank" aria-label="Scrambled word cards">${finalTokens.map(token => `<button data-final-token-id="${token.id}" ${placedIds.has(token.id) || finalSubmitted ? 'disabled' : ''}>${token.value}</button>`).join('')}</div>`;
};

function renderFinalResult() {
  const result = getFinalResult(finalScore);
  const breakdown = Object.keys(finalCategoryLabels).map(key => `<div><span>${finalCategoryLabels[key]}</span><strong>${finalBreakdown[key]} / 3</strong></div>`).join('');
  main.innerHTML = `<div class="game-board final-game final-result ${result.band}">
    ${screenHead('FOX FINAL MISSION', 'Your final adventure is complete.', '')}
    <section class="final-result-card" aria-live="polite">
      <img src="assets%20images%20rewards/${result.image}" alt="Fox result reward">
      <div class="final-result-copy"><small>FINAL SCORE</small><strong class="final-score">${finalScore} / 15</strong>${result.grade ? `<span class="final-grade">${result.grade}</span>` : ''}<h2>${result.title}</h2><p>${result.message}</p></div>
      <div class="final-breakdown" aria-label="Teacher breakdown"><h3>MISSION BREAKDOWN</h3>${breakdown}</div>
      <div class="final-result-actions"><button class="primary-btn" id="finalPlayAgain">${result.replayLabel}</button><button class="secondary-btn" data-screen="home">HOME</button></div>
    </section>
  </div>`;
}

function renderFinalIntro() {
  main.innerHTML = `<div class="game-board final-game final-intro">
    <section class="final-intro-card" aria-labelledby="finalIntroTitle">
      <div class="final-intro-heading"><p class="kicker">FOX SCHOOL QUEST</p><h1 id="finalIntroTitle">FOX FINAL MISSION</h1><p>Are you ready for your final adventure?</p></div>
      <div class="final-intro-media">
        <video class="final-intro-video" autoplay playsinline preload="auto" poster="assets%20images%20rewards/fox-grade-5.png.png">
          <source src="assets%20video%20final-mission/fox-final-mission-intro.mp4.mp4" type="video/mp4">
        </video>
        <img class="final-intro-fallback" src="assets%20images%20rewards/fox-grade-5.png.png" alt="Fox Final Mission" hidden>
      </div>
      <div class="final-intro-actions">
        <button class="secondary-btn final-replay" id="finalIntroReplay" type="button" hidden>REPLAY</button>
        <button class="primary-btn final-start" id="finalStartMission" type="button">START MISSION</button>
      </div>
    </section>
  </div>`;

  const video = document.querySelector('.final-intro-video');
  const source = video.querySelector('source');
  const fallback = document.querySelector('.final-intro-fallback');
  const replay = document.getElementById('finalIntroReplay');
  const showFallback = () => {
    video.hidden = true;
    fallback.hidden = false;
    replay.hidden = true;
    musicController.play();
  };
  video.addEventListener('play', () => musicController.pause());
  video.addEventListener('ended', () => {
    replay.hidden = false;
    musicController.play();
  });
  video.addEventListener('error', showFallback);
  source.addEventListener('error', showFallback);
  video.play().catch(() => {
    // Autoplay policies may require another child interaction; START remains available.
    musicController.play();
  });
}

function renderFinalMission() {
  if (finalIntroVisible) { renderFinalIntro(); return; }
  if (finalQuestionIndex >= finalMissionQuestions.length) { renderFinalResult(); return; }
  const question = currentFinalQuestion();
  const listening = question.type.startsWith('listen-');
  const choiceTask = ['listen-picture', 'listen-colour', 'listen-number', 'reading-picture', 'reading-group'].includes(question.type);
  const task = choiceTask ? renderFinalChoiceTask(question) : question.type === 'build-word' ? renderFinalBuildTask(question) : renderFinalSentenceTask(question);
  main.innerHTML = `<div class="game-board final-game ${question.type}">
    ${screenHead('FOX FINAL MISSION', 'Complete all 15 challenges!', '')}
    <div class="final-progress" aria-label="Question ${finalQuestionIndex + 1} of 15"><strong>${finalQuestionIndex + 1} / 15</strong><span><i style="width:${((finalQuestionIndex + 1) / 15) * 100}%"></i></span></div>
    <section class="final-question-card" data-final-question="${question.id}">
      <div class="final-task-heading"><small>${finalTaskTitle(question.type)}</small><h2>${question.prompt}</h2>${listening ? '<button class="sound-btn final-hear" id="finalHearAgain">HEAR AGAIN</button>' : ''}</div>
      <div class="final-task-body">${task}</div>
      <div class="final-submit-state" aria-live="polite">${finalSubmitted ? 'Answer saved.' : '&nbsp;'}</div>
      <div class="final-actions">${question.type === 'sentence' ? `<button class="secondary-btn final-back" id="finalBack" ${finalSubmitted || !finalAnswerIds.length ? 'disabled' : ''}>BACK</button>` : ''}<button class="primary-btn" id="finalSubmit" ${finalCanSubmit(question) ? '' : 'disabled'}>SUBMIT</button>${finalSubmitted ? '<button class="primary-btn next-btn" id="finalNext">NEXT</button>' : ''}</div>
    </section>
  </div>`;
  document.querySelectorAll('.final-game canvas[data-object-colour]').forEach(drawColourObject);
  announceFinalQuestion();
}

const announceFinalQuestion = () => {
  const question = currentFinalQuestion();
  if (!question?.type.startsWith('listen-') || finalAnnouncedQuestion === finalQuestionIndex || finalSubmitted) return;
  const index = finalQuestionIndex;
  const token = ++announcementToken;
  finalAnnouncedQuestion = index;
  setTimeout(() => {
    if (token === announcementToken && currentScreen === 'final' && finalQuestionIndex === index && !finalSubmitted) voiceController.play(wordVoice(question.audio));
  }, 250);
};

const submitFinalAnswer = () => {
  const question = currentFinalQuestion();
  if (!finalCanSubmit(question)) return;
  voiceController.stop();
  const correct = finalAnswerIsCorrect(question);
  if (correct) {
    finalScore += 1;
    finalBreakdown[question.category] += 1;
  }
  finalResults.push({ id: question.id, category: question.category, correct });
  finalSubmitted = true;
  renderFinalMission();
};

function renderBackpack() {
  const rewards = [
    { key: 'word', title: 'Build a Word', image: 'great-job.jpg' },
    { key: 'colour', title: 'Colour Mission', image: 'star-reward.jpg' },
    { key: 'find', title: 'Tap & Find', image: 'confetti-fox.jpg' },
    { key: 'pairs', title: 'Match Pairs', image: 'completed%20-check.jpg' },
    { key: 'sentence', title: 'Make a Sentence', image: 'fox-hug-star.jpg' }
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
  if (wordCompleted || wordResetting) return;
  const item = wordBank.find(candidate => candidate.id === button.dataset.letterId);
  const target = currentWordRound().word;
  if (!item) return;
  if (item.letter !== target[wordLetters.length]) {
    const roundAtMistake = wordRound;
    const previousBankOrder = wordBank.map(letter => letter.letter).join('');
    wordResetting = true;
    button.classList.add('shake');
    document.querySelector('.word-layout')?.classList.add('word-resetting');
    notify('Try again from the beginning');
    playRetryFeedback();
    setTimeout(() => {
      if (currentScreen !== 'word' || wordRound !== roundAtMistake || wordCompleted || !wordResetting) return;
      resetWordRound(previousBankOrder);
      renderWord();
      startWordHintCycle();
    }, 420);
    return;
  }
  wordLetters.push(item.letter);
  usedLetterIds.push(item.id);
  if (wordLetters.length === target.length) {
    const completedRound = wordRound;
    wordCompleted = true;
    wordSuccessReady = false;
    clearWordHintCycle();
    wordHintVisible = true;
    cancelPendingAnnouncement();
    addStar();
    if (activeGameMode === 'timed' && wordRound === wordRounds.length - 1) finishChallenge('word');
    renderWord();
    voiceController.playSequence([wordVoice(target), feedbackVoice('greatJob')]).then(() => {
      if (currentScreen !== 'word' || wordRound !== completedRound || !wordCompleted) return;
      wordSuccessReady = true;
      renderWord();
    });
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

const checkSentence = () => {
  if (sentenceSlots.some(tokenId => !tokenId) || sentenceSolved) return;
  const round = currentSentenceRound();
  const builtWords = sentenceSlots.map(tokenId => sentenceTokens.find(token => token.id === tokenId)?.word);
  if (builtWords.every((word, index) => word === round.words[index])) {
    const completedRound = sentenceRound;
    sentenceSolved = true;
    sentenceWrong = false;
    sentenceSuccessReady = false;
    addStar();
    renderSentence();
    voiceController.playSequence([sentenceVoice(round), feedbackVoice('greatJob')]).then(() => {
      if (currentScreen !== 'sentence' || sentenceRound !== completedRound || !sentenceSolved) return;
      sentenceSuccessReady = true;
      renderSentence();
    });
    return;
  }
  sentenceWrong = true;
  renderSentence();
  playRetryFeedback();
};

const placeSentenceToken = (tokenId, slotIndex) => {
  if (sentenceSolved || !sentenceTokens.some(token => token.id === tokenId)) return;
  const sourceIndex = sentenceSlots.indexOf(tokenId);
  const displacedToken = sentenceSlots[slotIndex];
  sentencePlacementHistory = sentencePlacementHistory.filter(id => id !== tokenId && id !== displacedToken);
  if (sourceIndex >= 0) sentenceSlots[sourceIndex] = displacedToken || null;
  sentenceSlots[slotIndex] = tokenId;
  sentencePlacementHistory.push(tokenId);
  sentenceWrong = false;
  renderSentence();
  checkSentence();
};

const removeSentenceToken = slotIndex => {
  if (sentenceSolved || !sentenceSlots[slotIndex]) return;
  const tokenId = sentenceSlots[slotIndex];
  sentenceSlots[slotIndex] = null;
  sentencePlacementHistory = sentencePlacementHistory.filter(id => id !== tokenId);
  sentenceWrong = false;
  renderSentence();
};

const undoSentenceToken = () => {
  if (sentenceSolved) return;
  while (sentencePlacementHistory.length) {
    const tokenId = sentencePlacementHistory.pop();
    const slotIndex = sentenceSlots.indexOf(tokenId);
    if (slotIndex < 0) continue;
    sentenceSlots[slotIndex] = null;
    sentenceWrong = false;
    renderSentence();
    return;
  }
};

document.addEventListener('click', event => {
  const screenButton = event.target.closest('[data-screen]');
  if (screenButton) { setScreen(screenButton.dataset.screen); return; }
  if (event.target.closest('#finalStartMission')) {
    const video = document.querySelector('.final-intro-video');
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    finalIntroVisible = false;
    resetFinalMission();
    musicController.play();
    renderFinalMission();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  if (event.target.closest('#finalIntroReplay')) {
    const video = document.querySelector('.final-intro-video');
    const replay = document.getElementById('finalIntroReplay');
    if (!video || video.hidden) return;
    musicController.pause();
    video.currentTime = 0;
    video.play().then(() => { replay.hidden = true; }).catch(() => { replay.hidden = false; musicController.play(); });
    return;
  }
  if (event.target.closest('#finalPlayAgain')) { resetFinalMission(); musicController.play(); renderFinalMission(); return; }
  if (event.target.closest('#finalHearAgain')) {
    cancelPendingAnnouncement();
    voiceController.play(wordVoice(currentFinalQuestion().audio));
    return;
  }
  const finalChoice = event.target.closest('[data-final-choice]');
  if (finalChoice && currentScreen === 'final' && !finalSubmitted) {
    finalSelection = finalChoice.dataset.finalChoice;
    renderFinalMission();
    return;
  }
  const finalToken = event.target.closest('[data-final-token-id]');
  if (finalToken && currentScreen === 'final' && !finalSubmitted) {
    if (!finalAnswerIds.includes(finalToken.dataset.finalTokenId)) finalAnswerIds.push(finalToken.dataset.finalTokenId);
    renderFinalMission();
    return;
  }
  const finalAnswerTile = event.target.closest('[data-final-answer-index]');
  if (finalAnswerTile && currentScreen === 'final' && !finalSubmitted) {
    finalAnswerIds.splice(Number(finalAnswerTile.dataset.finalAnswerIndex), 1);
    renderFinalMission();
    return;
  }
  if (event.target.closest('#finalBack')) {
    if (currentScreen === 'final' && !finalSubmitted) finalAnswerIds.pop();
    renderFinalMission();
    return;
  }
  if (event.target.closest('#finalSubmit')) { submitFinalAnswer(); return; }
  if (event.target.closest('#finalNext')) {
    if (!finalSubmitted) return;
    finalQuestionIndex += 1;
    if (finalQuestionIndex < finalMissionQuestions.length) prepareFinalQuestion();
    renderFinalMission();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const wordBlockButton = event.target.closest('[data-word-block]');
  if (wordBlockButton) {
    selectedWordBlock = wordBlockButton.dataset.wordBlock;
    activeGameMode = null;
    renderModeChoice('word');
    return;
  }
  const modeButton = event.target.closest('[data-game-mode]');
  if (modeButton) { startGameMode(modeButton.dataset.game, modeButton.dataset.gameMode); return; }
  if (event.target.closest('#wordPlayAgain')) { restartCurrentGame('word'); return; }
  if (event.target.closest('#colourPlayAgain')) { restartCurrentGame('colour'); return; }
  if (event.target.closest('#findPlayAgain')) { restartCurrentGame('find'); return; }
  if (event.target.closest('#pairPlayAgain')) { restartCurrentGame('pairs'); return; }
  if (event.target.closest('#sentencePlayAgain')) { resetSentenceMission(); musicController.play(); renderSentence(); return; }
  if (event.target.closest('#wordChooseWords')) {
    leaveGameMode();
    selectedWordBlock = null;
    render();
    return;
  }
  if (activeGameMode === 'timed' && timeChallenge.phase !== 'running' && !event.target.closest('#wordNext')) return;
  const voiceButton = event.target.closest('[data-voice-type]');
  if (voiceButton) { replayVoice(voiceButton); return; }
  const letterButton = event.target.closest('[data-letter-id]');
  if (letterButton) { handleWordLetter(letterButton); return; }
  const sentenceToken = event.target.closest('[data-sentence-token]');
  if (sentenceToken) {
    const emptyIndex = sentenceSlots.indexOf(null);
    if (emptyIndex >= 0) placeSentenceToken(sentenceToken.dataset.sentenceToken, emptyIndex);
    return;
  }
  const sentenceSlot = event.target.closest('[data-sentence-slot]');
  if (sentenceSlot) { removeSentenceToken(Number(sentenceSlot.dataset.sentenceSlot)); return; }
  if (event.target.closest('#sentenceBack')) { undoSentenceToken(); return; }
  if (event.target.closest('#sentenceHearAgain')) { voiceController.play(sentenceVoice(currentSentenceRound())); return; }
  if (event.target.closest('#sentenceNext')) {
    if (!sentenceSuccessReady) return;
    if (sentenceRound === sentenceRounds.length - 1) {
      sentenceMissionComplete = true;
      markGameComplete('sentence');
      renderSentence();
      playCompletionFeedback();
    } else {
      sentenceRound += 1;
      resetSentenceRound();
      renderSentence();
    }
    return;
  }
  if (event.target.closest('#wordReset')) {
    wordAnnouncedRound = -1;
    resetWordRound();
    renderWord();
    startWordHintCycle();
    announceWordRound();
    return;
  }
  if (event.target.closest('#wordNext')) {
    if (!wordSuccessReady) return;
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

document.addEventListener('dragstart', event => {
  if (currentScreen !== 'sentence' || sentenceSolved) return;
  const tokenCard = event.target.closest('[data-sentence-token]');
  const slot = event.target.closest('[data-sentence-slot]');
  const tokenId = tokenCard?.dataset.sentenceToken || sentenceSlots[Number(slot?.dataset.sentenceSlot)];
  if (!tokenId) { event.preventDefault(); return; }
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', tokenId);
});

document.addEventListener('dragover', event => {
  if (currentScreen === 'sentence' && event.target.closest('[data-sentence-slot], [data-sentence-bank]')) event.preventDefault();
});

document.addEventListener('drop', event => {
  if (currentScreen !== 'sentence' || sentenceSolved) return;
  const tokenId = event.dataTransfer.getData('text/plain');
  const slot = event.target.closest('[data-sentence-slot]');
  const bank = event.target.closest('[data-sentence-bank]');
  if (slot) {
    event.preventDefault();
    placeSentenceToken(tokenId, Number(slot.dataset.sentenceSlot));
  } else if (bank) {
    event.preventDefault();
    const sourceIndex = sentenceSlots.indexOf(tokenId);
    if (sourceIndex >= 0) removeSentenceToken(sourceIndex);
  }
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
