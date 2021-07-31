// ***Imports*** {✈}
import renderFunc from "./modules/renderFunc.js";
import { creatObj } from "./modules/creatObj.js";

// ***Save Mechanics*** {📷}
class Remove {
  constructor(word) {
    this.word = word;
  }
  removeWord() {
    const key = this.word[0];
    let array = JSON.parse(localStorage.getItem(key));
    array.splice(array.indexOf(this.word), 1);
    if (!array.length) {
      return localStorage.removeItem(key);
    }
    return localStorage.setItem(key, JSON.stringify(array));
  }
  static update() {
    sessionStorage.setItem("pendingRemove", JSON.stringify([]));
    creatObj();
    renderFunc();
  }
}

// ***DOM Save*** {📸}
document.getElementById("removeWord").onclick = function () {
  let pendingRemoves = JSON.parse(sessionStorage.getItem("pendingRemove"));
  for (const pendingRemove of pendingRemoves) {
    const remove = new Remove(pendingRemove);
    remove.removeWord();
  }
  Remove.update();
};
