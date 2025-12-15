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

// Global iPad detection: add a body class early so styles/scripts can rely on it
function isIpadOS() {
	return (navigator.maxTouchPoints &&
		navigator.maxTouchPoints > 2 &&
		/MacIntel/.test(navigator.platform)) ||
		/iPad|Macintosh/.test(navigator.userAgent) && /Safari/.test(navigator.userAgent);
}

var isIpadGlobal = isIpadOS() || /iPad/.test(navigator.platform);
console.log('iPad detection:', {
	isIpadOS: isIpadOS(),
	maxTouchPoints: navigator.maxTouchPoints,
	platform: navigator.platform,
	userAgent: navigator.userAgent,
	isIpadGlobal: isIpadGlobal
});

if (isIpadGlobal) {
	// Compute a size class using the viewport (treating iPad as landscape)
	function getIpadSizeClassFromViewport() {
		var w = window.innerWidth || document.documentElement.clientWidth || 0;
		var h = window.innerHeight || document.documentElement.clientHeight || 0;
		var maxViewport = Math.max(w, h);
		if (maxViewport >= 1366) return 'iPad--pro-12-9';
		if (maxViewport >= 1194) return 'iPad--pro-11';
		if (maxViewport <= 768) return 'iPad--small';
		if (maxViewport > 1024) return 'iPad--large';
		return 'iPad--medium';
	}

	function updateIpadBodyClasses() {
		if (!(document && document.body)) return false;
		var body = document.body;
		// ensure base class
		if (!body.classList.contains('iPad')) body.classList.add('iPad');

		// remove any existing iPad size classes
		var sizeClasses = ['iPad--pro-12-9','iPad--pro-11','iPad--small','iPad--large','iPad--medium'];
		sizeClasses.forEach(function(c){ body.classList.remove(c); });

		// add new size class based on viewport
		var sizeClass = getIpadSizeClassFromViewport();
		body.classList.add(sizeClass);
		console.log('iPad body classes set:', { base: 'iPad', size: sizeClass });
		return true;
	}

	// Try to add immediately; if body doesn't exist yet, wait for DOMContentLoaded.
	if (!updateIpadBodyClasses()) {
		console.log('Body not ready yet, waiting for DOMContentLoaded to set iPad classes');
		document.addEventListener('DOMContentLoaded', updateIpadBodyClasses);
	}

	// Keep body classes up-to-date when orientation or size changes
	window.addEventListener('resize', updateIpadBodyClasses);
	window.addEventListener('orientationchange', updateIpadBodyClasses);
} else {
	console.log('Not detected as iPad');
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




	var isIpad = isIpadOS() || /iPad/.test(navigator.platform);

	if (isIpad) {
		// Use the viewport's max dimension to detect larger iPad Pro models.
		var maxViewport = Math.max(viewportWidth, viewportHeight);
		var ipadSizeClass = 'iPad--medium';

		// Heuristics (CSS pixel dimensions):
		// - iPad Pro 12.9" typically reports a max viewport around 1366 (portrait height)
		// - iPad Pro 11" typically reports a max viewport around 1194
		if (maxViewport >= 1366) {
			ipadSizeClass = 'iPad--pro-12-9';
		} else if (maxViewport >= 1194) {
			ipadSizeClass = 'iPad--pro-11';
		} else if (maxViewport <= 768) {
			ipadSizeClass = 'iPad--small';
		} else if (maxViewport > 1024) {
			ipadSizeClass = 'iPad--large';
		}

		// Body classes are managed globally; do not modify here.

		// Adjust scale per iPad model to improve vertical fitting on large Pro devices.
		var adjustedScale;
		if (ipadSizeClass === 'iPad--small') {
			// portrait small iPads: keep conservative fit
			adjustedScale = Math.min(scaleByWidth, scaleByHeight);
		} else if (ipadSizeClass === 'iPad--pro-12-9') {
			// iPad Pro 12.9" — prefer filling height so large canvases look full.
			// Use the height-based scale but limit excessive horizontal overflow.
			adjustedScale = Math.min(scaleByHeight * 1.0, scaleByWidth * 1.0);
		} else if (ipadSizeClass === 'iPad--pro-11') {
			// iPad Pro 11" — favor height but allow a small width bias to avoid letterboxing
			adjustedScale = Math.min(Math.max(scaleByHeight, scaleByWidth * 0.99), scaleByWidth * 1.03);
		} else if (ipadSizeClass === 'iPad--medium') {
			adjustedScale = Math.min(scaleByWidth * 0.98, scaleByHeight);
		} else {
			// generic large
			adjustedScale = Math.min(scaleByWidth * 0.95, scaleByHeight);
		}

		// Apply scale transform
		$design.closest('.proportionalParent').css({
			transform: "scale(" + adjustedScale + ")"
		});

		// Calculate scaled dimensions for the spacer
		var scaledHeight = designHeight * adjustedScale;

		$design.closest('.proportionalSpacer').css({
			height: scaledHeight + 'px'
		});
	} else {
		console.log('navigator:platform =', navigator.platform);
		console.log('scaling to:', scale);

		// Apply scale transform for non-iPad devices
		$design.closest('.proportionalParent').css({
			transform: "scale(" + scale + ")"
		});

		// Calculate scaled dimensions for the spacer
		var scaledHeight = designHeight * scale;

		$design.closest('.proportionalSpacer').css({
			height: scaledHeight + 'px'
		});
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

