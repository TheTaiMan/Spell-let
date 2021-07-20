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
  set_Utterance(text) {
    return (this.utterance = new SpeechSynthesisUtterance(text));
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
    speechSynthesis.resume();
    this.onSyllable = 0;
    this.onLetter = 0;
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
  delayRender(time, text, retract = false) {
    for (let i = 0; i < text.length; i++) {
      
      setTimeout(() => {
        this.renderText.style.width = `${i}.3rem`;
        this.renderText.innerHTML += ` ${text[i]}`;
        if (i === text.length - 1) {
          if (!retract) {
            this.renderText.style.width = `${text.length -(text.length* 0.35)}rem`;
            return document.getElementById("bracket").innerHTML = '✔';
          }
          return this.renderReverse(time * 0.5, text);
        }
      }, i * (time || 200));
    }
  }
  renderReverse(time, text) {
    let encryptWord = text.split("");
    for (let i = 0; i <= encryptWord.length; i++) {
      setTimeout(() => {
        this.renderText.style.width = `${encryptWord.length - i}.3rem`;
        this.renderText.innerHTML = encryptWord
          .slice(0, encryptWord.length - i)
          .join(" ");
        (i === encryptWord.length) ? this.stopText() : false;
      }, i * (this.syllable.length <= 2 ? time * 7 : this.syllable.length >= 5 ? time / 2 : time)); // Experimental {🧪} [WILL CAUSE ERRORS❌]
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
        this.inputValue.push(`<span class='highlightWrong'> - </span>`);
      } else {
        this.inputValue.splice(
          index,
          1,
          `<span class='highlightWrong'>${
            !this.input.value[index] ? " - " : this.input.value[index]
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
    this.indicateText(text, state);
    return window.speechSynthesis.speak(this.set_Utterance(text)); // Make it so when the letter is wrong, it will make a monster sound, and the volumn will be increased
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
        this.renderText.innerHTML = this.renderWord.join("");
        break;
      case "encrypt":
        this.renderText.innerHTML = "";
        let time = text.length * 10;
        this.delayRender(time, this.encrypt(text), true);
        break;
      case "correct":
        this.delayRender(this.timeElapsed, text);
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
        break;
      case "word":
        this.onLetter = 0;
        this.onSyllable++;
        text = text[this.onSyllable - 1];
        break;
    }
    this.playText(text, state);
    this.utterance.addEventListener("end", (e) => {
      if (state === "letter" && syllable.length === this.onLetter) {
        return this.revealWord(this.syllable, "word");
      }
      return this.revealWord(this.syllable, "letter");
    });
  }
}
