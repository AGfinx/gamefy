// games-script.js
// Logic for the 4 educational Python games

// Utility to shuffle an array
function shuffleArray(array) {
    let copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// Global modal management
function openGame(gameId) {
    document.getElementById(`modal-${gameId}`).classList.add("active");
    // Initialize the specific game
    if(gameId === 'scramble') initScramble();
    if(gameId === 'quiz') initQuiz();
    if(gameId === 'matcher') initMatcher();
    if(gameId === 'tf') initTF();
}

function closeGame() {
    document.querySelectorAll('.game-modal').forEach(m => m.classList.remove('active'));
    // hide all feedbacks and rewards
    document.querySelectorAll('.game-feedback').forEach(f => {
        f.style.display = 'none';
        f.className = 'game-feedback'; // reset classes
    });
    document.querySelectorAll('.game-reward').forEach(r => r.style.display = 'none');
}

// Generic feedback display
function showFeedback(gameId, isSuccess, message) {
    const el = document.getElementById(`${gameId}-feedback`);
    el.textContent = message;
    el.className = 'game-feedback ' + (isSuccess ? 'feedback-success' : 'feedback-error');
    el.style.display = 'block';
}

function showReward(gameId, xp, gems) {
    const el = document.getElementById(`${gameId}-reward`);
    el.textContent = `💎 +${gems} Gems | ⭐ +${xp} XP`;
    el.style.display = 'block';
    
    // Animate header stats slightly by calling a global function if exists
    if(typeof rewardUser === 'function') {
        rewardUser(xp, gems);
    }
}


// ==========================================
// 1. WORD SCRAMBLE
// ==========================================
const scrambleWords = [
    "print", "import", "return", "def", "class", "while", "break",
    "continue", "lambda", "global", "yield", "except", "finally"
];
let currentScrambleWord = "";

function initScramble() {
    // Reset UI
    document.getElementById('scramble-input').value = "";
    document.getElementById('scramble-feedback').style.display = 'none';
    document.getElementById('scramble-reward').style.display = 'none';
    document.getElementById('scramble-input').disabled = false;
    
    // Pick word
    currentScrambleWord = scrambleWords[Math.floor(Math.random() * scrambleWords.length)];
    
    // Scramble it
    let scrambled = currentScrambleWord;
    while(scrambled === currentScrambleWord && scrambled.length > 1) {
        scrambled = shuffleArray(currentScrambleWord.split('')).join('');
    }
    
    document.getElementById('scramble-display').textContent = scrambled;
    setTimeout(() => document.getElementById('scramble-input').focus(), 100);
}

function handleScrambleEnter(e) {
    if (e.key === 'Enter') {
        checkScramble();
    }
}

function checkScramble() {
    if(document.getElementById('scramble-input').disabled) return;
    
    const input = document.getElementById('scramble-input').value.trim().toLowerCase();
    if (!input) return;
    
    if (input === currentScrambleWord) {
        showFeedback('scramble', true, "Correct! Well done.");
        showReward('scramble', 15, 10);
        document.getElementById('scramble-input').disabled = true;
        setTimeout(initScramble, 2000); // auto next after 2s
    } else {
        showFeedback('scramble', false, "Incorrect. Try again!");
        // shake effect could be added here
    }
}


// ==========================================
// 2. CODE QUIZ
// ==========================================
const quizQuestions = [
    {
        q: "What is the output of: print(2 ** 3)",
        options: ["6", "8", "9", "Error"],
        ans: 1
    },
    {
        q: "Which keyword is used to define a function in Python?",
        options: ["function", "def", "fun", "define"],
        ans: 1
    },
    {
        q: "What data type is the object: [1, 2, 3]?",
        options: ["List", "Tuple", "Dictionary", "Set"],
        ans: 0
    },
    {
        q: "How do you insert comments in Python code?",
        options: ["// comment", "/* comment */", "# comment", "<!-- comment -->"],
        ans: 2
    },
    {
        q: "Which function is used to get the length of a list?",
        options: ["length()", "size()", "count()", "len()"],
        ans: 3
    }
];
let currentQuizIndex = 0;

function initQuiz() {
    document.getElementById('quiz-feedback').style.display = 'none';
    document.getElementById('quiz-reward').style.display = 'none';
    document.getElementById('quiz-next-btn').style.display = 'none';
    
    const qObj = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    // Store current answer globally
    window.currentQuizAnswer = qObj.ans;
    window.quizAnswered = false;
    
    document.getElementById('quiz-question').textContent = qObj.q;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';
    
    qObj.options.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'quiz-option';
        btn.textContent = opt;
        btn.onclick = () => handleQuizOption(idx, btn);
        optionsContainer.appendChild(btn);
    });
}

function handleQuizOption(idx, btnElement) {
    if (window.quizAnswered) return;
    window.quizAnswered = true;
    
    const options = document.querySelectorAll('.quiz-option');
    options[window.currentQuizAnswer].style.borderColor = "var(--primary-green)";
    options[window.currentQuizAnswer].style.background = "#f0fff4";
    
    if (idx === window.currentQuizAnswer) {
        showFeedback('quiz', true, "Correct!");
        showReward('quiz', 20, 15);
    } else {
        btnElement.style.borderColor = "var(--primary-red)";
        btnElement.style.background = "#fff0f0";
        showFeedback('quiz', false, "Incorrect! Better luck next time.");
    }
    
    document.getElementById('quiz-next-btn').style.display = 'block';
}


