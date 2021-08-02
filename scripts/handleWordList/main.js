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

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    saveWord();
  }
});

document.getElementById("saveBtn").onclick = (event) => {
  input.focus();
  if (event.target.style.opacity === "1") {
    event.target.style.opacity = "";
  }
  return saveWord();
};

input.onpaste = (e) => {
  setTimeout(() => {
    input.value = input.value.replace(/[^a-zA-Z ]/g, "");
  }, 0);
};

// ***Render Word List*** {📋}
window.addEventListener("load", () => {
  creatObj();
  renderFunc();
  sessionStorage.setItem("pendingRemove", JSON.stringify([]));
});
