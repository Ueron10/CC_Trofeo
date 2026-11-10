// Game State
let teams = [];
let pointsTeams = [];
let questions = {
    1: [
        {
            question: "Apa nama samudra terbesar di dunia?",
            options: ["Samudra Atlantik", "Samudra Hindia", "Samudra Pasifik", "Samudra Arktik"],
            correct: 2
        },
        {
            question: "Apa nama garis khayal yang membagi bumi menjadi belahan utara dan selatan?",
            options: ["Garis Balik Utara", "Garis Khatulistiwa", "Garis Meridian", "Garis Tanggal Internasional"],
            correct: 1
        },
        {
            question: "Siapa nama panglima perang Kerajaan Majapahit yang terkenal dengan Sumpah Palapa?",
            options: ["Gajah Mada", "Hayam Wuruk", "Raden Wijaya", "Ken Arok"],
            correct: 0
        },
        {
            question: "Pada tahun berapa Perang Dunia II berakhir?",
            options: ["1939", "1942", "1945", "1948"],
            correct: 2
        }
    ],
    2: [
        {
            question: "Siapa ilmuwan yang mengemukakan tiga hukum gerak?",
            options: ["Galileo Galilei", "Albert Einstein", "Isaac Newton", "Charles Darwin"],
            correct: 2
        },
        {
            question: "Apa nama mineral alami yang memiliki tingkat kekerasan tertinggi?",
            options: ["Emas", "Berlian", "Kuarsa", "Safir"],
            correct: 1
        },
        {
            question: "Apa nama teknologi yang memungkinkan perangkat bertukar data melalui koneksi nirkabel dalam jarak dekat?",
            options: ["Wi-Fi", "NFC", "Bluetooth", "Inframerah"],
            correct: 2
        },
        {
            question: "Apa nama sistem operasi yang dikembangkan oleh Google untuk smartphone?",
            options: ["iOS", "Android", "Windows Phone", "HarmonyOS"],
            correct: 1
        }
    ],
    3: [
        {
            question: "Dalam serial Squid Game, apa nomor peserta yang dikenakan oleh karakter utama Seong Gi-hun?",
            options: ["001", "067", "456", "218"],
            correct: 2
        },
        {
            question: "Siapa sutradara film Inception dan Interstellar?",
            options: ["Christopher Nolan", "Steven Spielberg", "Denis Villeneuve", "James Cameron"],
            correct: 0
        },
        {
            question: "Perhatikan gambar grup musik Korea Selatan berikut. Apa nama grup musik tersebut?",
            image: "soal11.jfif",
            options: ["BLACKPINK", "TWICE", "aespa", "ITZY"],
            correct: 2
        },
        {
            question: "Perhatikan gambar tersebut. Siapakah tokoh yang dikenal sebagai meme tertawa tersebut?",
            image: "soal12.jpeg",
            options: ["Jackie Chan", "Yao Ming", "Bruce Lee", "Jet Li"],
            correct: 1
        }
    ],
    4: [
        {
            question: "Apa nama penguin yang terkenal dengan suara khas \"Noot Noot\"?",
            image: "soal13.jfif",
            options: ["Pingu", "Pororo", "Tux", "Skipper"],
            correct: 0
        },
        {
            question: "Kamu sedang tidur dan tiba-tiba bel rumah berbunyi. Ada tamu membawa sarapan. Apa yang pertama kali kamu buka?",
            options: ["Mata", "Pintu", "Mulut", "Jendela"],
            correct: 0
        },
        {
            question: "Tebak film dari emoji:",
            emoji: "🏠🎈👴",
            options: ["Up", "Coco", "Toy Story", "Inside Out"],
            correct: 0
        },
        {
            question: "Tebak lagu dari emoji:",
            emoji: "🚶‍♂️⚠️🛣️",
            options: ["Hati-Hati di Jalan - Tulus", "Monokrom - Tulus", "Diri - Tulus", "Sewindu - Tulus"],
            correct: 0
        }
    ]
};
let currentRound = 0;
let currentTeamIndex = null;
let selectedQuestion = null;
let questionLocked = false;
let buzzerPressed = false;

