import { creatObj } from "./modules/creatObj.js";
import renderFunc from "./modules/renderFunc.js";
import Storage from "./modules/class/storage.js";

const input = document.getElementById("inputWord"); // Temporary {🥼}

input.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    // On enter, set wordStorage html and objectStorage to be empty {∅} and recreate the objectStorage with the newly added word and re-render wordStorage.
    if (Storage.duplicates(event.target.value)) return;
    let store = new Storage(event.target.value);
    store.setStorage();
    console.log(localStorage);
  }
});

creatObj();
renderFunc();

