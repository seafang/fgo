// Load page
$(document).ready(function () {
	iframeResize();
	$("#defaultFrame").click();
});

window.addEventListener('DOMContentLoaded', function() {
	iframeResize()
	initiateResize()
});

function openFrame(url, tab) {
	$("nav a").removeClass("active");
	$(tab).addClass("active");
	$("#activeFrame").attr("src", url);
	iframeResize();
}

function iframeResize() {
	let height = $("#activeFrame").contentWindow.find($("body")).scrollHeight;
	$("#activeFrame").style.height = (height + 200) + "px";
}

function initiateResize() {
	let height = $("body").scrollHeight;
	window.parentsUntil("body").find($("#activeFrame")).style.height = (height + 200) + "px";
}
	
// Menu button
$(document).ready(function() {
	$("a.menu").click(function() {
		$("#menu-content").toggle(300);
	});
});

// To top button
$(document).scroll(function(){
	if ($(document.body).scrollTop() > 50 || $(document.documentElement).scrollTop() > 50) {
		$("#to_top").show();
	} else {
		$("#to_top").hide();
	}
});

function toTop() {
	$(document.body).scrollTop(0); // Safari
	$(document.documentElement).scrollTop(0);
};

// Modal
function openModal(modal) {
	$(modal).show();
};

function closeModal() {
	$(".modal").hide();
};

/* window.onclick = function(event) {
	if (event.target == $(".modal")) {
		$(".modal").hide();
	}
};*/

$(document).click(function(event) {
	if (!$(event.target).closest(".modal-box, .modalbtn").length) {
		$(".modal").hide();
	}
});

// Collapsible
function toggle(button, element) {
	if ($(button).html() == "接疊▲") {
		$(button).html("展開▼");
	} else {
		$(button).html("接疊▲");
	}
	$(element).toggle(300);
}
