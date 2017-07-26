require("../../sass/control/app.scss");

console.log("Loading controller");

window.CurrentState = {};
window.NextState = {};

const init = { method: 'GET',
               mode: 'cors',
               headers: { 'Accept': 'application/json' },
               cache: 'default' }

fetch('http://localhost:5000/api/main', init).then(r => r.json()).then(j => {
  window.CurrentState = j;
  renderState();
})

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
  renderPossession(state, next);
  renderTimeouts(state, next);
  renderScore(state, next);
  renderDowns(state, next);
}

function renderQuarter(state, next){
  renderAuto(state, next, "quarter");
}

function renderFlag(state, next){
  const elm = document.querySelector('.btn-flag')
  elm.classList.remove('on', 'off', 'next');

  elm.classList.add(state.flag ? 'on' : 'off');
  if (next.flag !== undefined)
    elm.classList.add('next');
}

function renderPossession(state, next){
  renderAuto(state, next, "possession");
}

function renderDowns(state, next){
  renderAuto(state, next, "downs");
}

function renderTimeouts(state, next){
  renderAuto(state, next, "timeoutsL");
  renderAuto(state, next, "timeoutsR");
}

function renderAuto(state, next, key){
  classRemoveAll(document.querySelectorAll('.btn[data-key="'+key+'"]'), ['on', 'next']);
  const elm = document.querySelector('.btn[data-key="'+key+'"][data-value="'+state[key]+'"]')
  if (elm !== null)
    elm.classList.add('on');
  if (next[key] !== undefined){
    const elm2 = document.querySelector('.btn[data-key="'+key+'"][data-value="'+next[key]+'"]')
    if (elm2 !== null)
      elm2.classList.add('next');
  }
}

function renderScore(state, next){
  const scoreL = document.querySelector('#scoreLNext');
  const scoreR = document.querySelector('#scoreRNext');

  scoreL.innerText = next.scoreL === undefined ? "" : "("+next.scoreL+")";
  scoreR.innerText = next.scoreR === undefined ? "" : "("+next.scoreR+")";

  classRemoveAll(document.querySelectorAll('.btn-score'), ['next']);
  if (next.touchdown !== undefined)
    document.querySelector('.btn-touchdown[data-touchdown="'+next.touchdown+'"]').classList.add("next");
}

document.querySelectorAll('.btn-flag').forEach(e => {
  e.onclick = () => {
    window.NextState.flag = (window.NextState.flag === undefined) ? !window.CurrentState.flag : undefined;

    renderState();
  };
});

function btnAutoHandler(e) {
  e = e.currentTarget;
  
  const key = e.getAttribute('data-key');
  const clear = e.hasAttribute('data-clear');
  const touchdown = e.hasAttribute('data-touchdown');

  const current = window.NextState[key] === undefined ? window.CurrentState[key] : window.NextState[key];
  let next = current;
  if (e.hasAttribute('data-delta'))
    next += parseInt(e.getAttribute('data-delta'));
  if (e.hasAttribute('data-value'))
    next = parseInt(e.getAttribute('data-value'));

  if (next == window.CurrentState[key] || clear)
    window.NextState[key] = undefined
  else
    window.NextState[key] = next;

  renderState();
}

document.querySelectorAll('.btn-possession').forEach(e => e.onclick = btnAutoHandler);
document.querySelectorAll('.btn-downs').forEach(e => e.onclick = btnAutoHandler);
document.querySelectorAll('.btn-timeouts').forEach(e => e.onclick = btnAutoHandler);
document.querySelectorAll('.btn-quarter').forEach(e => e.onclick = btnAutoHandler);


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

    btnAutoHandler(e);
  };
});


document.querySelector('.commit').onclick = () => {
  const changes = [];
  Object.keys(window.NextState).forEach(k => {
    changes.push({
      key: k,
      value: window.NextState[k]
    });
  })

  console.log("Sending changes:", changes)

const init = { method: 'POST',
               body: JSON.stringify({ Updates: changes }),
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json'
               },
               cache: 'default' }
  // TODO - locking to prevent double submit
  fetch('http://localhost:5000/api/main', init).then(r => r.json()).then(j => {
    window.CurrentState = j;
    window.NextState = {};
    renderState();
  })
}