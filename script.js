// Game State
let teams = [];
let questions = {
    1: [
        {
            question: "Apa ibukota Indonesia?",
            options: ["Surabaya", "Jakarta", "Bandung", "Medan"],
            correct: 1,
            points: 100
        },
        {
            question: "Apa nama hewan terbesar di dunia?",
            options: ["Gajah", "Paus Biru", "Hiu Paus", "Beruang Kutub"],
            correct: 1,
            points: 200
        },
        {
            question: "Apa nama gunung tertinggi di dunia?",
            options: ["K2", "Kangchenjunga", "Everest", "Lhotse"],
            correct: 2,
            points: 300
        },
        {
            question: "Apa nama teori besar tentang asal usul alam semesta?",
            options: ["Teori Relativitas", "Teori Kuantum", "Teori Big Bang", "Teori Evolusi"],
            correct: 2,
            points: 400
        }
    ],
    2: [
        {
            question: "Berapa jumlah provinsi di Indonesia?",
            options: ["34", "35", "36", "38"],
            correct: 3,
            points: 100
        },
        {
            question: "Berapa jumlah planet di tata surya kita?",
            options: ["7", "8", "9", "10"],
            correct: 1,
            points: 200
        },
        {
            question: "Berapa jumlah tulang pada tubuh manusia dewasa?",
            options: ["200", "206", "210", "215"],
            correct: 1,
            points: 300
        },
        {
            question: "Berapa kecepatan cahaya dalam km per detik?",
            options: ["300.000", "299.792", "298.000", "301.000"],
            correct: 1,
            points: 400
        }
    ],
    3: [
        {
            question: "Siapa presiden pertama Indonesia?",
            options: ["Soeharto", "Habibie", "Soekarno", "Megawati"],
            correct: 2,
            points: 100
        },
        {
            question: "Apa nama sungai terpanjang di dunia?",
            options: ["Amazon", "Nil", "Yangtze", "Mississippi"],
            correct: 1,
            points: 200
        },
        {
            question: "Apa nama samudra terbesar di dunia?",
            options: ["Samudra Atlantik", "Samudra Hindia", "Samudra Pasifik", "Samudra Arktik"],
            correct: 2,
            points: 300
        },
        {
            question: "Apa nama partikel subatomik yang memiliki muatan negatif?",
            options: ["Proton", "Neutron", "Elektron", "Foton"],
            correct: 2,
            points: 400
        }
    ],
    4: [
        {
            question: "Kapan Indonesia merdeka?",
            options: ["17 Agustus 1945", "28 Oktober 1928", "10 November 1945", "1 Juni 1945"],
            correct: 0,
            points: 100
        },
        {
            question: "Siapa penemu bola lampu?",
            options: ["Nikola Tesla", "Alexander Graham Bell", "Thomas Edison", "Albert Einstein"],
            correct: 2,
            points: 200
        },
        {
            question: "Siapa penulis novel 'Laskar Pelangi'?",
            options: ["Pramoedya Ananta Toer", "Andrea Hirata", "Ayu Utami", "Eka Kurniawan"],
            correct: 1,
            points: 300
        },
        {
            question: "Siapa ilmuwan yang merumuskan teori relativitas?",
            options: ["Isaac Newton", "Galileo Galilei", "Albert Einstein", "Stephen Hawking"],
            correct: 2,
            points: 400
        }
    ]
};
let currentRound = 0;
let currentTeamIndex = null;
let selectedQuestion = null;
let buzzerPressed = false;

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const questionModal = document.getElementById('question-modal');
const teamModal = document.getElementById('team-modal');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const closeModalBtn = document.getElementById('close-modal');
const closeTeamModalBtn = document.getElementById('close-team-modal');

// Initialize
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetGame);
closeModalBtn.addEventListener('click', closeModal);
closeTeamModalBtn.addEventListener('click', closeTeamModal);

// Setup buzzer buttons
document.querySelectorAll('.buzzer-btn').forEach(btn => {
    btn.addEventListener('click', handleBuzzer);
});

function startGame() {
    // Get team names and initial points
    teams = [];
    for (let i = 1; i <= 4; i++) {
        const nameInput = document.getElementById(`team${i}`);
        const pointsInput = document.getElementById(`team${i}-points`);
        teams.push({
            name: nameInput.value || `Tim ${i}`,
            score: parseInt(pointsInput.value) || 0,
            questionsAnswered: 0
        });
    }

    // Initialize game state
    currentRound = 0;
    currentTeamIndex = null;

    // Update UI
    updateTeamDisplay();
    createQuestionButtons();
    updateRoundInfo();

    // Switch screens
    setupScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
}

