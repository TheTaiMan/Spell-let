// ***Imports*** {✈}
import Word from "../word.js";
import setWordClass from "./modules/setClass.js";

// ***Speak Components*** {🧱}
const SpeakFunction = {
  // This needs to be wiped with soap {🧼}, so0O unclean code
  get block() {
    return givenWord.block;
  },
  set block(bouillon) {
    return (givenWord.block = bouillon);
  },
  get word() {
    return givenWord;
  },
  filter(value) {
    const text = document.getElementById("text");
    return (text.style.filter = value);
  },
  play(text, type) {
    return givenWord.playText(text, type);
  },
  revealWord() {
    givenWord.indicateInputValue();
    return givenWord.revealWord(givenWord.syllable, "letter");
  },
  display(reveal) {
    if (reveal) {
      givenWord.input.style.display = "none";
      this.filter("blur(0px)");
      document.getElementById("inputValue").style.display = "block";
    } else {
      givenWord.input.style.display = "block";
      this.filter("");
      document.getElementById("inputValue").style.display = "none";
      input.focus();
    }
  },
  revealGivenWord() {
    if (this.block) return;
    this.block = true;
    this.display(true);
    return this.revealWord();
  },
  playGivenWord() {
    if (this.block) return;
    this.block = true;
    this.display(false);
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

// ***Activate Class Functions*** {🏭}
window.addEventListener("load", () => {
  setWordClass(Word.pickWord(), SpeakFunction);// {givenWord, toCheck} = [window.object]
  givenWord.set_Utterance('Load Voice'); 
});

// ***DOM Events*** {📲}
const input = document.getElementById("inputSpelling");
input.onpaste = (e) => e.preventDefault();

document.getElementById("inputValue").onclick = (event) => {
  if (speechSynthesis.speaking) return;
  event.target.style.display = "none";
  input.style.display = "block";
  input.focus();
  input.select();
}

const handleBtn = (btn, width) => {
  if (speechSynthesis.speaking) return;
  btn.style.opacity = "1";
  btn.style.width = `${width}rem`;
  return setTimeout(() => {
    btn.style.opacity = "";
    btn.style.width = "";
  }, 180);
}

input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    if (speechSynthesis.speaking) return;
    return toCheck.checkSpelling();
  }
  return (event.target.value = event.target.value.replace(/[^A-Za-z]/, "")); // Do a shaking animation when you enter these characters
});

input.addEventListener("input", (event) => {
  event.target.value =
    event.target.value.charAt(0).toUpperCase() +
    event.target.value.slice(1).toLowerCase();
  givenWord.indicateInputValue();
});

document.getElementById("checkBtn").onclick = (event) => {
  if (speechSynthesis.speaking) return;
  handleBtn(event.target, 2);
  return toCheck.checkSpelling();
};

const playWord = document.getElementById("play-word");
playWord.addEventListener("click", () => {
 handleBtn(playWord, 6.7);
 return SpeakFunction.playGivenWord();
});

const revealWord = document.getElementById("revealWord");
revealWord.addEventListener("click", () => {
  handleBtn(revealWord, 4.7);
  toCheck.inCorrectCount = 0;
  return SpeakFunction.revealGivenWord();
});

// Use the datamuse https://www.datamuse.com/api/ API to check if the input is actually a word. If it comes back with an Error, its not a word and will not be saved, but if is doesn't have any errors, it will save the word to local storage object
