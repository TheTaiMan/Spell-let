// ***Exports*** {📦}
export default class RenderStorage {
  constructor(array, key) {
    this.array = array;
    this.key = key;
  }
  renderCategory() {
    return `<section class="category" id=${this.key}>
          <h2 class="header">${this.key}</h2>
          <div class="wordsContaner"></div>
      </section>`;
  }
  render() {
    let category = this.renderCategory();
    let array = this.array;
    let key = this.key;
    $(function () {
      $("#wordList").append(category);
      for (const word of array) {
        $(`#${key}`)
          .children(".wordsContaner")
          .append(
            `<p class="word" id="${word}" onclick="pendingRemove(event)">${word}</p>`
          );
      }
    });
  }
}
