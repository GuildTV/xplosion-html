require("../../sass/control/app.scss");

console.log("Loading controller");

if (window.location.hash.indexOf("simple") >= 0){
  document.title = "Simple controller";
  document.querySelector(".navbar-brand").innerText = "Simple Controller";

  document.querySelector("#sets-wrapper").style.display = "block";
  document.querySelector("#name-wrapper").style.display = "block";
  document.querySelector("#timeouts-wrapper").style.display = "none";
  document.querySelector("#downs-wrapper").style.display = "none";
  document.querySelectorAll(".quarter-control").forEach(e => e.style.display = "none");
  document.querySelectorAll(".btn-touchdown").forEach(e => e.style.display = "none");
  document.querySelectorAll(".btn-flag").forEach(e => e.style.display = "none");
  document.querySelector("#bar-preview").src = "/simple.html";
}

window.CurrentState = {};
window.NextState = {};

const init = { method: 'GET',
               mode: 'cors',
               headers: { 'Accept': 'application/json' },
               cache: 'default' }

function sync(e){
  if (e !== undefined)
    e.preventDefault();

  fetch('/api/main', init).then(r => r.json()).then(j => {
    window.CurrentState = j;
    renderState();
  });
}
sync();
document.querySelector('.sync').onclick = sync;

function classRemoveAll(elms, cl){
  if (elms === null || elms === undefined)
    return;

  elms.forEach(e => e.classList.remove(...cl));
}

function renderState(){
  console.log("Updating state");
  const state = window.CurrentState;
  const next = window.NextState;

  document.querySelector('#teamLName').innerText = state.nameL;
  document.querySelector('#teamRName').innerText = state.nameR;
  document.querySelector('.btn-possession-l').innerText = state.nameL;
  document.querySelector('.btn-possession-r').innerText = state.nameR;

  renderQuarter(state, next);
  renderFlag(state, next);
  renderButtonGroup(state, next, "possession");
  renderButtonGroup(state, next, "timeoutsL");
  renderButtonGroup(state, next, "timeoutsR");
  renderScore(state, next);
  renderSets(state, next);
  renderButtonGroup(state, next, "downs");
  renderGains(state, next);
  renderInOut(state, next);
  renderName(state, next);
}

function renderQuarter(state, next){
  // renderButtonGroup(state, next, "quarter"); // Old buttons
  const elm = document.querySelector('#quarter-select');
  elm.classList.remove("pending");

  if (next.quarter !== undefined)
    elm.classList.add("pending");

  classRemoveAll(document.querySelectorAll('#quarter-select option'), ['current', 'pending']);
  const opt = document.querySelector('#quarter-select option[value="'+state.quarter+'"]');
  if (opt !== null)
    opt.classList.add("current");

  const opt2 = document.querySelector('#quarter-select option[value="'+next.quarter+'"]');
  if (next.quarter !== undefined && opt2 !== null)
    opt2.selected = true;
  else if (opt !== null)
    opt.selected = true;
}

function renderFlag(state, next){
  const elm = document.querySelector('.btn-flag')
  elm.classList.remove('next');

  if (next.flag !== undefined)
    elm.classList.add('next');
}

function renderInOut(state, next){
  const elm = document.querySelector('.btn-inout')
  elm.classList.remove('next', 'on', 'off');

  if (next.in !== undefined)
    elm.classList.add('next');
  else if (state.in)
    elm.classList.add('on');
  else
    elm.classList.add('off');
}

function renderName(state, next){
  document.querySelector('#nameLCurrent').innerText = state.nameL;
  document.querySelector('#nameRCurrent').innerText = state.nameR;

  document.querySelector('#nameLNext').innerText = next.nameL === undefined ? "" : next.nameL;
  document.querySelector('#nameRNext').innerText = next.nameR === undefined ? "" : next.nameR;
}

function renderButtonGroup(state, next, key){
  classRemoveAll(document.querySelectorAll('.btn[data-key="'+key+'"]'), ['current', 'pending']);
  const elm = document.querySelector('.btn[data-key="'+key+'"][data-value="'+state[key]+'"]')
  if (elm !== null)
    elm.classList.add('current');
  if (next[key] !== undefined){
    const elm2 = document.querySelector('.btn[data-key="'+key+'"][data-value="'+next[key]+'"]')
    if (elm2 !== null)
      elm2.classList.add('pending');
  }
}

function renderScore(state, next){
  const scoreLNext = document.querySelector('#scoreLNext');
  const scoreRNext = document.querySelector('#scoreRNext');
  const scoreLCurrent = document.querySelector('#scoreLCurrent');
  const scoreRCurrent = document.querySelector('#scoreRCurrent');

  scoreLNext.innerText = next.scoreL === undefined ? "" : "("+next.scoreL+")";
  scoreRNext.innerText = next.scoreR === undefined ? "" : "("+next.scoreR+")";
  scoreLCurrent.innerText = "("+state.scoreL+")";
  scoreRCurrent.innerText = "("+state.scoreR+")";

  classRemoveAll(document.querySelectorAll('.btn-score'), ['pending']);
  if (next.touchdown !== undefined)
    document.querySelector('.btn-touchdown[data-touchdown="'+next.touchdown+'"]').classList.add("pending");
}

