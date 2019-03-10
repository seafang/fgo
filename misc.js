"use strict";

//load page
window.onload = function () {
	$("#defaultFrame").click();
}
function openFrame() {
	$("nav a").removeClass("active");
	$(this).addClass("active");
	$("#activeFrame").src = $(this).url;
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
