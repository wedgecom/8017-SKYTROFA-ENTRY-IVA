/*************
 * Proportional Design Resize
 */

 var proportionalArray = document.querySelectorAll('.proportional');

 if (proportionalArray) {

	 console.log('proportionalDesigns: ',proportionalArray)

	 proportionalArray.forEach((design) => {
		//jQuery(design).wrap("<div class='proportionalSpacer'><div class='proportionalParent'></div></div>")
		doProportionalResize(design);
	});

}

function doProportionalResize(design) {
	console.log('doProportionalResize');

	var $design = jQuery(design);
	var designWidth = $design.width();
	var designHeight = $design.height();
	var parentWidth = $design.closest('.proportionalParent').width();
	var parentHeight = $design.closest('.proportionalParent').height();
	console.log(
		'designWidth: ',designWidth,
		'\ndesignHeight: ', designHeight,
		'\nparentWidth: ', parentWidth,
		'\nparentHeight: ', parentHeight);

	var scale;

	scale = parentHeight / designHeight;

	//console.log('scale:', scale);
	//console.log('proportionalParentHeight:', proportionalParentHeight);




	function isIpadOS() {
		return navigator.maxTouchPoints &&
			navigator.maxTouchPoints > 2 &&
			/MacIntel/.test(navigator.platform);
	}

	var isIpad = isIpadOS();

	if (navigator.platform) {
		console.log('navigator:platform = ', navigator.platform);
	}

	if (parentWidth === 1366) {
		console.log('1366');
	}

	if (parentHeight === 1024) {
		console.log('1024');
	}

	if (navigator.platform !== 'iPad' && parentHeight !== 1024) {

		console.log('navigator:platform = ', navigator.platform);
		console.log('scaling');

		if (scale > 1) {
			$design.closest('.proportionalParent').css({
				transform: "scale(" + scale + ")"
			});

			var proportionalParentHeight = $design.closest('.proportionalParent').height() * scale;

			$design.closest('.proportionalSpacer').css({
				height: proportionalParentHeight
			});
		}
	} else {
		document.querySelector('body').classList.add('iPad');
	}

	setTimeout(() => {
		document.querySelector('body').classList.add('isVisible');
	}, 200);



}

jQuery(window).resize(function () {
	proportionalArray.forEach((design)=>{
		doProportionalResize(design);
	})
});

