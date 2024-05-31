const apiQuestions =
  "https://opentdb.com/api.php?amount=10&type=multiple&difficulty=easy";

// Home Page
const home = document.getElementById("home");
const categorySelect = document.getElementById("category-select");
const scoreChart = document.getElementById("score-chart");
const startButton = document.getElementById("start-btn");

startButton.addEventListener("click", goQuestion);

// Load Page
const loadPage = document.getElementById("load-page");

// Questions Page
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

nextButton.addEventListener("click", nextQuestion);

// Results Page
const results = document.getElementById("results");
const punctuation = document.getElementById("punctuation");
const resultText = document.getElementById("result-text");
const restartButton = document.getElementById("restart-btn");

restartButton.addEventListener("click", goQuestion);

// Pages list for easy access
const pages = [home, loadPage, questionContainer, results];

// Result text options
const resultTextOptions = [
  "Now try to do it with your eyes open.",
  "Your number of brain cells.",
  "2?",
  "Ok",
  "Dog!",
  "Average Joe",
  "Disappointment",
  "Lucky 7!",
  "It kinda looks like a snowman.",
  "Jimmy got a ten, and you get a NINE?!?!",
  "PERFECT SCORE! Well done!",
];

// Initial values
let questions = [];
let questionIndex = 0;
let score = 0;

let responded = false;

// Checks if scores is initialize in local storage
if (!localStorage.scores) {
  localStorage.setItem("scores", JSON.stringify({}));
} else {
  createChart(JSON.parse(localStorage.getItem("scores")));
}

// Goes to Questions section of page, and starts the game
async function goQuestion() {
  try {
    hideAll(...pages);
    loadPage.classList.remove("hide");

    await startGame();

    hideAll(...pages);
    questionContainer.classList.remove("hide");
  } catch (error) {
    console.error(error);

    hideAll(...pages);
    home.classList.remove("hide");
  }
}

// Goes to the Result page
function goResult() {
  saveScore(score);
  punctuation.innerHTML = score;
  resultText.innerText = resultTextOptions[score];

  hideAll(...pages);
  results.classList.remove("hide");
}

// Resets the initial values and fetches the questions from the API
async function startGame() {
  resetGame();
  let url = apiQuestions;
  if (categorySelect.value !== "0") {
    url += `&category=${categorySelect.value}`;
  }

  questions = await axios.get(url).then((res) => res.data.results);

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
  if (questionIndex >= 10) return goResult();

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

// Resets the values of the game
function resetGame() {
  questions = [];
  questionIndex = 0;
  score = 0;

  responded = false;
}

// Creates chart using the data in local storage
function createChart(scores) {
  let dates = Object.keys(scores);
  let values = Object.values(scores);

  new Chart(scoreChart, {
    type: "line",
    data: {
      labels: dates.slice(Math.max(dates.length - 5, 0)),
      datasets: [
        {
          label: "Score",
          backgroundColor: "#78c2ad",
          borderColor: "#78c2ad",
          data: values.slice(Math.max(values.length - 5, 0)),
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 10,
          offset: true,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
      padding: 20,
    },
  });
}

// Hide all pages in argument
function hideAll(...elems) {
  elems.forEach((elem) => elem.classList.add("hide"));
}

// Saves score to localStorage
function saveScore(newScore) {
  let savedScores = JSON.parse(localStorage.getItem("scores"));
  let date = new Date().toLocaleDateString();
  savedScores[date] = newScore;
  localStorage.setItem("scores", JSON.stringify(savedScores));
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
