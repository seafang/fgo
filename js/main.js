// Load data
var affinity = JSON.parse(classAdvantage);
var multiplier = JSON.parse(classBaseMultiplier);
var attrAffinity = JSON.parse(attributeAdvantage);

var common = [];
var servants = [];
var servantAtk = [],
	npBuff = [],
	skillBuff = [];
var master = [];
var events = [];

var ce = JSON.parse(craftEssence);
var cc = JSON.parse(commandCode);

var ceBuff = JSON.parse(craftEssenceBuff);
var ceAtk = JSON.parse(craftEssenceATK);
var masterBuff = JSON.parse(mysticCodeBuff);
var ccBuff = JSON.parse(commandCodeBuff);

var currentSave = {};
var bgServant = [],
	bgCE = [],
	bgMaster = [],
	customBuff = [];

$(document).ready(function() {

	loadData();

	// Generate save list
	generateSaveList();

	// Retrieve saved data and maintain in the background
	getSave();

	// Open corresponding frame
	$(".menu-button").click(function() {
		var url = $(this).attr("data-src") + ".html";
		openFrame(url, this);
	});

	$("#inventory-save").click(function() {
		getSave();
	});

	$("#create-save").click(function() {
		saveName();
	});

	$("#clear-save").click(function() {
		clearSave();
	});

	$("#to_top").click(function() {
		toTop();
	});

	$(".menu-button[data-src='" + favouritePage + "']").click(); // Open iframe, calc.html by default
	$("#activeFrame").css("height", 1500); // Set the iframe initial height
});

// Update iframe height on scroll
$(document).scroll(function() {
	iframeResize();
});

function loadData() {
	$.get("js/data/common.json", function(data) {
		common = JSON.parse(data);
	}, "text");

	$.get("js/data/servant.json", function(data) {
		servants = JSON.parse(data);
	}, "text");

	$.get("js/data/atk.json", function(data) {
		servantAtk = JSON.parse(data);
	}, "text");

	$.get("js/data/skill.json", function(data) {
		skillBuff = JSON.parse(data);
	}, "text");

	$.get("js/data/np.json", function(data) {
		npBuff = JSON.parse(data);
	}, "text");

	$.get("js/data/master.json", function(data) {
		master = JSON.parse(data);
	}, "text");

	$.get("js/data/events.json", function(data) {
		events = JSON.parse(data);
	}, "text");
}

// Retrieve iframe content height and update the iframe height
function iframeResize() {
	var frameHeight = $("#activeFrame").contents().find(".counter").html();
	$("#activeFrame").css("height", frameHeight);
}

// Open new iframe
function openFrame(url, tab) {
	$(".menu-button").removeClass("active");
	$(tab).addClass("active");
	$("#activeFrame").attr("src", url);
}

// Control display of return to top button
$(document).scroll(function() {
	if (window.pageYOffset > 50 || $(document.body).scrollTop() > 50 || $(document.documentElement).scrollTop() > 50) {
		$("#to_top").show();
	} else {
		$("#to_top").hide();
	}
});

// Return to top function
function toTop() {
	$(document.body).scrollTop(0); // Safari
	$(document.documentElement).scrollTop(0);
}