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
  "equilibrium",
  "available",
]; // Temporary {🥼}

const input = document.getElementById("inputSpelling"); // Temporary {🥼}

// ***Exports*** {📦}
export default class Word {
  // Add random word picker to the word class
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
  static start() {
    // Temporary {🥼}
    // This will DEFINITELY cause problems {⚠️} when moving to modules, it can't access word array
    let randomWord = Math.floor(Math.random() * word.length);
    input.setAttribute("maxlength", word[randomWord].length);
    input.focus();
    return word[randomWord];
  }
}
