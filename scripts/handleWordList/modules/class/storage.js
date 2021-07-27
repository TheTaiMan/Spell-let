import Word from "../../../word.js";
import renderFunc from "../renderFunc.js";
import { creatObj } from "../creatObj.js";
import { Search } from "../../search.js";

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
  static falseFormat(word) {
    function formatIndicator() {
      const searchContainer = document.getElementById("searchInputContainer");
      searchContainer.classList.add("shake");
      setTimeout(() => {
        searchContainer.classList.remove("shake");

        const input = document.getElementById("inputWord");
        if (input.value) {
          Search.reset();
          input.value = "";
        }
      }, 600);
    }
    const array = JSON.parse(localStorage.getItem(word[0]));

    if (word.length < 2) {
      formatIndicator();
      return true;
    } else if (array === null) {
      return false;
    } else if (array.includes(word)) {
      formatIndicator();
      return true;
    } else {
      return false;
    }
  }
}
