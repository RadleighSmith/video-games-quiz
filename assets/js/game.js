const question = document.getElementById("question");
const answerOptions = document.getElementById('answer-area');
const instructionsBtnHomepage = document.getElementById("intructions-btn-homepage");
const quizHomepageElements = document.querySelectorAll(".quiz-homepage");
const instructionsPage = document.getElementById("instruction-page");
const instructionBtn = document.getElementById("instruction-btn");
const questChoice = document.getElementById("question-choice");
const diffChoice = document.getElementById("difficulty-choice");
const startButton = document.getElementById("submit");
const gameContentArea = document.getElementById("question-number");
const questionCounterElement = document.getElementById("question-counter");
const answerCountersArea = document.getElementById("answer-counters-area");
const resultsPage = document.getElementById("results");
const resultsPageBtns = document.getElementById("results-page-btns");
const score = document.getElementById("score");
const resultsImg = document.getElementById('results-img');
const replayBtn = document.getElementById('replay');
const returnBtn = document.getElementById('return');

let answers = Array.from(document.getElementsByClassName("answers"));
let currentQuestion = {};
let questionCounter = 0;
let correctCount = 0;
let incorrectCount = 0;
let acceptInput = true;

let totalQuestions = [];
let questions = [];

/** 
 * Event Listener to show instructions page and hide quiz selection homepage 
 */
instructionsBtnHomepage.children[0].addEventListener("click", () => {
    toggleDisplay([
        instructionsBtnHomepage,
        instructionsPage,
        instructionBtn,
        ...quizHomepageElements,
    ]);
});

/** 
 * Event Listener to return to quiz selection homepage and hide instructions page
 */
instructionBtn.addEventListener("click", () => {
    toggleDisplay([
        instructionsBtnHomepage,
        instructionsPage,
        instructionBtn,
        ...quizHomepageElements,
    ]);
});

/** 
 * Function to construct the Quiz API URL based on user-selected options 
 */
function getQuestionsData() {
    const quest = questChoice.options[questChoice.selectedIndex].id;
    const diff = diffChoice.options[diffChoice.selectedIndex].id;

    return `https://opentdb.com/api.php?amount=${quest}&category=15&difficulty=${diff}&type=multiple`;
}

/** 
 * Function to retrieve quiz data from an API, format the questions, and initiate the game.
 * It fetches questions, randomly assigns correct answers with incorrect answers, 
 * and maps them to a formatted object.
 * If questions are available, it starts the game; otherwise, it displays an error message.;
 */
function getGameData() {
    fetch(getQuestionsData())
        .then(response => response.json())
        .then(loadedQuestions => {
            questions = loadedQuestions.results.map(loadedQuestion => {
                const formattedQuestion = {
                    question: loadedQuestion.question
                };
                const answerChoices = [...loadedQuestion.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
                answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

                answerChoices.forEach((answers, index) => {
                    formattedQuestion["answers" + (index + 1)] = answers;
                });

                return formattedQuestion;
            });
            if (questions.length > 0) {
                startGame();
            }
        })
        .catch(error => {
            console.error("Error:", error);
            Swal.fire({
                position: 'top',
                title: "Uh Oh! Error!",
                html: `Something went wrong, please try again`,
                icon: 'warning',
                showConfirmButton: false,
                timer: 2500,
                heightAuto: false,
            });
        });
}

/** 
 * Function to initialize the game, reset counters, and display necessary elements.
*/
function startGame() {
    totalQuestions = [...questions];
    questionCounter = 0;
    correctCount = 0;
    incorrectCount = 0;
    getNextQuestion();
    toggleDisplay([
        instructionsBtnHomepage,
        gameContentArea,
        question,
        answerOptions,
        answerCountersArea,
        ...quizHomepageElements,
    ]);
}

/**
 * Function to get the next question or end the game if no questions remain.
 * Updates the question counter and displays the next question.
 */
function getNextQuestion() {
    if (totalQuestions.length == 0) {
        toggleDisplay([
            gameContentArea,
            answerOptions,
            answerCountersArea,
            question,
            resultsImg,
            resultsPage,
            resultsPageBtns,
        ]);
        score.innerHTML = (`You Scored: ${correctCount}/${questChoice.value} `);
    } else {
        questionCounter++;
        questionCounterElement.innerText = (`${questionCounter}/${questChoice.value}`);
        let questIndex = Math.floor(Math.random() * totalQuestions.length);
        currentQuestion = totalQuestions[questIndex];
        question.innerHTML = currentQuestion.question;

        answers.forEach((answer, index) => {
            answer.innerHTML = currentQuestion["answers" + (index + 1)];
        });

        totalQuestions.splice(questIndex, 1);
        questions.splice(questIndex, 1);
        acceptInput = true;
    }
    answerResponse();
}

/**
 * Event listener for the start button.
 * Initiates the game by fetching and loading questions.
 */
startButton.addEventListener('click', () => {
    getGameData();

});

/**
 * Function to handle user's answer selection.
 * Triggers feedback and proceeds to next question.
 */
function answerResponse() {
    answers.forEach(answer => {
        answer.addEventListener("click", (event) => {
            const selectedAnswer = event.target;
            if (!acceptInput) return;
            acceptInput = false;
            const selectedAnswerChoice = selectedAnswer.dataset.answer;

            if (selectedAnswerChoice == currentQuestion.answer) {
                correctCount++;
                document.getElementById("correct-count").textContent = correctCount;
                Swal.fire({
                    position: 'center',
                    title: "You're Correct",
                    html: `${currentQuestion["answers" + currentQuestion.answer]} was the correct answer!`,
                    icon: 'success',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 2500,
                    heightAuto: false,
                }).then(() => getNextQuestion());
            } else {
                incorrectCount++;
                document.getElementById("incorrect-count").textContent = incorrectCount;
                Swal.fire({
                    position: 'center',
                    title: "You're Incorrect",
                    html: `The correct answer was ${currentQuestion["answers" + currentQuestion.answer]}`,
                    icon: 'error',
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    timer: 2500,
                    heightAuto: false,
                }).then(() => getNextQuestion());
            }
        });
    });
}

/**
 * Event listener to handle the return button click on the results page.
 * Toggles display to show the main quiz page and hide results.
 */
returnBtn.addEventListener("click", () => {
    toggleDisplay([
        resultsImg,
        resultsPage,
        resultsPageBtns,
        instructionsBtnHomepage,
        ...quizHomepageElements,
    ]);
});

/**
 * Event listener to handle the replay button click on the results page.
 * Starts a new game and toggles display to show the main quiz page and hide results.
 */
replayBtn.addEventListener("click", () => {
    getGameData();
    toggleDisplay([
        resultsImg,
        resultsPage,
        resultsPageBtns,
        ...quizHomepageElements,
        instructionsBtnHomepage,
    ]);
});

/**
 * Function to show and hide elements depending on current state
 * @param {HTMLElements} elements - items to toggle
 */
function toggleDisplay(elements) {
    elements.forEach((element) =>
        element.classList.contains("hide") ? element.classList.remove("hide") : element.classList.add("hide")
    );
}