let loadedQuestions = [];
let quizQuestions = [];
let answeredQuestionCount = 0
let wrongAnswerCount = 0;
let username;
let level;

$(document).ready(() => {
    //get username and level
    username = $("#usernameLabel").html();
    level = Number($("#levelLabel").html());
    
    //load all questions to display study tiles
    $.get(GetKanaQuestionApiString(username, level), (data, status) => {
        for (let index = 0; index < data.length; index++) {
            let question = data[index];
            loadedQuestions.push(new KanaQuestion(question, index));
        }

        //display study tiles
        $("#quiz").html(GenerateStudyTiles(loadedQuestions));
    });

    //begin the quiz
    $("#beginButton").click(() => {
        //disable the begin button so it can't be clicked again
        DisableBeginButton();
        //hide the button
        HideBeginButton();

        //get updated questions according to current level
        $.get(GetKanaQuestionApiString(username, level), (data, status) => {
            //clear existing loaded questions
            loadedQuestions.splice(0, loadedQuestions.length);
            for (let index = 0; index < data.length; index++) {
                let question = data[index];
                loadedQuestions.push(new KanaQuestion(question, index));
            }

            //select twelve questions, five guaranteed to be player level
            quizQuestions = SelectQuizQuestions(loadedQuestions, level);
            answeredQuestionCount = 0;
            wrongAnswerCount = 0;
        });


        $("#quiz").html(GenerateKanaQuizHTML(quizQuestions));
        //load the questions with AJAX

    });
});

function DisableBeginButton() {
    $("#beginButton").prop("disabled", true);
}

function HideBeginButton() {
    $("#beginButton").hide();
}

function EnableBeginButton() {
    $("#beginButton").prop("disabled", false);
}

function ShowBeginButton() {
    $("#beginButton").show();
}

function GetKanaQuestionApiString(username, level) {
    let path = "/loadKanaQuestions";
    return path + "?userlevel=" + level;
}

function GenerateStudyTiles(loadedKanaQuestions) {
    let returnHtml = `<h2>Study Kana:</h2><div class="card-group"><div class="card" style="width: 18rem;">`;

    loadedKanaQuestions.forEach(question => {
        returnHtml += GetStudyTileHtmlForQuestion(question);
    });

    returnHtml += `</div></div>`;
    return returnHtml;
}

function GetStudyTileHtmlForQuestion(question) {
    let returnHtml = `<div class="card-body">`;

    returnHtml += `<div class="card-header">Romanji: ${question.romanji} <br></div>`;
    returnHtml += `<div>Hiragana: <img src="img/${question.hiragana}"> <br></div>`;
    returnHtml += `<div>Katakana: <img src="img/${question.katakana}"> <br></div>`;

    returnHtml += `</div>`;
    return returnHtml;
}

function SelectQuizQuestions(loadedQuestions, currentLevel) {
    let numCurrentLevelQuestions = 0;
    let numReviewQuestions = 0;
    let returnQuestions = [];

    for (let index = 0; index < loadedQuestions.length; index++) {
        const question = loadedQuestions[index];

        //reached the total number of questions
        if ((numCurrentLevelQuestions + numReviewQuestions) == 12) {
            break;
        }

        //no higher level questions
        if (question.level > currentLevel) {
            continue;
        }

        //need a current level question
        if (numReviewQuestions == 7) {
            if (question.level < currentLevel) {
                continue;
            }
        }

        //add the question to the list
        returnQuestions.push(question);

        //update the appropriate count for this question
        if (question.level < currentLevel) {
            numReviewQuestions++;
        }
        else {
            numCurrentLevelQuestions++;
        }
    }

    return shuffleArray(returnQuestions);
}

