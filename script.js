const quizzes = [
    {
        title: 'General Knowledge Quiz',
        questions: [
            {
                question: 'What is the capital of France?',
                answers: [
                    { text: 'Berlin', correct: false },
                    { text: 'Madrid', correct: false },
                    { text: 'Paris', correct: true },
                    { text: 'Lisbon', correct: false }
                ]
            },
            {
                question: 'Who is the author of "Harry Potter"?',
                answers: [
                    { text: 'J.R.R. Tolkien', correct: false },
                    { text: 'J.K. Rowling', correct: true },
                    { text: 'Stephen King', correct: false },
                    { text: 'George R.R. Martin', correct: false }
                ]
            },
            {
                question: 'What is the largest planet in our solar system?',
                answers: [
                    { text: 'Earth', correct: false },
                    { text: 'Jupiter', correct: true },
                    { text: 'Saturn', correct: false },
                    { text: 'Mars', correct: false }
                ]
            }
        ]
    },
    {
        title: 'Science Quiz',
        questions: [
            {
                question: 'What is the chemical symbol for water?',
                answers: [
                    { text: 'HO', correct: false },
                    { text: 'H2O', correct: true },
                    { text: 'O2H', correct: false },
                    { text: 'OH', correct: false }
                ]
            },
            {
                question: 'What planet is known as the Red Planet?',
                answers: [
                    { text: 'Earth', correct: false },
                    { text: 'Mars', correct: true },
                    { text: 'Jupiter', correct: false },
                    { text: 'Saturn', correct: false }
                ]
            },
            {
                question: 'What is the speed of light?',
                answers: [
                    { text: '300,000 km/s', correct: true },
                    { text: '150,000 km/s', correct: false },
                    { text: '450,000 km/s', correct: false },
                    { text: '600,000 km/s', correct: false }
                ]
            }
        ]
    }
];

let currentQuiz, currentQuestionIndex, score, timerInterval;

const quizContainer = document.getElementById('quiz-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const shareButton = document.getElementById('share-btn');
const quizSelection = document.getElementById('quiz-selection');
const quizList = document.getElementById('quiz-list');
const quizTitle = document.getElementById('quiz-title');
const timerElement = document.getElementById('timer');

startQuizSelection();

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

restartButton.addEventListener('click', startQuizSelection);

shareButton.addEventListener('click', shareScore);

function startQuizSelection() {
    quizContainer.classList.add('hide');
    scoreContainer.classList.add('hide');
    quizSelection.classList.remove('hide');
    quizList.innerHTML = '';
    quizzes.forEach((quiz, index) => {
        const button = document.createElement('button');
        button.innerText = quiz.title;
        button.addEventListener('click', () => startQuiz(index));
        quizList.appendChild(button);
    });
}

function startQuiz(quizIndex) {
    quizSelection.classList.add('hide');
    quizContainer.classList.remove('hide');
    currentQuiz = quizzes[quizIndex];
    quizTitle.innerText = currentQuiz.title;
    currentQuestionIndex = 0;
    score = 0;
    setNextQuestion();
}

function setNextQuestion() {
    resetState();
    showQuestion(currentQuiz.questions[currentQuestionIndex]);
    startTimer();
}

function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) score++;
    clearInterval(timerInterval); // Stop timer when answer is selected
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
    });
    nextButton.classList.remove('hide');
}

function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

function showScore() {
    quizContainer.classList.add('hide');
    scoreContainer.classList.remove('hide');
    scoreElement.innerText = `${score} out of ${currentQuiz.questions.length}`;
}

function startTimer() {
    let timeLeft = 30;
    timerElement.innerText = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            selectAnswer({ target: { dataset: { correct: false }} });
        }
    }, 1000);
}

function shareScore() {
    const shareText = `I scored ${score} out of ${currentQuiz.questions.length} in the ${currentQuiz.title}! Try the quiz yourself: ${window.location.href}`;
    if (navigator.share) {
        navigator.share({
            title: 'Quiz Score',
            text: shareText
        });
    } else {
        alert('Sorry, your browser does not support the Web Share API.');
    }
}

if ('navigator' in window && 'share' in navigator) {
    shareButton.style.display = 'block';
} else {
    shareButton.style.display = 'none';
}