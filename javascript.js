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

// Create the request URL using category name and difficulty level
function createRequestURL(categoryValue, difficultyValue) {
    // Default setup
    var url = "https://opentdb.com/api.php?amount=10";
    // Add category code
    url += "&category=" + categoryCodes[categoryValue];
    // Add difficulty level
    url += "&difficulty=" + difficultyValue;
    url += "type=multiple";
    return url;
}

// Returns a promise containing results from request
function requestQuiz(url) {
    return fetch(url).then(function(result) {
        return result.json()
    });
}