function updateTeamDisplay() {
    teams.forEach((team, index) => {
        document.getElementById(`team-name-${index}`).textContent = team.name;
        document.getElementById(`team-score-${index}`).textContent = team.score;
        document.getElementById(`team-answered-${index}`).textContent = team.questionsAnswered;
    });

    // Highlight current team
    document.querySelectorAll('.team-card').forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentTeamIndex) {
            card.classList.add('active');
        }
    });
}

function createQuestionButtons() {
    [1, 2, 3, 4].forEach(row => {
        const container = document.getElementById(`row-${row}-buttons`);
        container.innerHTML = '';

        questions[row].forEach((question, index) => {
            const btn = document.createElement('button');
            btn.className = 'question-btn';
            btn.dataset.row = row;
            btn.dataset.index = index;
            btn.dataset.points = question.points;
            btn.textContent = `${question.points} Poin`;
            btn.addEventListener('click', () => selectQuestion(row, index));
            container.appendChild(btn);
        });
    });
}

function updateRoundInfo() {
    const totalQuestions = 16;
    const answeredQuestions = teams.reduce((sum, team) => sum + team.questionsAnswered, 0);
    document.getElementById('round-number').textContent = answeredQuestions + 1;
    document.getElementById('questions-remaining').textContent = totalQuestions - answeredQuestions;
}

function selectQuestion(row, index) {
    // Check if question is already taken
    const btn = document.querySelector(`.question-btn[data-row="${row}"][data-index="${index}"]`);
    if (btn.disabled) {
        alert('Soal ini sudah dipilih!');
        return;
    }

    // Store selected question
    selectedQuestion = {
        row: row,
        index: index,
        points: questions[row][index].points,
        text: questions[row][index].question,
        data: questions[row][index]
    };

    // Show team selection modal
    showTeamSelection();
}

function showTeamSelection() {
    const teamSelection = document.getElementById('team-selection');
    teamSelection.innerHTML = '';

    teams.forEach((team, index) => {
        // Check if team has already answered 4 questions
        if (team.questionsAnswered >= 4) {
            return;
        }

        const btn = document.createElement('button');
        btn.className = 'team-select-btn';
        btn.textContent = team.name;
        btn.addEventListener('click', () => selectTeam(index));
        teamSelection.appendChild(btn);
    });

    // Check if all teams have answered 4 questions
    if (teamSelection.children.length === 0) {
        alert('Semua tim sudah menjawab 4 soal!');
        return;
    }

    teamModal.classList.remove('hidden');
}

function selectTeam(index) {
    currentTeamIndex = index;
    closeTeamModal();

    const team = teams[currentTeamIndex];

    // Show question modal with options
    document.getElementById('modal-points').textContent = selectedQuestion.points;
    document.getElementById('modal-question').textContent = selectedQuestion.text;
    createAnswerOptions();
    questionModal.classList.remove('hidden');
}

function createAnswerOptions() {
    const questionData = selectedQuestion.data;
    const answerContainer = document.getElementById('answer-options');
    const answerFeedback = document.getElementById('answer-feedback');
    answerContainer.innerHTML = '';
    answerFeedback.textContent = '';
    answerFeedback.classList.add('hidden');

    const revealButton = document.createElement('button');
    revealButton.type = 'button';
    revealButton.className = 'answer-action-btn reveal';
    revealButton.textContent = 'Jawaban';
    revealButton.addEventListener('click', () => {
        answerFeedback.textContent = `Jawaban: ${questionData.options[questionData.correct]}`;
        answerFeedback.classList.remove('hidden');
        answerContainer.querySelectorAll('.answer-action-btn:not(.reveal)').forEach(btn => {
            btn.disabled = false;
        });
        revealButton.disabled = true;
    });
    answerContainer.appendChild(revealButton);

    const judgmentButtons = document.createElement('div');
    judgmentButtons.className = 'answer-judgment-buttons';
    [
        { label: 'Benar', isCorrect: true, className: 'correct' },
        { label: 'Salah', isCorrect: false, className: 'incorrect' }
    ].forEach(option => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `answer-action-btn ${option.className}`;
        btn.textContent = option.label;
        btn.disabled = true;
        btn.addEventListener('click', () => handleOptionAnswer(option.isCorrect));
        judgmentButtons.appendChild(btn);
    });
    answerContainer.appendChild(judgmentButtons);
}

function closeModal() {
    questionModal.classList.add('hidden');
    selectedQuestion = null;
    // Reset answer options
    const answerContainer = document.getElementById('answer-options');
    answerContainer.innerHTML = '';
    const answerFeedback = document.getElementById('answer-feedback');
    answerFeedback.textContent = '';
    answerFeedback.classList.add('hidden');
}