// ==========================================
// 3. CONCEPT MATCHER
// ==========================================
const matchPairs = [
    { id: 't1', term: "String", id2: 'd1', def: "A sequence of characters" },
    { id: 't2', term: "Float", id2: 'd2', def: "A decimal number" },
    { id: 't3', term: "Boolean", id2: 'd3', def: "True or False value" },
    { id: 't4', term: "Dictionary", id2: 'd4', def: "Key-value pairs" }
];
let selectedTerm = null;
let selectedDef = null;
let matchesFound = 0;

function initMatcher() {
    matchesFound = 0;
    selectedTerm = null;
    selectedDef = null;
    
    document.getElementById('matcher-feedback').style.display = 'none';
    document.getElementById('matcher-reward').style.display = 'none';
    
    const termsCol = document.getElementById('match-col-terms');
    const defsCol = document.getElementById('match-col-defs');
    
    // Clear old (keep titles)
    Array.from(termsCol.children).forEach(c => { if(!c.classList.contains('match-col-title')) c.remove() });
    Array.from(defsCol.children).forEach(c => { if(!c.classList.contains('match-col-title')) c.remove() });
    
    // Shuffle logic
    const shuffledTerms = shuffleArray(matchPairs);
    const shuffledDefs = shuffleArray(matchPairs);
    
    shuffledTerms.forEach(pair => {
        const el = document.createElement('div');
        el.className = 'match-item term-item';
        el.textContent = pair.term;
        el.dataset.pairId = pair.id; // use pairs array logic
        el.onclick = () => selectMatchItem(el, 'term');
        termsCol.appendChild(el);
    });
    
    shuffledDefs.forEach(pair => {
        const el = document.createElement('div');
        el.className = 'match-item def-item';
        el.textContent = pair.def;
        el.dataset.pairId = pair.id;
        el.onclick = () => selectMatchItem(el, 'def');
        defsCol.appendChild(el);
    });
}

function selectMatchItem(element, type) {
    if (element.classList.contains('matched')) return;
    
    if (type === 'term') {
        document.querySelectorAll('.term-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        selectedTerm = element;
    } else {
        document.querySelectorAll('.def-item').forEach(el => el.classList.remove('selected'));
        element.classList.add('selected');
        selectedDef = element;
    }
    
    checkMatch();
}

function checkMatch() {
    if (selectedTerm && selectedDef) {
        if (selectedTerm.dataset.pairId === selectedDef.dataset.pairId) {
            // Match success
            selectedTerm.classList.remove('selected');
            selectedTerm.classList.add('matched');
            selectedDef.classList.remove('selected');
            selectedDef.classList.add('matched');
            selectedTerm = null;
            selectedDef = null;
            matchesFound++;
            
            showFeedback('matcher', true, "Matched!");
            setTimeout(() => document.getElementById('matcher-feedback').style.display = 'none', 1000);
            
            if (matchesFound === matchPairs.length) {
                showFeedback('matcher', true, "All concepts matched perfectly!");
                showReward('matcher', 50, 30);
            }
        } else {
            // Match failed
            showFeedback('matcher', false, "Incorrect match!");
            setTimeout(() => {
                if(selectedTerm) selectedTerm.classList.remove('selected');
                if(selectedDef) selectedDef.classList.remove('selected');
                selectedTerm = null;
                selectedDef = null;
                document.getElementById('matcher-feedback').style.display = 'none';
            }, 800);
        }
    }
}


// ==========================================
// 4. TRUE OR FALSE
// ==========================================
const tfQuestions = [
    { q: "Python is a compiled language.", a: false },
    { q: "Lists in Python are mutable.", a: true },
    { q: "Tuples use square brackets [].", a: false },
    { q: "Indentation matters in Python.", a: true },
    { q: "'True' and 'False' must be capitalized in Python.", a: true },
    { q: "Python strings can be changed after creation (mutable).", a: false }
];
let currentTFObj = null;

function initTF() {
    document.getElementById('tf-feedback').style.display = 'none';
    document.getElementById('tf-reward').style.display = 'none';
    document.getElementById('tf-next-btn').style.display = 'none';
    document.querySelectorAll('.tf-btn').forEach(btn => btn.disabled = false);
    
    currentTFObj = tfQuestions[Math.floor(Math.random() * tfQuestions.length)];
    document.getElementById('tf-statement').textContent = currentTFObj.q;
}

function checkTF(guess) {
    document.querySelectorAll('.tf-btn').forEach(btn => btn.disabled = true);
    
    if (guess === currentTFObj.a) {
        showFeedback('tf', true, "Correct!");
        showReward('tf', 15, 10);
    } else {
        showFeedback('tf', false, "Incorrect!");
    }
    
    document.getElementById('tf-next-btn').style.display = 'block';
}
