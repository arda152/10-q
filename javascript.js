// Object to store category-url code pairs
const categoryCodes = {
    animals: 27,
    art: 25,
    general_knowledge: 9,
    history: 23,
    music: 12,
    science_and_nature: 17,
    sports: 21
}

// DOM elements
let startButton = document.getElementById("startButton");
let quizSetup = document.getElementById("quizSetup");
let quizDisplay = document.getElementsByClassName("quizDisplay");
let progressDisplay = document.getElementById("progressDisplay");
let answersDisplay = documnet.getElementById("answersDisplay");

startButton.addEventListener("click", function() {
    // Assign values
    let selectedCategory = document.getElementById("categorySelect").value;
    let selectedDifficulty = document.getElementById("difficultySelect").value;
    // Handle errors
    // checkForErrors();
    // Generate URL
    let requestURL = createRequestURL(selectedCategory, selectedDifficulty);
    // Make http request
    let quizArray = [];
    requestQuiz(requestURL).then(function(result) {
        quizArray = createQuizArray(result);
        return quizArray;
    }).then(function(result) {
        // run display quiz using results
    });
});

// Create the request URL using category name and difficulty level
function createRequestURL(categoryValue, difficultyValue) {
    // Default setup
    var url = "https://opentdb.com/api.php?amount=10";
    // Add category code
    url += "&category=" + categoryCodes[categoryValue];
    // Add difficulty level
    url += "&difficulty=" + difficultyValue;
    url += "&type=multiple";
    return url;
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
            questionData.question,
            questionData.correct_answer,
            questionData.incorrect_answers
        });
    }
    return quizArray;
}