function shuffleArray(array) {
    let counter = array.length;

    while (counter > 0) {
        let index = Math.floor(Math.random() * counter);
        counter--;

        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

function GenerateKanaQuizHTML(allQuestions) {
    let returnHtml = "<div id=questionlist><ul>";
    let innerHtml = "";
    allQuestions.forEach(question => {
        //form the opening of the list item
        let singleQuestionHtml = `<li class="kanaquestion question${question.index}">`
        //1 = given h pick k
        //2 = given k pick h
        //3 = given r pick k
        //4 = given k pick r
        let questionType = getRandomInteger(1, 4);
        innerHtml += GenerateKanaQuestionHTML(question, questionType, allQuestions);
    });
    returnHtml += innerHtml + "</ul></div>";
    //add a disabled continue button
    returnHtml += '<button type="button" id="quizContinue" onclick="QuizContinue()" disabled>Continue</button>';
    return returnHtml;
}

function GenerateKanaQuestionHTML(question, questionType, allQuestions) {
    switch (questionType) {
        case 1:
            return GenerateGivenHirPickKat(question, allQuestions);
        case 2:
            return GenerateGivenKatPickHir(question, allQuestions);
        case 3:
            return GenerateGivenRomPickKat(question, allQuestions);
        case 4:
        default:
            return GenerateGivenKatPickRom(question, allQuestions);
    }
}

function GenerateGivenHirPickKat(question, allQuestions) {
    let returnHtml = "<div class=\"questionlabel\">Pick the katakana that matches this hiragana:</div>";
    returnHtml += `<img class="kanaimage" src="img/${question.hiragana}"<br><br>`;
    returnHtml += GenerateKanaOptions(question, allQuestions, true);
    return returnHtml;
}

function GenerateGivenKatPickHir(question, allQuestions) {
    let returnHtml = "<div class=\"questionlabel\">Pick the hiragana that matches this katakana:</div>";
    returnHtml += `<img class="kanaimage" src="img/${question.katakana}"<br><br>`;
    returnHtml += GenerateKanaOptions(question, allQuestions, false);
    return returnHtml;
}

function GenerateGivenRomPickKat(question, allQuestions) {
    let returnHtml = `<div class="questionlabel">Pick the katakana that matches this romanji:</div>`;
    returnHtml += `<div class="questionlabel">${question.romanji}</div>`;
    returnHtml += GenerateKanaOptions(question, allQuestions, true);
    return returnHtml;
}

function GenerateGivenKatPickRom(question, allQuestions) {
    let returnHtml = `<div class="questionlabel">Click the romanji that matches this katakana:</div>`;
    returnHtml += `<img class="kanaimage" src="img/${question.katakana}"<br><br>`;
    returnHtml += GenerateRomanjiOptions(question, allQuestions);
    return returnHtml;
}

function GenerateKanaOptions(question, allQuestions, isKatakana) {
    let returnHtml = `<div class="choices">`;
    let correctResponsePosition = getRandomInteger(0, 3);
    let usedKana = [];
    usedKana.push(question);

    let imageName = "";
    if (isKatakana) {
        imageName = question.katakana;
    }
    else {
        imageName = question.hiragana;
    }

    for (let index = 0; index < 4; index++) {
        if (index == correctResponsePosition) {
            returnHtml += `<img class="kanaimage optionforquestion_${question.index}" src="img/${imageName}" onclick="CorrectAnswer(this)">`;
        }
        else {
            let valueAdded = false;
            while (valueAdded == false) {
                potentialQuestion = allQuestions[getRandomInteger(0, allQuestions.length - 1)];
                let alreadyAdded = false;
                let potentialImageName = "";
                if (isKatakana) {
                    potentialImageName = potentialQuestion.katakana;
                }
                else {
                    potentialImageName = potentialQuestion.hiragana;
                }

                for (let usedKanaIndex = 0; usedKanaIndex < usedKana.length; usedKanaIndex++) {
                    if (usedKana[usedKanaIndex].romanji === potentialQuestion.romanji) {
                        alreadyAdded = true;
                    }
                }

                if (alreadyAdded == false) {
                    usedKana.push(potentialQuestion);
                    returnHtml += `<img class="kanaimage optionforquestion_${question.index}" src="img/${potentialImageName}" onclick="IncorrectAnswer(this)">`;
                    valueAdded = true;
                }
            }
        }
    }

    returnHtml += `</div>`;
    return returnHtml;
}

function GenerateRomanjiOptions(question, allQuestions) {
    let returnHtml = `<div class="choices">`;
    let correctResponsePosition = getRandomInteger(0, 3);
    let usedKana = [];
    usedKana.push(question);

    for (let index = 0; index < 4; index++) {
        if (index == correctResponsePosition) {
            returnHtml += `<button type="button" class="questionlabel optionforquestion_${question.index}" onclick="CorrectAnswer(this)">${question.romanji}</button>`;
        }
        else {
            let valueAdded = false;
            while (valueAdded == false) {
                potentialQuestion = allQuestions[getRandomInteger(0, allQuestions.length - 1)];
                let alreadyAdded = false;
                let potentialImageName = "";

                for (let usedKanaIndex = 0; usedKanaIndex < usedKana.length; usedKanaIndex++) {
                    if (usedKana[usedKanaIndex].romanji === potentialQuestion.romanji) {
                        alreadyAdded = true;
                    }
                }

                if (alreadyAdded == false) {
                    usedKana.push(potentialQuestion);
                    returnHtml += `<button type="button" class="questionlabel optionforquestion_${question.index}" onclick="IncorrectAnswer(this)">${potentialQuestion.romanji}</button>`;
                    valueAdded = true;
                }
            }
        }
    }


    returnHtml += `</div>`;
    return returnHtml;
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CorrectAnswer(clickedElement) {
    //let questionIndex = getQuestionIndex(clickedElement.className);
    //quizQuestions[questionIndex].status = EQuestionStatus.CORRECT;
    $("." + getAnswerClass(clickedElement.className)).removeAttr("onclick");
    clickedElement.style.border = "thick solid green";
    answeredQuestionCount++;
    SetContinueButtonEnabled();
}

function IncorrectAnswer(clickedElement) {
    //let questionIndex = getQuestionIndex(clickedElement.className);
    //quizQuestions[questionIndex].status = EQuestionStatus.INCORRECT;
    $("." + getAnswerClass(clickedElement.className)).removeAttr("onclick");
    clickedElement.style.border = "thick solid red";
    wrongAnswerCount++;
    answeredQuestionCount++;
    SetContinueButtonEnabled();
}

function getQuestionIndex(className) {
    let nameChunks = className.split("_");
    for (let index = 0; index < nameChunks.length; index++) {
        const chunk = nameChunks[index];
        if (isNaN(chunk)) {
            continue;
        }
        return Number(chunk);
    }
}

function getAnswerClass(className) {
    return className.substring(className.search(" ") + 1);
}

function SetContinueButtonEnabled() {
    if (answeredQuestionCount == quizQuestions.length) {
        $("#quizContinue").prop("disabled", false);
    }
    else {
        $("#quizContinue").prop("disabled", true);
    }
}

function QuizContinue() {
    if (answeredQuestionCount < quizQuestions.length) {
        return;
    }

    if (wrongAnswerCount > 1) {
        alert("You have not mastered this level.  Train again.");
    }
    else {
        alert("You have mastered this level.  Congratulations!")
        //call to level user up
        $.post("/levelup", { user: username, newLevel: (level + 1) },
            (data, status) => {
                level = data.newLevel;
                $("#levelLabel").html(level);
            })
            .fail((xhr, status, error) => {
                alert("The server encountered a problem leveling you up.");
                console.log(`Error - status: ${status} error: ${error}`);
            })
            ;
    }

    //need to reset quiz
    ResetQuiz();
}

function ResetQuiz() {
    answeredQuestionCount = 0;
    wrongAnswerCount = 0;
    quizQuestions.splice(0, quizQuestions.length); //clear the quiz questions
    ClearQuizHTML();
    EnableBeginButton();
    ShowBeginButton();
}

function ClearQuizHTML() {
    $("#quiz").html("");
}