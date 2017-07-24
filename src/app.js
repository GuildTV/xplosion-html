require ("../sass/app.scss");

console.log([1, 2, 3, [4]]);


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

window.showFlag = function(){
  document.body.classList.add("flag");
}

window.hideFlag = function(){
  document.body.classList.remove("flag");
}