function renderSets(state, next){
  const setsLNext = document.querySelector('#setsLNext');
  const setsRNext = document.querySelector('#setsRNext');
  const setsCurrent = document.querySelector('#setsLCurrent');
  const setsRCurrent = document.querySelector('#setsRCurrent');

  setsLNext.innerText = next.setsL === undefined ? "" : "("+next.setsL+")";
  setsRNext.innerText = next.setsR === undefined ? "" : "("+next.setsR+")";
  setsLCurrent.innerText = "("+state.setsL+")";
  setsRCurrent.innerText = "("+state.setsR+")";

  classRemoveAll(document.querySelectorAll('.btn-sets'), ['pending']);
}

function renderGains(state, next){
  const gainsCurrent = document.querySelector('#gainsCurrent');
  const gainsNext = document.querySelector('#gainsNext');

  gainsNext.innerText = next.gains === undefined ? "" : "("+next.gains+")";
  gainsCurrent.innerText = "("+state.gains+")";

  const sliderVal = next.gains === undefined ? state.gains : next.gains;
  document.querySelector('#gains-slider').value = sliderVal;
}

document.querySelector('#gains-slider').oninput = () => {
  window.NextState.gains = document.querySelector('#gains-slider').value;
  if (window.NextState.gains == window.CurrentState.gains)
    window.NextState.gains = undefined;

  renderState();
};

document.querySelectorAll('.btn-flag').forEach(e => {
  e.onclick = () => {
    window.NextState.flag = (window.NextState.flag === undefined) ? !window.CurrentState.flag : undefined;

    renderState();
    return false;
  };
});

document.querySelectorAll('.btn-editor').forEach(e => {
  const key = e.getAttribute('data-key');

  e.onclick = () => {
    const newVal = window.prompt(key, (window.NextState[key] === undefined) ? window.CurrentState[key] : window.NextState[key]);
    window.NextState[key] = newVal;

    renderState();
    return false;
  };
});

document.querySelectorAll('.btn-inout').forEach(e => {
  e.onclick = () => {
    window.NextState.in = (window.NextState.in === undefined) ? !window.CurrentState.in : undefined;

    renderState();
    return false;
  };
});

function buttonGroupHandler(e) {
  e = e.currentTarget;
  
  const key = e.getAttribute('data-key');
  const clear = e.hasAttribute('data-clear');

  const current = window.NextState[key] === undefined ? window.CurrentState[key] : window.NextState[key];
  let next = current;
  if (e.hasAttribute('data-delta'))
    next = parseInt(next) + parseInt(e.getAttribute('data-delta'));
  if (e.hasAttribute('data-value'))
    next = e.getAttribute('data-value');

  if (next == window.CurrentState[key] || clear)
    window.NextState[key] = undefined
  else
    window.NextState[key] = next;

  renderState();
  return false;
}

document.querySelectorAll('.btn-gains').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-possession').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-downs').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-timeouts').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-quarter').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-sets').forEach(e => e.onclick = buttonGroupHandler);
document.querySelector('#quarter-select').onchange = (e) => {
  const newElm = document.querySelector('#quarter-select option:checked');
  const newVal = newElm.getAttribute('value');

  if (newVal == window.CurrentState.quarter)
    window.NextState.quarter = undefined;
  else
    window.NextState.quarter = newVal;

  renderState();
}

document.querySelectorAll('.btn-score').forEach(elm=> {
  elm.onclick = e => {
    const e2 = e.currentTarget;
    if (e2.hasAttribute('data-touchdown')){
      if (e2.hasAttribute('data-clear')){
        if (window.NextState.touchdown == e2.getAttribute('data-touchdown'))
          window.NextState.touchdown = undefined;
      } else {
        window.NextState.touchdown = e2.getAttribute('data-touchdown');
      }
    }

    buttonGroupHandler(e);
    return false;
  };
});

document.querySelector('.commit').onclick = (e) => {
  e.preventDefault();

  const changes = [];
  Object.keys(window.NextState).forEach(k => {
    const v = window.NextState[k];
    if (v === undefined)
      return;

    changes.push({
      key: k,
      value: v
    });
  });

  console.log("Sending changes:", changes)

  const init = { 
    method: 'POST',
    body: JSON.stringify({ Updates: changes }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    cache: 'default'
  };
  // TODO - if delta changes are added, then some locking will be wanted on this
  fetch('/api/main', init).then(j => {
    window.NextState = {};
    sync();
    renderState();
  })
}