// DOM Elements
const setupScreen = document.getElementById('setup-screen');
const homeScreen = document.getElementById('home-screen');
const pointsSetupScreen = document.getElementById('points-setup-screen');
const pointsScreen = document.getElementById('points-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const questionModal = document.getElementById('question-modal');
const teamModal = document.getElementById('team-modal');
const minimumBidModal = document.getElementById('minimum-bid-modal');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const closeModalBtn = document.getElementById('close-modal');
const closeTeamModalBtn = document.getElementById('close-team-modal');
const bidAmountInput = document.getElementById('bid-amount');

// Initialize
document.getElementById('points-mode-btn').addEventListener('click', () => {
    homeScreen.classList.add('hidden');
    pointsSetupScreen.classList.remove('hidden');
    document.body.classList.add('header-hidden');
});
document.getElementById('competition-mode-btn').addEventListener('click', () => {
    homeScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
    document.body.classList.remove('header-hidden');
});
document.getElementById('points-setup-back-btn').addEventListener('click', () => {
    pointsSetupScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    document.body.classList.add('header-hidden');
});
document.getElementById('competition-home-btn').addEventListener('click', () => {
    setupScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    document.body.classList.add('header-hidden');
});
document.getElementById('points-start-btn').addEventListener('click', startPointsBoard);
const pointsTeamCountInput = document.getElementById('points-team-count');
pointsTeamCountInput.addEventListener('change', updatePointsTeamInputs);
updatePointsTeamInputs();
document.getElementById('points-home-btn').addEventListener('click', () => {
    pointsScreen.classList.add('hidden');
    homeScreen.classList.remove('hidden');
    document.body.classList.add('header-hidden');
});
document.getElementById('points-scoreboard').addEventListener('click', handlePointsChange);
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', resetGame);
closeModalBtn.addEventListener('click', closeModal);
closeTeamModalBtn.addEventListener('click', closeTeamModal);
document.getElementById('confirm-bid-btn').addEventListener('click', confirmBid);
document.getElementById('minimum-bid-continue-btn').addEventListener('click', () => {
    minimumBidModal.classList.add('hidden');
    showTeamSelection();
});
window.addEventListener('resize', positionActiveGameModal);

// Setup buzzer buttons
document.querySelectorAll('.buzzer-btn').forEach(btn => {
    btn.addEventListener('click', handleBuzzer);
});

function startPointsBoard() {
    pointsTeams = [];
    const teamCount = Number(pointsTeamCountInput.value);
    for (let i = 1; i <= teamCount; i++) {
        const name = document.getElementById(`points-team${i}`).value.trim();
        const scoreInput = document.getElementById(`points-team${i}-score`);
        const score = Number(scoreInput.value);
        pointsTeams.push({
            name: name || `Tim ${i}`,
            score: Number.isFinite(score) ? score : 0
        });
    }

    renderPointsBoard();
    pointsSetupScreen.classList.add('hidden');
    pointsScreen.classList.remove('hidden');
    document.body.classList.add('header-hidden');
}

function updatePointsTeamInputs() {
    const teamCount = Number(pointsTeamCountInput.value);
    document.querySelectorAll('[data-points-team-row]').forEach(row => {
        row.classList.toggle('hidden', Number(row.dataset.pointsTeamRow) > teamCount);
    });
}

function renderPointsBoard() {
    const scoreboard = document.getElementById('points-scoreboard');
    scoreboard.innerHTML = '';

    pointsTeams.forEach((team, index) => {
        const card = document.createElement('div');
        card.className = 'team-card points-team-card';

        const name = document.createElement('h3');
        name.textContent = team.name;

        const score = document.createElement('p');
        score.className = 'score';
        score.textContent = `Poin: ${team.score}`;
        score.setAttribute('aria-live', 'polite');

        const controls = document.createElement('div');
        controls.className = 'points-controls';
        [
            { label: '−10', amount: -10, description: `Kurangi 10 poin ${team.name}` },
            { label: '+10', amount: 10, description: `Tambah 10 poin ${team.name}` }
        ].forEach(control => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `points-control-btn ${control.amount > 0 ? 'add' : 'subtract'}`;
            button.dataset.teamIndex = index;
            button.dataset.amount = control.amount;
            button.textContent = control.label;
            button.setAttribute('aria-label', control.description);
            controls.appendChild(button);
        });

        card.append(name, score, controls);
        scoreboard.appendChild(card);
    });
}

function handlePointsChange(event) {
    const button = event.target.closest('.points-control-btn');
    if (!button) return;

    const teamIndex = Number(button.dataset.teamIndex);
    const amount = Number(button.dataset.amount);
    const team = pointsTeams[teamIndex];
    if (!team || !Number.isFinite(amount)) return;

    team.score += amount;
    renderPointsBoard();
}

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
    questionLocked = false;
    Object.values(questions).forEach(categoryQuestions => {
        categoryQuestions.forEach(question => {
            question.minimumBid = (Math.floor(Math.random() * 5) + 1) * 10;
        });
    });

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
            btn.dataset.questionNumber = (row - 1) * questions[row].length + index + 1;
            btn.textContent = btn.dataset.questionNumber;
            btn.addEventListener('click', () => selectQuestion(row, index));
            container.appendChild(btn);
        });
    });
}

