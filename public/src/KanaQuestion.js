export const EQuestionStatus = {
    NONE : "None",
    CORRECT : "Correct",
    INCORRECT : "Incorrect"
};

class KanaQuestion {
    constructor(question, index){
        this.romanji = question.romanji;
        this.hiragana = question.hiragana;
        this.katakana = question.katakana;
        this.level = question.userlevel;
        this.index = index;
        this.status = EQuestionStatus.NONE;
    }

    DoesRomanjiMatch(enteredText){
        return (enteredText === this.romanji);
    }

    DoesHiraganaMatch(enteredHiragana){
        return (enteredHiragana === this.hiragana);
    }
    
    DoesKatakanaMatch(enteredKatakana){
        return (enteredKatakana === this.katakana);
    }
}