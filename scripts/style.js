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
    let time = 3000;
    const animations = {
      spellContainer: {
        name: document.getElementsByTagName("MAIN")[0],
        animate() {
          $(this.name).animate(
            {
              top: "-82px",
              height: "300px",
              width: "25rem",
            },
            time
          );
        },
        reset() {
          $(this.name).animate(
            {
              top: "",
              height: "450px",
              width: "100%",
            },
            time
          );
        },
      },
      speakerContainer: {
        name: document.getElementById("wordIndicator"),
        animate() {
          $(this.name).animate(
            { minHeight: `${$("#wordIndicator").height() / 1.8}px` },
            time
          );
        },
        reset() {
          $(this.name).animate({ minHeight: "" }, time);
        },
      },
      speaker: {
        name: document.getElementById("play-word"),
        animate() {
          $(this.name).animate(
            {
              width: `${$(this.name).width() / 2}px`,
              height: `${$(this.name).height() / 2}px`,
              right: "42%",
            },
            time
          );
        },
        reset() {
          $(this.name).animate(
            {
              width: `${$(this.name).width() * 2}px`,
              height: `${$(this.name).height() * 2}px`,
              right: "",
            },
            time
          );
        },
      },
      inputSpelling: {
        name: document.getElementById("spellContainer"),
        animate() {
          $(this.name).animate(
            {
              maxWidth: "504.16px",
            },
            time
          );
        },
        reset() {
          $(this.name).animate(
            {
              maxWidth: "625px",
            },
            time
          );
        },
      },
    };
    if (!reset) {
      for (const animation in animations) {
        animations[animation].animate();
      }
      console.log("Run");
    } else {
      for (const animation in animations) {
        animations[animation].reset();
      }
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
      outerClick(active = false) {
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
        if ($("main").queue("fx").length !== 0) return; // If animation present
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
