$(document).ready( () => {
    //get username and level
    let username = $("#usernameLabel").html();
    let level = $("#levelLabel").html();

    //begin the quiz
    $("#beginButton").click( () => {
        //disable the begin button so it can't be clicked again
        DisableBeginButton();
        //hide the button
        HideBeginButton();


        //load the questions with AJAX
        let loadedQuestions = [];
        $.get(GetKanaQuestionApiString(username, level), (data, status) => {
            data.forEach(question => {
                loadedQuestions.push(new KanaQuestion(question));
            });

            //select twelve questions, five guaranteed to be player level
            let quizQuestions = SelectQuizQuestions(loadedQuestions, level);

            //for now, throw the quiz questions on the page, later construct a view and process the quiz
            $("#quiz").html(JSON.stringify(quizQuestions));
        });
    });
});

function DisableBeginButton() {
    $("#beginButton").prop("disabled", true);
}

function HideBeginButton() {
    $("#beginButton").hide();
}

function GetKanaQuestionApiString(username, level) {
    let path = "/loadKanaQuestions";
    return path + "?userlevel=" + level;
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