// Set favourite page
var favouritePage;

function checkFavourite() {
	if ($(".favouritebtn").attr("data-src") == favouritePage) {
		$(".favouritebtn").addClass("currentFavourite");
	}
}

function setFavourite(url) {
	favouritePage = url;
	currentSave.favouritePage = favouritePage;
	parent.favouritePage = favouritePage;
	parent.currentSave = currentSave;
	save();
	checkFavourite();

	alert("本頁面已經被設為起始頁面 \n 下次訪問本站時將直接跳轉至本頁面");
}

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
	if (!$(event.target).closest(".modal-box, .modalbtn, #to_top, .inventory-card-logo").length) {
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
