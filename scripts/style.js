$(function () {
  $("#play-word").hover(
    () => {
      $("#bracket").css({ opacity: 1 });
    },
    () => {
      $("#bracket").css({ opacity: "" });
    }
  );
});
