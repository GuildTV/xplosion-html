
let nextID = 1;

export const applyBlur = function(elm) {
	let lastLeft = elm.offsetLeft;
	let lastTop = elm.offsetTop;

	// a multiplier, to be able to control the intensity of the effect
	const multiplier=0.25;

	const id = "blur" + (nextID++);

	const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	svg.setAttribute("version", "1.1");
	svg.setAttribute("class", "filters");
	const def = document.createElementNS("http://www.w3.org/2000/svg", 'defs');
	svg.appendChild(def);
	const filterElm = document.createElementNS("http://www.w3.org/2000/svg", "filter");
	filterElm.setAttribute("id", id);
	def.appendChild(filterElm);
	const blur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
	blur.setAttribute("in", "SourceGraphic");
	blur.setAttribute("stdDeviation", "0,0");
	filterElm.appendChild(blur);

	document.body.appendChild(svg);
	elm.style.WebkitFilter = "url(#"+id+")";

	(function updateMotionBlur(){
		const currentLeft = elm.offsetLeft;
		const currentTop = elm.offsetTop;

		// calculate the changes from the last frame and apply the multiplier
		var xDiff=Math.abs(currentLeft-lastLeft)*multiplier;
		var yDiff=Math.abs(currentTop-lastTop)*multiplier;

		// set the blur
		blur.setAttribute("stdDeviation",xDiff+","+yDiff);

		// store current position for the next frame
		lastLeft = currentLeft;
		lastTop = currentTop;

		// call to update in the next frame
		requestAnimationFrame(updateMotionBlur);
	})();
}