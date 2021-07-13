// ***Imports*** {✈}
import { Speak } from "./class/speak.js";
import { Check } from "./class/check.js";

// ***Exports*** {📦}
export const setWordClass = (word, SpeakFunction) => {
  window.givenWord = new Speak(word);
  window.toCheck = new Check(word, SpeakFunction);
};
