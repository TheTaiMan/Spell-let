import { Search } from "./handleWordList/search.js";

$(function () {
  $("#play-word").hover(
    () => {
      $("#bracket").css({ opacity: 1 });
    },
    () => {
      $("#bracket").css({ opacity: "" });
    }
  );

  const animateSpelling = (reset = false) => {
    if (!reset) {
      console.log("Run");
    } else {
      console.log("Reset");
    }
  };

  const WordListToggle = () => {
    const input = document.getElementById("inputWord");
    const animations = {
      resetInput() {
        if (input.value) {
          return Search.reset();
        }
      },
      outerClick(active=false) {
        if (active) {
          $("#overlay").css({ display: "" });
          return $("#overlay").off();
        }
        $("#overlay").css({ display: "block" });
        return $("#overlay").click(() => {
          this.start();
        });
      },
      reset() {
        this.outerClick(true);
        animateSpelling(true);
        return $("#storageList").css({ height: "0.8rem" });
        // Restore all the pendingRemove words in sessionStorage clear sessionStorage.
      },
      animate() {
        this.outerClick();
        input.focus();
        animateSpelling();
        return $("#storageList").css({ height: "200%" });
      },
      start() {
        this.resetInput();
        if (document.getElementById("storageList").style.height === "200%") {
          return this.reset();
        }
        return this.animate();
      },
    };

    animations.start();
  };

  $("#listToggle").click(function () {
    WordListToggle();
  });
});
