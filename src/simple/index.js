require("../../sass/simple/app.scss");

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

  document.querySelector('#sets-left .content').innerText = state.setsL;
  document.querySelector('#sets-right .content').innerText = state.setsR;
  document.querySelector('.score-left').innerText = pad(state.scoreL, 2);
  document.querySelector('.score-right').innerText = pad(state.scoreR, 2);
  document.querySelector('#name-left .content').innerText = state.nameL;
  document.querySelector('#name-right .content').innerText = state.nameR;

  document.body.classList.remove("possession-left", "possession-right");
  switch(state.possession){
    case 1:
      document.body.classList.add("possession-left");
      break;
    case 2:
      document.body.classList.add("possession-right");
      break;
  }

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