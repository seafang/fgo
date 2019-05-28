var affinity = parent.affinity;
var multiplier = parent.multiplier;
var attrAffinity = parent.attrAffinity;

var common = parent.common;
var servants = parent.servants;
var ce = parent.ce;
var master = parent.master;

var skillBuff = parent.skillBuff;
var npBuff = parent.npBuff;
var servantAtk = parent.servantAtk;
var ceBuff = parent.ceBuff;
var ceAtk = parent.ceAtk;
var masterBuff = parent.masterBuff;

var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;
var bgMaster = parent.bgMaster;
var favouritePage = parent.favouritePage;

var modalCaller = "";

/* Layout */
$(document).ready(function() {
	updateCounter();
	$("#enemy-setup-collapsebtn").click(function() {
		toggle(this, "#enemy-setup-collapsible");
	});
	$("#servant-setup-collapsebtn").click(function() {
		toggle(this, "#servant-setup-collapsible");
	});
	$("#ce-setup-collapsebtn").click(function() {
		toggle(this, "#ce-setup-collapsible");
	});
	$("#master-setup-collapsebtn").click(function() {
		toggle(this, "#master-setup-collapsible");
	});
	$("#teammate-setup-collapsebtn").click(function() {
		toggleTeammate(this, "#teammate-setup-collapsible");
	});

	initialServantEnemy();
	initialCommonEnemy();
	initialServant();
	initialCE();
	initialTeammate();
	initialTeammateCE();

	checkFavourite();
	$(".favouritebtn").click(function() {
		var url = $(this).attr("data-src");
		setFavourite(url);
	});
});

// Update page height
$(document).on("click", function() {
	updateCounter();
});

function updateCounter() {
	var height = $("#enemy-info").outerHeight() + $("#environment-info").outerHeight() + $("#servant-info").outerHeight() +
		$("#ce-info").outerHeight() + $("#master-info").outerHeight() + $("#teammate-info").outerHeight() +
		$("#buff-info").outerHeight() + $("#calc-result-section").outerHeight() + 1000;
	$("#calc-counter").html(height);
}

function toggleTeammate(button, element) {
	if ($(button).html() == "接疊 ▲") {
		$(button).html("展開 ▼");
		$(".teammate-detail").hide(300);
	} else {
		$(button).html("接疊 ▲");
		$(".allow-toggle").show(300);
	}
}


/* Misc */
// Check if any servant appears more than twice on the team
function countDuplicate(newID) {
	var test = false;
	var list = [];
	var count = 0;
	var team = ["servantInfo", "teammate1Info", "teammate2Info", "teammate3Info", "teammate4Info", "teammate5Info"];

	// Loop through the team for a complete lsit of teammates
	$(team).each(function() {
		if(window[this][0] !== undefined) {
			list.push(window[this][0].id);
		}
	});

	// Check if the newly-selected servant are already on the team
	$(list).each(function() {
		if (newID == this) {
			count++;
		}
	});
	if (count > 2) {
		test = true;
	}
	return test;
}


/* Set Enemy */
var enemyInfo = [];
var trait = [];
var debuff = [];
var enemy1Debuff = [], enemy2Debuff = [], enemy3Debuff = [];
var enemy1Trait = [], enemy2Trait = [], enemy3Trait = [];

$(document).ready(function() {
	// Open modals
	$("#common-enemy-modalbtn").click(function() {
		openModal("#common-enemy-modal");
		loadCommonEnemyImg();
	});
	$("#servant-enemy-modalbtn").click(function() {
		openModal("#servant-enemy-modal");
		loadServantEnemyImg();
	});

	// Clear current enemy setup
	$("#current-enemy-resetbtn").click(function() {
		resetCurrentEnemy();
	});

	// Update trait array
	$(".current-enemy-trait").change(function() {
		updateTrait();
	});
	$(".enemy-trait-resetbtn").click(function() {
		resetTrait();
	});

	// Update debuff array
	$(".current-enemy-debuff").change(function() {
		updateDebuff();
	});
	$(".enemy-debuff-resetbtn").click(function() {
		resetDebuff();
	});

	// Set enemy
	$(".enemy-applybtn").click(function() {
		var enemy = $(this).attr("data-value");

		// If the enemy has changed, removed all previous calculation results
		if ($("#" + enemy + "-result-title").html() != "") {
			if (confirm("重新選擇敵人後對應的計算結果將會被清除，是否繼續？")) {
				$("#" + enemy + "-result").find(".table-resetbtn").click();
				setEnemy(enemy);
			}
		} else {
			setEnemy(enemy);
		}
	});

	// Remove enemy
	$(".enemy-resetbtn").click(function() {
		var enemy = $(this).attr("data-value");

		// Removed all previous calculation results
		if ($("#" + enemy + "-result-title").html() != "") {
			if (confirm("清除後對應的計算結果亦不會保留，是否繼續？")) {
				$("#" + enemy + "-result").find(".table-resetbtn").click();
				resetEnemy(enemy);
			}
		} else {
			resetEnemy(enemy);
		}
	});
});

// Update trait array
function updateTrait() {
	trait = [];
	$(".current-enemy-trait:checked").each(function() {
		trait.push($(this).val())
	});
	if (trait[0] !== undefined) {
		$("#enemy-trait-label").addClass("highlight")
	} else {
		$("#enemy-trait-label").removeClass("highlight")
	}
}

// Reset trait
function resetTrait() {
	$(".current-enemy-trait-type").each(function() {
		$(this).prop("checked", false);
	});
	updateTrait();
}

// Update debuff array
function updateDebuff() {
	debuff = [];
	$(".current-enemy-debuff").each(function() {
		if ($(this).is(":checked")) {
			var obj = {};
			obj.name = $(this).val();
			obj.src = $(this).attr("data-src");
			debuff.push(obj);
		}
	});
	if (debuff[0] !== undefined) {
		$("#enemy-debuff-label").addClass("highlight")
	} else {
		$("#enemy-debuff-label").removeClass("highlight")
	}
}

// Reset trait
function resetDebuff() {
	$(".current-enemy-debuff").each(function() {
		$(this).prop("checked", false);
	});
	updateDebuff();
}

// Retrieve selected enemy's info
function pickEnemy(type, enemyID) {
	closeModal();

	// Determine if the enemy is servant or not
	switch (type) {
		case 1:
			enemyInfo = servants.filter(function(obj) {
				return obj.id == enemyID;
			});
			break;
		case 2:
			enemyInfo = common.filter(function(obj) {
				return obj.name == enemyID;
			});
			break;
		default:
			break;
	}

	// Reveal the collapsed section if it is hiden
	if ($("#enemy-setup-collapsebtn").html() == "展開 ▼") {
		$("#enemy-setup-collapsebtn").click();
	}

	$("#current-enemy-img").attr("src", enemyInfo[0].imgID);
	$("#current-enemy-name").html(enemyInfo[0].name);

	// Set class to 'Saber' if it's a non-servant enemy without pre-designated class
	if (enemyInfo[0].classes !== "All") {
		$("#current-enemy-class").val(enemyInfo[0].classes);
		$("#current-enemy-class").attr("title", enemyInfo[0].classes);
	} else {
		$("#current-enemy-class").val("Saber");
		$("#current-enemy-class").attr("title", "Saber");
	}

	$("#current-enemy-gender").val(enemyInfo[0].gender);
	$("#current-enemy-attribute").val(enemyInfo[0].attribute);
	$("#current-enemy-alignment1").val(enemyInfo[0].alignment1);
	$("#current-enemy-alignment2").val(enemyInfo[0].alignment2);

	// Loop through the trait list and check all corresponding traits
	$(".current-enemy-trait").prop("checked", false);
	$(enemyInfo[0].trait).each(function(index, value) {
		$("input.current-enemy-trait[value=" + value + "]").prop("checked", true)
	});
	updateTrait();
}

// Initialise enemy setup
function resetCurrentEnemy() {
	$("#current-enemy-img").attr("src", "images/bg_logo.webp");
	$("#current-enemy-name").html("未選定/自訂敵人");
	$("#current-enemy-class").val("Saber");
	$("#current-enemy-gender").val("無性別");
	$("#current-enemy-attribute").val("天");
	$("#current-enemy-alignment1").val("不適用");
	$("#current-enemy-alignment2").val("不適用");
	if ($("#enemy-setup-collapsebtn").html() == "展開 ▼") {
		$("#enemy-setup-collapsebtn").click();
	}
	$("#enemy-trait-resetbtn").click();
	$("#enemy-debuff-resetbtn").click();
}

// Set the enemy
function setEnemy(enemy) {
	var element = $("#" + enemy);
	$(element).show();

	// Check if is customising enemy
	if ($("#current-enemy-name").html() == "未選定/自訂敵人"){
		$(element).find(".enemy-img").attr("src", "images/bg_logo.webp");
	} else {
		$(element).find(".enemy-img").attr("src", $("#current-enemy-img").attr("src"));
	}
	if ($("#current-enemy-name").html() == "未選定/自訂敵人"){
		$(element).find(".enemy-name").html("自訂敵人");
	} else {
		$(element).find(".enemy-name").html($("#current-enemy-name").html());
	}

	// Display debuffs as logo, update enemy debuff lsit
	var debuffList = "";
	$(debuff).each(function(key, value) {
		debuffList += "<img class='debuff-logo' src='" + value.src + "' />";
	});
	$(element).find(".enemy-debuff").html(debuffList);
	window[enemy + "Debuff"] = debuff;

	// Display class as logo
	var imgURL = "images/class/" + encodeURI($("#current-enemy-class").val()) + ".webp";
	$(element).find(".enemy-class").attr({
		src: imgURL,
		title: $("#current-enemy-class").val()
	});


	$(element).find(".enemy-gender").html($("#current-enemy-gender").val());
	$(element).find(".enemy-attribute").html($("#current-enemy-attribute").val());
	$(element).find(".enemy-alignment1").html($("#current-enemy-alignment1").val());
	$(element).find(".enemy-alignment2").html($("#current-enemy-alignment2").val());

	// Display trait as string list, update enemy trait list
	var trait = [];
	$(".current-enemy-trait:checked").each(function() {
		trait.push($(this).val())
	});
	window[enemy + "Trait"] = trait;
	var string = trait.join(", ");
	if (string.length !== 0) {
		$(element).find(".enemy-trait").html(string);
	} else {
		$(element).find(".enemy-trait").html("無");
	}
	if (servantInfo[0] !== undefined) {
		updateBuff();
	}
}

// Remove enemy
function resetEnemy(enemy) {
	var element = $("#" + enemy);
	$(element).hide();
	$(element).find(".enemy-img").attr("src", "images/bg_logo.webp");
	$(element).find(".enemy-name").html("");
	window[enemy + "Debuff"] = [];
	$(element).find(".enemy-class").attr("src", "images/class/Unknown.webp");
	$(element).find(".enemy-gender").html("");
	$(element).find(".enemy-attribute").html("");
	$(element).find(".enemy-alignment1").html("");
	$(element).find(".enemy-alignment2").html("");
	$(element).find(".enemy-trait").html("");
	window[enemy + "Trait"] = [];
	updateBuff();
}

/* Set Battlefield */
var battlefield = [];

$(document).ready(function() {
	// Update battlefield list
	$(".battlefield-type").change(function() {
		updateBattlefield();
	});

	// If 'rock mountain' is selected, automatically select 'mountain' as well
	$("#battlefield-type11").change(function() {
		if ($(this).is(":checked")) {
			$("#battlefield-type8").prop("checked", true);
		}
	});

	// Reset battelfield
	$("#battlefield-resetbtn").click(function() {
		resetBattlefield();
	});
});

