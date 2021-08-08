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
              width: `${$("#searchContainer").outerWidth()}px`,
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
              right: `${$("#searchContainer").outerWidth() / 1.92}px`,
            },
            time / 2,
            function () {
              setTimeout(() => {
                $("#searchImg").animate({ right: "" }, time - 300);
              }, 150);
            }
          );
        },
        reset() {
          $("#searchImg").animate({ right: 100 }, time - 440);
          setTimeout(() => {
            $(this.name).animate(
              {
                width: `${$(this.name).outerWidth() * this.scaleRate}px`,
                height: `${$(this.name).outerHeight() * this.scaleRate}px`,
                right: "",
              },
              time / 1.5
            );
          }, time / 3);
        },
      },
      inputSpelling: {
        name: document.getElementById("spellContainer"),
        animate() {
          let margin = "120px";
          if ($(window).width() < 643) {
            $(this.name).css({ justifySelf: "end" });
            margin = "0";
          }
          $(this.name).animate(
            {
              marginBottom: "213px",
              maxWidth: `${$("#searchInputContainer").outerWidth()}px`,
              marginLeft: margin,
            },
            time,
            function () {
              $("Main").css({ visibility: "hidden" });

              setTimeout(() => {
                $("#searchInputContainer").css({ visibility: "visible" });
              }, 80);
            }
          );
          //}
        },
        reset() {
          $(this.name).animate(
            {
              marginBottom: "",
              maxWidth: "625px",
              marginLeft: "",
            },
            time,
            function () {
              if (
                document.getElementById("spellContainer").style.justifySelf ===
                "end"
              )
                document.getElementById("spellContainer").style.justifySelf =
                  "center";

              $("#inputSpelling").focus();
            }
          );
          function reset() {
            setTimeout(() => {
              $("#searchInputContainer").css({ visibility: "hidden" });
            }, 20);
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
        let pendingRemove = JSON.parse(sessionStorage.getItem("pendingRemove"));
        for (const word of pendingRemove) {
          $(`#${word}`).click();
        }
        return $("#storageList").css({ height: "0.8rem" });
        // Restore all the pendingRemove words in sessionStorage clear sessionStorage.
      },
      animate() {
        this.outerClick();
        setTimeout(() => {
          input.focus();
        }, 800);
        animateSpelling();
        return $("#storageList").css({ height: "280%" });
      },
      start() {
        if ($("main").queue("fx").length !== 0 || speechSynthesis.speaking)
          return; // If animation present

        if (document.getElementById("text").innerHTML) {
          document.getElementById("text").innerHTML = "";
          $("#inputSpelling").css({ display: "" });
          $("#inputValue").css({ display: "" });
        }

        this.resetInput();
        if (document.getElementById("storageList").style.height === "280%") {
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
