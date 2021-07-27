// ***Global Variable*** {🌎}
const input = document.getElementById("inputWord");

// ***Search Mechanics*** {🗺}
export class Search {
  // And something when there is no words found or no category found
  constructor(compare, input) {
    this.compare = compare;
    this.input = input;
  }
  classLogic(type) {
    return this.compare.classList[type]("disappear");
  }
  match() {
    if (this.classLogic("contains")) return this.classLogic("remove");
  }
  falseMatch() {
    if (!this.classLogic("contains")) return this.classLogic("add");
  }
  sliceCompare() {
    return this.compare.id.split("", this.input.length).join("");
  }
  compareLogic(compare) {
    if (compare === this.input) {
      return this.match();
    }
    return this.falseMatch();
  }
  static reset() {
    function loop(ele) {
      for (const prop of ele) {
        if (prop.classList.contains("disappear"))
          prop.classList.remove("disappear");
      }
    }
    const words = document.getElementsByClassName("word");
    const categories = document.getElementsByClassName("category");
    return loop(words), loop(categories);
  }
}

// ***Search Components*** {🔎}
const searchFunction = {
  input: input,
  checkInput(compare, type) {
    if (this.input.value) {
      if (input.placeholder !== "Add Words...")
        input.placeholder = "Add Words...";

      return type.compareLogic(compare);
    }
    return Search.reset();
  },
  loopWords(words) {
    for (const word of words) {
      const wordSearch = new Search(word, this.input.value);
      this.checkInput(wordSearch.sliceCompare(), wordSearch);
    }
  },
  loopCategory() {
    return [...document.querySelectorAll(".category")].forEach((section) => {
      const categoryId = document.getElementById(section.id);

      const words = categoryId.children[1].children;
      if (categoryId.id === this.input.value[0]) {
        this.loopWords(words);
      }

      const categorySearch = new Search(categoryId, this.input.value[0]);
      this.checkInput(categorySearch.compare.id, categorySearch);
    });
  },
};

// ***DOM Search*** {📁}
input.addEventListener("input", (event) => {
  input.value =
    input.value.charAt(0).toUpperCase() + input.value.slice(1).toLowerCase();

  input.value = input.value.replace(
    /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
    ""
  );
  searchFunction.loopCategory();
});
