require("../../sass/control/app.scss");

console.log("Loading controller");

window.CurrentState = {};
window.NextState = {};

const init = { method: 'GET',
               mode: 'cors',
               headers: { 'Accept': 'application/json' },
               cache: 'default' }

function sync(){
  fetch('/api/main', init).then(r => r.json()).then(j => {
    window.CurrentState = j;
    renderState();
  });
}
sync();
document.querySelector('.sync').onclick = sync;

document.querySelector('#teamLName').innerText = window.teams.leftName;
document.querySelector('#teamRName').innerText = window.teams.rightName;

function classRemoveAll(elms, cl){
  if (elms === null || elms === undefined)
    return;

  elms.forEach(e => e.classList.remove(...cl));
}

function renderState(){
  console.log("Updating state");
  const state = window.CurrentState;
  const next = window.NextState;

  renderQuarter(state, next);
  renderFlag(state, next);
  renderButtonGroup(state, next, "possession");
  renderButtonGroup(state, next, "timeoutsL");
  renderButtonGroup(state, next, "timeoutsR");
  renderScore(state, next);
  renderButtonGroup(state, next, "downs");
  renderGains(state, next);
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
  elm.classList.remove('on', 'off', 'next');

  elm.classList.add(state.flag ? 'on' : 'off');
  if (next.flag !== undefined)
    elm.classList.add('next');
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
}

document.querySelectorAll('.btn-gains').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-possession').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-downs').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-timeouts').forEach(e => e.onclick = buttonGroupHandler);
document.querySelectorAll('.btn-quarter').forEach(e => e.onclick = buttonGroupHandler);
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
  };
});

document.querySelector('.commit').onclick = () => {
  const changes = [];
  Object.keys(window.NextState).forEach(k => {
    const v = window.NextState[k];
    if (v === undefined)
      return;

    changes.push({
      key: k,
      value: v
    });
  })

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
  fetch('/api/main', init).then(r => r.json()).then(j => {
    window.CurrentState = j;
    window.NextState = {};
    renderState();
  })
}