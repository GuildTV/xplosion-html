require("../../sass/graphic/app.scss");
require("./touchdown");

document.querySelector('#team-l .text').innerText = window.teams.leftInitials;
document.querySelector('#team-r .text').innerText = window.teams.rightInitials;

var protocol = window.location.protocol.startsWith('https') ? 'wss://' : 'ws://'
window.socket = new WebSocket(protocol + window.location.host + "/ws");
window.socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  console.log("Got data:", data);

  renderState(data);
}

function renderState(state){
  document.body.classList.remove("in");
  if (state.in)
    document.body.classList.add("in");

  document.querySelector('#box-right .content').innerText = getDownsAndGains(state);
  updateWithAnimation(() => getQuarterText(state), "box-left");

  updateWithAnimation(() => pad(state.scoreL, 2), "score-left");
  updateWithAnimation(() => pad(state.scoreR, 2), "score-right");

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

  // document.body.classList.remove("flag");
  // if (state.flag)
    // document.body.classList.add("flag");

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

    if (state.triggers.flag)
      doFlag(state);
  }
}

function updateWithAnimation(nextValSelector, name){
  const currentVal = document.querySelector('#'+name+' .content').innerText;

  if (currentVal == nextValSelector())
    return;

  if (document.querySelector('#'+name+'-next.in'))
    return setTimeout(() => updateWithAnimation(nextValSelector, name), 10);

  document.querySelector('#'+name+'-next .content').innerText = nextValSelector();
  document.querySelector('#'+name+'-next').classList.add("in");

  setTimeout(() => {
    document.querySelector('#'+name+' .content').innerText = document.querySelector('#'+name+'-next .content').innerText;
    document.querySelector('#'+name+'-next .content').innerText = "";
    document.querySelector('#'+name+'-next').classList.remove("in");

  }, 290); // Slightly more than the in animation
}

let flagTimer = null;
function doFlag(state){
  if (flagTimer !== null)
    return;

  document.body.classList.add("flag");
  flagTimer = setTimeout(() => {
    document.body.classList.remove("flag");
    flagTimer = null;
  }, 5000); // Flag show duration
}

function getQuarterText(state){
  switch(state.quarter){
    case 1:
      return "1st Quarter";
    case 2:
      return "2nd Quarter";
    case 3:
      return "3rd Quarter";
    case 4:
      return "4th Quarter";
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
  return downs + " & " + gains;
}

function classRemoveAll(elms, cl){
  if (elms === null || elms === undefined)
    return;

  elms.forEach(e => e.classList.remove(...cl));
}

function pad(val, len) {
  val = val + "";
  if (val.length < len)
    return pad("0"+val, len);

  return val;
}