// Update battlefield
function updateBattlefield() {
	battlefield = [];
	$(".battlefield-type").each(function() {
		if ($(this).is(":checked")) {
			battlefield.push($(this).val());
		}
	});
	if (battlefield[0] !== undefined) {
		$("#battelfield-setup-label").addClass("highlight")
	} else {
		$("#battelfield-setup-label").removeClass("highlight")
	}
}

// Reset battlefield
function resetBattlefield() {
	$(".battlefield-type").each(function() {
		$(this).prop("checked", false);
	});
	updateBattlefield();
}


/* Set Servant */
var servantInfo = [];
var servantSave = [];
var servantAffList = [], servantMult = [], servantAttrAffList = [], servantAtkList = [];
var skillBuffList = [], npBuffList = [];
var skillSet = ["default"];

$(document).ready(function() {
	// Check if enemy is set, open modal box
	$("#servant-modalbtn").click(function() {
		if ($("#enemy1-name").html() != "") {
			openModal("#servant-modal");
			loadServantImg();
		} else {
			alert("請先設定敵人！");
		}
	});

	// Revert changes made
	$("#servant-resetbtn").click(function() {
		resetServant();
	});

	// Update NP info
	$("#current-servant-rankup").change(function() {
		setCurrentServantNP();
	});

	// Update skill info & logo
	$(".check-skill-rankup").change(function() {
		setSkill(this, $(this).val());
	});
});

// Retrieve servant info
function pickServant(servantID) {
	closeModal();
	servantInfo = servants.filter(function(obj) {
		return obj.id == servantID;
	});

	// Check duplication, retrieve skill, np & multipliers info
	if (countDuplicate(servantInfo[0].id)) {
		servantInfo = [];
		alert("重複從者！請檢查隊伍組成。");
	} else {
		$("#servant-resetbtn").show();

		skillSet = ["default"];

		// Filter useful skill buffs by ID, buffs that are effective to oneself & damage related buffs
		skillBuffList = multiFilter(skillBuff, {
			id: [servantID],
			toSelf: [true],
			effect: ["dmg", "nped", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def", "accdef",
				"class", "alignment1", "alignment2", "trait", "enemytrait", "hpdmg"]
		});

		// Filter useful NP buffs by ID, buffs that are effective to oneself,
		// buff that incur before damage & damage related buffs
		npBuffList = multiFilter(npBuff, {
			id: [servantID],
			toSelf: [true],
			buffFirst: [true],
			effect: ["dmg", "nped", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def", "accdef",
				"class", "alignment1", "alignment2", "trait", "enemytrait", "npmult", "hpmult"]
		});

		// Filter ATK info, affinity, attribute affinity and class multipliers
		servantAffList = affinity.filter(function(value) {
			return value.classes == servantInfo[0].classes;
		});
		servantMult = multiplier.filter(function(value) {
			return value.classes == servantInfo[0].classes;
		});
		servantAttrAffList = attrAffinity.filter(function(value) {
			return value.attribute == servantInfo[0].attribute;
		});
		servantAtkList = servantAtk.filter(function(value) {
			return value.id == servantInfo[0].id;
		});

		// Reveal set-up section if hiden
		if ($("#servant-setup-collapsebtn").html() == "展開 ▼") {
			$("#servant-setup-collapsebtn").click();
		}

		$("#current-servant-img").attr("src", servantInfo[0].imgID);
		$("#current-servant-name").html(servantInfo[0].name);

		// Display class & star as logo
		$("#current-servant-class").attr({
			src: "images/class/" + servantInfo[0].classes + ".webp",
			title: servantInfo[0].classes
		});
		var starHTML = "";
		switch (servantInfo[0].star) {
			case 0:
				starHTML = "-";
				break;
			case 1:
				starHTML = "★";
				break;
			case 2:
				starHTML = "★★";
				break;
			case 3:
				starHTML = "★★★";
				break;
			case 4:
				starHTML = "★★★★";
				break;
			case 5:
				starHTML = "★★★★★";
				break;
			default:
				break;
		}
		$("#current-servant-star").html(starHTML);
		$("#current-servant-star").removeClass("dull");
		$("#current-servant-star").attr("data-star", servantInfo[0].star);

		$("#current-servant-gender").html(servantInfo[0].gender);
		$("#current-servant-attribute").html(servantInfo[0].attribute);
		$("#current-servant-alignment").html(servantInfo[0].alignment1 + ", " + servantInfo[0].alignment2);
		$("#current-servant-trait").html(servantInfo[0].trait.join(", "));
		$("#current-servant-np").removeClass("Buster Arts Quick")
		$("#current-servant-np").addClass(servantInfo[0].npColor)

		// Determine if NP rank-up is available
		$("#servant-setup").find("input").prop("disabled", false);
		$("#servant-setup").find("select").prop("disabled", false);
		$("#current-servant-rankup").prop("disabled", !servantInfo[0].npRankUp);

		// Retrieve saved servant data
		servantSave = bgServant.filter(function(obj) {
			return obj.id == servantID;
		});
		setCurrentServantInfo();
		setCurrentServantNP();

		// Determine if skill rank-ups are available
		var skilllist = ["skill1", "skill2", "skill3"]
		$(skilllist).each(function() {
			var toggle = $("#check-" + this + "-rankup");
			toggle.prop("disabled", !servantInfo[0][this + "RU"]);
			setSkill(toggle);
		});

		updateBuff();
	}
}

// Revert changes made
function resetServant() {
	skillSet = ["default"];
	setCurrentServantInfo();
	setCurrentServantNP();
	var skilllist = ["skill1", "skill2", "skill3"]
	$(skilllist).each(function() {
		var toggle = $("#check-" + this + "-rankup");
		setSkill(toggle);
	});
	updateBuff();
}

// Check if servant is owned, apply saved data
function setCurrentServantInfo() {
	if (servantSave[0] != undefined) {
		// Apply saved data, update event buff
		$("#current-servant-lv").val(servantSave[0].data[1]);
		$("#current-servant-nplv").val(servantSave[0].data[2]);
		$("#current-servant-statup").val(servantSave[0].data[4]);
		$("#current-servant-rankup").prop("checked", servantSave[0].data[3]);
		$("#skill1-lv").val(servantSave[0].data[5]);
		$("#check-skill1-rankup").prop("checked", servantSave[0].data[6]);
		$("#skill2-lv").val(servantSave[0].data[7]);
		$("#check-skill2-rankup").prop("checked", servantSave[0].data[8]);
		$("#skill3-lv").val(servantSave[0].data[9]);
		$("#check-skill3-rankup").prop("checked", servantSave[0].data[10]);
		updateEventBuff();
	} else {
		// Initialise all fields
		$("#current-servant-lv").val(0);
		$("#current-servant-nplv").val(1);
		$("#current-servant-statup").val(0);
		$("#current-servant-rankup").prop("checked", false);
		$(".skill-lv").val(1);
		$(".check-skill-rankup").prop("checked", false);
		$("#event-buff").val(0);
	}
	$("#current-servant-hp").val(100);
	$("#current-servant-npoc").val("1");
	$(".use-skill").each(function() {
		if ($(this).is(":checked")) {
			$(this).click();
		}
	});
}

// Check if NP rank-up is toggled, set NP name & description accordingly
function setCurrentServantNP() {
	var keyword = "";
	if ($("#current-servant-rankup").is(":checked")) {
		keyword = "RU";
	}
	$("#current-servant-np").html(servantInfo[0].np + " " + servantInfo[0]["np" + keyword + "Rank"]);
	$("#current-servant-npdscrp").html(servantInfo[0]["np" + keyword + "Dscrp"]);
}

// Check if skill rank-up is toggled, set skill logo, name & description accordingly
function setSkill(toggle) {
	var skill = $(toggle).val();
	var keyword = "";
	if ($(toggle).is(":checked")) {
		keyword = "RU";
	}
	$("#" + skill + "-img").attr("src", servantInfo[0][skill + keyword + "ImgID"]);
	$("#" + skill + "-name").html(servantInfo[0][skill + keyword + "Name"]);
	$("#" + skill + "-dscrp").html(servantInfo[0][skill + keyword + "Dscrp"]);

	// Determine if skill should be disabled
	var check = !servantInfo[0][skill + keyword + "DmgBuff"];
	if (check) {
		// Uncheck skill if it is unavailable & checked
		if ($("#use-" + skill).is(":checked")) {
			$("#use-" + skill).click();
		}
	}
	$("#use-" + skill).prop("disabled", check);
	$("#" + skill + "-lv").prop("disabled", check);
}


/* Set Servant CE */
var ceInfo = [];
var ceSave = [];
var ceBuffList = [];

$(document).ready(function() {
	// Check if servant is set, open modal box
	$("#servant-ce-modalbtn").click(function() {
		if ($("#current-servant-name").html() != "未選定從者") {
			openModal("#ce-modal");
			loadCEImg();
		} else {
			alert("請先設定從者！");
		}
	});

	// Revert changes made
	$("#servant-ce-reapplybtn").click(function() {
		reapplyCE();
	});

	// Remove CE
	$("#servant-ce-resetbtn").click(function() {
		$(this).hide();
		$("#servant-ce-reapplybtn").hide();
		resetCE();
	});

	// Update CE description on change in max-status
	$("#servant-ce-max").change(function() {
		setCurrentServantCEEffect(this);
	});

	// Update CE ATK on change in CE Lv
	$("#servant-ce-lv").change(function() {
		updateCEAtk();
	});
});

// Retrieve CE info
function pickCE(essenceID) {
	closeModal();

	$("#servant-ce-reapplybtn").show();
	$("#servant-ce-resetbtn").show();

	ceInfo = ce.filter(function(obj) {
		return obj.id == essenceID;
	});

	// Filter useful CE buffs by ID, buff that are effective to oneself & damage related buff
	ceBuffList = multiFilter(ceBuff, {
		id: [essenceID],
		toSelf: [true],
		effect: ["dmg", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "enemytrait"]
	});

	// Reveal set-up section if hiden
	if ($("#ce-setup-collapsebtn").html() == "展開 ▼") {
		$("#ce-setup-collapsebtn").click();
	}

	$("#servant-ce-img").attr("src", ceInfo[0].imgID);
	$("#servant-ce-name").html(ceInfo[0].name);

	// Display star info as logo
	var starHTML = "";
	switch (ceInfo[0].star) {
		case 3:
			starHTML = "★★★";
			break;
		case 4:
			starHTML = "★★★★";
			break;
		case 5:
			starHTML = "★★★★★";
			break;
		default:
			break;
	}
	$("#servant-ce-star").html(starHTML);
	$("#servant-ce-star").removeClass("dull");
	$("#servant-ce-star").attr("data-star", ceInfo[0].star);

	// Check if the CE is max at default
	var defaultMax = ceInfo[0].defaultMax;
	$("#servant-ce-max").prop("disabled", defaultMax);
	$("#servant-ce-lv").prop("disabled", defaultMax);

	// Retrieve saved CE data
	ceSave = bgCE.filter(function(obj) {
		return obj.id == essenceID;
	});
	setCurrentServantCE();
	var ceToggle = $("#servant-ce-max");
	setCurrentServantCEEffect(ceToggle);
	updateCEAtk();
	updateBuff();
}

// Revert changes made
function reapplyCE() {
	setCurrentServantCE();
	var ceToggle = $("#servant-ce-max");
	setCurrentServantCEEffect(ceToggle);
	updateCEAtk();
	updateBuff();
}

