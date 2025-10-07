


function isiPreview() {
	// let isiPreview = document.querySelector('.isi-preview')
	let isiNavBtn = document.querySelectorAll('.isi-nav')
	isiToggle = document.querySelectorAll('.isi-toggle')
	refBtn = document.querySelectorAll('.ref-nav');
	


	isiToggle.forEach(btn => {
		btn.addEventListener('click', function () {

			let refModal = document.getElementById('references')
			isiModal = document.getElementById('isiModal');


			if(refModal.classList.contains('isOpen')){
				refModal.classList.remove('isOpen');
				isiModal.classList.add("isOpen");
			isiNavBtn.forEach(el => {
				el.classList.add("isOpen");
			});

			refBtn.forEach(el => {
				el.classList.remove("isOpen");
			});
			}else{
				isiModal.classList.toggle("isOpen");
				isiNavBtn.forEach(el => {
				el.classList.toggle("isOpen");
			});
			}		

		});
	});

}
isiPreview();