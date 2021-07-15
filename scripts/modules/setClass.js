// ***Imports*** {✈}
import Speak from "./class/speak.js";
import Check from "./class/check.js";

// ***Exports*** {📦}
export default function setWordClass(word, SpeakFunction) {
  window.givenWord = new Speak(word);
  window.toCheck = new Check(word, SpeakFunction);
};