// Remove chosen CE
function resetCE() {
	ceInfo = [];
	ceSave = [];
	ceBuffList = [];
	$("#servant-ce-img").attr("src", "images/bg_logo.webp");
	$("#servant-ce-name").html("未選定禮裝");
	$("#servant-ce-star").html("★★★★★");
	$("#servant-ce-star").addClass("dull");
	$("#servant-ce-star").attr("data-star", "");
	$("#servant-ce-max").prop("checked", false);
	$("#servant-ce-max").prop("disabled", true);
	$("#servant-ce-lv").val(0);
	$("#servant-ce-lv").prop("disabled", true);
	$("#servant-ce-dscrp").html("");
	updateCEAtk();
	updateBuff();
}

// Check if CE is owned, apply saved data
function setCurrentServantCE() {
	if (ceSave[0] != undefined) {
		// Apply saved data
		$("#servant-ce-max").prop("checked", ceSave[0].data[1]);
		$("#servant-ce-lv").val(ceSave[0].data[2]);
	} else {
		// Initialise all fields
		if (ceInfo[0] != undefined) {
			$("#servant-ce-max").prop("checked", ceInfo[0].defaultMax);
		} else {
			$("#servant-ce-max").prop("checked", false);
		}
		$("#servant-ce-lv").val(0);
	}
}

// Check if CE is maxed, set CE description accordingly
function setCurrentServantCEEffect(toggle) {
	if (ceInfo[0] != undefined) {
		if ($(toggle).is(":checked")) {
			$("#servant-ce-dscrp").html(ceInfo[0].maxEffect);
		} else {
			$("#servant-ce-dscrp").html(ceInfo[0].defaultEffect);
		}
	}
}


/* Set Master Mystic Code */
var masterInfo = [];
var masterSave = [];
var masterBuffList = [];
var masterSkillSet = [];

$(document).ready(function() {
	// Check if servant is set, open modal box
	generateMasterSelection();
	$("#master-name-selection").change(function() {
		if ($("#current-servant-name").html() == "未選定從者") {
			$("#master-name-selection").val("不使用魔術禮裝");
			alert("請先設定從者！");
		}
	});

	// Apply chosen mystic code's info
	$("#master-name-selection").change(function() {
		setMaster(this);
	});

	// Remove chosen mystic code
	$("#master-resetbtn").click(function() {
		applyMaster();
	});
});

// Generate mystic code dropdown list
function generateMasterSelection() {
	$(master).each(function(index, value) {
		var select = $("#master-name-selection");
		var name = value.name;
		var option = {value: name, text: name};
		select.append($('<option>', option));
	});
}

// Check if mystic code is chosen, retrieve mystic code info
function setMaster(element) {
	if ($(element).val() == "不使用魔術禮裝") {
		// Hide set-up section
		if ($("#master-setup-collapsebtn").html() == "接疊 ▲") {
			$("#master-setup-collapsebtn").click();
		}

		$("#master-resetbtn").hide();

		// Clear all arrays
		masterInfo = [];
		masterSave = [];
		masterBuffList = [];
		masterSkillSet = [];

		$("#master-selection-label").removeClass("highlight");

		// Initialise all fields
		$("#master-img1").attr("src", "");
		$("#master-img2").attr("src", "");
		$("#master-lv").val(1);
		$("#master-lv").prop("disabled", true);

		var skilllist = ["skill1", "skill2", "skill3"];
		$(skilllist).each(function() {
			$("#master-" + this + "-logo").attr("src", "");
			$("#master-" + this + "-logo").removeClass("dull");
			$("#check-master-" + this).prop("checked", false);
			$("#check-master-" + this).prop("disabled", true);
			$("#master-" + this + "-name").html("");
			$("#master-" + this + "-dscrp").html("");
		});
	} else {
		// Reveal set-up section if hiden
		if ($("#master-setup-collapsebtn").html() == "展開 ▼") {
			$("#master-setup-collapsebtn").click();
		}

		$("#master-resetbtn").show();
		$("#master-selection-label").addClass("highlight");

		var name = $(element).val();
		masterInfo = master.filter(function(obj) {
			return obj.name == name;
		});

		// Filter useful skill buffs by mystic code & dmage related buffs
		masterBuffList = multiFilter(masterBuff, {
			name: [name],
			effect: ["dmg", "adddmg", "buster", "arts", "quick", "npdmg"]
		});

		// Apply mystic code info
		$("#master-img1").attr("src", masterInfo[0].imgID1);
		$("#master-img2").attr("src", masterInfo[0].imgID2);
		$("#master-lv").prop("disabled", false);

		// Set skill logos, determine if skills need to be disabled
		var skilllist = ["skill1", "skill2", "skill3"];
		$(skilllist).each(function() {
			$("#master-" + this + "-logo").attr("src", masterInfo[0][this + "ImgID"]);
			var allow = !masterInfo[0][this + "Buff"].some(function(value) {
				return value == "card" || value == "dmg"
			});
			$("#check-master-" + this).prop("disabled", allow);
			$("#master-" + this + "-name").html(masterInfo[0][this + "Name"]);
			$("#master-" + this + "-dscrp").html(masterInfo[0][this + "Dscrp"]);
		});

		// Retrieve saved mystic code data
		masterSave = bgMaster.filter(function(obj) {
			return obj.name == name;
		});
		applyMaster();
	}
}

// Retrieve saved mystic code data
function applyMaster() {
	var skilllist = ["skill1", "skill2", "skill3"];
	$(skilllist).each(function() {
		$("#master-" + this + "-logo").addClass("dull");
		$("#check-master-" + this).prop("checked", false);
	});
	if (masterSave[0] != undefined) {
		$("#master-lv").val(masterSave[0].data[1]);
	} else {
		$("#master-lv").val(1);
	}
}


/* Set Teammates */
var teammate1Info = [], teammate2Info = [], teammate3Info = [], teammate4Info = [], teammate5Info = [];
var teammate1Save = [], teammate2Save = [], teammate3Save = [], teammate4Save = [], teammate5Save = [];
var teammate1SkillSet = [], teammate2SkillSet = [], teammate3SkillSet = [], teammate4SkillSet = [], teammate5SkillSet = [];
var teammate1SkillBuffList = [], teammate2SkillBuffList = [], teammate3SkillBuffList = [], teammate4SkillBuffList = [], teammate5SkillBuffList = [];
var teammate1NPBuffList = [], teammate2NPBuffList = [], teammate3NPBuffList = [], teammate4NPBuffList = [], teammate5NPBuffList = [];
var teammate1CEInfo = [], teammate2CEInfo = [], teammate3CEInfo = [], teammate4CEInfo = [], teammate5CEInfo = [];
var teammate1CESave = [], teammate2CESave = [], teammate3CESave = [], teammate4CESave = [], teammate5CESave = [];
var teammate1CEBuffList = [], teammate2CEBuffList = [], teammate3CEBuffList = [], teammate4CEBuffList = [], teammate5CEBuffList = [];

$(document).ready(function() {
	// Check if servant is chosen, open modal box
	$(".teammate-modalbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		if ($("#current-servant-name").html() != "未選定從者") {
			openModal("#teammate-modal");
			setCaller(teammate);
			loadTeammateImg();
		} else {
			alert("請先設定從者！");
		}
	});

	// Check if teammate is chosen, open CE modal box
	$(".teammate-ce-modalbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		if ($("#" + teammate + " .teammate-name").html() != "未選定隊友") {
			openModal("#teammate-ce-modal");
			setCaller(teammate);
			loadTeammateCEImg();
		} else {
			alert("請先設定隊友！");
		}
	});

	// Revert changes made
	$(".teammate-reapplybtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		reapplyTeammate(teammate);
	});

	// Remove teammate CE
	$(".teammate-ce-resetbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		$(this).hide();
		resetTeammateCE(teammate);
	});

	// Remove teammate
	$(".teammate-resetbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		if ($("#teammate-setup-collapsebtn").html() == "接疊 ▲") {
			$("#teammate-setup-collapsebtn").html("展開 ▼");
		}
		$(this).hide();
		$(".teammate-reapplybtn[data-teammate='" + teammate + "']").hide();
		resetTeammate(teammate);
	});

	// Reveal additional teammate slot
	$(".teammate-extendbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		$(this).hide();
		extend(teammate);
	});

	// Retrieve teammate info
	$(".teammate-np-rankup").change(function() {
		setTeammateNP(this);
	});
	$(".teammate-skill-rankup").change(function() {
		setTeammateSkill(this);
	});

	// Enable NP toggles
	$(".teammate-np").change(function() {
		enableTeammateNP(this);
	});

	// Set common support servant as teammate
	$(".supportbtn").click(function() {
		var id = Number($(this).attr("data-id"));
		setSupport(id);
	});
});

// Reveal additional teammate slot
function extend(element) {
	$("#" + element).show();
	$("#" + element).addClass("allow-toggle");
}

// Retrieve teammate info
function pickTeammate(value, teammateID, brute) {
	closeModal();
	modalCaller = "";
	var section = $("#" + value);
	window[value + "Info"] = servants.filter(function(obj) {
		return obj.id == teammateID;
	});

	// Check if chosen servant is duplicated
	if (countDuplicate(window[value + "Info"][0].id)) {
		window[value + "Info"] = [];
		alert("重複從者！請檢查隊伍組成。");
	} else {
		$(".teammate-reapplybtn[data-teammate='" + value + "']").show();
		$(".teammate-resetbtn[data-teammate='" + value + "']").show();

		window[value + "SkillSet"] = [];

		// Filter useful NP and skill buffs by ID, effective to teammates & dmage related
		window[value + "SkillBuffList"] = multiFilter(skillBuff, {
			id: [teammateID],
			range: ["team", "single", "all-enemy", "single-enemy"],
			effect: ["dmg", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def", "accdef",
				"class", "alignment1", "alignment2", "trait", "enemytrait"]
		});
		window[value + "NPBuffList"] = multiFilter(npBuff, {
			id: [teammateID],
			range: ["team", "single", "all-enemy", "single-enemy"],
			effect: ["dmg", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def", "accdef",
				"class", "alignment1", "alignment2", "trait", "enemytrait"]
		});
		var info = window[value + "Info"];

		// Reveal set-up section if hiden
		if ($("#teammate-setup-collapsebtn").html() == "展開 ▼") {
			$("#teammate-setup-collapsebtn").click();
		}

		section.find(".teammate-img").attr("src", info[0].imgID);
		section.find(".teammate-name").html(info[0].name);

		// Display class & star info as logo
		section.find(".teammate-class").attr({
			src: "images/class/" + info[0].classes + ".webp",
			title: info[0].classes
		});
		var starHTML = "";
		switch (info[0].star) {
			case 0:
				starHTML = "-";
				break;
			case 1:
				starHTML = "★";
				break;
			case 2:
				starHTML = "★★";
				break;
			case 3:
				starHTML = "★★★";
				break;
			case 4:
				starHTML = "★★★★";
				break;
			case 5:
				starHTML = "★★★★★";
				break;
			default:
				break;
		}
		section.find(".teammate-star").html(starHTML);
		section.find(".teammate-star").removeClass("dull");

		// Determine if NP rank-up is available
		section.find(".teammate-np-rankup").prop("disabled", !info[0].npRankUp);

		// Visualise NP color
		section.find(".teammate-np-name").removeClass("Buster Arts Quick");
		section.find(".teammate-np-name").addClass(info[0].npColor);

		if (brute) {
			// If teammate is added as common support, max out all stats
			setSupportInfo(value);
		} else {
			// Assume a support teammate, hence set all stats as initial
			setTeammateInfo(value);
		}

		// Retrieve saved teammate data
		window[value + "Save"] = bgServant.filter(function(obj) {
			return obj.id == teammateID;
		});

		// Determine if NP rank-up is available
		var npToggle = section.find(".teammate-np-rankup");
		setTeammateNP(npToggle);

		// Determine if skill rank-up is available
		var skilllist = ["skill1", "skill2", "skill3"];
		$(skilllist).each(function() {
			var skillToggle = section.find(".teammate-" + this + "-rankup");
			skillToggle.prop("disabled", !info[0][this + "RU"]);
			setTeammateSkill(skillToggle);
		});

		// If teammate is added as common support, toggle all skills
		if (brute) {
			toggleAllSkills(value);
		}
	}
}

