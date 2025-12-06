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

	// Design dimensions (calculated from actual element)
	var designWidth = $design.width();
	var designHeight = $design.height();
	var aspectRatio = designWidth / designHeight;

	// Viewport dimensions
	var viewportWidth = window.innerWidth;
	var viewportHeight = window.innerHeight;

	// Calculate scale based on BOTH width and height constraints
	var scaleByWidth = viewportWidth / designWidth;
	var scaleByHeight = viewportHeight / designHeight;

	// Use the SMALLER scale to ensure content fits both dimensions
	var scale = Math.min(scaleByWidth, scaleByHeight);

	console.log(
		'designWidth:', designWidth,
		'\ndesignHeight:', designHeight,
		'\nviewportWidth:', viewportWidth,
		'\nviewportHeight:', viewportHeight,
		'\nscaleByWidth:', scaleByWidth,
		'\nscaleByHeight:', scaleByHeight,
		'\nfinal scale:', scale
	);




	function isIpadOS() {
		return navigator.maxTouchPoints &&
			navigator.maxTouchPoints > 2 &&
			/MacIntel/.test(navigator.platform);
	}

	var isIpad = isIpadOS();

	if (navigator.platform !== 'iPad' && !isIpad) {
		console.log('navigator:platform =', navigator.platform);
		console.log('scaling to:', scale);

		// Apply scale transform
		$design.closest('.proportionalParent').css({
			transform: "scale(" + scale + ")"
		});

		// Calculate scaled dimensions for the spacer
		var scaledHeight = designHeight * scale;

		$design.closest('.proportionalSpacer').css({
			height: scaledHeight + 'px'
		});
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

