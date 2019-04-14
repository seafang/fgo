// Load page
$(document).ready(function() {
	$("#defaultFrame").click();
	$("#activeFrame").css("height", 1500);
});

$(document).scroll(function() {
	iframeResize();
});

function iframeResize() {
	var frameHeight = $("#activeFrame").contents().find(".counter").html();
	$("#activeFrame").css("height", frameHeight);
}

function openFrame(url, tab) {
	$("nav a").removeClass("active");
	$(tab).addClass("active");
	$("#activeFrame").attr("src", url);
}
	
// Menu button
$(document).ready(function() {
	$("a.menu").click(function() {
		$("#menu-content").toggle(300);
	});
});

// To top button
$(document).scroll(function() {
	if (window.pageYOffset > 50 || $(document.body).scrollTop() > 50 || $(document.documentElement).scrollTop() > 50) {
		$("#to_top").show();
	} else {
		$("#to_top").hide();
	}
});

function toTop() {
	$(document.body).scrollTop(0); // Safari
	$(document.documentElement).scrollTop(0);
}

// Modal
function openModal(modal) {
	if (modal != "#servant-enemy-modal" && modal != "#common-enemy-modal") {
		var position = window.pageYOffset || $(parent.document.body).scrollTop() || $(parent.document.documentElement).scrollTop();
		$(modal).css("padding-top", ( position + 100 ) + "px");
	}
	$(modal).show();
}

function closeModal() {
	$(".modal").hide();
	$(".filter-box-toggle").each(function() {
		if($(this).html() == "–") {
			$(this).click();
		}
	});
}

$(document).click(function(event) {
	if (!$(event.target).closest(".modal-box, .modalbtn, #to_top").length) {
		$(".modal").hide();
	}
});

function setCaller(caller) {
	modalCaller = caller;
}

// Collapsible
function toggle(button, element) {
	if ($(button).html() == "接疊 ▲") {
		$(button).html("展開 ▼");
	} else {
		$(button).html("接疊 ▲");
	}
	$(element).toggle(300);
}