function updateRoundInfo() {
    const totalQuestions = 16;
    const answeredQuestions = Math.min(
        totalQuestions,
        teams.reduce((sum, team) => sum + team.questionsAnswered, 0)
    );
    const progressTrack = document.querySelector('.round-progress-track');
    document.getElementById('round-number').textContent = Math.min(answeredQuestions + 1, totalQuestions);
    document.getElementById('questions-remaining').textContent = totalQuestions - answeredQuestions;
    document.getElementById('questions-completed').textContent = answeredQuestions;
    document.getElementById('round-progress-fill').style.width = `${(answeredQuestions / totalQuestions) * 100}%`;
    progressTrack.setAttribute('aria-valuenow', answeredQuestions);
}

function selectQuestion(row, index) {
    // Check if question is already taken
    const btn = document.querySelector(`.question-btn[data-row="${row}"][data-index="${index}"]`);
    if (btn.disabled) {
        alert('Soal ini sudah dipilih!');
        return;
    }

    const question = questions[row][index];
    // Store selected question
    selectedQuestion = {
        row: row,
        index: index,
        number: (row - 1) * questions[row].length + index + 1,
        minimumBid: question.minimumBid,
        text: question.question,
        data: question
    };

    questionLocked = true;
    closeTeamModalBtn.classList.add('hidden');
    closeModalBtn.classList.add('hidden');
    document.getElementById('minimum-bid-value').textContent = selectedQuestion.minimumBid;
    document.querySelector('#game-screen .section-heading:not(.question-section-heading)')
        .scrollIntoView({ block: 'center' });
    minimumBidModal.classList.remove('hidden');
    positionActiveGameModal();
}

function positionGameModal(modal) {
    const standingsHeading = document.querySelector('#game-screen .section-heading:not(.question-section-heading)');
    const questionHeading = document.querySelector('#game-screen .question-section-heading');
    const popup = modal.querySelector('.board-anchored-modal-content');
    const container = document.querySelector('.container');
    if (!standingsHeading || !questionHeading || !popup || !container) return;

    const standingsRect = standingsHeading.getBoundingClientRect();
    const questionRect = questionHeading.getBoundingClientRect();
    const popupRect = popup.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const margin = 16;
    const centerX = standingsRect.left + standingsRect.width / 2;
    const centerY = (
        standingsRect.top + standingsRect.height / 2 +
        questionRect.top + questionRect.height / 2
    ) / 2;
    const minX = Math.max(margin, containerRect.left + margin) + popupRect.width / 2;
    const maxX = Math.min(window.innerWidth - margin, containerRect.right - margin) - popupRect.width / 2;
    const minY = Math.max(margin, containerRect.top + margin) + popupRect.height / 2;
    const maxY = Math.min(window.innerHeight - margin, containerRect.bottom - margin) - popupRect.height / 2;
    const x = Math.max(minX, Math.min(centerX, maxX));
    const y = Math.max(minY, Math.min(centerY, maxY));

    modal.style.setProperty('--game-modal-x', `${x - containerRect.left}px`);
    modal.style.setProperty('--game-modal-y', `${y - containerRect.top}px`);
}

function positionActiveGameModal() {
    [minimumBidModal, teamModal, questionModal].forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            positionGameModal(modal);
        }
    });
}

function showTeamSelection() {
    const teamSelection = document.getElementById('team-selection');
    teamSelection.innerHTML = '';

    teams.forEach((team, index) => {
        const btn = document.createElement('button');
        btn.className = 'team-select-btn';
        btn.textContent = team.name;
        btn.addEventListener('click', () => selectTeam(index));
        teamSelection.appendChild(btn);
    });

    if (teamSelection.children.length === 0) {
        questionLocked = false;
        selectedQuestion = null;
        closeTeamModalBtn.classList.remove('hidden');
        closeModalBtn.classList.remove('hidden');
        return;
    }

    teamModal.classList.remove('hidden');
    positionActiveGameModal();
}

