
const flareIn = document.querySelector('#touchdown-flare-in');
const flareOut = document.querySelector('#touchdown-flare-out');
const vidDark = document.querySelector('#touchdown-effect-dark');
const vidLight = document.querySelector('#touchdown-effect-light');

flareIn.onplaying = flareInPlaying;
flareOut.onplaying = flareOutPlaying;

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

function flareInPlaying(){
  if (touchdownTimer !== null && touchdownTimer != 1)
    return;
  touchdownTimer = setTimeout(function(){
    // start css transition
    document.body.classList.add("touchdown-in", "touchdown-ani");
    touchdownTimer = setTimeout(function(){
      // start out animation
      flareOut.play().catch(e => flareOutPlaying());

    }, 8000); // On duration
  }, 120); // In ani delay
}

function flareOutPlaying(){
  touchdownTimer = setTimeout(function(){
    document.body.classList.remove("touchdown-in");

    touchdownTimer = setTimeout(function(){
      document.body.classList.remove("touchdown-ani");
      touchdownTimer = null;
    }, 1100); // Wait for reset
  }, 240); // Out ani delay
}