class Word {
  constructor(word) {
    this._word = this.setWord(word);
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
    this.renderWord = [];
    this.utterance = "";
    this.onSyllable = 0;
    this.timeElapsed = 0;
    this.block = false;
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
    speechSynthesis.resume();
    this.onSyllable = 0;
    return speechSynthesis.cancel();
  }
  set_timeElapsed(e) {
    let add = 0;
    if (this.syllable.length === 1) {
      add = 250;
    } else if (this.syllable.length >= 5) {
      add = 200;
    } else {
      add = 280;
    }
    //console.log(e.elapsedTime / this.word.length + add);
    return (this.timeElapsed = e.elapsedTime / this.word.length + add);
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
        this.renderText.innerHTML += ` ${text[i]}` || "";
        retract && i === text.length - 1
          ? this.renderReverse(time * 0.5, text)
          : false;
      }, i * (time || 200));
    }
  }
  renderReverse(time, text) {
    let encryptWord = text.split("");
    for (let i = encryptWord.length; i >= 0; i--) {
      setTimeout(() => {
        this.renderText.innerHTML =
          encryptWord.slice(0, encryptWord.length - i).join(" ") || "";
        i === encryptWord.length ? this.stopText() : false;
      }, i * (this.syllable.length === 1 ? time * 7 : this.syllable.length >= 5 ? time / 2 : time)); // *THIS SECTION MIGHT CAUSE ERRORS IN THE FUTURE
    }
  }
  /* Functions */
  indicateText(text = false, state) {
    //const renderText = document.getElementById("text");
    switch (state) {
      case "syllable":
        if (!this.renderWord.length) {
          this.renderText.innerHTML = "";
        }
        this.delayRender(this.timeElapsed, text);
        break;
      case "word": // ***FIXED***
        this.renderWord.push(text);
        this.renderText.innerHTML = this.renderWord.join(" ");
        break;
      case "full-word":
        this.renderText.innerHTML = text || "";
        break;
      case "encrypt":
        this.renderText.innerHTML = "";
        let time = text.length * 10;
        this.delayRender(time, this.encrypt(text), true);
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
    // passes the full word to the play text function without anything being processed
    this.playText(this.word, "full-word"),
      this.utterance.addEventListener("end", (e) => {
        this.stopText();
      });
  }
  ifNoSyllable() {
    // as the name suggest, this only activates when the word has only one syllable
    if (this.syllable.length === 1) {
      this.playText(this.spell, "syllable");
      this.utterance.addEventListener("end", (e) => {
        this.fullWord();
      });
      return true;
    }
    return false;
  }
  revealWord(text, state) {
    // This function is the start, it takes a state and passes it to the playText method, and it repeats for the whole word. following a odd even pattern
    this.resumeText();
    if (speechSynthesis.speaking) return;
    if (this.ifNoSyllable()) return;
    switch (state) {
      case "syllable":
        if (this.onSyllable < this.syllable.length) {
          text = text[this.onSyllable].split("");
        } else {
          return this.fullWord();
        }
        this.onSyllable++;
        break;
      case "word":
        text = text[this.onSyllable - 1];
        break;
    }
    this.playText(text, state);
    this.utterance.addEventListener("end", (e) => {
      setTimeout(() => {
        if (state === "syllable") {
          return this.revealWord(this.syllable, "word");
        }
        return this.revealWord(this.syllable, "syllable");
      }, 100);
    });
  }
}

/* const randomWord = () => {

} */
let givenWord;
const revealGivenWord = () => {
  if (!givenWord.block) {
    givenWord.block = true;
    return (
      (document.getElementById("text").style.filter = "blur(0px)"),
      givenWord.revealWord(givenWord.syllable, "syllable")
    );
  }
  return;
};
const playGivenWord = () => {
  if (!givenWord.block) {
    givenWord.block = true;
    document.getElementById("text").style.filter = "";
    return (
      givenWord.playText(givenWord.word, "encrypt"),
      givenWord.utterance.addEventListener("end", (e) => {
        givenWord.set_timeElapsed(e);
        //givenWord.block = false;
      })
    );
  }
  return;
};

class Check extends Word {
  constructor(word) {
    super(word);
  }
  checkSpelling(input) {
    const spellingValue = input.value.toLowerCase();
    if (this.word.toLowerCase() === spellingValue) {
      //console.log("Correct!");
      revealGivenWord();
      return true;
    }
    //console.log("Incorrect, go back to pre-school! ");
    playGivenWord();
    return false;
  }
}

const input = document.getElementById("inputSpelling");
let toCheck;

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    toCheck.checkSpelling(input);
  }
});

const playWord = document.getElementById("play-word");
playWord.addEventListener("click", playGivenWord);

const revealWord = document.getElementById("revealWord");
revealWord.addEventListener("click", revealGivenWord);

const setWordClass = (word) => {
  givenWord = new Speak(word);
  toCheck = new Check(word);
};

let word = [
  "perpendicular",
  "Deforestation",
  "Procrastination",
  "computer",
  "vegetable",
  "text",
  "beats",
];

setWordClass(word[2]);