// Revert changes made
function reapplyTeammate(value) {
	window[value + "SkillSet"] = [];

	setTeammateInfo(value);
	var section = $("#" + value);

	var npToggle = section.find(".teammate-np-rankup");
	setTeammateNP(npToggle);

	var skilllist = ["skill1", "skill2", "skill3"];
	$(skilllist).each(function() {
		var skillToggle = section.find(".teammate-" + this + "-rankup");
		setTeammateSkill(skillToggle);
	});

	// If CE is set, apply saved data
	if (section.find(".teammate-ce-name").html() != "未選定禮裝") {
		setTeammateCE(value);
		var ceToggle = section.find(".teammate-ce-max");
		setTeammateCEEffect(ceToggle);
	}
}

// Remove teammate
function resetTeammate(value) {
	// Clear all arrays
	window[value + "Info"] = [];
	window[value + "Save"] = [];
	window[value + "SkillSet"] = [];
	window[value + "SkillBuffList"] = [];
	window[value + "NPBuffList"] = [];

	var section = $("#" + value);
	section.hide();
	if (value != "teammate1") {
		section.removeClass("allow-toggle");
		$("#" + value + "-extendbtn").show();
	}
	section.find(".teammate-img").attr("src", "images/bg_logo.webp");
	section.find(".teammate-name").html("未選定隊友");
	section.find(".teammate-class").attr({
		src: "images/class/Unknown.webp",
		title: ""
	});
	section.find(".teammate-star").html("★★★★★");
	section.find(".teammate-star").addClass("dull");

	// If CE is set, remove CE
	if (section.find(".teammate-ce-name").html() != "未選定禮裝") {
		resetTeammateCE(value);
	}

	// Initialise all fields
	section.find(":input").each(function() {
		$(this).prop("disabled", true);
	});
	section.find(":checkbox").each(function() {
		$(this).prop("checked", false);
	});
	section.find("select").each(function() {
		$(this).prop("disabled", true);
	});
	section.find(".teammate-nplv").val(1);
	section.find(".teammate-npoc").val(1);
	section.find(".teammate-np-name").removeClass("Buster Arts Quick");
	section.find(".teammate-np-name").html("");
	section.find(".teammate-np-dscrp").html("");

	var skilllist = ["skill1", "skill2", "skill3"];
	$(skilllist).each(function() {
		section.find(".teammate-" + this + "-lv").val(1);
		section.find(".teammate-" + this + "-img").attr("src", "");
		section.find(".teammate-" + this + "-name").html("");
		section.find(".teammate-" + this + "-dscrp").html("");
	});
}

// Check if teammate is owned, retrieve saved teammate data
function setTeammateInfo(value) {
	var section = $("#" + value);
	var save = window[value + "Save"];
	var skilllist = ["skill1", "skill2", "skill3"];
	if (save[0] != undefined) {
		section.find(".teammate-np-rankup").prop("checked", save[0].data[3]);
		section.find(".teammate-skill1-lv").val(save[0].data[5]);
		section.find(".teammate-skill1-rankup").prop("checked", save[0].data[6]);
		section.find(".teammate-skill2-lv").val(save[0].data[7]);
		section.find(".teammate-skill2-rankup").prop("checked", save[0].data[8]);
		section.find(".teammate-skill3-lv").val(save[0].data[9]);
		section.find(".teammate-skill3-rankup").prop("checked", save[0].data[10]);
	} else {
		section.find(".teammate-np-rankup").prop("checked", false);
		$(skilllist).each(function() {
			section.find(".teammate-" + this + "-lv").val(1);
			section.find(".teammate-" + this + "-rankup").prop("checked", false);
		});
	}
	section.find(".teammate-nplv").val(1);
	section.find(".teammate-npoc").val(1);
	$(skilllist).each(function() {
		section.find(".teammate-" + this).prop("checked", false);
		section.find(".teammate-" + this + "-img").addClass("dull");
	});
}

// Check if NP rank-up is toggled, set NP name & description accordingly
function setTeammateNP(toggle) {
	var section = $(toggle).parents(".teammate-detail");
	var value = section.attr("id");
	var info = window[value + "Info"];
	var keyword = "";
	if ($(toggle).is(":checked")) {
		keyword = "RU";
	}
	section.find(".teammate-np-name").html(info[0].np + " " + info[0]["np" + keyword + "Rank"]);
	section.find(".teammate-np-dscrp").html(info[0]["np" + keyword + "Dscrp"]);

	// Determine if NP should be disabled
	var check = !info[0]["np" + keyword + "DmgToTeam"];
	section.find(".teammate-np").prop("disabled", check);
}

// Enable NP toggles
function enableTeammateNP(toggle) {
	var section = $(toggle).parents(".teammate-detail");
	var check = $(toggle).is(":checked");
	section.find(".teammate-nplv").prop("disabled", check);
	section.find(".teammate-npoc").prop("disabled", check);
}

// Check if skill rank-up is toggled, set skill logo, name & description accordingly
function setTeammateSkill(toggle) {
	var section = $(toggle).parents(".teammate-detail");
	var value = section.attr("id");
	var skill = $(toggle).val();
	var info = window[value + "Info"];
	var keyword = "";
	if ($(toggle).is(":checked")) {
		keyword = "RU";
	}
	section.find(".teammate-" + skill + "-img").attr("src", info[0][skill + keyword + "ImgID"]);
	section.find(".teammate-" + skill + "-name").html(info[0][skill + keyword + "Name"]);
	section.find(".teammate-" + skill + "-dscrp").html(info[0][skill + keyword + "Dscrp"]);

	// Determine if skill should be disabled
	var check = !info[0][skill + keyword + "DmgToTeam"];
	if (check) {
		// Uncheck skill if it is unavailable & checked
		if (section.find(".teammate-" + value).is(":checked")) {
			section.find(".teammate-" + value).click();
		}
	}
	section.find(".teammate-" + skill).prop("disabled", check);
	section.find(".teammate-" + skill + "-lv").prop("disabled", check);
}

// Set common support as teammate at the first available slot
function setSupport(teammateID) {
	var slot = "";
	var list = ["teammate1", "teammate2", "teammate3", "teammate4", "teammate5"];
	var i = -1;
	var empty = false;
	while (empty == false) {
		i++;
		var section = $("#" + list[i]);
		if ($(section).find(".teammate-name").html() == "未選定隊友") {
			empty = true;
		}
	}
	pickTeammate(list[i], teammateID, true);
}

// Max out all skills' stats for common support teammate
function setSupportInfo(value) {
	var section = $("#" + value);

	var npToggle = section.find(".teammate-np-rankup");
	npToggle.prop("checked", !npToggle.prop("disabled"));

	var skilllist = ["skill1", "skill2", "skill3"];
	$(skilllist).each(function() {
		section.find(".teammate-" + this + "-lv").val(10);
		var toggle = section.find(".teammate-" + this + "-rankup");
		toggle.prop("checked", !toggle.prop("disabled"));
		section.find(".teammate-" + this + "-img").addClass("dull");
	});
}

// Toggle all skills for common support teammate
function toggleAllSkills(value) {
	var section = $("#" + value);
	var skilllist = ["skill1", "skill2", "skill3"];
	$(skilllist).each(function() {
		if (!section.find(".teammate-" + this).prop("disabled")) {
			section.find(".teammate-" + this).click();
		}
	});
}

// Retrieve CE info
function pickTeammateCE(value, ceID) {
	closeModal();
	modalCaller = "";
	$(".teammate-ce-resetbtn[data-teammate='" + value + "']").show();

	var section = $("#" + value);
	window[value + "CEInfo"] = ce.filter(function(obj) {
		return obj.id == ceID;
	});

	// Filter useful CE buffs by ID, effective to teammate & damage related
	window[value + "CEBuffList"] = multiFilter(ceBuff, {
		id: [ceID],
		range: ["team", "all-enemy", "single-enemy"],
		effect: ["dmg", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "enemytrait"]
	});

	var info = window[value + "CEInfo"];
	section.find(".teammate-ce-img").attr("src", info[0].imgID);
	section.find(".teammate-ce-name").html(info[0].name);

	// Check if CE is max by default
	section.find(".teammate-ce-max").prop("disabled", info[0].defaultMax);

	// Assume CE equiped by a support teammate, hence set stats as initial
	setTeammateCE(value);

	// Retrieve saved CE data
	window[value + "CESave"] = bgCE.filter(function(obj) {
		return obj.id == ceID;
	});

	var ceToggle = section.find(".teammate-ce-max");
	setTeammateCEEffect(ceToggle);
}

// Remove teammate CE
function resetTeammateCE(value) {
	// Clear all array
	window[value + "CEInfo"] = [];
	window[value + "CESave"] = [];
	window[value + "CEBuffList"] = [];

	var section = $("#" + value);
	if (section.find(".teammate-ce-name").html() != "未選定禮裝") {
		section.find(".teammate-ce-img").attr("src", "images/bg_logo.webp");
		section.find(".teammate-ce-name").html("未選定禮裝");
		section.find(".teammate-ce-star").addClass("dull");
		section.find(".teammate-ce-max").prop("checked", false);
		section.find(".teammate-ce-max").prop("disabled", true);
		section.find(".teammate-ce-dscrp").html("");
	}
}

// Apply saved CE info
function setTeammateCE(value) {
	var section = $("#" + value);
	var save = window[value + "CESave"];
	var info = window[value + "CEInfo"];
	if (save[0] != undefined) {
		section.find(".teammate-ce-max").prop("checked", save[0].data[1]);
	} else {
		if (ceInfo[0] != undefined) {
			section.find(".teammate-ce-max").prop("checked", info[0].defaultMax);
		} else {
			section.find(".teammate-ce-max").prop("checked", false);
		}
	}
}

// Determine if CE is maxed, set CE description accordingly
function setTeammateCEEffect(toggle) {
	var info = window[value + "CEInfo"];
	if (info[0] != undefined) {
		if ($(toggle).is(":checked")) {
			section.find(".teammate-ce-dscrp").html(info[0].maxEffect);
		} else {
			section.find(".teammate-ce-dscrp").html(info[0].defaultEffect);
		}
	}
}


/* Update Buff */
var useStrict = [true, false];
var includeAfterDefeat = [true, false];
var tempAffinity = [], tempAlignment1 = [], tempAlignment2 = [], tempTrait = [];
var servantNPAddMult = {};
var tempEnemyTrait = [];