function selectTeam(index) {
    currentTeamIndex = index;
    closeTeamModal(true);

    const team = teams[currentTeamIndex];

    document.getElementById('modal-question-number').textContent = selectedQuestion.number;
    document.getElementById('auction-team-info').textContent =
        `${team.name} memiliki ${team.score} poin.`;
    document.getElementById('bid-minimum').textContent = selectedQuestion.minimumBid;
    const maximumBid = Math.max(team.score, selectedQuestion.minimumBid);
    document.getElementById('bid-maximum').textContent = maximumBid;
    bidAmountInput.value = '';
    bidAmountInput.min = selectedQuestion.minimumBid;
    bidAmountInput.max = maximumBid;
    document.getElementById('bid-error').textContent = '';
    document.getElementById('bid-error').classList.add('hidden');
    document.getElementById('auction-stage').classList.remove('hidden');
    document.getElementById('question-stage').classList.add('hidden');
    questionModal.classList.remove('hidden');
    positionActiveGameModal();
}

function confirmBid() {
    const team = teams[currentTeamIndex];
    const bid = Number(bidAmountInput.value);
    const bidError = document.getElementById('bid-error');

    const maximumBid = team ? Math.max(team.score, selectedQuestion.minimumBid) : 0;
    if (!team || !Number.isInteger(bid) || bid < selectedQuestion.minimumBid || bid > maximumBid) {
        bidError.textContent =
            `Masukkan lelang antara ${selectedQuestion.minimumBid} hingga ${maximumBid} poin.`;
        bidError.classList.remove('hidden');
        return;
    }

    selectedQuestion.bid = bid;
    document.getElementById('auction-stage').classList.add('hidden');
    document.getElementById('question-stage').classList.remove('hidden');
    const modalQuestion = document.getElementById('modal-question');
    modalQuestion.textContent = selectedQuestion.text;
    modalQuestion.classList.toggle('emoji-question', Boolean(selectedQuestion.data.emoji));
    if (selectedQuestion.data.emoji) {
        const emoji = document.createElement('span');
        emoji.className = 'question-emoji';
        emoji.textContent = selectedQuestion.data.emoji;
        modalQuestion.append(' ', emoji);
    }
    const questionMedia = document.getElementById('question-media');
    const questionImage = document.getElementById('question-image');
    if (selectedQuestion.data.image) {
        questionImage.src = selectedQuestion.data.image;
        questionImage.alt = `Gambar untuk soal nomor ${selectedQuestion.number}`;
        questionMedia.classList.remove('hidden');
    } else {
        questionImage.removeAttribute('src');
        questionImage.alt = '';
        questionMedia.classList.add('hidden');
    }
    createAnswerOptions();
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
    if (questionLocked) return;
    closeModalBtn.disabled = false;
    questionModal.classList.add('hidden');
    selectedQuestion = null;
    currentTeamIndex = null;
    document.getElementById('auction-stage').classList.remove('hidden');
    document.getElementById('question-stage').classList.add('hidden');
    bidAmountInput.value = '';
    document.getElementById('bid-error').textContent = '';
    document.getElementById('bid-error').classList.add('hidden');
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
    closeModalBtn.disabled = true;

    const answerFeedback = document.getElementById('answer-feedback');
    answerFeedback.textContent = isCorrect
        ? 'Jawaban benar! +50 poin.'
        : `Jawaban salah! -${selectedQuestion.bid} poin.`;
    answerFeedback.classList.remove('hidden');

    // Delay before handling answer
    setTimeout(() => {
        closeModalBtn.disabled = false;
        handleAnswer(isCorrect);
    }, 1500);
}

function closeTeamModal(force = false) {
    if (questionLocked && !force) return;
    teamModal.classList.add('hidden');
}

function handleAnswer(isCorrect) {
    const team = teams[currentTeamIndex];

    if (isCorrect) {
        team.score += 50;
    } else {
        team.score -= selectedQuestion.bid;
    }

    team.questionsAnswered++;

    // Disable the question button
    const btn = document.querySelector(`.question-btn[data-row="${selectedQuestion.row}"][data-index="${selectedQuestion.index}"]`);
    btn.disabled = true;

    // Update displays
    updateTeamDisplay();
    updateRoundInfo();

    // Close modal
    questionLocked = false;
    closeModal();
    closeTeamModalBtn.classList.remove('hidden');
    closeModalBtn.classList.remove('hidden');

    // Reset current team index
    currentTeamIndex = null;

    // Check if game is over
    if (isGameOver()) {
        showResults();
        return;
    }
}



function isGameOver() {
    return teams.reduce((sum, team) => sum + team.questionsAnswered, 0) >= 16;
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
    questionLocked = false;
    buzzerPressed = false;

    // Clear inputs
    setupScreen.querySelectorAll('.team-inputs input').forEach(input => {
        input.value = '';
    });

    // Hide tie-breaker section
    document.getElementById('tie-breaker-section').classList.add('hidden');

    // Switch screens
    resultsScreen.classList.add('hidden');
    setupScreen.classList.remove('hidden');
    document.body.classList.remove('header-hidden');
}
