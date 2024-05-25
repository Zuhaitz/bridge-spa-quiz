const apiQuestions =
  "https://opentdb.com/api.php?amount=10&category=25&type=multiple&difficulty=easy";

const home = document.getElementById("home");
const startButton = document.getElementById("start-btn");
const questionContainer = document.getElementById("question-container");
const questionText = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");

startButton.addEventListener("click", goQuestion);

let questions = [];
let questionIndex = 0;
let score = 0;

let responded = false;

if (!localStorage.scores) {
  localStorage.setItem("scores", JSON.stringify({}));
}

function goQuestion() {
  home.classList.add("hide");
  questionContainer.classList.remove("hide");
  startGame();
}

async function startGame() {
  questions = await axios.get(apiQuestions).then((res) => res.data.results);
  console.log(questions);
  questionIndex = 0;
  score = 0;

  let currentQuestion = questions[questionIndex];
  questionText.innerHTML = currentQuestion.question;
  let answers = [].concat(currentQuestion.incorrect_answers);
  answers.push(currentQuestion.correct_answer);

  answers = shuffle(answers);

  answers.forEach((answer) => {
    let btn = document.createElement("button");
    btn.innerHTML = answer;
    btn.dataset.correct = answer === currentQuestion.correct_answer;
    btn.addEventListener("click", selectAnswer);

    answerButtons.appendChild(btn);
  });
}

function selectAnswer(event) {
  console.log(event.currentTarget.dataset.correct);
  if (responded) {
    return;
  }
  if (event.currentTarget.dataset.correct) {
    score += 1;
  }
}

// let date = new Date().toLocaleDateString();

// Ref: https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
