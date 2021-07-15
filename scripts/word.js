import { creatObj, objectStorage } from "./handleWordList/modules/creatObj.js";

/* let word = [
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
*/
const input = document.getElementById("inputSpelling");

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
      throw Error(`${text === "" ? "{empty}": text} is not an actual word`);
    }
    text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    return (this._word = text.trim());
  }
  static pickWord() {
    function random(parameter) {
      return Math.floor(Math.random() * parameter);
    }
    let result = "";
    let objectKey = Object.keys(objectStorage);
  
    if (!objectKey.length) return creatObj();
  
    let randomKey = random(objectKey.length);
    let randomArray = objectStorage[objectKey[randomKey]];
    let randomWord = random(randomArray.length);

    result = randomArray[randomWord];

    randomArray.splice(randomWord, 1);
    if (!randomArray.length) {
      delete objectStorage[objectKey[randomKey]];
    }

    input.setAttribute("maxlength", result.length);
    input.focus();

    return result;
  }
  
}
