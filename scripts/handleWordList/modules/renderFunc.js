// ***Imports*** {✈}
import RenderStorage from "./class/renderStorage.js";
import { objectStorage } from "./creatObj.js";

// ***Exports*** {📦}
export default function renderFunc() {
  document.getElementById("wordList").innerHTML = "";
  for (const property in objectStorage) {
    let renderSection = new RenderStorage(objectStorage[property], property);
    renderSection.render();
  }
};