$(document).ready(function() {
	// Update buff on change in battlefield type
	$("#battlefield-setup input:checkbox").change(function() {
		updateBuff();
	});

	// Set if strict mode is under use (disregard all buffs that come with chance in calculation)
	$("#use-strict-mode").change(function() {
		if ($(this).is(":checked")) {
			useStrict = [false];
			$("#use-strict-mode-label").addClass("highlight");
		} else {
			useStrict = [true, false];
			$("#use-strict-mode-label").removeClass("highlight");
		}
	});

	// Set if buffs effective after defeat should be included
	$("#include-after-defeat").change(function() {
		if ($(this).is(":checked")) {
			includeAfterDefeat = [true, false];
			$("#include-after-defeat-label").addClass("highlight");
		} else {
			includeAfterDefeat = [false];
			$("#include-after-defeat-label").removeClass("highlight");
		}
	});

	// Update buff
	$(".update-trigger").change(function() {
		updateBuff();
	});

	// Update active skill sets, update buff
	$(".use-skill").change(function() {
		var skill = $(this).val();
		var img = $("#" + skill + "-img");
		if($(this).is(":checked")) {
			$(img).removeClass("dull");
		} else {
			$(img).addClass("dull");
		}
		updateSkillSet(this);
		updateBuff();
	});
	$(".check-master-skill").change(function() {
		var skill = $(this).val();
		var img = $("#master-" + skill + "-logo");
		if($(this).is(":checked")) {
			$(img).removeClass("dull");
		} else {
			$(img).addClass("dull");
		}
		updateMasterSkillSet(this);
		updateBuff();
	});
	$(".teammate-skill").change(function() {
		var skill = $(this).val();
		var img = $(this).parents(".teammate-detail").find(".teammate-" + skill + "-img");
		if($(this).is(":checked")) {
			$(img).removeClass("dull");
		} else {
			$(img).addClass("dull");
		}
		updateTeammateSkillSet(this);
		updateBuff();
	});

	$("#buff-info input").change(function() {
		labelHighlight(this);
	});

	$("#buff-resetbtn").click(function() {
		updateBuff();
	});
});

// Includes servant skills toggled into skill set array
function updateSkillSet(toggle) {
	var skill = $(toggle).val();
	if ($(toggle).is(":checked")) {
		skillSet.push(skill);
	} else {
		var position = skillSet.indexOf(skill);
		skillSet.splice(position, 1);
	}
}
 // Includes master mystic code skills toggled into skill set array
function updateMasterSkillSet(toggle) {
	var skill = $(toggle).val();
	if ($(toggle).is(":checked")) {
		masterSkillSet.push(skill);
	} else {
		var position = masterSkillSet.indexOf(skill);
		masterSkillSet.splice(position, 1);
	}
}

// Includes teammate skills toggled into skill set array
function updateTeammateSkillSet(toggle) {
	var skill = $(toggle).val();
	var teammate = $(toggle).parents(".teammate-detail").attr("id");
	var skillset = window[teammate + "SkillSet"];
	if ($(toggle).is(":checked")) {
		skillset.push(skill);
	} else {
		var position = skillset.indexOf(skill);
		skillset.splice(position, 1);
	}
}

// Update buff
function updateBuff() {
	// Clear all arrays
	tempAffinity = [], tempAlignment1 = [], tempAlignment2 = [], tempTrait = [];
	servantNPAddMult = {};
	tempEnemyTrait = [];

	// Clear all input fields
	$("#buff-info").find("input").each(function() {
		$(this).val(0);
	});
	$(".np-ed").each(function() {
		$(this).val(100);
	});
	$("#buff-info").find(".label").each(function() {
		$(this).removeClass("highlight");
	});

	// Update passive skill buff
	updatePassiveBuff();

	// Update prerequisite skill & NP buffs
	updateSkillPreReq();
	updateNPPreReq();

	// If CE is set, takes prerequisite buffs into account
/*	if (ceInfo[0] !== undefined) {
		updateCEPreReq();
	}*/

	// If teammate is set, takes prerequisite CE, NP & skill buffs into account
	$(".teammate-detail").each(function() {
		if ($(this).find(".teammate-name").html() != "未選定隊友") {
			updateTeammateSkillPreReq(this);
			updateTeammateNPPreReq(this);
			/*if ($(this).find(".teammate-ce-name").html() != "未選定禮裝") {
				updateTeammateCEPreReq(this);
			}*/
		}
	});

	// Update skill & NP buffs
	updateSkillBuff();
	updateNPBuff();

	// If CE is set, update buffs
	if (ceInfo[0] !== undefined) {
		updateCEAtk();
		updateCEBuff();
	}

	// If mystic code is set, update buffs
	if (masterInfo[0] !== undefined) {
		updateMasterBuff();
	}

	// If teammate is set, update buffs
	$(".teammate-detail").each(function() {
		if ($(this).find(".teammate-name").html() != "未選定隊友") {
			updateTeammateSkillBuff(this);
			if ($(this).find(".teammate-np").is(":checked")) {
				updateTeammateNPBuff(this);
			}
			if ($(this).find(".teammate-ce-name").html() != "未選定禮裝") {
				updateTeammateCEBuff(this);
			}
		}
	});

	$("#buff-info").find(".label").each(function() {
		labelHighlight(this);
	});
}

// Highlight active buff fields, put alarm on incorrect input
function labelHighlight(field) {
	$(field).siblings(".labeltag").removeClass("alarm highlight");

	var min = Number.NEGATIVE_INFINITY;		// Set minimum value for different fields, negative infinity by default
	var max = Number.POSITIVE_INFINITY;		// No maximum by default
	if ($(field).hasClass("np-ed")) {		// 100 for NP ED
		min = 100;
	} else if ($(field).attr("id") == "ce-atk") {
		min = 0;
		max = 2400;
	} else if (
		$(field).hasClass("red-atk") || $(field).hasClass("skill-ed") ||		// 0 for fields that disallow negative values
		$(field).attr("id") == "add-atk" || $(field).attr("id") == "event-buff"
	) {
		min = 0;
	}
	if (Number($(field).val()) > min && Number($(field).val()) !== 0) {		// Highlight if higher than minimum & non-0
		$(field).siblings(".labeltag").addClass("highlight");
	} else if (Number($(field).val()) < min || Number($(field).val()) > max) {	// Alarm if smaller than minimum or larger than maximum
		$(field).siblings(".labeltag").addClass("alarm");
	}
}

// Update CE ATK
function updateCEAtk() {
	if (ceInfo[0] === undefined) {
		$("#ce-atk").val(0);
	} else if (ceInfo[0].defaultMax == true) {
		$("#ce-atk").val(ceInfo[0].maxAtk);		// Use default value if CE is max by default
	} else {
		var maxLV;				// Set maximum lv of CE
		switch (ceInfo[0].star) {
			case 3:
				maxLV = 60;
				break;
			case 4:
				maxLV = 80;
				break;
			case 5:
			default:
				maxLV = 100;
				break;
		}
		if (!$("#servant-ce-max").is(":checked")) {		// If CE is not max, set maximum lv as 20
			maxLV = 20;
		}
		if (Number($("#servant-ce-lv").val()) > maxLV) {
			$("#servant-ce-lv").val(maxLV);
		}

		// Lookup CE ATK using sum of default & max ATK
		var sum = ceInfo[0].defaultAtk + ceInfo[0].maxAtk;
		var lvRef = ceAtk.filter(function(obj) {
			return obj.sum == sum.toString();
		});
		var lv = $("#servant-ce-lv").val();
		if (lv == "0") {
			lv = "20";
		}
		$("#ce-atk").val(lvRef[0][lv]);
	}
}

// Read saved event buff data
function updateEventBuff() {
	if (servantSave[0] != undefined) {
		$("#event-buff").val(servantSave[0].data[19]);
	}
}

// Update passive skill buffs
function updatePassiveBuff() {
	var rankUp = "";
	if ($("#current-servant-rankup").is(":checked")) {
		rankUp = "RU";
	}

	// Update Buster buff, includes both passive skills & NP fixed-value buffs
	var buster = Number($("#Buster-buff").val());
	buster += servantInfo[0].passiveBuster;
	buster += servantInfo[0]["npBuster" + rankUp];
	$("#Buster-buff").val(buster);

	// Update Arts buff
	var arts = Number($("#Arts-buff").val());
	arts += servantInfo[0].passiveArts;
	arts += servantInfo[0]["npArts" + rankUp];
	$("#Arts-buff").val(arts);

	// Update Quick buff
	var quick = Number($("#Quick-buff").val());
	quick += servantInfo[0].passiveQuick;
	quick += servantInfo[0]["npQuick" + rankUp];
	$("#Quick-buff").val(quick);

	// Update increased damage due to divinity
	var divinity = Number($("#add-atk").val());
	divinity += servantInfo[0].divinity;
	$("#add-atk").val(divinity);

	// Update NP buffs
	var npdmg = Number($("#np-buff").val());
	npdmg += servantInfo[0]["npDmgUp" + rankUp];
	$("#np-buff").val(npdmg);

	// Update ATK buffs
	var atk = Number($("#atk-buff").val());
	atk += servantInfo[0]["npAtk" + rankUp];
	$("#atk-buff").val(atk);
}

