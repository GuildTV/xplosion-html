
const flareIn = document.querySelector('#touchdown-flare-in');
const flareOut = document.querySelector('#touchdown-flare-out');
const vidDark = document.querySelector('#touchdown-effect-dark');
const vidLight = document.querySelector('#touchdown-effect-light');

let touchdownTimer = null;
window.showTouchdown = function(team) { // team = "l" or "r"
  document.body.classList.remove("touchdown-l", "touchdown-r");
  document.body.classList.add("touchdown-"+team);//, "touchdown-in", "touchdown-ani");

  if (touchdownTimer !== null)
    return;

  flareIn.play();
  vidDark.currentTime = 0;
  vidLight.currentTime = 0;
  vidDark.play();
  vidLight.play();

  touchdownTimer = setTimeout(function(){
    // start css transition
    document.body.classList.add("touchdown-in", "touchdown-ani");
    touchdownTimer = setTimeout(function(){
      // start out animation
      flareOut.play();

      touchdownTimer = setTimeout(function(){
        document.body.classList.remove("touchdown-in");

        touchdownTimer = setTimeout(function(){
          document.body.classList.remove("touchdown-ani");
          touchdownTimer = null;
        }, 1100); // Reset the animation after it has finished
      }, 280);

    }, 8000);
  }, 80);
}
