// ***Imports*** {✈}
import { creatObj } from "./modules/creatObj.js";
import renderFunc from "./modules/renderFunc.js";
import Storage from "./modules/class/storage.js";

// ***Global Variable*** {🌎}
const input = document.getElementById("inputWord");
const listToggle = document.getElementById("listToggle");

// ***DOM Events*** {📲}
const saveWord = () => {
  if (Storage.falseFormat(input.value)) return;
  let store = new Storage(input.value);
  store.setStorage();
  setTimeout(() => (input.value = ""), 0);
  console.log(localStorage);
};

input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    saveWord();
  }
});

input.onpaste = (e) => {
  setTimeout(() => {
    input.value = input.value.replace(/[^a-zA-Z ]/g, "");
  }, 0);
};

document.getElementById("saveBtn").onclick = (event) => {
  input.focus();
  if (event.target.style.opacity === "1") {
    event.target.style.opacity = "";
  }
  return saveWord();
};

listToggle.onclick = () => {
  const list = document.getElementById("wordStorage");
  list.classList.toggle("disappear");
  if (input.value) {
    input.value = "";
  }
  if (list.classList.contains("disappear")) {
    creatObj();
    renderFunc();
  }
};

// ***Render Word List*** {📋}
creatObj();
renderFunc();
