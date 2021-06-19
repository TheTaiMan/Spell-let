/*
utterance.addEventListener("end", (e) => {
  console.log("End");
  console.log(e.charIndex);
  console.log(e.target.text);
  console.log("Total:" + e.elapsedTime);
  console.log(e.target.text.length);
  console.log((e.elapsedTime / e.target.text.length)-52); 

});


utterance.addEventListener('start', function(event) {
  console.log("Speech paused after " + event.elapsedTime + " milliseconds.");
  setTimeout(()=> {
    speechSynthesis.pause();
    console.log('PASEEE'); 
  }, 516);
}); */

// case 'word':
//         this.resumeText();
//         //let timeOut = this.syllable[this.onSyllable-1||0].length * this.eachSyllableTime;
//         if (this.onSyllable <= this.syllable.length) {
//           text = text[this.onSyllable-1];
//         } else {
//           text = this.word;
//         }

//         console.log('-------------------------------------------------------------');
//         console.log('time: '+timeOut);
//         console.log('syllable: '+this.syllable[this.onSyllable-1||0]);
//         console.log('onSyllable: '+this.onSyllable-1 || 0);
//         console.log('on ' + this.onSyllable);
//         console.log('eachTime: '+this.eachSyllableTime);
//         setTimeout(()=> {
//           console.log('HII');
//           this.utterance.volume = 0.1;
//         }, timeOut+300);
//         break;
//     }

/******************************************************** */

/**
 * Use the average time for a letter to be said and that can
 * be used to determine when to stop and when to resume.
 * There should be different voice synthesis for each type of word
 * for example, the word should have its own synthesis and the spelling should too
 */

/**
 * For the spelling, you should use .substring() method to go to the spelling an [OR]
 * use the syllable array and split each index of it, and when it ends, hopefully when you press
 * resume, it will resume from the word itself.
 */

/**
 * After saying the spelling of the first word, the end event listener of that utterance will start and trigger the
 * start of the word and then it will pause it after taking the time of the average length of how long it takes to say 1
 * letter and then multiply it by the length of the first syllable, this will insure that it pause of where it left off form
 * the first spelling of the syllable.
 */

/**
 * If the pausing technic doesn't work, then move on to volume, this will allow you to mute the voice when it is not saying the
 * right syllable, and when it is saying the right syllable, it will turn the volume to 1, so it can be heard, when it pass the
 * syllable, it will then mute again.https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance/volume
 */

class Speak {
  constructor(word) {
    this.word = word;
    this.syllable = this.syllabify(this.word);
    this.spell = this.word.split("");
    this.utterance = "";
    this.onSyllable = 0;
    //this.rate = 0.8;
    //utterance.text = text.substring(0);
  }
  /* Tools */
  syllabify(words) {
    const syllableRegex =
      /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    return words.match(syllableRegex);
  }
  indicateText(text = false) {
    return (document.getElementById("text").innerHTML = text || "");
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
    this.indicateText("");
    speechSynthesis.resume();
    this.onSyllable = 0;
    return speechSynthesis.cancel();
  }
  /* Functions */
  playText(text) {
    this.indicateText(text);
    this.resumeText();
    if (speechSynthesis.speaking) return;
    return window.speechSynthesis.speak(this.set_Utterance(text));
  }
  fullWord() {
    this.playText(this.word),
    this.utterance.addEventListener("end", (e) => {
      this.stopText();
    })
  }
  ifNoSyllable() {
    if (this.syllable.length === 1) {
      this.playText(this.spell);
      this.utterance.addEventListener("end", (e) => {
        this.fullWord();
      });
      return true;
    }
    return false;
  }
  playComboText(text, state) {
    this.resumeText();
    if (speechSynthesis.speaking) return;

    this.ifNoSyllable();
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
    this.playText(text);

    this.utterance.addEventListener("end", (e) => {
      setTimeout(() => {
        if (state === "syllable") {
          return vegetable.playComboText(vegetable.syllable, "word");
        }
        return this.playComboText(vegetable.syllable, "syllable");
      }, 100);
    });
  }
}

const vegetable = new Speak("vegetable");

const playWord = document.getElementById("play-word");
playWord.addEventListener("click", () => {
  vegetable.playText(vegetable.word);
});

const revealWord = document.getElementById("revealWord");
revealWord.addEventListener("click", () => {
  vegetable.playComboText(vegetable.syllable, "syllable");
});

const playSyllable = document.getElementById("play-syllable");
playSyllable.addEventListener("click", () => {
  vegetable.playText(vegetable.syllable);
});

const playSpelling = document.getElementById("play-spelling");
playSpelling.addEventListener("click", () => {
  vegetable.playText(vegetable.spell);
});

const pauseButton = document.getElementById("pause-button");
pauseButton.addEventListener("click", vegetable.pauseText);

const stopButton = document.getElementById("stop-button");
stopButton.addEventListener("click", () => {
  vegetable.stopText();
});
