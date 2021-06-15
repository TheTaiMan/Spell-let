/*
utterance.addEventListener("end", (e) => {
  console.log("End");
  console.log(e.charIndex);
  console.log(e.utterance.text);
  console.log("Total:" + e.elapsedTime);
  console.log(e.utterance.text.length);
  console.log((e.elapsedTime / e.utterance.text.length)-52); 

});


utterance.addEventListener('start', function(event) {
  console.log("Speech paused after " + event.elapsedTime + " milliseconds.");
  setTimeout(()=> {
    speechSynthesis.pause();
    console.log('PASEEE'); 
  }, 516);
}); */

/******************************************************** */

class Speak {
  constructor(word) {
    this.word = word;
    this.syllable = this.syllabify(this.word);
    this.spell = this.word.split("");
    this.utterance = "";
    //this.rate = 0.8;
    //utterance.text = text.substring(0);
  }
  syllabify(words) {
    const syllableRegex =
      /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    return words.match(syllableRegex);
  }
  indicateText(text = false) {
    return (document.getElementById("text").innerHTML = text || '');
  }
  playText(text) {
    this.indicateText(text);
    this.resumeText();
    if (speechSynthesis.speaking) return;
    return window.speechSynthesis.speak(this.set_Utterance(text));
  }
  set_Utterance(text) {
    return (this.utterance = new SpeechSynthesisUtterance(text));
  }
  pauseText() {
    if (speechSynthesis.speaking) return speechSynthesis.pause();
  }
  resumeText() {
    return speechSynthesis.resume();
  }
  stopText() {
    this.indicateText('');
    speechSynthesis.resume();
    return speechSynthesis.cancel();
  }
}

const vegetable = new Speak("vegetable");
vegetable.set_Utterance("hi");

const playWord = document.getElementById("play-word");
const playSyllable = document.getElementById("play-syllable");
const playSpelling = document.getElementById("play-spelling");

playWord.addEventListener("click", () => {
  vegetable.playText(vegetable.word);

  vegetable.utterance.addEventListener("start", function (e) {
    console.log("Started");
    console.log(e.target.text);
  });
  vegetable.utterance.addEventListener("end", (e) => {
    console.log("End");
    //console.log(e.charIndex);
  });
});

playSyllable.addEventListener("click", () => {
  vegetable.playText(vegetable.syllable);
});

playSpelling.addEventListener("click", () => {
  vegetable.playText(vegetable.spell);
});

const pauseButton = document.getElementById("pause-button");
const stopButton = document.getElementById("stop-button");

pauseButton.addEventListener("click", vegetable.pauseText);
stopButton.addEventListener("click", () => {vegetable.stopText()});
