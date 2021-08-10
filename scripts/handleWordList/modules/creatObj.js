// ***Exports*** {📦}
export let objectStorage = new Object();

export const creatObj = () => {
  objectStorage = new Object();
  let orderedKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    orderedKeys.push(localStorage.key(i));
  }
  orderedKeys.sort();
  for (let i = 0; i < localStorage.length; i++) {
    objectStorage[orderedKeys[i]] = JSON.parse(
      localStorage.getItem(orderedKeys[i])
    );
  }
  //console.log(objectStorage)
};