function handleOptionAnswer(isCorrect) {
    const buttons = document.querySelectorAll('.answer-action-btn:not(.reveal)');
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    // Delay before handling answer
    setTimeout(() => {
        handleAnswer(isCorrect);
    }, 1500);
}

function closeTeamModal() {
    teamModal.classList.add('hidden');
}

function handleAnswer(isCorrect) {
    const team = teams[currentTeamIndex];
    const points = selectedQuestion.points;

    if (isCorrect) {
        team.score += points;
    } else {
        team.score -= points;
    }

    team.questionsAnswered++;

    // Disable the question button
    const btn = document.querySelector(`.question-btn[data-row="${selectedQuestion.row}"][data-index="${selectedQuestion.index}"]`);
    btn.disabled = true;

    // Update displays
    updateTeamDisplay();
    updateRoundInfo();

    // Close modal
    closeModal();

    // Reset current team index
    currentTeamIndex = null;

    // Check if game is over
    if (isGameOver()) {
        showResults();
        return;
    }
}



function isGameOver() {
    return teams.every(team => team.questionsAnswered >= 4);
}

function showResults() {
    gameScreen.classList.add('hidden');
    resultsScreen.classList.remove('hidden');

    // Sort teams by score (descending)
    const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

    // Display rankings
    document.getElementById('rank1-name').textContent = sortedTeams[0].name;
    document.getElementById('rank1-score').textContent = sortedTeams[0].score;
    document.getElementById('rank2-name').textContent = sortedTeams[1].name;
    document.getElementById('rank2-score').textContent = sortedTeams[1].score;
    document.getElementById('rank3-name').textContent = sortedTeams[2].name;
    document.getElementById('rank3-score').textContent = sortedTeams[2].score;
    document.getElementById('rank4-name').textContent = sortedTeams[3].name;
    document.getElementById('rank4-score').textContent = sortedTeams[3].score;

    // Check for ties
    const tieGroups = findTies(sortedTeams);
    if (tieGroups.length > 0) {
        showTieBreaker(tieGroups);
    }
}

function findTies(sortedTeams) {
    const tieGroups = [];
    let currentGroup = [sortedTeams[0]];

    for (let i = 1; i < sortedTeams.length; i++) {
        if (sortedTeams[i].score === sortedTeams[i-1].score) {
            currentGroup.push(sortedTeams[i]);
        } else {
            if (currentGroup.length > 1) {
                tieGroups.push([...currentGroup]);
            }
            currentGroup = [sortedTeams[i]];
        }
    }

    if (currentGroup.length > 1) {
        tieGroups.push(currentGroup);
    }

    return tieGroups;
}

function showTieBreaker(tieGroups) {
    const tieSection = document.getElementById('tie-breaker-section');
    const tieMessage = document.getElementById('tie-message');
    
    let message = 'Tie detected antara: ';
    tieGroups.forEach((group, index) => {
        const teamNames = group.map(t => t.name).join(' dan ');
        message += teamNames;
        if (index < tieGroups.length - 1) message += ', ';
    });
    
    tieMessage.textContent = message;
    tieSection.classList.remove('hidden');

    // Enable buzzer buttons for tied teams
    buzzerPressed = false;
    document.querySelectorAll('.buzzer-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('pressed');
    });
    document.getElementById('buzzer-result').textContent = '';
}

function handleBuzzer(e) {
    if (buzzerPressed) return;

    buzzerPressed = true;
    const teamIndex = parseInt(e.target.dataset.team);
    const team = teams[teamIndex];

    // Disable all buzzers
    document.querySelectorAll('.buzzer-btn').forEach(btn => {
        btn.disabled = true;
    });

    // Highlight pressed buzzer
    e.target.classList.add('pressed');

    // Show result
    document.getElementById('buzzer-result').textContent = 
        `${team.name} menekan buzzer pertama!`;

    // In a real implementation, you would have a tie-breaker question here
    // For now, we'll just award the tie-breaker win to the first buzzer
    // You can extend this to ask a tie-breaker question
}

function resetGame() {
    // Reset all state
    teams = [];
    currentRound = 0;
    currentTeamIndex = null;
    selectedQuestion = null;
    buzzerPressed = false;

    // Clear inputs
    document.querySelectorAll('.team-inputs input').forEach(input => {
        input.value = '';
    });

    // Hide tie-breaker section
    document.getElementById('tie-breaker-section').classList.add('hidden');

    // Switch screens
    resultsScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
}
