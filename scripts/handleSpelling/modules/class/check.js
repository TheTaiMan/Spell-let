// ***Imports*** {✈}
import Word from "../../../word.js";
import setWordClass from "../setClass.js";

// ***Exports*** {📦}
export default class Check extends Word {
  constructor(word, SpeakFunction) {
    super(word);
    this.inCorrectCount = 0;
    this.SpeakFunction = SpeakFunction;
  }
  done() {
    this.renderText.innerHTML = "Done!"; // Do something with when you are done
    setWordClass(Word.pickWord(), this.SpeakFunction);
  }
  nextWord() {
    this.inCorrectCount = 0;
    document.getElementById("bracket").innerHTML = ")";
    const randomWord = Word.pickWord();
    if (!randomWord) return this.done();

    setWordClass(randomWord, this.SpeakFunction);
    return this.SpeakFunction.playGivenWord();
  }
  correct() {
    if (this.SpeakFunction.block) return;
    this.SpeakFunction.block = true;
    this.SpeakFunction.playCorrectWord();
    if ((this.renderText.textContent = this.word))
      this.renderText.innerHTML = "";
    this.SpeakFunction.word.utterance.addEventListener("end", (e) => {
      //This needs to cleaned {🧼}
      setTimeout(() => {
        this.blank();
        this.nextWord();
      }, 1000);
    });
  }
  inCorrect(wrong = false) {
    if (wrong) {
      document.getElementById("revealWord").style.opacity =
        this.inCorrectCount * 2 * 0.1;
    }
    return this.SpeakFunction.playGivenWord();
  }
  blank() {
    this.renderText.innerHTML = "";
    this.renderInput.innerHTML = "";
    this.input.value = "";
  }
  checkSpelling() {
    if (this.word === this.input.value) {
      this.correct();
      document.getElementById("revealWord").style.opacity = "";
      return true;
    } else if (!this.input.value) {
      this.inCorrect();
      return false;
    }

    this.inCorrectCount++;
    if (this.inCorrectCount === 5) {
      this.SpeakFunction.revealGivenWord();
      this.inCorrectCount = 0;
      document.getElementById("revealWord").style.opacity = "";
    } else {
      this.inCorrect(true);
    }
    
    return false;
  }
}
