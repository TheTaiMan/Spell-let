import Word from "../../../word.js";
import renderFunc from "../renderFunc.js";
import { creatObj } from "../creatObj.js";


export default class Storage extends Word {
  // Add something that will prevent it from adding letters that are 2 characters long
  constructor(word) {
    super(word);
  }
  setStorage() {
    let word = this.word;
    let data = localStorage.getItem(word[0]);
    data = data ? JSON.parse(data) : [];
    data.push(word);
    localStorage.setItem(word[0], JSON.stringify(data));
    return this.orderArray(), this.updateStorage(); // When implementing words for the first time take out .updateStorage()[❌]
  }
  checkLength() {
    return JSON.parse(localStorage.getItem(this.word[0])).length > 1
      ? true
      : false;
  }
  orderArray() {
    if (!this.checkLength()) return;
    let arrayParsed = JSON.parse(localStorage.getItem(this.word[0]));
    arrayParsed = arrayParsed.sort((a, b) => a.length - b.length);
    localStorage.setItem(this.word[0], JSON.stringify(arrayParsed));
  }
  updateStorage() {
    // Have this as a utility function in another file that can be accessed by any other file;
    creatObj();
    renderFunc();
  }
  static duplicates(word) {
    // Do something about the input of Words, where the first letter is uppercased automatically
    const array = JSON.parse(localStorage.getItem(word[0]));
    if (array === null) {
      return false;
    }

    if (array.includes(word)) {
      return true;
    }
    return false;
  }
}
