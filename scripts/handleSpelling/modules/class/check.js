// ***Imports*** {✈}
import Word from "../../../word.js";
import setWordClass from "../setClass.js";
import confetti from "https://cdn.skypack.dev/canvas-confetti";

// ***Exports*** {📦}
export default class Check extends Word {
  constructor(word, SpeakFunction) {
    super(word);
    this.inCorrectCount = 0;
    this.SpeakFunction = SpeakFunction;
  }
  done() {
    $("#play-word").css({
      transform: "rotate(-90deg)",
    });
    $("#textWave").css({ display: "none" });
    this.SpeakFunction.play("You completed all the words! Congrats!", "");

    setTimeout(() => {
      $("#play-word").css({
        transform: "rotate(0deg)",
      });
      $("#textWave").css({ display: "" });
      this.renderText.innerHTML = "Done";
      document.getElementById("bracket").innerText = "!";
      setWordClass(Word.pickWord(), this.SpeakFunction);
    }, 2000);

    setTimeout(() => {
      confetti({
        origin: {
          angle: 50,
          particleCount: 50,
          startVelocity: 60,
          spread: 180,
          y: 0.2983923865430757,
        },
      });
      confetti({
        origin: {
          angle: 10,
          particleCount: 150,
          startVelocity: 20,
          spread: 90,
          y: 0.2683923865430757,
        },
      });
      confetti({
        origin: {
          angle: 90,
          particleCount: 180,
          startVelocity: 30,
          spread: 360,
          y: 0.2783923865430757,
        },
      });
    }, 150);
  }
  nextWord() {
    this.inCorrectCount = 0;
    const randomWord = Word.pickWord();

    document.getElementById("spellContainer").style.backgroundColor = "";
    this.input.style.backgroundColor = "";

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
      document.getElementById("spellContainer").classList.add("shake");
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
