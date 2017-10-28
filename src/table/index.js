require("../../sass/table/app.scss");

import { applyBlur } from '../blur';

window.tableData = [];
window.currentData = -1;

const rowAniDuration = 120;
const subtitleAniDuration = 140;

window.play = function() {
	showTableData(0);
	window.currentData = 0;

	document.body.classList.add("showHeading");

	setTimeout(() => {
		showTableAni();

	}, 2200);
};
window.stop = function() {
	document.body.classList.add("out");
	window.currentData = -1;
};

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
	if (window.currentData+1 >= window.tableData.length)
		return window.stop();

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
				showTableData(++window.currentData);

				setTimeout(() => {
					showTableAni();
				}, 1000);
			}, 300);
		}, subtitleAniDuration + 300);

	}, (rowAniDuration * rows.length))
}

window.update = function(str){
	console.log("Update:", str)
	const dat = (typeof(str) == "string") ? JSON.parse(str) : str;

	window.tableData = JSON.parse(dat.data);
}

function showTableData(i){
	const newData = window.tableData[i];
	console.log("New data:", newData);

	const rowHolder = document.querySelector("#rows");
	rowHolder.innerHTML = "";

	const leaderHeader = document.querySelector("#line2 .leader")
	leaderHeader.classList.remove("show");
	if (newData.mode == "leader")
		leaderHeader.classList.add("show");

	document.querySelector("#line2 .left").innerText = (newData.subtitle == "" || newData.subtitle === undefined || newData.subtitle === null) ? " " : newData.subtitle;
	document.querySelector("#line1 .text1 .inner").innerText = newData.title;

	for (let d of newData.rows){
		const inner = document.createElement("div")
		inner.classList.add("inner");

		Object.keys(d).forEach(k => {
			const col = document.createElement("div")
			col.classList.add(k);
			col.innerText = d[k];
			inner.appendChild(col)
		});

		const elm = document.createElement("div");
		elm.appendChild(inner);
		elm.classList.add("row", "row"+newData.mode);
		rowHolder.appendChild(elm);
	}
}

if (window.location.hash.indexOf("dev") != -1){
	console.log("DEV MODE");

	document.body.classList.add("dev");

	window.devUpdate = function(){
		try {
			window.tableData = JSON.parse(document.querySelector("#testData").value)			
		} catch (e) {
			alert("Failed to parse data, ensure it is correct: " + e)
		}
	}

	
	window.currentData = -1;
	window.devUpdate();
}