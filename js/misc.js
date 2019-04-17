// Modal
function openModal(modal) {
	if (modal != "#servant-enemy-modal" && modal != "#common-enemy-modal") {
		var position = window.pageYOffset || $(parent.document.body).scrollTop() || $(parent.document.documentElement).scrollTop();
		$(modal).css("padding-top", ( position - 100 ) + "px");
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
		closeModal();
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
