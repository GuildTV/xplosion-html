require("../../sass/lt/app.scss");

if (window.location.hash.indexOf("dev") != -1){
	console.log("DEV MODE");

	document.body.classList.add("dev");

	window.showLT = function() {
		document.body.classList.add("in");

	};
	window.hideLT = function() {
		document.body.classList.add("out");

		setTimeout(() => {
			document.body.classList.remove("out", "in");

		}, 1000); // Needs to be more than fade out
	};

	window.update = function() {
		document.querySelector('#line1 .text1 .inner').innerText = document.querySelector('#dev-l1a').value;
		document.querySelector('#line1 .text2').innerText = document.querySelector('#dev-l1b').value;
		document.querySelector('#line2 .left').innerText = document.querySelector('#dev-l2l').value;
		document.querySelector('#line2 .right').innerText = document.querySelector('#dev-l2r').value;

		document.body.classList.remove("phase2");
		if (document.querySelector('#dev-l1b').value != "")
			document.body.classList.add("phase2");
	}

	update();
}