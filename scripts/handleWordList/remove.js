import renderFunc from "./modules/renderFunc.js";
import { creatObj } from "./modules/creatObj.js";

class Save {
  constructor(word) {
    this.word = word;
  }
  checkClass() {
    if (this.word.classList.contains("remove")) {
      return this.removeWord(this.word.id);
    }
  }
  removeWord(word) {
    const key = word[0];
    let array = JSON.parse(localStorage.getItem(key));
    array.splice(array.indexOf(word), 1);
    if (!array.length) {
      return localStorage.removeItem(key);
    }
    return localStorage.setItem(key, JSON.stringify(array));
  }
  static update() {
    creatObj();
    renderFunc();
  }
}

document.getElementById("removeWord").onclick = function () {
  [...document.querySelectorAll(".category")].forEach((section) => {
    const categoryId = document.getElementById(section.id);
    const words = categoryId.children[1].children;

    for (const word of words) {
      const save = new Save(word);
      save.checkClass();
    }
  });
  Save.update();
};

