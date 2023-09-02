// Homepage
const instructionsBtnHomepage = document.getElementById("intructions-btn-homepage");
const quizHomepageElements = document.querySelectorAll(".quiz-homepage");
const submit = document.getElementById("submit");
const questChoice = document.getElementById("question-choice");
const diffChoice = document.getElementById("difficulty-choice");
// Instructions Page
const instructionsPage = document.getElementById("instruction-page");
const instructionBtn = document.getElementById("instruction-btn");

// Quiz Game Page

const question = document.getElementById("question");
const answers = Array.from(document.getElementsByClassName("answers"));

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

function getQuestions(start) {
    if (start) {
        gameUrl = (`https://opentdb.com/api.php?amount=${quest}&category=15&difficulty=${diff}&type=multiple`);
    } else {
        gameUrl = ("https://opentdb.com/api.php?amount=10&category=15&difficulty=easy&type=multiple");
    }

    console.log("API URL:", gameUrl);
}

// Retrieves the users options

submit.addEventListener('click', () => {
    quest = questChoice.options[questChoice.selectedIndex].id;
    diff = diffChoice.options[diffChoice.selectedIndex].id;

    // Call getQuestions(true) with user-selected options
    getQuestions(true);
});