// Update prerequisite skill buffs
function updateSkillPreReq() {
	$(skillSet).each(function() {			// Loop through each skill in effect
		var checkRU = false;
		if (this !== "default") {
			checkRU = $("#check-" + this + "-rankup").is(":checked");
		}
		var activeSkillBuff = multiFilter(skillBuffList, {	// Filter useful buffs by rank up status and settings
			no: [this.toString()],
			skillRU: [checkRU],
			chance: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeSkillBuff).each(function() {		// Loop through each buff
			switch (this.effect) {
				case "class":		// Buffs that change affinity relationships
					tempAffinity = affinity.filter(function(value) {
						return value.classes = this.corrDetail[0];
					});
					break;
				case "alignment1":		// Buff that add temporary alignment 1
					tempAlignment1.push(this.corrDetail[0]);
					break;
				case "alignment2":		// Buff that add temporary alignment 2
					tempAlignment2.push(this.corrDetail[0]);
					break;
				case "trait":			// Buff that add temporary trait
					tempTrait.push(this.corrDetail[0]);
					break;
				case "enemytrait":		// Buff that add temporary trait to the enemy
					tempEnemyTrait.push(this.corrDetail[0]);
					break;
				default:
					break;
			}
		});
	});
}

// Update prerequisite NP buffs
function updateNPPreReq() {
	var checkRU = $("#current-servant-rankup").is(":checked");
	var activeNPBuff = multiFilter(npBuffList, {		// Filter useful buffs by NP rank up status and settings
		npRU: [checkRU],
		chance: useStrict
	});
	$(activeNPBuff).each(function() {
		switch (this.effect) {
			case "class":
				tempAffinity = affinity.filter(function(value) {
					return value.classes = this.corrDetail[0];
				});
				break;
			case "alignment1":
				tempAlignment1.push(this.corrDetail[0]);
				break;
			case "alignment2":
				tempAlignment2.push(this.corrDetail[0]);
				break;
			case "trait":
				tempTrait.push(this.corrDetail[0]);
				break;
			case "enemytrait":
				tempEnemyTrait.push(this.corrDetail[0]);
				break;
			case "npmult":			// NP with additional multiplier that correlate with OC lv (Arash)
			case "hpmult":			// NP with additional multiplier that correlate with HP value (Anne&Mary, Hijikata)
				servantNPAddMult.type = this.effect;
				servantNPAddMult.npLV = this.npLV;
				servantNPAddMult["1"] = this["1"];
				servantNPAddMult["2"] = this["2"];
				servantNPAddMult["3"] = this["3"];
				servantNPAddMult["4"] = this["4"];
				servantNPAddMult["5"] = this["5"];
				break;
			default:
				break;
		}
	});
}

/*// Update prerequisite CE buffs
function updateCEPreReq() {
	var activeCEBuff = multiFilter(ceBuffList, {
		chance: useStrict,
		afterDefeat: includeAfterDefeat
	});
	$(activeCEBuff).each(function() {
		switch (this.effect) {
			default:
				break;
		}
	});
}*/

// Update prerequisite teammate skill buffs
function updateTeammateSkillPreReq(section) {
	var teammate = $(section).attr("id");
	var skillset = window[teammate + "SkillSet"];
	var buffList = window[teammate + "SkillBuffList"];
	$(skillset).each(function() {
		var checkRU = $(section).find(".teammate-" + this + "-rankup").is(":checked");
		var activeSkillBuff = multiFilter(buffList, {
			no: [this.toString()],
			skillRU: [checkRU],
			chance: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeSkillBuff).each(function() {
			switch (this.effect) {
				case "alignment1":
					tempAlignment1.push(this.corrDetail[0]);
					break;
				case "alignment2":
					tempAlignment2.push(this.corrDetail[0]);
					break;
				case "trait":
					tempTrait.push(this.corrDetail[0]);
					break;
				case "enemytrait":
					tempEnemyTrait.push(this.corrDetail[0]);
					break;
				default:
					break;
			}
		});
	});
}

// Update prerequisite teammate NP buffs
function updateTeammateNPPreReq(section) {
	var teammate = $(section).attr("id");
	var checkRU = $(section).find(".teammate-np-rankup").is(":checked");
	var buffList = window[teammate + "NPBuffList"];
	var activeNPBuff = multiFilter(buffList, {
		npRU: [checkRU],
		chance: useStrict
	});
	$(activeNPBuff).each(function() {
		switch (this.effect) {
			case "alignment1":
				tempAlignment1.push(this.corrDetail[0]);
				break;
			case "alignment2":
				tempAlignment2.push(this.corrDetail[0]);
				break;
			case "trait":
				tempTrait.push(this.corrDetail[0]);
				break;
			case "enemytrait":
				tempEnemyTrait.push(this.corrDetail[0]);
				break;
			default:
				break;
		}
	});
}

// Update prerequisite teammate CE buffs
/*function updateTeammateCEPreReq(section) {
	var teammate = $(section).attr("id");
	var buffList = window[teammate + "CEBuffList"];
	var activeCEBuff = multiFilter(buffList, {
		chance: useStrict,
		afterDefeat: includeAfterDefeat
	});
	$(activeCEBuff).each(function() {
		switch (this.effect) {
			default:
				break;
		}
	});
}*/

// Update servant skill buffs
function updateSkillBuff() {
	$(skillSet).each(function() {
		var lv = $("#" + this + "-lv").val();
		var checkRU = $("#check-" + this + "-rankup").is(":checked");
		var activeSkillBuff = multiFilter(skillBuffList, {
			no: [this.toString()],
			skillRU: [checkRU],
			chance: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeSkillBuff).each(function() {		// Check if buff is effective under particular battlefield type
			var test = true;
			if (this.selective == true) {
				switch (this.lookUp) {
					case "env":
						if (!battlefield.some(function(env) {
							return buff.corrDetail.includes(env) === true;
						})) {
							test = false;		 // Ignore buff if criteria is not met
						}
						break;
					default:
						break;
				}
			}
			if (test = true) {
				switch (this.effect) {
					case "dmg":			// ATK buffs
						var value = Number($("#atk-buff").val());
						value += this[lv];
						$("#atk-buff").val(value);
						break;
					case "adddmg":			// Additional damage buffs
						var value = Number($("#add-atk").val());
						value += this[lv];
						$("#add-atk").val(value);
						break;
					case "npdmg":			// NP damage buffs
						var value = Number($("#np-buff").val());
						value += this[lv];
						$("#np-buff").val(value);
						break;
					case "buster":			// Buster buffs
						var value = Number($("#Buster-buff").val());
						value += this[lv];
						$("#Buster-buff").val(value);
						break;
					case "arts":			// Arts buffs
						var value = Number($("#Arts-buff").val());
						value += this[lv];
						$("#Arts-buff").val(value);
						break;
					case "quick":			// Quick buffs
						var value = Number($("#Quick-buff").val());
						value += this[lv];
						$("#Quick-buff").val(value);
						break;
					case "def":			// Enemy defence debuff
					case "accdef":
						updateDefDebuff(this, 'enemy1', lv);
						if (this.range == "all-enemy") {	// Apply debuff to enemy 2 & 3 if effective range permits
							updateDefDebuff(this, 'enemy2', lv);
							updateDefDebuff(this, 'enemy3', lv);
						}
						break;
					case "skilled":			// Extra damage
						updateSkillED(this, 'enemy1', lv);
						updateSkillED(this, 'enemy2', lv);
						updateSkillED(this, 'enemy3', lv);
						break;
					case "hpdmg":			// ATK buffs that correlate with HP value (Passionlips)
						var hp = Number($("#current-servant-hp").val());
						if (hp <= 50 && hp > 0) {		// Activate if HP below 50%
							var value = Number($("#atk-buff").val());
							var lower = this[lv];
							var total = (50 - hp) * 4 / 10 + lower;
							value += Number(total.toFixed(1));
							$("#atk-buff").val(value);
						}
						break;
					default:
						break;
				}
			}
		});
	});
}

// Update defence debuff per enemy
function updateDefDebuff(buff, enemy, lv) {
	var field = $("#" + enemy + "-buff").find(".def-debuff");
	var value = Number($(field).val());
	value += buff[lv];
	$(field).val(value);
}

// Update extra damage buff by skills
function updateSkillED(buff, enemy, lv) {
	var test = false;
	switch (buff.lookUp) {			// Check if criteria is met
		case "class":			// Class-specific
			if (buff.corrDetail.some(function(classes) {
				return classes == $("#" + enemy + "-class").attr("title");
			})) {
				test = true;
			}
			break;
		case "gender":			// Gender-specific
			if (buff.corrDetail.some(function(gender) {
				return gender == $("#" + enemy + "-gender").html();
			})) {
				test = true;
			}
			break;
		case "alignment1":		// Alignment-specific
			if (buff.corrDetail[0] == $("#" + enemy + "-alignment1").html()) {
				test = true;
			}
			break;
		case "alignment2":
			if (buff.corrDetail[0] == $("#" + enemy + "-alignment2").html()) {
				test = true;
			}
			break;
		case "trait":			// Trait-specific
			var traitList = window[enemy + "Trait"]
			if (traitList.some(function(trait) {		// Check enemy default traits
				return buff.corrDetail.includes(trait) === true;
			})) {
				test = true;
			} else if (tempEnemyTrait.some(function(trait) {		// Check temporary traits given by other buffs
				return buff.corrDetail.includes(trait) === true;
			})) {
				test = true;
			}
			break;
		case "debuff":			// Debuff-specific (Robin Hood)
			var debuffList = window[enemy + "Debuff"]
			if (debuffList.some(function(debuff) {
				return debuff == buff.corrDetail[0];
			})) {
				test = true;
			}
			break;
		default:
			break;
	}
	if (test == true) {			// Update buff if criteria is met
		var field = $("#" + enemy + "-buff").find(".skill-ed");
		var value = Number($(field).val());
		value += buff[lv];
		$(field).val(value);
	}
}

// Update NP buffs
function updateNPBuff() {
	var nplv = $("#current-servant-nplv").val();
	var oclv = $("#current-servant-npoc").val();
	var checkRU = $("#current-servant-rankup").is(":checked");
	var activeNPBuff = multiFilter(npBuffList, {
		npRU: [checkRU],
		chance: useStrict
	});
	$(activeNPBuff).each(function() {		// Check if buff correlate with NP lv or oc lv
		if (this.npLV == true) {
			var lv = nplv;
		} else {
			var lv = oclv;
		}
		var test = true;
		if (this.selective == true) {
			switch (this.lookUp) {
				case "skill":		// NP buffs that required prerequisite skills (Ereshkigal, Kingprotea)
					var skill = this.corrDetail[0];
					if (!$("#use-" + skill).is(":checked")) {
						test = false;
					}
					break;
				default:
					break;
			}
		}
		if (test = true) {
			switch (this.effect) {
				case "dmg":
					var value = Number($("#atk-buff").val());
					value += this[lv];
					$("#atk-buff").val(value);
					break;
				case "adddmg":
					var value = Number($("#add-atk").val());
					value += this[lv];
					$("#add-atk").val(value);
					break;
				case "npdmg":
					var value = Number($("#np-buff").val());
					value += this[lv];
					$("#np-buff").val(value);
					break;
				case "buster":
					var value = Number($("#Buster-buff").val());
					value += this[lv];
					$("#Buster-buff").val(value);
					break;
				case "arts":
					var value = Number($("#Arts-buff").val());
					value += this[lv];
					$("#Arts-buff").val(value);
					break;
				case "quick":
					var value = Number($("#Quick-buff").val());
					value += this[lv];
					$("#Quick-buff").val(value);
					break;
				case "def":
				case "accdef":
					updateNPDefDebuff(this, 'enemy1', lv);
					if (this.range == "all-enemy") {
						updateNPDefDebuff(this, 'enemy2', lv);
						updateNPDefDebuff(this, 'enemy3', lv);
					}
					break;
				case "nped":
				case "skilled":
					updateNPED(this, 'enemy1', lv, this.effect);
					updateNPED(this, 'enemy2', lv, this.effect);
					updateNPED(this, 'enemy3', lv, this.effect);
					break;
				default:
					break;
			}
		}
	});
}

// Update defense debuff by NP per enemy
function updateNPDefDebuff(buff, enemy, lv) {
	var field = $("#" + enemy + "-buff").find(".def-debuff");
	var value = Number($(field).val());
	value += buff[lv];
	$(field).val(value);
}

// Update ED buffs by NP
function updateNPED(buff, enemy, lv, category) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			test =  ( buff.corrDetail[0] == $("#" + enemy + "-class").attr("title") );
			break;
		case "gender":
			test =  buff.corrDetail.some(function(gender) {
				return gender == $("#" + enemy + "-gender").html();
			});
			break;
		case "alignment1":
			test =  ( buff.corrDetail[0] == $("#" + enemy + "-alignment1").html() );
			break;
		case "alignment2":
			test = ( buff.corrDetail[0] == $("#" + enemy + "-alignment2").html() );
			break;
		case "trait":
			var traitList = window[enemy + "Trait"]
			if (traitList.some(function(trait) {
				return buff.corrDetail.includes(trait) === true;
			})) {
				test = true;
			} else if (tempEnemyTrait.some(function(trait) {
				return buff.corrDetail.includes(trait) === true;
			})) {
				test = true;
			}
			break;
		case "debuff":
			var debuffList = window[enemy + "Debuff"]
			test = debuffList.some(function(debuff) {
				return debuff == buff.corrDetail[0];
			});
		case "class-trait":				// Compound criteria (Mysterious Heroine X [Alter])
			var testTable = [];
			testTable.push(buff.corrDetail[0] == $("#" + enemy + "-class").attr("title"));
			var traitList = window[enemy + "Trait"];
			if (traitList.some(buff.corrDetail[1])) {
				testTable.push(true);
			} else {
				testTable.push(false);
			}
			test = testTable.every(function(value) {
				return value === true;
			});
			break;
		default:
			break;
	}
	if (test == true && category == "nped") {				// Standard NP ED given as NP buff
		var field = $("#" + enemy + "-buff").find(".np-ed");
		var value = Number($(field).val());
		value += buff[lv];
		$(field).val(value);
	} else if (test == true && category == "skilled") {		// Skill ED given by NP buff (Beni-enma)
		var field = $("#" + enemy + "-buff").find(".skill-ed");
		var value = Number($(field).val());
		value += buff[lv];
		$(field).val(value);
	}
}

// Update CE buffs
function updateCEBuff() {
	var test = true;
	if (ceInfo[0].type == "羈絆禮裝") {			// Check if CE is a max bond CE
		if (ceInfo[0].corrSerID != servantInfo[0].id) {
			test = false;
		}
	}
	if (test == true) {
		var checkRU = $("#servant-ce-max").is(":checked");
		var lv;
		if (checkRU == true) {
			lv = "max";
		} else {
			lv = "default";
		}
		var activeCEBuff = multiFilter(ceBuffList, {
			chance: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeCEBuff).each(function() {
			switch (this.effect) {
				case "dmg":
					var value = Number($("#atk-buff").val());
					value += this[lv];
					$("#atk-buff").val(value);
					break;
				case "adddmg":
					var value = Number($("#add-atk").val());
					value += this[lv];
					$("#add-atk").val(value);
					break;
				case "npdmg":
					var value = Number($("#np-buff").val());
					value += this[lv];
					$("#np-buff").val(value);
					break;
				case "buster":
					var value = Number($("#Buster-buff").val());
					value += this[lv];
					$("#Buster-buff").val(value);
					break;
				case "arts":
					var value = Number($("#Arts-buff").val());
					value += this[lv];
					$("#Arts-buff").val(value);
					break;
				case "quick":
					var value = Number($("#Quick-buff").val());
					value += this[lv];
					$("#Quick-buff").val(value);
					break;
				case "def":
					updateCEDefDebuff(this, 'enemy1', lv);
					if (this.range == "all-enemy") {
						updateCEDefDebuff(this, 'enemy2', lv);
						updateCEDefDebuff(this, 'enemy3', lv);
					}
					break;
				case "skilled":
					updateCEED(this, 'enemy1', lv);
					updateCEED(this, 'enemy2', lv);
					updateCEED(this, 'enemy3', lv);
					break;
				default:
					break;
			}
		});
	}
}

// Update defense debuff by CE per enemy
function updateCEDefDebuff(buff, enemy, lv) {
	var field = $("#" + enemy + "-buff").find(".def-debuff");
	var value = Number($(field).val());
	value += buff[lv];
	$(field).val(value);
}

// Update ED buffs by NP
function updateCEED(buff, enemy, lv) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			test = ( buff.corrDetail[0] == $("#" + enemy + "-class").attr("title") );
			break;
		case "gender":
			test = ( buff.corrDetail[0] == $("#" + enemy + "-gender").html() );
		case "alignment1":
			test = ( buff.corrDetail[0] == $("#" + enemy + "-alignment1").html() );
			break;
		case "alignment2":
			test = ( buff.corrDetail[0] == $("#" + enemy + "-alignment2").html() );
			break;
		case "trait":
			var traitList = window[enemy + "Trait"]
			if (traitList.some(function(trait) {
				return trait == buff.corrDetail[0];
			})) {
				test = true;
			} else if (tempEnemyTrait.some(function(trait) {
				return trait == buff.corrDetail[0];
			})) {
				test = true;
			}
			break;
		case "debuff":
			var debuffList = window[enemy + "Debuff"]
			test = debuffList.some(function(debuff) {
				return debuff == buff.corrDetail[0];
			});
			break;
		default:
			break;
	}
	if (test == true) {
		var field = $("#" + enemy + "-buff").find(".skill-ed");
		var value = Number($(field).val());
		value += buff[lv];
		$(field).val(value);
	}
}

