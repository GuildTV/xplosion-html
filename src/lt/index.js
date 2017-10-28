require("../../sass/lt/app.scss");

import { applyBlur } from '../blur';

window.play = function() {
	document.body.classList.add("in");

};
window.stop = function() {
	document.body.classList.add("out");

	setTimeout(() => {
		document.body.classList.remove("out", "in");

	}, 1000); // Needs to be more than fade out
};
window.update = function(str){
	console.log("Update:", str)
	const dat = (typeof(str) == "string") ? JSON.parse(str) : str;

	document.querySelector('#line1 .text1 .inner').innerText = dat.f0 || dat.l1a || "";
	document.querySelector('#line1 .text2').innerText = dat.f1 || dat.l1b || "";
	document.querySelector('#line2 .left').innerText = dat.f2 || dat.l2l || "";
	document.querySelector('#line2 .right').innerText = dat.f3 || dat.l2r || "";

	document.body.classList.remove("phase2");
	if (document.querySelector('#line1 .text2').innerText != "")
		document.body.classList.add("phase2");
}

if (window.location.hash.indexOf("dev") != -1){
	console.log("DEV MODE");

	document.body.classList.add("dev");

	window.updateDev = function() {
		const data = {
			l1a: document.querySelector('#dev-l1a').value,
			l1b: document.querySelector('#dev-l1b').value,
			l2l: document.querySelector('#dev-l2l').value,
			l2r: document.querySelector('#dev-l2r').value,
		}
		window.update(data);
	}

	updateDev();

	applyBlur(document.querySelector('#line1 .text1'))
}