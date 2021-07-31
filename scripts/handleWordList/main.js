// ***Imports*** {✈}
import { creatObj } from "./modules/creatObj.js";
import renderFunc from "./modules/renderFunc.js";
import Storage from "./modules/class/storage.js";
import { Search } from "./search.js";

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

$("#storageList").css({ height: "0.8rem" });

const WordListToggle = () => {
  if (input.value) {
    input.value = "";
    setTimeout(() => {
      Search.reset();
    }, 200);
  }

  if (document.getElementById("storageList").style.height === "10rem") {
    $("#overlay").css({ display: "" });
    $("#overlay").off();
    return $("#storageList").css({ height: "0.8rem" });
  }

  $("#overlay").css({ display: "block" });
  $("#overlay").click(function () {
    WordListToggle();
  });
  input.focus();
  return $("#storageList").css({ height: "10rem" });
};

listToggle.onclick = () => WordListToggle(); // Restore all the pendingRemove words in sessionStorage clear sessionStorage.

// ***Render Word List*** {📋}
creatObj();
renderFunc();
