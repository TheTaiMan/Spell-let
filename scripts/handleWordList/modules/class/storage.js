import Word from "../../../word.js";
import renderFunc from "../renderFunc.js";
import { creatObj } from "../creatObj.js";
import { Search } from "../../search.js";

export default class Storage extends Word {
  // Add something that will prevent it from adding letters that are 2 characters long
  constructor(word) {
    super(word);
  }
  storageIndication() {
    document.getElementById("inputWord").placeholder = "Saved✔";
    document.getElementById("saveBtn").style.opacity = "1";
  }
  setStorage() {
    let word = this.word;
    let data = localStorage.getItem(word[0]);
    data = data ? JSON.parse(data) : [];
    data.push(word);
    localStorage.setItem(word[0], JSON.stringify(data));
    this.storageIndication();
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
    const input = document.getElementById("inputWord");
    function formatIndicator() {
      const searchContainer = document.getElementById("searchInputContainer");
      searchContainer.classList.add("shake");
      setTimeout(() => {
        searchContainer.classList.remove("shake");
        if (input.value) {
          Search.reset();
          input.value = "";
        }
      }, 600);
    }
    const array = JSON.parse(localStorage.getItem(word[0]));

    if (word.length < 2) {
      formatIndicator();
      if (!word.length) {
        input.placeholder = "Can't be empty";
        if (document.getElementById("saveBtn").style.opacity === "1") {
          document.getElementById("saveBtn").style.opacity = "";
        }
      } else {
        input.placeholder = "Isn't a word";
      }
      return true;
    } else if (array === null) {
      return false;
    } else if (array.includes(word)) {
      formatIndicator();
      input.placeholder = "No Duplicates";
      return true;
    } else {
      return false;
    }
  }
}
