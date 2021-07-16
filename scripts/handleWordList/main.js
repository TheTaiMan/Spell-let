// ***Imports*** {✈}
import { creatObj } from "./modules/creatObj.js";
import renderFunc from "./modules/renderFunc.js";
import Storage from "./modules/class/storage.js";

// ***Global Variable*** {🌎}
const input = document.getElementById("inputWord");

// ***DOM Events*** {📲}
input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    if (Storage.falseFormat(event.target.value)) return;
    let store = new Storage(event.target.value);
    store.setStorage();
    setTimeout(() => input.value = "", 0);
    console.log(localStorage);
  }
});

// ***Render Word List*** {📋}
creatObj();
renderFunc();

