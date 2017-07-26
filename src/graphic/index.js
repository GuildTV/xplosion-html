require("../../sass/graphic/app.scss");
require("./touchdown");

// window.playIn = function() {
//   const inVideo = document.querySelector('#video-in');
//   inVideo.play();
//   // setTimeout(function(){
//     document.body.classList.add("in");

//   // }, 780);
// }

// window.playOut = function() {
//   const outVideo = document.querySelector('#video-out');
//   outVideo.play();
//   document.body.classList.remove("in");
// }

window.socket = new WebSocket("ws://10.42.13.111:5000/ws");
window.socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("Got data:", data);

  renderState(data);
}

function renderState(state){

  document.querySelector('#box-left').innerText = getDownsAndGains(state);
  document.querySelector('#box-right').innerText = getQuarterText(state);

  document.querySelector('#score-left').innerText = state.scoreL;
  document.querySelector('#score-right').innerText = state.scoreR;

  document.body.classList.remove("possession-left", "possession-right");
  switch(state.possession){
    case 1:
      document.body.classList.add("possession-left");
      break;
    case 2:
      document.body.classList.add("possession-right");
      break;
  }

  classRemoveAll(document.querySelectorAll('.timeL'), ['hidden'])
  switch(state.timeoutsL){
    case 3:
      document.querySelector('#timeout-l3').classList.add('hidden');
    case 2:
      document.querySelector('#timeout-l2').classList.add('hidden');
    case 1:
      document.querySelector('#timeout-l1').classList.add('hidden');
  }
  classRemoveAll(document.querySelectorAll('.timeR'), ['hidden'])
  switch(state.timeoutsR){
    case 3:
      document.querySelector('#timeout-r3').classList.add('hidden');
    case 2:
      document.querySelector('#timeout-r2').classList.add('hidden');
    case 1:
      document.querySelector('#timeout-r1').classList.add('hidden');
  }

  document.body.classList.remove("flag");
  if (state.flag)
    document.body.classList.add("flag");

  if (state.triggers) {
    switch (state.triggers.touchdown){
      case 1:
      case "1":
        window.showTouchdown("l");
        break;
      case 2:
      case "2":
        window.showTouchdown("r");
        break;
    }
  }
}

function getQuarterText(state){
  switch(state.quarter){
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    case 4:
      return "4th";
    default:
      return "";
  }
}

function getDownsAndGains(state){
  const gains = state.gains === null ? "" : state.gains + "";
  let downs = "";
  switch(state.downs){
    case 1:
      downs = "1st";
      break;
    case 2:
      downs = "2nd";
      break;
    case 3:
      downs = "3rd";
      break;
    case 4:
      downs = "4th";
      break;
  }

  if (downs == "")
    return gains;
  if (gains == "")
    return downs;
  return downs + "&" + gains;
}

function classRemoveAll(elms, cl){
  if (elms === null || elms === undefined)
    return;

  elms.forEach(e => e.classList.remove(...cl));
}
