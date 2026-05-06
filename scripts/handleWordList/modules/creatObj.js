// ***Exports*** {📦}
export let objectStorage = new Object();

export const creatObj = () => {
  objectStorage = new Object();
  let orderedKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key.length === 1 && key >= "A" && key <= "Z") {
      orderedKeys.push(key);
    }
  }
  orderedKeys.sort();
  for (let i = 0; i < orderedKeys.length; i++) {
    objectStorage[orderedKeys[i]] = JSON.parse(
      localStorage.getItem(orderedKeys[i])
    );
  }
  //console.log(objectStorage)
};