// Update mystic code buffs
function updateMasterBuff() {
	var lv = $("#master-lv").val();
	$(masterSkillSet).each(function() {
		var activeBuff = masterBuffList.filter(function(buff) {
			return buff.no == this;
		});
		$(activeBuff).each(function() {
			switch (this.effect) {
				case "dmg":
					var value = Number($("#atk-buff").val());
					value += this[lv];
					$("#atk-buff").val(value);
					break;
				case "adddmg":
					var value = Number($("#add-atk").val());
					value += this[lv];
					$("#add-atk").val(value);
					break;
				case "npdmg":
					var value = Number($("#np-buff").val());
					value += this[lv];
					$("#np-buff").val(value);
					break;
				case "buster":
					var value = Number($("#Buster-buff").val());
					value += this[lv];
					$("#Buster-buff").val(value);
					break;
				case "arts":
					var value = Number($("#Arts-buff").val());
					value += this[lv];
					$("#Arts-buff").val(value);
					break;
				case "quick":
					var value = Number($("#Quick-buff").val());
					value += this[lv];
					$("#Quick-buff").val(value);
					break;
				default:
					break;
			}
		});
	});
}

// Update teammate skill buffs
function updateTeammateSkillBuff(section) {
	var teammate = $(section).attr("id");
	var skillset = window[teammate + "SkillSet"];
	var buffList = window[teammate + "SkillBuffList"];
	$(skillset).each(function() {
		var lv = $(section).find(".teammate-" + this + "-lv").val();
		var checkRU = $(section).find(".teammate-" + this + "-rankup").is(":checked");
		var activeSkillBuff = multiFilter(buffList, {
			no: [this.toString()],
			skillRU: [checkRU],
			chance: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeSkillBuff).each(function() {
			var test = true;
			if (this.selective == true) {			// Check if buff is selective
				switch (this.lookUp) {
					case "class":			// Class-specific buff
						test = ( servantInfo[0].classes == this.corrDetail[0] );
						break;
					case "gender":			// Gender-specific buff
						test = this.corrDetail.some(function(gender) {
							return gender == servantInfo[0].gender;
						});
						break;
					case "alignment1":		// Alignment-specific buff
						if (servantInfo[0].alignment1 != this.corrDetail[0]) {
							test = tempAlignment1.some(function(value) {	// Check temporary alignment
								return value == this.corrDetail[0];
							});
						}
						break;
					case "alignment2":
						if (servantInfo[0].alignment2 != this.corrDetail[0]) {
							test = tempAlignment2.some(function(value) {
								return value == this.corrDetail[0];
							});
						}
						break;
					case "trait":		// Trait-specific buff
						if (!servantInfo[0].trait.some(function(value) {
						    	return value == this.corrDetail[0];
						})) {
							test = tempTrait.some(function(value) {		// Check temporary traits
								return value == this.corrDetail[0];
							});
						}
						break;
				}
			}
			if (test = true) {
				switch (this.effect) {
					case "dmg":
						var value = Number($("#atk-buff").val());
						value += this[lv];
						$("#atk-buff").val(value);
						break;
					case "adddmg":
						var value = Number($("#add-atk").val());
						value += this[lv];
						$("#add-atk").val(value);
						break;
					case "npdmg":
						var value = Number($("#np-buff").val());
						value += this[lv];
						$("#np-buff").val(value);
						break;
					case "buster":
						var value = Number($("#Buster-buff").val());
						value += this[lv];
						$("#Buster-buff").val(value);
						break;
					case "arts":
						var value = Number($("#Arts-buff").val());
						value += this[lv];
						$("#Arts-buff").val(value);
						break;
					case "quick":
						var value = Number($("#Quick-buff").val());
						value += this[lv];
						$("#Quick-buff").val(value);
						break;
					case "def":
					case "accdef":
						updateDefDebuff(this, 'enemy1', lv);
						if (this.range == "all-enemy") {
							updateDefDebuff(this, 'enemy2', lv);
							updateDefDebuff(this, 'enemy3', lv);
						}
						break;
					case "skilled":
						updateSkillED(this, 'enemy1', lv);
						updateSkillED(this, 'enemy2', lv);
						updateSkillED(this, 'enemy3', lv);
						break;
					default:
						break;
				}
			}
		});
	});
}

// Update teammate NP buffs
function updateTeammateNPBuff(section) {
	var teammate = $(section).attr("id");
	var nplv = $(section).find(".teammate-nplv").val();
	var oclv = $(section).find(".teammate-npoc").val();
	var checkRU = $(section).find(".teammate-np-rankup").is(":checked");
	var buffList = window[teammate + "NPBuffList"];
	var activeNPBuff = multiFilter(buffList, {
		npRU: [checkRU],
		chance: useStrict
	});
	$(activeNPBuff).each(function() {
		if (this.npLV == true) {
			var lv = nplv;
		} else {
			var lv = oclv;
		}
		var test = true;
		if (this.selective == true) {
			switch (this.lookUp) {
				case "skill":			// NP buffs that required prerequisite skills (Ereshkigal)
					var skill = this.corrDetail[0];
					test = $("#use-" + skill).is(":checked");
					break;
				default:
					break;
			}
		}
		if (test = true) {
			switch (this.effect) {
				case "dmg":
					var value = Number($("#atk-buff").val());
					value += this[lv];
					$("#atk-buff").val(value);
					break;
				case "adddmg":
					var value = Number($("#add-atk").val());
					value += this[lv];
					$("#add-atk").val(value);
					break;
				case "npdmg":
					var value = Number($("#np-buff").val());
					value += this[lv];
					$("#np-buff").val(value);
					break;
				case "buster":
					var value = Number($("#Buster-buff").val());
					value += this[lv];
					$("#Buster-buff").val(value);
					break;
				case "arts":
					var value = Number($("#Arts-buff").val());
					value += this[lv];
					$("#Arts-buff").val(value);
					break;
				case "quick":
					var value = Number($("#Quick-buff").val());
					value += this[lv];
					$("#Quick-buff").val(value);
					break;
				case "def":
				case "accdef":
					updateNPDefDebuff(this, 'enemy1', lv);
					if (this.range == "all-enemy") {
						updateNPDefDebuff(this, 'enemy2', lv);
						updateNPDefDebuff(this, 'enemy3', lv);
					}
					break;
				case "skilled":
					updateNPED(this, 'enemy1', lv);
					updateNPED(this, 'enemy2', lv);
					updateNPED(this, 'enemy3', lv);
					break;
				default:
					break;
			}
		}
	});
}

// Update teammate CE buffs
function updateTeammateCEBuff(section) {
	var teammate = $(section).attr("id");
	var test = true;
	var info = window[teammate + "Info"];
	var essence = window[teammate + "CEInfo"];
	if (essence[0].type == "羈絆禮裝") {
		if (essence[0].corrSerID != info[0].id) {
			test = false;
		}
	}
	if (test = true) {
		var checkRU = $(section).find(".teammate-ce-max").is(":checked");
		var buffList = window[teammate + "CEBuffList"];
		var lv;
		if (checkRU == true) {
			lv = "max";
		} else {
			lv = "default";
		}
		var activeCEBuff = multiFilter(buffList, {
			chance: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeCEBuff).each(function() {
			switch (this.effect) {
				case "dmg":
					var value = Number($("#atk-buff").val());
					value += this[lv];
					$("#atk-buff").val(value);
					break;
				case "adddmg":
					var value = Number($("#add-atk").val());
					value += this[lv];
					$("#add-atk").val(value);
					break;
				case "npdmg":
					var value = Number($("#np-buff").val());
					value += this[lv];
					$("#np-buff").val(value);
					break;
				case "buster":
					var value = Number($("#Buster-buff").val());
					value += this[lv];
					$("#Buster-buff").val(value);
					break;
				case "arts":
					var value = Number($("#Arts-buff").val());
					value += this[lv];
					$("#Arts-buff").val(value);
					break;
				case "quick":
					var value = Number($("#Quick-buff").val());
					value += this[lv];
					$("#Quick-buff").val(value);
					break;
				case "def":
					updateCEDefDebuff(this, 'enemy1', lv);
					if (this.range == "all-enemy") {
						updateCEDefDebuff(this, 'enemy2', lv);
						updateCEDefDebuff(this, 'enemy3', lv);
					}
					break;
				case "skilled":
					updateCEED(this, 'enemy1', lv);
					updateCEED(this, 'enemy2', lv);
					updateCEED(this, 'enemy3', lv);
					break;
				default:
					break;
			}
		});
	}
}

/* Calculation */
var enemy1Result = [], enemy2Result = [], enemy3Result = [];
var queryCount = 0;

$(document).ready(function() {
	// Check if enemy & servant are both set
	$("#calc-calcbtn").click(function() {
		if ($("#enemy1-name").html() != "" && $("#current-servant-name").html() != "未選定從者") {
			calculation();
		} else {
			alert("請先設定敵人及從者！");
		}
	});

	// Clear all results
	$("#calc-result-resetbtn").click(function() {
		$(this).hide();
		clearAllResult();
	});

	// Clear specific table
	$(".table-resetbtn").click(function() {
		var enemy = $(this).attr("data-value");
		window[enemy + "Result"] = [];
		clearResultTable(enemy);
	});
});

// Calculation
function calculation() {
	$("#calc-result-resetbtn").show();

	var enemyList = ["enemy1", "enemy2", "enemy3"];
	queryCount++;		// Update the total number of query in the current session
	$(enemyList).each(function() {
		if ($("#" + this).find(".enemy-name").html() != "") {		// Calculate results on each enemy set
			calcDmg(this);
		}
	});
}

// Calcuation per enemy
function calcDmg(enemy) {
	var servantLv = $("#current-servant-lv").val();
	var atk;
	if (servantLv == "0") {			// Check if default servant lv is in used
		atk = servantInfo[0].atk;
	} else {
		atk = servantAtkList[0][servantLV];
	}
	var atkStatUp = parseInt($("#current-servant-statup").val());
	if (atkStatUp > 2000) {			// Check if ATK stats up exceed 2000
		atkStatUp = 2000
	} else if (atkStatUp < 0) {
		atkStatUp = 0
	}
	var ceAtk = parseInt($("#ce-atk").val());
	if (ceAtk > 2400) {			// Check if CE ATK exceed 2400
		ceAtk = 2400
	} else if (ceAtk < 0) {
		ceAtk = 0
	}
	var totalAtk = atk + atkStatUp + ceAtk;		// Calculate total ATK
	var npLv = $("#current-servant-nplv").val();
	var npMultiplier;
	if ($("#current-servant-rankup").is(":checked")) {		// Acquire NP multiplier
		npMultiplier = servantInfo[0]["np" + npLv + "RU"] / 100;
	} else {
		npMultiplier = servantInfo[0]["np" + npLv] / 100;
	}
	var multLV;
	if (servantNPAddMult.npLV !== undefined) {		// Check if additional NP multiplier correlate with NP lv or oc lv
		if (servantNPAddMult.npLV) {
			multLV = npLv;
		} else {
			multLV = $("#current-servant-npoc").val();
		}
	}
	switch (servantNPAddMult.type) {
		case undefined:			// No additional NP multiplier
			break;
		case "npmult":			// Correlate with oc lv (Arash)
			npMultiplier += servantNPAddMult[multLV];
			break;
		case "hpmult":			// Correlate with HP value (Anne&Mary, Hijikata)
			var hp = Number($("#current-servant-hp").val());
			if (hp < 0) {		// Check the validity of HP value
				hp = Math.abs(hp);
			} else if (hp > 100) {
				hp = 100;
			}
			var addMult = servantNPAddMult[multLV] * [ 1 - ( hp / 100 ) ];
			npMultiplier += addMult;
			break;
	}
	var npColor = servantInfo[0].npColor;
	var cardMultiplier;
	switch (npColor) {		// Acquire card color multiplier
		case "Buster":
			cardMultiplier = 1.5;
			break;
		case "Arts":
			cardMultiplier = 1;
			break;
		case "Quick":
			cardMultiplier = 0.8;
			break;
		default:
			break;
	}
	var cardBuff = parseFloat($("#" + npColor + "-buff").val()) / 100;	// Acquire card buff that correspond with NP color
	var classMultiplier = servantMult[0].multiplier;		// Acquire class multiplier
	var enemyClass = $("#" + enemy + "-class").attr("title");
	var affMultiplier;
	if (tempAffinity[0] !== undefined) {			// Acquire affinity relationship, check if temporary affinity is in effect
		affMultiplier = tempAffinity[0][enemyClass];
	} else {
		affMultiplier = servantAffList[0][enemyClass];
	}
	var advantage;			// Display advantage visually
	if (affMultiplier > 1) {
		advantage = "weak";
	} else if (affMultiplier < 1) {
		advantage = "resist";
	}
	var enemyAttr = $("#" + enemy + "-attribute").html();
	var attrAffMultiplier = servantAttrAffList[0][enemyAttr];		// Acquire attribute affinity relationship
	var atkBuff = parseFloat($("#atk-buff").val()) / 100;
	var defDebuff = parseFloat($("#" + enemy + "-buff").find(".def-debuff").val()) / 100;
	var npDmgBuff = [ parseFloat($("#np-buff").val()) + parseFloat($("#event-buff").val()) +
		parseFloat($("#" + enemy + "-buff").find(".skill-ed").val()) ] / 100;
	var npEDBuff = parseFloat($("#" + enemy + "-buff").find(".np-ed").val()) / 100;
	if (npEDBuff < 1) {
		npEDBuff = 1;
	}
	var addDmg = parseInt($("#add-atk").val());
	var redDmg = parseInt($("#" + enemy + "-buff").find(".red-atk").val());

	// Generate output
	var minOutput = totalAtk * 0.23 * [ npMultiplier * cardMultiplier * ( 1 + cardBuff ) ] * classMultiplier * affMultiplier *
		attrAffMultiplier * ( 1 + atkBuff + defDebuff ) * ( 1 + npDmgBuff) * npEDBuff * 0.9 + ( addDmg - redDmg );
	minOutput = Number(minOutput.toFixed(0));
	var avgOutput = totalAtk * 0.23 * [ npMultiplier * cardMultiplier * ( 1 + cardBuff ) ] * classMultiplier * affMultiplier *
		attrAffMultiplier * ( 1 + atkBuff + defDebuff ) * ( 1 + npDmgBuff) * npEDBuff + ( addDmg - redDmg );
	avgOutput = Number(avgOutput.toFixed(0));
	var maxOutput = totalAtk * 0.23 * [ npMultiplier * cardMultiplier * ( 1 + cardBuff ) ] * classMultiplier * affMultiplier *
		attrAffMultiplier * ( 1 + atkBuff + defDebuff ) * ( 1 + npDmgBuff) * npEDBuff * 1.1 + ( addDmg - redDmg );
	maxOutput = Number(maxOutput.toFixed(0));

	// Write output into array
	var output = {
		query: queryCount,
		name: servantInfo[0].name,
		color: npColor,
		classes: servantInfo[0].classes,
		lv: $("#current-servant-lv").find("option:selected").html(),
		atk: totalAtk,
		np: npLv,
		npmult: npMultiplier * 100,
		oc: $("#current-servant-npoc").find("option:selected").html(),
		nped: npEDBuff * 100,
		npbuff: npDmgBuff * 100,
		cardbuff: cardBuff * 100,
		atkbuff: atkBuff * 100,
		defdebuff: defDebuff * 100,
		min: minOutput,
		avg: avgOutput,
		max: maxOutput,
		adv: advantage
	};
	window[enemy + "Result"].push(output);
	generateResultTable(enemy);
	$("#calc-result-resetbtn").show();

	$("#buff-info").find(".label").each(function() {
		labelHighlight(this);
	});
}

// Clear all results
function clearAllResult() {
	var enemyList = ["enemy1", "enemy2", "enemy3"];
	$(enemyList).each(function() {
		var table = $("#" + this + "-table");
		$(table).parents(".result").hide();
		$(table).find(".result-row").each(function() {
			$(this).remove();
		});
		$("#" + this + "-result-title").html("");
		window[enemy + "Result"] = [];
	});
	queryCount = 0;			// Reset query count of the session
	$("#calc-result-resetbtn").hide();
}

// Clear specific result table
function clearResultTable(enemy) {
	var table = $("#" + enemy + "-table");
	$(table).parents(".result").hide();
	$(table).find(".result-row").each(function() {
		$(this).remove();
	});
	$("#" + enemy + "-result-title").html("");

	if ($("#enemy1-result").css("display") == "none" && $("#enemy2-result").css("display") == "none" &&
	    $("#enemy3-result").css("display") == "none") {
		$("#calc-result-resetbtn").click();
	}
}

// Generate result table
function generateResultTable(enemy) {
	var table = document.getElementById(enemy + "-table");
	clearResultTable(enemy);		// Clear any existing table
	$(table).parents(".result").show();
	$("#" + enemy + "-result-title").html($("#" + enemy + "-detail").find(".enemy-name").html());	// Write enemy name
	sortDescend(window[enemy + "Result"], "avg");		// Rearrange results by damage output
	var i = 0;
	window[enemy + "Result"].forEach(function(result) {
		i++;
		var row = table.insertRow(-1);
		$(row).addClass("result-row");
		$(row).addClass("result-row-" + result.query);
		row.insertCell(-1).innerHTML = i;
		row.insertCell(-1).innerHTML = "<span class='" + result.color + "'>" + result.name + "</span>";
		row.insertCell(-1).innerHTML = "<img class='class-logo' src='images/class/" + result.classes + ".webp' />";
		row.insertCell(-1).innerHTML = result.lv;
		row.insertCell(-1).innerHTML = result.atk;
		row.insertCell(-1).innerHTML = result.np;
		row.insertCell(-1).innerHTML = result.npmult;
		row.insertCell(-1).innerHTML = result.oc;
		row.insertCell(-1).innerHTML = result.nped;
		row.insertCell(-1).innerHTML = result.npbuff;
		row.insertCell(-1).innerHTML = result.cardbuff;
		row.insertCell(-1).innerHTML = result.atkbuff;
		row.insertCell(-1).innerHTML = result.defdebuff;
		row.insertCell(-1).innerHTML = "<span class='" + result.adv + "'>" + result.min + "</span>";
		row.insertCell(-1).innerHTML = "<span class='" + result.adv + "'>" + result.avg + "</span>";
		row.insertCell(-1).innerHTML = "<span class='" + result.adv + "'>" + result.max + "</span>";
		row.insertCell(-1).innerHTML = "<a class='result-delbtn' data-query='" + result.query + "'>&times;</a>";
	});
	deleteQueryBind();		// Attach event handers
}

// Attach event handlers to the delete button at each row
function deleteQueryBind() {
	$(".result-delbtn").ready(function() {
		$(".result-delbtn").click(function() {
			var table = $(this).parents(".enemy-table");
			var query = $(this).attr("data-query");
			deleteQuery(table, query);
		});
	});
}

// Delete specific row
function deleteQuery(table, query) {
	var enemy = $(table).attr("data-value");
	var row = $(table).find(".result-row-" + query);
	$(row).remove();
	var newList = window[enemy + "Result"];
	var position = newList.indexOf(function(result) {
		return result.query == query;
	});
	newList.splice(position, 1);
	window[enemy + "Result"] = newList;

	// Check if the table is empty after row removal, hide the table if true
	if (newList[0] === undefined) {
		$(".table-resetbtn[data-value='" + enemy + "']").click();
	}
}
