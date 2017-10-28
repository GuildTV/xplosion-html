
let touchdownTimer = null;
window.showTouchdown = function(team) { // team = "l" or "r"
  document.body.classList.remove("touchdown-l", "touchdown-r");
  document.body.classList.add("touchdown-"+team);

  if (touchdownTimer !== null)
    return;

  // start css transition
  document.body.classList.add("touchdown-in", "touchdown-ani");
  touchdownTimer = setTimeout(function(){
    document.body.classList.remove("touchdown-in");

    touchdownTimer = setTimeout(function(){
      document.body.classList.remove("touchdown-ani");
      touchdownTimer = null;
    }, 1100); // Wait for reset

  }, 8000); // Duration
}
