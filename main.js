const apiQuestions =
  "https://opentdb.com/api.php?amount=10&category=25&type=multiple&difficulty=easy";

// Home Page
const home = document.getElementById("home");
const startButton = document.getElementById("start-btn");

startButton.addEventListener("click", goQuestion);

// Questions Page
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

nextButton.addEventListener("click", nextQuestion);

// Results Page
const results = document.getElementById("results");
const punctuation = document.getElementById("punctuation");
const restartButton = document.getElementById("restart-btn");

restartButton.addEventListener("click", restartGame);

const pages = [home, questionContainer, results];

// Initial values
let questions = [];
let questionIndex = 0;
let score = 0;

let responded = false;

// Checks if scores is initialize in local storage
if (!localStorage.scores) {
  localStorage.setItem("scores", JSON.stringify({}));
}

// Goes to Questions section of page, and starts the game
async function goQuestion() {
  try {
    startButton.disabled = true;
    startButton.innerHTML = "Loading...";

    await startGame();

    hideAll(...pages);
    questionContainer.classList.remove("hide");
  } catch (error) {
    console.error(error);
  }

  startButton.disabled = false;
  startButton.innerHTML = "Take the quiz";
}

function goResults() {
  punctuation.innerHTML = score;
  hideAll(...pages);
  results.classList.remove("hide");
}

async function restartGame() {
  try {
    restartButton.disabled = true;
    restartButton.innerHTML = "Loading...";

    await startGame();

    hideAll(...pages);
    questionContainer.classList.remove("hide");
  } catch (error) {
    console.error(error);
  }

  restartButton.disabled = false;
  restartButton.innerHTML = "Play Again";
}

// Resets the initial values and fetches the questions from the API
async function startGame() {
  resetGame();

  questions = await axios.get(apiQuestions).then((res) => res.data.results);
  console.log(questions);

  addNextQuestionToDOM();
}

// When answer is selected, checks if answer is correct or not
function selectAnswer(event) {
  if (responded) return;

  Array.from(answerButtons.children).forEach((button) => {
    setStatusClass(button);
  });

  if (event.currentTarget.dataset.correct === "true") {
    score += 1;
  }

  responded = true;
  nextButton.classList.remove("hide");
}

// Sets the class for each button to display if correct or not
function setStatusClass(element) {
  if (element.dataset.correct === "true") {
    element.classList.add("color-correct");
  } else {
    element.classList.add("color-wrong");
  }
}

// Cleans the previous question and goes to the next
function nextQuestion() {
  answerButtons.innerHTML = "";

  questionIndex += 1;
  if (questionIndex >= 10) return goResults();

  addNextQuestionToDOM();
  responded = false;
}

// Adds the questions and answers to the DOM
function addNextQuestionToDOM() {
  let currentQuestion = questions[questionIndex];
  questionText.innerHTML = currentQuestion.question;

  // We do this to create a copy of the array, to not modify the original values
  let answers = [].concat(currentQuestion.incorrect_answers);
  answers.push(currentQuestion.correct_answer);

  // We shuffle the array of answers, to be in a random order
  answers = shuffle(answers);

  answers.forEach((answer) => {
    let btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.classList.add("answer");
    btn.dataset.correct = answer === currentQuestion.correct_answer;
    btn.addEventListener("click", selectAnswer);

    answerButtons.appendChild(btn);
  });

  nextButton.classList.add("hide");
}

// let date = new Date().toLocaleDateString();

// Resets the values of the game
function resetGame() {
  questions = [];
  questionIndex = 0;
  score = 0;

  responded = false;
}

function hideAll(...elems) {
  elems.forEach((elem) => elem.classList.add("hide"));
}

// Shuffles the array that's being passed by argument
// Ref: https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
