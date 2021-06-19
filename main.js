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
    return (this._word = text.toLowerCase());
  }
}

class Check extends Word {
  constructor(word) {
    super(word);
  }
  /* checkSpelling(currentSyllable) {

  } */
}

class Speak extends Word {
  constructor(word) {
    super(word);
    this.syllable = this.syllabify(this.word);
    this.spell = this.word.split("");
    this.renderLetter = [];
    this.utterance = "";
    this.onSyllable = 0;
    this.timeElapsed = 0;
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
    //this.indicateText("");
    speechSynthesis.resume();
    this.onSyllable = 0;
    return speechSynthesis.cancel();
  }
  /* Functions */
  indicateText(text = false, state) {
    const renderText = document.getElementById("text");
    let textContent = renderText.textContent;
    switch (state) {
      case "syllable":
        if (textContent === this.word) {
          renderText.innerHTML = "";
        }
        for (let i = 0; i < text.length; i++) {
          setTimeout(function () {
            renderText.innerHTML += ` ${text[i]}` || "";
          }, i * this.timeElapsed);
        }
        break;
      case "word":
        textContent = textContent.split(" ");
        let syllable = textContent.filter((property) => property.length === 1);
        syllable = syllable.join("");
        this.renderLetter.push(syllable);
        renderText.innerHTML = this.renderLetter.join(" ");
        break;
      case "full-word":
        renderText.innerHTML = text || "";
        break;
    }
  }
  playText(text, state) {
    this.indicateText(text, state);
    this.resumeText();
    if (speechSynthesis.speaking) return;
    return window.speechSynthesis.speak(this.set_Utterance(text));
  }
  fullWord() {
    this.playText(this.word, "full-word"),
      this.utterance.addEventListener("end", (e) => {
        this.stopText();
      });
  }
  ifNoSyllable() {
    if (this.syllable.length === 1) {
      console.log("HI");
      this.playText(this.spell, "syllable");
      this.utterance.addEventListener("end", (e) => {
        this.fullWord();
      });
      return true;
    }
    return false;
  }
  revealWord(text, state) {
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
          return this.revealWord(vegetable.syllable, "word");
        }
        return this.revealWord(vegetable.syllable, "syllable");
      }, 100);
    });
  }
}

const vegetable = new Speak("computer");

const playWord = document.getElementById("play-word");
playWord.addEventListener("click", () => {
  vegetable.playText(vegetable.word, "full-word");
  vegetable.utterance.addEventListener("end", (e) => {
    vegetable.timeElapsed = e.elapsedTime / e.target.text.length + 200;
    console.log(vegetable.timeElapsed);
  });
});

const revealWord = document.getElementById("revealWord");
revealWord.addEventListener("click", () => {
  vegetable.revealWord(vegetable.syllable, "syllable");
});
