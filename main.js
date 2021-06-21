class Word {
  constructor(word) {
    this._word = this.setWord(word);
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
      add = 100;
    } else {
      add = 280;
    }
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
    return newCode.toUpperCase();
  }
  delayRender(time, text, imprint) {
    for (let i = 0; i < text.length; i++) {
      // This prints the letters of the syllable to the console in sync with the voice spelling it
      setTimeout(function () {
        imprint.innerHTML += ` ${text[i]}` || "";
      }, i * (time || 200)); // this is responsible for the delay of the letter being shown in the window.
    }
  }
  /* Functions */
  indicateText(text = false, state) {
    // The last step of the step of this class, it renders the text being said in a dynamic way to the window, with the syllable and everything showing in sort of sync with teh voice.
    const renderText = document.getElementById("text");
    let textContent = renderText.textContent;
    switch (state) {
      case "syllable":
        if (!this.renderWord.length) {
          renderText.innerHTML = "";
        }
        this.delayRender(this.timeElapsed, text, renderText);
        break;
      case "word": // favorite function of this class, it takes the content already rendered to the window, and splits them it groups, one being a full syllable and the other a letters of a syllable. Then combines the letter that apart of a syllable into a syllable when the syllable is being said.
        textContent = textContent.split(" ");
        let syllable = textContent.filter((property) => property.length === 1); // Then it filters through the groups and stores the letters of syllables
        syllable = syllable.join(""); // Then makes those letters of syllable a full syllable string.
        this.renderWord.push(syllable); // That full syllable gets added to the this.renderWord which can be accessed  by the whole class and allows previous words to be saved along with new ones getting added.
        renderText.innerHTML = this.renderWord.join(" "); // The all of the arraying in the this.renderWord gets rendered to the window, showing an illusion of the syllables letters combining while the old syllables not changing, but the whole section is being changed even the old words.
        break;
      case "full-word":
        renderText.innerHTML = text || "";
        break;
      case "encrypt":
        renderText.innerHTML = "";
        text = this.encrypt(text);
        let time = text.length * 10;
        this.delayRender(time, text, renderText);
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
          text = text[Math.min(this.onSyllable, text.length)].split("");
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
        return givenWord.block = false;
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
    console.log("Incorrect, go back to pre-school! ");
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

setWordClass("computer");
