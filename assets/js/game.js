const question = document.getElementById("question");
const answerOptions = document.getElementById('answer-area');
let answers = Array.from(document.getElementsByClassName("answers"));
const instructionsBtnHomepage = document.getElementById("intructions-btn-homepage");
const quizHomepageElements = document.querySelectorAll(".quiz-homepage");
const instructionsPage = document.getElementById("instruction-page");
const instructionBtn = document.getElementById("instruction-btn");
const questChoice = document.getElementById("question-choice");
const diffChoice = document.getElementById("difficulty-choice");
const startButton = document.getElementById("submit");
const gameContentArea = document.getElementById("question-number");
const answerCountersArea = document.getElementById("answer-counters-area");
const resultsPage = document.getElementById("results");
const resultsPageBtns = document.getElementById("results-page-btns");
const score = document.getElementById("score");
const answerElements = answerOptions.querySelectorAll('.answers');

let currentQuestion = {};
let questionCounter = 0;
let correctCount = 0;
let incorrectCount = 0;
let acceptInput = true;

let questions = [];


/** Event Listener to show instructions page and hide quiz selection homepage */
instructionsBtnHomepage.addEventListener("click", function () {
    instructionsBtnHomepage.classList.add("hide");
    quizHomepageElements.forEach(function (homepage) {
        homepage.classList.add("hide");
    });

    instructionsPage.classList.remove("hide");
    instructionBtn.classList.remove("hide");
});

/** Event Listener to return to quiz selection homepage and hide instructions page */
instructionBtn.addEventListener("click", function () {
    instructionsBtnHomepage.classList.remove("hide");
    instructionsPage.classList.add("hide");
    instructionBtn.classList.add("hide");

    quizHomepageElements.forEach(function (instructions) {
        instructions.classList.remove("hide");
    });
});

// Trivia Database API
/** Function to construct the Quiz API URL based on user-selected options */

function getQuestionsData() {
    const quest = questChoice.options[questChoice.selectedIndex].id;
    const diff = diffChoice.options[diffChoice.selectedIndex].id;

    return gameUrl = `https://opentdb.com/api.php?amount=${quest}&category=15&difficulty=${diff}&type=multiple`;
}

/** Function to retrive the data from the Triva DB using the user-selected options
 * it then formats the question and splices the incorrect and correct answers
 * together whist randomising the correct answers position.
 */

function getGameData() {

    const gameUrl = getQuestionsData();

    fetch(gameUrl)
        .then(response => response.json())
        .then(loadedQuestions => {
            console.log(loadedQuestions.results);
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
            } else {
                console.error("Error Loading Quiz");
            }
        });
}
/** Function to start the game when the user clicks start, it will reset all 
 * the hud elements to 0 */
function startGame() {
    totalQuestions = [...questions];
    questionCounter = 0;
    correctCount = 0;
    incorrectCount = 0;
    getNextQuestion();

    quizHomepageElements.forEach(function (game) {
        game.classList.add("hide");
    });

    instructionsBtnHomepage.classList.add("hide");
    gameContentArea.classList.remove("hide");
    question.classList.remove("hide");
    answerCountersArea.classList.remove("hide");
    answerElements.forEach((element) => {
        element.classList.remove('hide');
    });

}
/** Function to get the next question  or end the game once no questions are left */
function getNextQuestion() {
    if (totalQuestions.length == 0) {
        gameContentArea.classList.add("hide");
        answerCountersArea.classList.add("hide");
        question.classList.add("hide");
        answerElements.forEach((element) => {
            element.classList.add('hide');
        });
        resultsPage.classList.remove("hide");
        resultsPageBtns.classList.remove("hide");



        score.innerHTML = (`You Scored: ${correctCount}/${questChoice.value} `);
    } else {
        questionCounter++;
        questionCounter.innerText = (`${questionCounter}/${questChoice.value}`);
        let questIndex = Math.floor(Math.random() * totalQuestions.length);
        currentQuestion = totalQuestions[questIndex];
        question.innerHTML = currentQuestion.question;

        answers.forEach((answer, index) => {
            let number = answer.dataset["answer"];
            answer.innerHTML = currentQuestion["answers" + number];
        });

        totalQuestions.splice(questIndex, 1);
        questions.splice(questIndex, 1);
        acceptInput = true;
    }
    answerResponse();
}
startButton.addEventListener('click', () => {
    getGameData();

});

function answerResponse() {
    answers.forEach(answer => {
        answer.addEventListener("click", function (event) {
            const selectedAnswer = event.target;
            if (!acceptInput) return;
            acceptInput = false;
            const selectedAnswerChoice = selectedAnswer.dataset["answer"];

            if (selectedAnswerChoice == currentQuestion.answer) {
                alert("Correct!");
            } else {
                alert("Incorrect!");
            }
            setTimeout(() => {
                getNextQuestion();
            }, 1000);
        });
    });
}