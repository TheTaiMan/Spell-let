class Word {
  constructor(word) {
    this._word = this.setWord(word);
    this.input = document.getElementById("inputSpelling");
    this.renderInput = document.getElementById("inputValue");
    this.renderText = document.getElementById("text");
  }
  get word() {
    return this._word;
  }
  setWord(text) {
    if (typeof text !== "string" || !text.trim() || text.length === 0) {
      throw Error("Enter an actual word");
    }
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    return (this._word = text.trim());
  }
}

class Speak extends Word {
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
  /* Tools */
  syllabify(words) {
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
    return (this.timeElapsed = e.elapsedTime / this.word.length - 50);
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
        this.renderText.innerHTML += ` ${text[i]}`;
        if (i === text.length - 1) {
          !retract
            ? (this.renderText.innerHTML += ` ✓`)
            : this.renderReverse(time * 0.5, text);
        }
      }, i * (time || 200));
    }
  }
  renderReverse(time, text) {
    let encryptWord = text.split("");
    for (let i = encryptWord.length; i >= 0; i--) {
      setTimeout(() => {
        this.renderText.innerHTML = encryptWord
          .slice(0, encryptWord.length - i)
          .join(" ");
        i === encryptWord.length ? this.stopText() : false;
      }, i * (this.syllable.length === 1 ? time * 7 : this.syllable.length >= 5 ? time / 2 : time)); // *THIS SECTION MIGHT CAUSE ERRORS IN THE FUTURE
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
      if (
        this.inputValue[index].toLowerCase() !== this.spell[index].toLowerCase()
      ) {
        return false;
      }
    } catch (e) {
      return false;
    }
    return true;
  }
  highlight(index) {
    // Add a feature where every letter after the index of the actual word is wrong and it will be highlighted a different color
    let correct;
    if (!this.checkLetter(index)) {
      if (this.inputValue[index] === undefined) {
        this.inputValue.push(`<span class='highlightWrong'>-</span>`);
      } else {
        this.inputValue.splice(
          index,
          1,
          `<span class='highlightWrong'>${this.input.value[index]}</span>`
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
  /* Functions */
  indicateText(text = false, state) {
    switch (state) {
      case "letter":
        if (this.renderText.textContent === this.word) {
          this.renderText.innerHTML = "";
        }
        this.checkLetter(this.onCharacter())
          ? this.renderLetter.push(`<span class='highlight'>${text}</span>`)
          : this.renderLetter.push(`<span class='highlightRed'>${text}</span>`);

        this.renderText.innerHTML = `${this.renderWord.join(
          " "
        )} ${this.renderLetter.join(" ")}`;

        if (this.checkLetter(this.onCharacter())) {
          this.renderLetter.splice(this.onLetter - 1, 1, text);
        }

        this.highlight(this.onCharacter());
        break;
      case "word":
        let syllable = this.renderLetter.filter((letter) => {
          return (
            this.syllable[this.onSyllable - 1].includes(letter) ||
            this.syllable[this.onSyllable - 1].includes(letter[27])
          ); // Use a regex to get the letter, for next time
        });

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
  playText(text, state) {
    // the play text function is second to the last step of speaking, it actually says what is passed into the function and passes its value and state to the indicate text of what is being said.
    this.resumeText();
    if (speechSynthesis.speaking) return;
    this.indicateText(text, state);
    return window.speechSynthesis.speak(this.set_Utterance(text));
  }
  fullWord() {
    this.playText(this.word, "full-word");
    this.utterance.addEventListener("end", (e) => {
      this.stopText();
    });
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

let givenWord;
const SpeakFunction = {
  filter(value) {
    const text = document.getElementById("text");
    return (text.style.filter = value);
  },
  play(text, type) {
    return givenWord.playText(text, type);
  },
  revealWord() {
    return givenWord.revealWord(givenWord.syllable, "letter");
  },
  revealGivenWord() {
    if (givenWord.block) return;
    givenWord.block = true;
    return this.filter("blur(0px)"), this.revealWord();
  },
  playGivenWord() {
    if (givenWord.block) return;
    givenWord.block = true;
    this.filter("");
    this.play(givenWord.word, "encrypt");
    givenWord.utterance.addEventListener("end", (e) => {
      return givenWord.set_timeElapsed(e);
    });
  },
  playCorrectWord() {
    this.filter("blur(0px)");
    this.play(givenWord.word, "correct");
  },
};

class Check extends Word {
  constructor(word) {
    super(word);
    this.inCorrectCount = 0;
  }
  pickWord() {
    this.inCorrectCount = 0;
    let randomWord = Math.floor(Math.random() * word.length);
    setWordClass(word[randomWord]);
    return SpeakFunction.playGivenWord();
  }
  correct() {
    if (givenWord.block) return;
    givenWord.block = true;
    SpeakFunction.playCorrectWord();
    if ((this.renderText.textContent = this.word))
      this.renderText.innerHTML = "";
    givenWord.utterance.addEventListener("end", (e) => {
      setTimeout(() => {
        this.blank();
        this.pickWord();
      }, 1000);
    });
  }
  inCorrect() {
    return SpeakFunction.playGivenWord();
  }
  blank() {
    this.renderText.innerHTML = "";
    this.renderInput.innerHTML = "";
    this.input.value = "";
  }
  checkSpelling() {
    const spellingValue = this.input.value.trim().toLowerCase();
    if (this.word.toLowerCase() === spellingValue) {
      this.correct();
      return true;
    }
    if (this.inCorrectCount === 3) {
      SpeakFunction.revealGivenWord();
      this.inCorrectCount = 0;
    } else {
      this.inCorrect();
    }
    this.inCorrectCount++;
    return false;
  }
}

const input = document.getElementById("inputSpelling");
let toCheck;

input.addEventListener("keyup", (event) => {
  event.preventDefault();
    if (event.keyCode === 13) {
      toCheck.checkSpelling();
    }
    event.target.value = event.target.value.replace(/[^A-Za-z]/, "");
});

input.addEventListener("keydown", (e) => {
  e.target.value = e.target.value.replace(/[^A-Za-z]/, "");
});

input.addEventListener("input", (event) => {
  givenWord.indicateInputValue();
});

// Add something that when pressed will reveal the word

const playWord = document.getElementById("play-word");
playWord.addEventListener("click", () => {
  SpeakFunction.playGivenWord();
});

const revealWord = document.getElementById("revealWord");
revealWord.addEventListener("click", () => {
  SpeakFunction.revealGivenWord();
});

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
];
const setWordClass = (word) => {
  givenWord = new Speak(word);
  toCheck = new Check(word);
};

setWordClass("computer");

// Use the datamuse https://www.datamuse.com/api/ API to check if the input is actually a word. If it comes back with an Error, its not a word and will not be saved, but if is doesn't have any errors, it will save the word to local storage object
