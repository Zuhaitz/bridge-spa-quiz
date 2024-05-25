//https://opentdb.com/api.php?amount=10&category=25&difficulty=easy

const home = document.getElementById("home");
const startButton = document.getElementById("start-btn");
const questionContainer = document.getElementById("question-container");

function goQuestion() {
  home.classList.add("hide");
  questionContainer.classList.remove("hide");
}

startButton.addEventListener("click", goQuestion);
