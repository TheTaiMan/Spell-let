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
    creatObj();
    renderFunc();
    sessionStorage.setItem("pendingRemove", JSON.stringify([]));
  }
  static onDuplicate(inputWord) {
    let pendingRemove = JSON.parse(sessionStorage.getItem("pendingRemove"));

    const word = inputWord;
    word.classList.toggle("remove");

    if (word.classList.contains("remove")) {
      pendingRemove.push(word.id);
      sessionStorage.setItem("pendingRemove", JSON.stringify(pendingRemove));
    } else {
      const restoreWord = pendingRemove.indexOf(word.id);
      pendingRemove.splice(restoreWord, 1);
      sessionStorage.setItem("pendingRemove", JSON.stringify(pendingRemove));
    }
  }
  static falseFormat(word) {
    const input = document.getElementById("inputWord");
    const array = JSON.parse(localStorage.getItem(word[0]));

    const falseFormat = {
      inputMessage(type) {
        if (input.placeholder !== type) {
          return (input.placeholder = type);
        }
      },
      resetInput() {
        if (input.value) {
          return Search.reset();
        }
      },
      animationIndicator() {
        const searchContainer = document.getElementById("searchInputContainer");
        searchContainer.classList.add("shake");
        setTimeout(() => {
          searchContainer.classList.remove("shake");
          this.resetInput();
        }, 600);
      },
      inputLength() {
        this.animationIndicator();
        if (!word.length) {
          if (document.getElementById("saveBtn").style.opacity === "1")
            document.getElementById("saveBtn").style.opacity = "";

          return this.inputMessage("Can't be empty");
        }
        if (word === "I" || word === "A") {
          return this.inputMessage("You know it already");
        }
        return this.inputMessage("Isn't a word");
      },
      duplicateIndicator(wordEle) {
        if (wordEle.classList.contains("remove")) {
          this.animationIndicator();
          this.inputMessage("Remove...");

          const saveBtn = document.getElementById("saveBtn");
          saveBtn.classList.add("wobble");
          setTimeout(() => {
            saveBtn.classList.remove("wobble");
            this.resetInput();
          }, 800);
        } else {
          this.inputMessage("Unlisted");
          this.resetInput();
        }
      },
    };

    if (word.length < 2) {
      falseFormat.inputLength();
      return true;
    } else if (array === null) {
      return false;
    } else if (array.includes(word)) {
      const word = document.getElementById(input.value);
      Storage.onDuplicate(word);
      falseFormat.duplicateIndicator(word);
      return true;
    } else {
      return false;
    }
  }
}
