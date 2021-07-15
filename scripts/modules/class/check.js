// ***Imports*** {✈}
import Word from "./word.js";
import setWordClass from "../setClass.js"; // Change this to word class because that will have a random word picker as a static property

let word = [
  "perpendicular",
  "Deforestation",
  "Procrastination",
  "computer",
  "vegetable",
  "molecules",
  "text",
  "beats",
  "analogous",
  "disappear",
  "resemblance",
  "activation",
  "equilibrium",
  "available",
]; // Temporary {🥼}

// ***Exports*** {📦}
export default class Check extends Word {
  constructor(word, SpeakFunction) {
    super(word);
    this.inCorrectCount = 0;
    this.SpeakFunction = SpeakFunction;
  }
  pickWord() {
    // Temporary {🥼}
    this.inCorrectCount = 0;
    let randomWord = Math.floor(Math.random() * word.length);
    setWordClass(word[randomWord], this.SpeakFunction); // This needs to cleaned {🧼}
    this.input.setAttribute("maxlength", word[randomWord].length);
    return this.SpeakFunction.playGivenWord();
  }
  correct() {
    if (this.SpeakFunction.block) return;
    this.SpeakFunction.block = true;
    this.SpeakFunction.playCorrectWord();
    if ((this.renderText.textContent = this.word))
      this.renderText.innerHTML = "";
    this.SpeakFunction.word.utterance.addEventListener("end", (e) => { //This needs to cleaned {🧼}
      setTimeout(() => {
        this.blank();
        this.pickWord();
      }, 1000);
    });
  }
  inCorrect() {
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
      return true;
    }
    if (this.inCorrectCount === 5) {
      this.SpeakFunction.revealGivenWord();
      this.inCorrectCount = 0;
    } else {
      this.inCorrect();
    }
    this.inCorrectCount++;
    return false;
  }
}
