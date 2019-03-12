//load page
window.onload = function () {
	$("#defaultFrame").click();
}
function openFrame(url, tab) {
	$("nav a").removeClass("active");
	$(tab).addClass("active");
	document.getElementById("activeFrame").src = url;
}
	
//menu button
$(document).ready(function() {
	$("a.menu").click(function() {
		$("#menu-content").toggle(300);
	});
});

// To top button
$(document).scroll(function(){
	if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
		$("#to_top").show();
	} else {
		$("#to_top").hide();
	}
});

function toTop() {
	document.body.scrollTop = 0; // Safari
	document.documentElement.scrollTop = 0;
};

// Modal
function openModal(modal) {
	$("#" + modal).show();
}

function closeModal(modal) {
	$("#" + modal).hide();
}

window.onclick = function(event) {
	if (event.target == $(".modal")) {
		$(".modal").hide();
	}
}
