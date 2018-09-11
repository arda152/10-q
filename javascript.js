// DOM elements
let helperText = document.getElementById("helperText")
let startButton = document.getElementById("startButton");
let quizSetup = document.getElementById("quizSetup");
let quizDisplay = document.getElementsByClassName("quizDisplay");
let progressDisplay = document.getElementById("progressDisplay");
let answersDisplay = document.getElementById("answersDisplay");
let endDisplay = document.getElementById("endDisplay");
let resultsDisplay = document.getElementById("resultsDisplay");
let restartButtonDiv = document.getElementById("restartButtonDiv");

startButton.addEventListener("click", quizInit);
function quizRestart() {
    // Cleanup
    progressDisplay.textContent = "";
    resultsDisplay.textContent = "";
    restartButtonDiv.textContent = "";
    quizSetup.classList.remove("hide");
}
function endQuiz(points) {
    questionDisplay.textContent = "";
    answersDisplay.textContent = "";
    resultsDisplay.textContent = "You answered " + points + " question" + (points !== 1 ? "s" : "") + " correctly!";
    let restartButton = document.createElement("a");
    restartButton.className = "button";
    restartButton.textContent = "Restart";
    restartButton.addEventListener("click", quizRestart);
    restartButtonDiv.appendChild(restartButton);
}

function quizInit() {
    // Assign values
    let selectedCategory = document.getElementById("categorySelect").value;
    let selectedDifficulty = document.getElementById("difficultySelect").value;

    // Generate URL
    let requestURL = createRequestURL(selectedCategory, selectedDifficulty);
    // Make http request
    let quizArray = [];
    requestQuiz(requestURL).then(function(result) {
        if (!result || result.response_code !== 0) {
            throw ("OpenTriviaDB error");
        }
        quizArray = createQuizArray(result);
        return quizArray;
    }).then(function(result) {
        // Clear helper text in case of previous error messages
        helperText.textContent = "";
        let quizState = {
            "counter": 0,
            "points": 0,
            "questionData" : result,
        };
        quizSetup.classList.add("hide");
        showQuestion(quizState);
    }, function(err) {
        helperText.textContent = "The database doesn't have enough questions. Please pick another category or difficulty."
    });
}

// Run the quiz with returned results from database
function showQuestion(quizState) {
    let question = quizState.questionData[quizState.counter];
    questionDisplay.innerHTML = question.question;
    let answerIsAt = random0to3();
    // Save position for future look up
    question.answerIsAt = answerIsAt;
    for (let i = 0; i < 4; i++) {
        let answerColumn = document.createElement("div");
        answerColumn.classList.add("column", "has-text-centered");
        let answerButton = document.createElement("a");
        answerButton.classList.add("button");
        answerButton.innerHTML = (answerIsAt === i) ? question.correct_answer : question.incorrect_answers.pop();
        answerButton.id = i;
        answerButton.onclick =  handleAnswerClick.bind(answerButton, quizState);
        answerColumn.appendChild(answerButton);
        answersDisplay.appendChild(answerColumn);
    }
}

// Runs when user answers a question
function handleAnswerClick(quizState) {
    // Make sure user only picks one answer
    removeAllEventListeners();
    // Check the answer, show the correct answer
    let currentCorrectAnswer = quizState.questionData[quizState.counter].correct_answer;
    if (currentCorrectAnswer === this.textContent) {
        addMark(true);
        quizState.points++;
    } else {
        addMark(false);
    }
    // Correct answer turns to green with delay
    displayCorrectAnswer(quizState);
    // If the game is over
    // Create timeout so user can see the correct answer
    setTimeout(function () {
        // Clear the display
        answersDisplay.textContent = "";
        questionDisplay.textContent = "";
        if (quizState.counter === 9) {
            endQuiz(quizState.points);
        } else {
        // Show the next question
        quizState.counter++;
        showQuestion(quizState);
        }
    }, 1000);
}


function removeAllEventListeners() {
    for (answerButton of document.querySelectorAll("#answersDisplay a")) {
        // Correct answer turns to green with delay
        // This line makes sure user only picks one answer
        answerButton.onclick = null;
    }
}


// Add the correct mark for an answer
function addMark(answerIsCorrect) {
    // Create and initialize icon
    let iconContainer = document.createElement("span");
    iconContainer.className = "icon";
    let icon = document.createElement("i");
    icon.className = "fas";
    iconContainer.appendChild(icon);
    // Select the right icon
    icon.classList.add(answerIsCorrect ? "fa-check" : "fa-times");
    // Add icon
    progressDisplay.appendChild(iconContainer);
}
// Create the request URL u sing category name and difficulty level
function createRequestURL(categoryValue, difficultyValue) {
    // Default setup
    var url = "https://opentdb.com/api.php?amount=10";
    // Add category code
    url += "&category=" + categoryValue;
    // Add difficulty level
    url += "&difficulty=" + difficultyValue;
    url += "&type=multiple";
    return url;
}

// Turns the correct answer to green with delay
function displayCorrectAnswer(quizState) {
    // Find out the correct answer
    let correctAnswerButton = document.querySelectorAll("#answersDisplay a")[quizState.questionData[quizState.counter].answerIsAt];
    // Add color class to button
    correctAnswerButton.classList.add("is-success");
}

// Returns a promise containing results from request
function requestQuiz(url) {
    return fetch(url).then(function(result) {
        return result.json()
    });
}

// Sort http response into quiz array
function createQuizArray(response) {
    let quizArray = [];
    for (questionData of response.results) {
        quizArray.push({
            "question": questionData.question,
            "correct_answer": questionData.correct_answer,
            "incorrect_answers": questionData.incorrect_answers
        });
    }
    return quizArray;
}

function random0to3() {
    return Math.floor(Math.random() * 4);
}
