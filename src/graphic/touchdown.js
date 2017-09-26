
const vidDark = document.querySelector('#touchdown-effect-dark');
const vidLight = document.querySelector('#touchdown-effect-light');

let touchdownTimer = null;
window.showTouchdown = function(team) { // team = "l" or "r"
  document.body.classList.remove("touchdown-l", "touchdown-r");
  document.body.classList.add("touchdown-"+team);//, "touchdown-in", "touchdown-ani");

  if (touchdownTimer !== null)
    return;

  touchdownTimer = 1; // temp value
  flareIn.play().catch(e => flareInPlaying());
  vidDark.currentTime = 0;
  vidLight.currentTime = 0;
  vidDark.play(); 
  vidLight.play();
}
