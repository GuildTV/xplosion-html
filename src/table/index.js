require("../../sass/table/app.scss");

import { applyBlur } from '../blur';

const rowAniDuration = 140;
const subtitleAniDuration = 140;

window.hideTable = function(){
	document.body.classList.add("out");
}

setTimeout(() => {
	document.body.classList.add("showHeading");

	setTimeout(() => {
		showTableAni();

	}, 3000);

}, 1000);

function showTableAni(){
	document.body.classList.add("showTable");

	const rows = document.querySelectorAll('.row');
	for (let i=0; i<rows.length; i++) {
		const row = rows[i];

		setTimeout(() => {
			rows[i].classList.add("show");
		}, subtitleAniDuration + (rowAniDuration * i));
	}
}

window.next = function() {
	document.body.classList.remove("hideTitle");

	const rows = document.querySelectorAll('.row');
	for (let i=rows.length-1; i>=0; i--) {
		const row = rows[i];
		const ind = rows.length-i-1;

		setTimeout(() => {
			rows[i].classList.remove("show");
		}, rowAniDuration * ind);
	}

	setTimeout(() => {
		document.body.classList.remove("showTable");

		setTimeout(() => {
			document.body.classList.add("hideTitle");

			setTimeout(() => {
				// TODO - swap text

				setTimeout(() => {
					showTableAni();
				}, 2000);
			}, 400);
		}, subtitleAniDuration + 300);

	}, (rowAniDuration * rows.length))
}