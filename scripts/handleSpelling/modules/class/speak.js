// ***Imports*** {✈}
import Word from "../../../word.js";

// ***Exports*** {📦}
export default class Speak extends Word {
  constructor(word) {
    super(word);
    this.syllable = this.syllabify(this.word);
    this.spell = this.word.split("");
    this.renderLetter = [];
    this.renderWord = [];
    this.utterance = "";
    this.onSyllable = 0;
    this.onLetter = 0;
    this.timeElapsed = 0;
    this.block = false;
    this.inputValue = [];
  }
  /* Tools [🛠] */
  syllabify(words) {
    // Should be changed {🥼}
    const syllableRegex =
      /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    return words.match(syllableRegex);
  }
  setVoice() {
    const voices = window.speechSynthesis.getVoices();
    return (this.utterance.voice = voices.filter((voice) => {
      return voice.name == "Google US English";
    })[0]);
  }
  set_Utterance(text) {
    this.utterance = new SpeechSynthesisUtterance(text);
    this.setVoice();
    return this.utterance;
  }
  pauseText() {
    return speechSynthesis.pause();
  }
  resumeText() {
    return speechSynthesis.resume();
  }
  stopText() {
    this.block = false;
    this.renderWord = [];
    this.renderLetter = [];
    this.resumeText();
    this.onSyllable = 0;
    this.onLetter = 0;
    document.getElementById("text").style.fontWeight = "";
    if (document.getElementById("spellContainer").classList.contains("shake"))
      document.getElementById("spellContainer").classList.remove("shake");
    this.renderText.style.width = "auto";
    document.getElementById("bracket").style.opacity = "0";
    return speechSynthesis.cancel();
  }
  set_timeElapsed(e) {
    return (this.timeElapsed = e.elapsedTime / this.word.length - 50); // Change this based on text length; if bigger, make the time bigger and if it is shorter, make it short
  }
  encrypt(string) {
    string = string.toLowerCase();
    let newCode = "";
    for (const letter of string) {
      let random = Math.floor(Math.random() * 26);
      let letterCode = letter.charCodeAt(0);
      let letterShift = letterCode + random;
      if (letterShift > 122) {
        letterShift -= 122;
        letterShift += 96;
      }
      newCode += String.fromCharCode(letterShift);
    }
    if (newCode.length >= 13) {
      let percentage = Math.floor(newCode.length * 0.7);
      newCode = newCode.slice(0, percentage);
    }
    return newCode.toUpperCase();
  }
  correct() {
    this.renderText.style.width = "auto";
    document.getElementById("bracket").style.fontSize = `5rem`;

    const correctColor = "#1BEF5B";
    document.getElementById("spellContainer").style.backgroundColor =
      correctColor;
    this.input.style.backgroundColor = correctColor;

    return (document.getElementById("bracket").innerText = "✔");
  }
  delayRender(time, text, retract = false) {
    for (let i = 0; i < text.length; i++) {
      setTimeout(() => {
        document.getElementById("bracket").style.opacity = "1";
        document.getElementById("bracket").style.fontSize = `${i * 0.5 + 5}rem`;
        this.renderText.style.width = `${i * 1.6}rem`;
        /* Make this a seperate mthod where you only contron the style */
        this.renderText.innerHTML += ` ${text[i]}`;
        if (i === text.length - 1) {
          if (!retract) {
            return this.correct();
          }
          return this.renderReverse(time * 0.5, text);
        }
      }, i * (time || 200));
    }
  }
  renderReverse(time, text) {
    let encryptWord = text.split("");
    for (let i = 0; i <= encryptWord.length; i++) {
      document.getElementById("bracket").style.fontSize = `5rem`;
      setTimeout(() => {
        this.renderText.style.width = `${encryptWord.length - i * 1.2}rem`;
        this.renderText.innerHTML = encryptWord
          .slice(0, encryptWord.length - i)
          .join(" ");
        i === encryptWord.length ? this.stopText() : false;
      }, i * (this.word.length < 4 ? time * 10 : this.syllable.length <= 2 && this.word.length < 6 ? time * 6 : this.word.length <= 7 && this.syllable.length <= 2 ? time * 2 : this.syllable.length >= 5 ? time / 2 : time)); // Experimental {🧪} [WILL CAUSE ERRORS❌]
    }
  }
  onCharacter() {
    let sum = 0;
    if (this.onSyllable === 0) return (sum = this.onLetter - 1);
    for (let i = 0; i < this.onSyllable; i++) {
      sum += this.syllable[i].length;
    }
    return sum + this.onLetter - 1;
  }
  checkLetter(index) {
    try {
      if (this.inputValue[index] !== this.spell[index]) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }
  highlight(index) {
    let correct;
    if (!this.checkLetter(index)) {
      if (this.inputValue[index] === undefined) {
        this.inputValue.push(
          `<span class='highlightWrong'>&nbsp;&nbsp;</span>`
        );
      } else {
        this.inputValue.splice(
          index,
          1,
          `<span class='highlightWrong'>${
            !this.input.value[index] ? "&nbsp;&nbsp;" : this.input.value[index]
          }</span>`
        );
      }
      correct = false;
    } else {
      this.inputValue.splice(
        index,
        1,
        `<span class='highlight'>${this.input.value[index]}</span>`
      );
      correct = true;
    }
    this.renderInput.innerHTML = this.inputValue.join("");
    if (correct) this.inputValue.splice(index, 1, this.input.value[index]);
  }
  indicateInputValue() {
    this.inputValue = this.input.value.replace(/[^A-Za-z]/, "").split("");
    this.renderInput.innerHTML = this.inputValue.join("");
  }
  fullWord() {
    this.playText(this.word, "full-word");
    this.utterance.addEventListener("end", (e) => {
      this.stopText();
    });
  }
  playText(text, state) {
    // the play text function is second to the last step of speaking, it actually says what is passed into the function and passes its value and state to the indicate text of what is being said.
    this.resumeText();
    if (speechSynthesis.speaking) return;
    if (document.getElementById("bracket").innerText !== ")")
      document.getElementById("bracket").innerText = ")";
    this.indicateText(text, state);
    return window.speechSynthesis.speak(this.set_Utterance(text)); // Make it so when the letter is wrong, it will make a monster sound, and the volumn will be increased
  }
  soundWaveIndicator(time = false) {
    document.getElementById("bracket").style.opacity = "1";
    let bracketIndicator = setInterval(() => {
      document.getElementById("bracket").style.opacity = "";
      clearInterval(bracketIndicator);
    }, 400 * (!time ? 1 : time));
  }
  /* Functions [🎰] */
  indicateText(text = false, state) {
    switch (state) {
      case "letter":
        if (this.renderText.textContent === this.word) {
          this.renderText.innerHTML = "";
        }
        this.checkLetter(this.onCharacter())
          ? this.renderLetter.push(`<span class='highlight'>${text}</span>`)
          : this.renderLetter.push(
              `<span class='highlightCorrect'>${text}</span>`
            );

        this.renderText.innerHTML = `${this.renderWord.join(
          " "
        )} ${this.renderLetter.join(" ")}`;

        if (this.checkLetter(this.onCharacter())) {
          this.renderLetter.splice(this.onLetter - 1, 1, text);
        }

        this.highlight(this.onCharacter());
        break;
      case "word":
        let syllable = this.renderLetter.filter((letter) =>
          this.syllable[this.onSyllable - 1].includes(
            letter.replace(/<\/?[^>]+(>|$)/g, "")
          )
        );

        syllable = syllable.join("");
        this.renderWord.push(syllable);
        this.renderText.innerHTML = this.renderWord.join(" ");
        this.renderLetter = [];

        if (this.onSyllable === this.syllable.length)
          this.renderInput.innerHTML = this.inputValue.join("");
        break;
      case "full-word":
        document.getElementById("bracket").style.opacity = "1";
        this.renderText.innerHTML = this.renderWord.join("");
        break;
      case "encrypt":
        this.renderText.innerHTML = "";
        document.getElementById("text").style.fontWeight = "700";
        let time = text.length * 10;
        this.delayRender(time, this.encrypt(text), true);
        break;
      case "correct":
        this.delayRender(this.timeElapsed, text);
        break;
      default:
        break;
    }
  }
  revealWord(text, state) {
    this.resumeText();
    if (speechSynthesis.speaking) return;
    let syllable;
    switch (state) {
      case "letter":
        if (this.onSyllable < this.syllable.length) {
          syllable = text[this.onSyllable].split("");
          text = syllable[this.onLetter];
          this.onLetter++;
        } else if (this.syllable.length === 1) {
          return this.stopText();
        } else {
          return this.fullWord();
        }
        this.soundWaveIndicator();
        break;
      case "word":
        this.onLetter = 0;
        this.onSyllable++;
        text = text[this.onSyllable - 1];
        this.soundWaveIndicator(text.length);
        break;
    }
    //document.getElementById("bracket").style.opacity = "1";
    this.playText(text, state);
    this.utterance.addEventListener("end", (e) => {
      if (state === "letter" && syllable.length === this.onLetter) {
        return this.revealWord(this.syllable, "word");
      }
      return this.revealWord(this.syllable, "letter");
    });
  }
}
