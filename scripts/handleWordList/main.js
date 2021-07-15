import { creatObj, objectStorage } from "./modules/creatObj.js";
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

document.getElementById("randomWord").onclick = () => {
  function random(parameter) {
    return Math.floor(Math.random() * parameter);
  }
  let objectKey = Object.keys(objectStorage);

  if (!objectKey.length)
    return (
      creatObj(),
      (document.getElementById("random").innerHTML = "Got All the words")
    );

  let randomKey = random(objectKey.length);
  let randomArray = objectStorage[objectKey[randomKey]];
  let randomWord = random(randomArray.length);

  document.getElementById("random").innerHTML = randomArray[randomWord];
  randomArray.splice(randomWord, 1);
  if (!randomArray.length) {
    delete objectStorage[objectKey[randomKey]];
  }
  console.log(objectStorage);
};

/* 
for (let i = 0; i < word.length; i++) {
  let store = new Storage(word[i]);
  store.setStorage();
} */

window.addEventListener("load", () => {
  creatObj();
  console.log(localStorage, objectStorage);
  renderFunc();
});
