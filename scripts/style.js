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
    let time = 500;
    const animations = {
      spellContainer: {
        name: document.getElementsByTagName("MAIN")[0],
        animate() {
          $(this.name).animate(
            {
              top: "-180px",
              height: "230px",
              width: "25rem",
            },
            time,
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
          setTimeout(() => {
            $(this.name).animate({ minHeight: "" }, time);
          }, time / 3);
        },
      },
      speaker: {
        name: document.getElementById("play-word"),
        scaleRate: 2.15,
        animate() {
          $(this.name).animate(
            {
              width: `${$(this.name).outerWidth() / this.scaleRate}px`,
              height: `${$(this.name).outerHeight() / this.scaleRate}px`,
              right: `${$("#wordIndicator").width() / 2.48}px`,
            },
            time / 1.5
          );
        },
        reset() {
          setTimeout(() => {
            $(this.name).animate(
              {
                width: `${$(this.name).outerWidth() * this.scaleRate}px`,
                height: `${$(this.name).outerHeight() * this.scaleRate}px`,
                right: "",
              },
              time / 1.5,
            );
          }, time / 3);
        },
      },
      inputSpelling: {
        name: document.getElementById("spellContainer"),
        animate() {
          $(this.name).animate(
            {
              marginBottom: "213px",
              maxWidth: "504.16px",
              marginLeft: "120px",
            },
            time,
            function () {
              $("#searchContainer").css({ visibility: "visible"});
              $("Main").css({ visibility: "hidden" });
            }
          );
        },
        reset() {
          $(this.name).animate(
            {
              marginBottom: "",
              maxWidth: "625px",
              marginLeft: "",
            },
            time, function () {
              $("#inputSpelling").focus();
            }
          );
          function reset() {
            $("#searchContainer").css({ visibility: "hidden" });
            $("Main").css({ visibility: "visible" });
          }
          reset();
        },
      },
    };
    if (!reset) {
      for (const animation in animations) {
        animations[animation].animate();
      }
    } else {
      for (const animation in animations) {
        animations[animation].reset();
      }
    }
  };

  const WordListToggle = () => {
    const input = document.getElementById("inputWord");

    if (input.placeholder !== "Add Words...")
      input.placeholder = "Add Words...";

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
        setTimeout(() => {
          input.focus();
        }, 800);
        animateSpelling();
        return $("#storageList").css({ height: "250%" });
      },
      start() {
        if ($("main").queue("fx").length !== 0) return; // If animation present
        this.resetInput();
        if (document.getElementById("storageList").style.height === "250%") {
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
