var affinity = parent.affinity;
var multiplier = parent.multiplier;
var attrAffinity = parent.attrAffinity;

var common = parent.common;
var servants = parent.servants;
var ce = parent.ce;
var master = parent.master;
var events = parent.events;

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
var customBuff = parent.customBuff;
var favouritePage = parent.favouritePage;

var modalCaller = "";

/* Layout */
$(document).ready(function() {
	updateCounter();

	checkFavourite();
	$(".favouritebtn").click(function() {
		var url = $(this).attr("data-src");
		setFavourite(url);
	});

	common = parent.common;
	servants = parent.servants;
	skillBuff = parent.skillBuff;
	npBuff = parent.npBuff;
	servantAtk = parent.servantAtk;
	events = parent.events;
});

// Update page height
$(document).on("click", function() {
	updateCounter();
});

function updateCounter() {
	var height = $("#rank-enemy-info").outerHeight() + $("#rank-environment-info").outerHeight() +
	$("#rank-servant-info").outerHeight() + 1500;
	$("#calc-counter").html(height);
}

/* Enemy Setup */
var enemyGender = [], enemyAlignment1 = [], enemyAlignment2 = [], enemyTrait = [], enemyDebuff = [];

$(document).ready(function() {
	// Open modals
	$("#rank-common-enemy-modalbtn").click(function() {
		openModal("#common-enemy-modal");
		loadCommonEnemyImg();
	});
	$("#rank-servant-enemy-modalbtn").click(function() {
		openModal("#servant-enemy-modal");
		loadServantEnemyImg();
	});
	$("#rank-enemy-resetbtn").click(function() {
		resetEnemy();
	});

	$("#rank-enemy-class").change(function() {
		if ($(this).val() == "Custom") {
			$("#rank-enemy-affinity-setup").show();
		} else {
			$("#rank-enemy-affinity-setup").val(1);
			$("#rank-enemy-affinity-setup").hide();
		}
	});

	$("#rank-enemy-attribute").change(function() {
		if ($(this).val() == "Custom") {
			$("#rank-enemy-attrAffinity-setup").show();
		} else {
			$("#rank-enemy-attrAffinity-setup").val(1);
			$("#rank-enemy-attrAffinity-setup").hide();
		}
	});

	$(".rank-enemy-gender").change(function() {
		updateGender();
	});
	$("#rank-enemy-gender-setbtn").click(function() {
		$(".rank-enemy-gender").prop("checked", true);
		updateGender();
	});
	$("#rank-enemy-gender-resetbtn").click(function() {
		$(".rank-enemy-gender").prop("checked", false);
		updateGender();
	});

	$(".rank-enemy-alignment1").change(function() {
		updateAlignment1();
	});
	$("#rank-enemy-alignment1-setbtn").click(function() {
		$(".rank-enemy-alignment1").prop("checked", true);
		updateAlignment1();
	});
	$("#rank-enemy-alignment1-resetbtn").click(function() {
		$(".rank-enemy-alignment1").prop("checked", false);
		updateAlignment1();
	});

	$(".rank-enemy-alignment2").change(function() {
		updateAlignment2();
	});
	$("#rank-enemy-alignment2-setbtn").click(function() {
		$(".rank-enemy-alignment2").prop("checked", true);
		updateAlignment2();
	});
	$("#rank-enemy-alignment2-resetbtn").click(function() {
		$(".rank-enemy-alignment2").prop("checked", false);
		updateAlignment2();
	});

	$(".rank-enemy-trait").change(function() {
		updateTrait();
	});
	$("#rank-enemy-trait-setbtn").click(function() {
		$(".rank-enemy-trait").prop("checked", true);
		updateTrait();
	});
	$("#rank-enemy-trait-resetbtn").click(function() {
		$(".rank-enemy-trait").prop("checked", false);
		updateTrait();
	});

	$(".rank-enemy-debuff").change(function() {
		updateDebuff();
	});
	$("#rank-enemy-debuff-setbtn").click(function() {
		$(".rank-enemy-debuff").prop("checked", true);
		updateDebuff();
	});
	$("#rank-enemy-debuff-resetbtn").click(function() {
		$(".rank-enemy-debuff").prop("checked", false);
		updateDebuff();
	});
});

// Retrieve selected enemy's info
function pickEnemy(type, enemyID) {
	closeModal();

	// Determine if the enemy is servant or not
	switch (type) {
		case 1:
			rankEnemyInfo = servants.filter(function(obj) {
				return obj.id == enemyID;
			});
			break;
		case 2:
			rankEnemyInfo = common.filter(function(obj) {
				return obj.name == enemyID;
			});
			break;
		default:
			break;
	}

	$("#rank-enemy-img").attr("src", rankEnemyInfo[0].imgID);
	$("#rank-enemy-name").html(rankEnemyInfo[0].name);

	// Set class to 'Saber' if it's a non-servant enemy without pre-designated class
	if (rankEnemyInfo[0].classes !== "All") {
		$("#rank-enemy-class").val(rankEnemyInfo[0].classes);
	} else {
		$("#rank-enemy-class").val("Saber");
	}

	$("#rank-enemy-attribute").val(rankEnemyInfo[0].attribute);

	$("#rank-enemy-gender-resetbtn").click();
	$("input.rank-enemy-gender[value=" + rankEnemyInfo[0].gender + "]").prop("checked", true)
	updateGender();

	$("#rank-enemy-alignment1-resetbtn").click();
	$("input.rank-enemy-alignment1[value=" + rankEnemyInfo[0].alignment1 + "]").prop("checked", true)
	updateAlignment1();

	$("#rank-enemy-alignment2-resetbtn").click();
	$("input.rank-enemy-alignment2[value=" + rankEnemyInfo[0].alignment2 + "]").prop("checked", true)
	updateAlignment2();

	// Loop through the trait list and check all corresponding traits
	$(".rank-enemy-trait").prop("checked", false);
	$(rankEnemyInfo[0].trait).each(function(index, value) {
		$("input.rank-enemy-trait[value=" + value + "]").prop("checked", true)
	});
	updateTrait();
}

function resetEnemy() {
	$("#rank-enemy-img").attr("src", "images/bg_logo.webp");
	$("#rank-enemy-name").html("未選定/自訂敵人");
	$("#rank-enemy-class").val("Saber");
	$("#rank-enemy-attribute").val("天");
	$("#rank-enemy-gender-resetbtn").click();
	$("#rank-enemy-alignment1-resetbtn").click();
	$("#rank-enemy-alignment2-resetbtn").click();
	$("#rank-enemy-trait-resetbtn").click();
	$("#rank-enemy-debuff-resetbtn").click();
}

function updateGender() {
	enemyGender = [];
	$(".rank-enemy-gender:checked").each(function() {
		enemyGender.push($(this).val())
	});
	if (enemyGender[0] !== undefined) {
		$("#rank-enemy-gender-label").addClass("highlight")
	} else {
		$("#rank-enemy-gender-label").removeClass("highlight")
	}
}

function updateAlignment1() {
	enemyAlignment1 = [];
	$(".rank-enemy-alignment1:checked").each(function() {
		enemyAlignment1.push($(this).val())
	});
	if (enemyAlignment1[0] !== undefined) {
		$("#rank-enemy-alignment1-label").addClass("highlight")
	} else {
		$("#rank-enemy-alignment1-label").removeClass("highlight")
	}
}

function updateAlignment2() {
	enemyAlignment2 = [];
	$(".rank-enemy-alignment2:checked").each(function() {
		enemyAlignment2.push($(this).val())
	});
	if (enemyAlignment2[0] !== undefined) {
		$("#rank-enemy-alignment2-label").addClass("highlight")
	} else {
		$("#rank-enemy-alignment2-label").removeClass("highlight")
	}
}

function updateTrait() {
	enemyTrait = [];
	$(".rank-enemy-trait:checked").each(function() {
		enemyTrait.push($(this).val())
	});
	if (enemyTrait[0] !== undefined) {
		$("#rank-enemy-trait-label").addClass("highlight")
	} else {
		$("#rank-enemy-trait-label").removeClass("highlight")
	}
}

function updateDebuff() {
	enemyDebuff = [];
	$(".rank-enemy-debuff:checked").each(function() {
		enemyDebuff.push($(this).val())
	});
	if (enemyDebuff[0] !== undefined) {
		$("#rank-enemy-debuff-label").addClass("highlight")
	} else {
		$("#rank-enemy-debuff-label").removeClass("highlight")
	}
}

/* Battelfield Setup */
var battlefield = [];

$(document).ready(function() {
	$(".rank-battlefield-type").change(function() {
		updateBattlefield();
	});
	$("#rank-battlefield-setbtn").click(function() {
		$(".rank-battlefield-type").prop("checked", true);
		updateBattlefield();
	});
	$("#rank-battlefield-resetbtn").click(function() {
		$(".rank-battlefield-type").prop("checked", false);
		updateBattlefield();
	});

});

function updateBattlefield() {
	battlefield = [];
	$(".rank-battlefield-type:checked").each(function() {
		battlefield.push($(this).val())
	});
	if (battlefield[0] !== undefined) {
		$("#rank-battelfield-setup-label").addClass("highlight")
	} else {
		$("#rank-battelfield-setup-label").removeClass("highlight")
	}
}

/* Servant Setup */
var useStrict = [true, false];
var activeColor = "Common";
var buffListCommon = [0, 0, 0, 0, 0, 0, 100], buffListBuster = [0, 0, 0, 0, 0, 0, 100],
	buffListArts = [0, 0, 0, 0, 0, 0, 100], buffListQuick = [0, 0, 0, 0, 0, 0, 100];
var ceInfoCommon = [], ceInfoBuster = [], ceInfoArts = [], ceInfoQuick = [];
var ceBuffListCommon = [], ceBuffListBuster = [], ceBuffListArts = [], ceBuffListQuick = [];
var ceSaveCommon = [false, 0], ceSaveBuster = [false, 0], ceSaveArts = [false, 0], ceSaveQuick = [false, 0];
var masterInfoCommon = [], masterInfoBuster = [], masterInfoArts = [], masterInfoQuick = [];
var masterBuffListCommon = [], masterBuffListBuster = [], masterBuffListArts = [], masterBuffListQuick = [];
var masterSaveCommon = 1, masterSaveBuster = 1, masterSaveArts = 1, masterSaveQuick = 1;

$(document).ready(function() {
	$("#rank-use-strict-mode").change(function() {
		if ($(this).is(":checked")) {
			useStrict = [false];
			$("#rank-use-strict-mode-label").addClass("highlight");
		} else {
			useStrict = [true, false];
			$("#rank-use-strict-mode-label").removeClass("highlight");
		}
	});

	generateRankReleaseSelection();
	generateRankProgressSelection();

	$("#rank-use-inventory").change(function() {
		if ($(this).is(":checked")) {
			$("#assign-progress-toggle").hide();
			$("#use-inventory-setup-toggle").show();
			if (!$("#rank-use-saved-data").is(":checked")) {
				$("#rank-use-saved-data").click();
			}
			if (!$("#rank-use-universal-buff").is(":checked")) {
				$("#rank-use-universal-buff").click();
			}
			if (!$("#rank-use-saved-teammate").is(":checked")) {
				$("#rank-use-saved-teammate").click();
			}
			if (!$("#rank-use-saved-ce").is(":checked")) {
				$("#rank-use-saved-ce").click();
			}
			if (!$("#rank-use-saved-master").is(":checked")) {
				$("#rank-use-saved-master").click();
			}
			$("#use-inventory-setup-toggle").siblings(".setup-toggle").hide();
		} else {
			$("#use-inventory-setup-toggle").hide();
			$("#assign-progress-toggle").show();
			$("#use-inventory-setup-toggle").siblings(".setup-toggle").show();
		}
	});

	$("#rank-use-saved-data").change(function() {
		if ($(this).is(":checked")) {
			$("#assign-data-toggle").hide();
			$("#assign-npLV-toggle").hide();
			$("#rank-servant-lv").val(0);
			$("#rank-servant-statup").val(0);
			$("#rank-servant-npoc").val(1);
			$("#rank-servant-hp").val(100);
			$("#assign-npLV-toggle input").val(1);
			$("#rank-use-saved-data-label").addClass("highlight");
		} else {
			$("#assign-data-toggle").show();
			$("#assign-npLV-toggle").show();
			$("#rank-use-saved-data-label").removeClass("highlight");
		}
	});

	$("#rank-use-saved-teammate").change(function() {
		if ($(this).is(":checked")) {
			$("#assign-buff-toggle").hide();
			$("#rank-buff-resetbtn").click();
			$("#rank-use-saved-teammate-label").addClass("highlight");
			if ($("#rank-use-saved-ce").is(":checked") && $("#rank-use-saved-master").is(":checked")) {
				$("#assign-by-color-toggle").hide();
			}
		} else {
			$("#assign-buff-toggle").show();
			$("#rank-use-saved-teammate-label").removeClass("highlight");
			$("#assign-by-color-toggle").show();
		}
	});

	$("#rank-use-saved-ce").change(function() {
		if ($(this).is(":checked")) {
			$("#assign-ce-toggle").hide();
		/*	if ($("#rank-ce-resetbtn").css("display") == "block") {
				$("#rank-ce-resetbtn").click();
			} else {
				resetCE();
			}*/
			$("#rank-use-saved-ce-label").addClass("highlight");
			if ($("#rank-use-saved-teammate").is(":checked") && $("#rank-use-saved-master").is(":checked")) {
				$("#assign-by-color-toggle").hide();
			}
		} else {
			$("#assign-ce-toggle").show();
			$("#rank-use-saved-ce-label").removeClass("highlight");
			$("#assign-by-color-toggle").show();
		}
	});

	$("#rank-use-saved-master").change(function() {
		if ($(this).is(":checked")) {
			$("#assign-master-toggle").hide();
			$("#rank-master-selection").val("不使用魔術禮裝");
			setRankMaster($("#rank-master-selection"));
			$("#rank-use-saved-master-label").addClass("highlight");
			if ($("#rank-use-saved-teammate").is(":checked") && $("#rank-use-saved-ce").is(":checked")) {
				$("#assign-by-color-toggle").hide();
			}
		} else {
			$("#assign-master-toggle").show();
			$("#rank-use-saved-master-label").removeClass("highlight");
			$("#assign-by-color-toggle").show();
		}
	});

	$("#rank-use-universal-buff").change(function() {
		if ($(this).is(":checked")) {
			activeColor = "Common";
			$("#rank-current-color").val("Buster");
			$("#assign-current-color-toggle").hide();
			$("#rank-use-universal-buff-label").addClass("highlight");
			buffListBuster = [0, 0, 0, 0, 0, 0, 100], buffListArts = [0, 0, 0, 0, 0, 0, 100], buffListQuick = [0, 0, 0, 0, 0, 0, 100];
			ceInfoBuster = [], ceInfoArts = [], ceInfoQuick = [];
			ceBuffListBuster = [], ceBuffListArts = [], ceBuffListQuick = [];
			ceSaveBuster = [false, 0], ceSaveArts = [false, 0], ceSaveQuick = [false, 0];
			masterInfoBuster = [], masterInfoArts = [], masterInfoQuick = [];
			masterBuffListBuster = [], masterBuffListArts = [], masterBuffListQuick = [];
			masterSaveBuster = 1, masterSaveArts = 1, masterSaveQuick = 1;
			applyBuffByColor();
		} else {
			activeColor = "Buster";
			$("#assign-current-color-toggle").show();
			$("#rank-use-universal-buff-label").removeClass("highlight");
			buffListBuster = buffListCommon;
			ceInfoBuster = ceInfoCommon;
			ceBuffListBuster = ceBuffListCommon;
			ceSaveBuster = ceSaveCommon;
			masterInfoBuster = masterInfoCommon;
			masterBuffListBuster = masterBuffListCommon;
			masterSaveBuster = masterSaveCommon;
		}
	});

	$("#rank-current-color").change(function() {
		activeColor = $(this).val();
		applyBuffByColor();
	});

	$("#assign-buff-toggle .update-trigger").change(function() {
		updateBuffList();
	});

	$("#assign-ce-toggle .update-trigger").change(function() {
		updateCESave();
	});

	// Buff-related
	$(".supportbtn").click(function() {
		var support = $(this).attr("data-value");
		applySupportBuff(support);
	});

	$("#rank-buff-resetbtn").click(function() {
		$("#assign-buff-toggle .update-trigger").val(0);
		updateBuffList();
	});

	// CE-related
	$("#rank-ce-modalbtn").click(function() {
		openModal("#ce-modal");
		loadCEImg();
	});
	$("#rank-ce-resetbtn").click(function() {
		resetCE();
	});

	// Master-related
	generateRankMasterSelection();

	$("#rank-master-selection").change(function() {
		setRankMaster(this);
	});

	$("#rank-master-lv").change(function() {
		window["masterSave" + activeColor] = Number($(this).val());
	});
});

function generateRankReleaseSelection() {
	var servantList = $(servants).filter(function(servant) {
		return servant.id >= 59;
	});
	$(servantList).each(function(index, value) {
		var select = $("#rank-release-selection");
		var id = value.id;
		var name = value.name;
		var option = {value: id, text: name};
		select.append($('<option>', option));
	});
}

function generateRankProgressSelection() {
	$(events).each(function(index, value) {
		var select = $("#rank-progress-selection");
		var id = value.sequence;
		var name = value.event;
		var option = {value: id, text: name};
		select.append($('<option>', option));
	});
}

// Update Buff list
function updateBuffList() {
	var buffList = [];
	buffList[0] = Number($("#rank-atk-buff").val());
	buffList[1] = Number($("#rank-add-atk").val());
	buffList[2] = Number($("#rank-np-buff").val());
	buffList[3] = Number($("#rank-Buster-buff").val());
	buffList[4] = Number($("#rank-Arts-buff").val());
	buffList[5] = Number($("#rank-Quick-buff").val());
	buffList[6] = 100;
	window["buffList" + activeColor] = buffList;
}

function applySupportBuff(support) {
	var buffList = inventoryTeammateBuff[support];
	$("#assign-buff-toggle .update-trigger").each(function(index) {
		var value = Number($(this).val());
		value += buffList[index];
		$(this).val(value);
	});
	updateBuffList();
}

// Retrieve CE info
function pickCE(essenceID) {
	closeModal();

	$("#rank-ce-resetbtn").show();

	var ceInfo = ce.filter(function(obj) {
		return obj.id == essenceID;
	});

	// Filter useful CE buffs by ID, buff that are effective to oneself & damage related buff
	var ceBuffList = multiFilter(ceBuff, {
		id: [essenceID],
		toSelf: [true],
		effect: ["dmg", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def"]
	});

	window["ceInfo" + activeColor] = ceInfo;
	window["ceBuffList" + activeColor] = ceBuffList;

	$("#rank-ce-img").attr("src", ceInfo[0].imgID);
	$("#rank-ce-name").html(ceInfo[0].name);

	// Check if the CE is max at default
	var defaultMax = ceInfo[0].defaultMax;
	$("#rank-ce-max").prop("disabled", defaultMax);
	$("#rank-ce-lv").prop("disabled", defaultMax);
	$("#rank-ce-max").prop("checked", defaultMax);
	$("#rank-ce-lv").val(0);

	updateCESave();
}

function updateCESave() {
	var ceSave = [];
	var ceInfo = window["ceInfo" + activeColor];
	var maxLV;				// Set maximum lv of CE
	switch (ceInfo.star) {
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
	if (!$("#rank-ce-max").is(":checked")) {		// If CE is not max, set maximum lv as 20
		maxLV = 20;
	}
	if (Number($("#rank-ce-lv").val()) > maxLV) {
		$("#rank-ce-lv").val(maxLV);
	}

	ceSave[0] = $("#rank-ce-max").is(":checked");
	ceSave[1] = Number($("#rank-ce-lv").val());
	window["ceSave" + activeColor] = ceSave;
}

// Remove chosen CE
function resetCE() {
	window["ceInfo" + activeColor] = [];
	window["ceBuffList" + activeColor] = [];
	$("#rank-ce-img").attr("src", "images/bg_logo.webp");
	$("#rank-ce-name").html("未選定禮裝");
	$("#rank-ce-max").prop("checked", false);
	$("#rank-ce-max").prop("disabled", true);
	$("#rank-ce-lv").val(0);
	$("#rank-ce-lv").prop("disabled", true);
	updateCESave();
}

function generateRankMasterSelection() {
	$(master).each(function(index, value) {
		var select = $("#rank-master-selection");
		var name = value.name;
		var option = {value: name, text: name};
		select.append($('<option>', option));
	});
}

function setRankMaster(element) {
	if ($(element).val() == "不使用魔術禮裝") {

		// Clear all arrays
		window["masterInfo" + activeColor] = [];
		window["masterBuffList" + activeColor] = [];
		window["masterSave" + activeColor] = 1;

		$("#rank-master-selection-label").removeClass("highlight");

		// Initialise all fields
		$("#rank-master-lv").val(1);
		$("#rank-master-lv").prop("disabled", true);
	} else {
		$("#rank-master-selection-label").addClass("highlight");

		var name = $(element).val();
		var masterInfo = master.filter(function(obj) {
			return obj.name == name;
		});

		// Filter useful skill buffs by mystic code & dmage related buffs
		var masterBuffList = multiFilter(masterBuff, {
			name: [name],
			effect: ["dmg", "adddmg", "buster", "arts", "quick", "npdmg"]
		});

		window["masterInfo" + activeColor] = masterInfo;
		window["masterBuffList" + activeColor] = masterBuffList;

		$("#rank-master-lv").prop("disabled", false);
	}
}

function applyBuffByColor() {
	var buffList = window["buffList" + activeColor];
	var ceInfo = window["ceInfo" + activeColor];
	var ceSave = window["ceSave" + activeColor];
	var masterInfo = window["masterInfo" + activeColor];
	var masterSave = window["masterSave" + activeColor];

	$("#rank-atk-buff").val(buffList[0]);
	$("#rank-add-atk").val(buffList[1]);
	$("#rank-np-buff").val(buffList[2]);
	$("#rank-Buster-buff").val(buffList[3]);
	$("#rank-Arts-buff").val(buffList[4]);
	$("#rank-Quick-buff").val(buffList[5]);

	if (ceInfo[0] !== undefined) {
		$("#rank-ce-img").attr("src", ceInfo[0].imgID);
		$("#rank-ce-name").html(ceInfo[0].name);
	} else {
		$("#rank-ce-img").attr("src", "images/bg_logo.webp");
		$("#rank-ce-name").html("未選定禮裝");
	}
	$("#rank-ce-max").prop("checked", ceSave[0]);
	$("#rank-ce-lv").val(ceSave[1]);

	if (masterInfo[0] !== undefined) {
		$("#rank-master-selection").val(masterInfo[0].name);
		$("#rank-master-selection-label").addClass("highlight");
	} else {
		$("#rank-master-selection").val("不使用魔術禮裝");
		$("#rank-master-selection-label").removeClass("highlight");
	}
	$("#rank-master-lv").val(masterSave);
}

/* Result Section */
var universalBuffCommon = [0, 0, 0, 0, 0, 0, 100], universalBuffBuster = [0, 0, 0, 0, 0, 0, 100],
	universalBuffArts = [0, 0, 0, 0, 0, 0, 100], universalBuffQuick = [0, 0, 0, 0, 0, 0, 100],
	universalBuffTemp = [0, 0, 0, 0, 0, 0, 100];
var currentServantInfo = [], currentServantSave = [], currentSkillBuffList = [],
	currentNPBuffList = [], currentTempAffinity = [], currentNPAddMult = [];
var currentNPLV = 1, currentOCLV = 1, currentNPRU = "", currentEDEffective = false;
var currentCEInfo = [], currentCESave = []; currentCEBuffList = [];
var currentMasterInfo = [], currentMasterSave = []; currentMasterBuffList = [];
var ceAtkCommon = 0, ceAtkBuster = 0, ceAtkArts = 0, ceAtkQuick = 0, ceAtkTemp = 0;
var rankResult = [];

$(document).ready(function() {
	$("#rank-calcbtn").click(function() {
		$("#rank-result").show();
		rank();
		generateRankTable();
	});

	$("#rank-result-resetbtn").click(function() {
		$("#rank-result").hide();
		clearRankResult();
	});

	$(".rank-class").click(function() {
		var servantClass = $(this).attr("title");
		rankClassChange(this, servantClass);
	});
	$("#rank-class-setbtn").click(function() {
		rankClassAll();
	});
	$("#rank-class-resetbtn").click(function() {
		rankClassNone();
	});

	$(".rank-star").change(function() {
		var star = Number($(this).val());
		rankStarChange(this, star);
	});
	$("#rank-star-setbtn").click(function() {
		rankStarAll();
	});
	$("#rank-star-resetbtn").click(function() {
		rankStarNone();
	});

	$(".rank-type").change(function() {
		var type = $(this).val();
		rankTypeChange(this, type);
	});
	$("#rank-type-setbtn").click(function() {
		rankTypeAll();
	});
	$("#rank-type-resetbtn").click(function() {
		rankTypeNone();
	});

	$(".rank-color").change(function() {
		var color = $(this).val();
		rankColorChange(this, color);
	});
	$("#rank-color-setbtn").click(function() {
		rankColorAll();
	});
	$("#rank-color-resetbtn").click(function() {
		rankColorNone();
	});

	$(".rank-range").change(function() {
		var range = $(this).val();
		rankRangeChange(this, range);
	});
	$("#rank-range-setbtn").click(function() {
		rankRangeAll();
	});
	$("#rank-range-resetbtn").click(function() {
		rankRangeNone();
	});

	$(".rank-ed").change(function() {
		var ed = $(this).val();
		rankEDChange(this, ed);
	});
	$("#rank-ed-setbtn").click(function() {
		rankEDAll();
	});
	$("#rank-ed-resetbtn").click(function() {
		rankEDNone();
	});

	$(".rank-npru").change(function() {
		var npru = $(this).val();
		rankNPRUChange(this, npru);
	});
	$("#rank-npru-setbtn").click(function() {
		rankNPRUAll();
	});
	$("#rank-npru-resetbtn").click(function() {
		rankNPRUNone();
	});

	// Generate new table
	$("#rank-filterbtn").click(function() {
		generateRankTable();
	});
});

function rank() {
	var servantList = [];
	var ownership = [true, false];
	universalBuffCommon = [0, 0, 0, 0, 0, 0, 100], universalBuffBuster = [0, 0, 0, 0, 0, 0, 100],
		universalBuffArts = [0, 0, 0, 0, 0, 0, 100], universalBuffQuick = [0, 0, 0, 0, 0, 0, 100];
	currentTempAffinity = [], currentNPAddMult = [];
	rankResult = [];

	initialRankFilter();

	if ($("#rank-use-inventory").is(":checked")) {
		ownership = [true];
	}
	servantList = multiFilter(servants, {
		npRange: ["全體", "單體"],
		owned: ownership,
	});
	if (!$("#rank-use-inventory").is(":checked")) {
		servantList = servantList.filter(function(servant) {
			return servant.id <= Number($("#rank-release-selection").val());
		});
	}

	updateUniversalBuff();

	$(servantList).each(function() {
		universalBuffTemp = [0, 0, 0, 0, 0, 0, 100];
		currentEDEffective = false;
		var id = this.id;
		currentServantInfo[0] = this;

		currentSkillBuffList = multiFilter(skillBuff, {
			id: [id],
			toSelf: [true],
			effect: ["dmg", "nped", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def", "accdef",
				"class", "hpdmg"]
		});
		currentNPBuffList = multiFilter(npBuff, {
			id: [id],
			toSelf: [true],
			buffFirst: [true],
			effect: ["dmg", "nped", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def", "accdef",
				"class", "npmult", "hpmult"]
		});

		var npRU = "";

		currentOCLV = $("#rank-servant-npoc").val();

		var key = "";
		var test = false;
		if ($("#rank-use-universal-buff").is(":checked")) {
			key = "Common";
		} else {
			key = currentServantInfo[0].npColor;
		}

		if ($("#rank-use-inventory").is(":checked")) {
			currentServantSave = bgServant.filter(function(servant) {
				return servant.id == id;
			});

			universalBuffTemp[3] += currentServantSave[0].data[19];						// Event buff

			if ($("#rank-use-saved-teammate").is(":checked")) {
				var support = currentServantSave[0].data[16];
				for (var i = 0; i < ( universalBuffTemp.length - 1 ); i++) {
					universalBuffTemp[i] += inventoryTeammateBuff[support][i];
				}
			}

			if ($("#rank-use-saved-ce").is(":checked")) {
				var ce = currentServantSave[0].data[17];
				if (ce != 0) {
					updateCEAtk("Temp");
					updateCEBuff("Temp");
				}
			} else {
				test = true;
			}

			if ($("#rank-use-saved-master").is(":checked")) {
				var code = currentServantSave[0].data[18];
				if (code != "不使用魔術禮裝") {
					updateMasterBuff("Temp");
				}
			}

			if ($("#rank-use-saved-data").is(":checked")) {
				if (currentServantSave[0].data[3]) {
					npRU = "RU";
				}

				currentNPLV = currentServantSave[0].data[2].toString();

				if (currentSkillBuffList[0] !== undefined) {
					updateSkillPreReq("default", false, 1);
					updateSkillPreReq("skill1", currentServantSave[0].data[6]);
					updateSkillPreReq("skill2", currentServantSave[0].data[8]);
					updateSkillPreReq("skill3", currentServantSave[0].data[10]);

					updateSkillBuff("skill1", currentServantSave[0].data[6], currentServantSave[0].data[5], []);
					updateSkillBuff("skill2", currentServantSave[0].data[8], currentServantSave[0].data[7], []);
					updateSkillBuff("skill3", currentServantSave[0].data[10], currentServantSave[0].data[9], []);
				}
			} else {
				if (currentServantInfo[0].sequence != "" && currentServantInfo[0].sequence <= Number($("#rank-progress-selection").val())) {
					npRU = "RU";
				}
				var source = $("#assign-npLV-toggle").find("#" + currentServantInfo[0].type + "-" + currentServantInfo[0].star);
				currentNPLV = $(source).find("select").val();

				if (currentSkillBuffList[0] !== undefined) {
					acHocSkillBuff();
				}
			}

			if (!$("#rank-use-saved-teammate").is(":checked") || !$("#rank-use-saved-ce").is(":checked") ||
				!$("#rank-use-saved-master").is(":checked")) {
				for (var i = 0; i < ( universalBuffTemp.length - 1 ); i++) {
					universalBuffTemp[i] += window["universalBuff" + key][i];
				}
			}
		} else {
			for (var i = 0; i < ( universalBuffTemp.length - 1 ); i++) {
				universalBuffTemp[i] += window["universalBuff" + key][i];
			}

			test = true;

			if (currentServantInfo[0].sequence != "" && currentServantInfo[0].sequence <= Number($("#rank-progress-selection").val())) {
				npRU = "RU";
			}
			var source = $("#assign-npLV-toggle").find("#" + currentServantInfo[0].type + "-" + currentServantInfo[0].star);
			currentNPLV = $(source).find("select").val();

			acHocSkillBuff();
		}

		currentNPRU = npRU;
		updatePassiveBuff(npRU);

		if (currentNPBuffList[0] !== undefined) {
			updateNPPreReq(npRU);
			updateNPBuff();
		}

		if (test) {
			calcDmg(key);
		} else {
			calcDmg("Temp");
		}
	});
};

function updateSkillPreReq(skill, skillRU) {
	var activeSkillBuff = multiFilter(currentSkillBuffList, {
		no: [skill.toString()],
		skillRU: [skillRU],
		chance: useStrict,
	});
	$(activeSkillBuff).each(function() {
		switch (this.effect) {
			case "class":
				currentTempAffinity = affinity.filter(function(value) {
					return value.classes = this.corrDetail[0];
				});
				break;
			default:
				break;
		}
	});
}

function acHocSkillBuff() {
	var skillSet = ["skill1", "skill2", "skill3"];
	var skillRU = true;

	$(skillSet).each(function() {
		var buffList = multiFilter(currentSkillBuffList, {
			no: [this.toString()],
			skillRU: [true],
			chance: useStrict,
		});
		buffList = buffList.filter(function(buff) {
			return buff.sequence <= Number($("#rank-progress-selection").val());
		});
		if (buffList[0] === undefined) {
			buffList = multiFilter(currentSkillBuffList, {
				no: [this.toString()],
				skillRU: [false],
				chance: useStrict,
			});
			skillRU = false;
		}

		updateSkillPreReq(this, skillRU);
		updateSkillBuff(this, skillRU, $("#rank-servant-skill-lv").val(), buffList);
	});
}

function updateSkillBuff(skill, skillRU, lv, buffList) {
	var activeSkillBuff = []
	if (buffList[0] === undefined) {
		activeSkillBuff = multiFilter(currentSkillBuffList, {
			no: [skill.toString()],
			skillRU: [skillRU],
			chance: useStrict,
		});
	} else {
		activeSkillBuff = buffList;
	}
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
				case "dmg":
					universalBuffTemp[0] += this[lv];
					break;
				case "adddmg":
					universalBuffTemp[1] += this[lv];
					break;
				case "npdmg":
					universalBuffTemp[2] += this[lv];
					break;
				case "buster":
					universalBuffTemp[3] += this[lv];
					break;
				case "arts":
					universalBuffTemp[4] += this[lv];
					break;
				case "quick":
					universalBuffTemp[5] += this[lv];
					break;
				case "def":
				case "accdef":
					universalBuffTemp[0] += this[lv];
					break;
				case "skilled":
					updateSkillED(this, lv);
					break;
				case "hpdmg":							// ATK buffs that correlate with HP value (Passionlips)
					var hp = Number($("#rank-servant-hp").val());
					if (hp <= 50 && hp > 0) {							// Activate if HP below 50%
						var value = Number($("#atk-buff").val());
						var lower = this[lv];
						var total = (50 - hp) * 4 / 10 + lower;
						value += Number(total.toFixed(1));
						universalBuffTemp[0] += value;
					}
					break;
				default:
					break;
			}
		}
	});
}

function updateSkillED(buff, lv) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			if (enemyClass.some(function(classes) {
				return buff.corrDetail.includes(classes) === true;
			})) {
				test = true;
			}
			break;
		case "gender":
			test = enemyGender.some(function(gender) {
				return gender == buff.corrDetail[0];
			});
			break;
		case "alignment1":
			test = enemyAlignment1.some(function(alignment1) {
				return alignment1 == buff.corrDetail[0];
			});
			break;
		case "alignment2":
		  test = enemyAlignment2.some(function(alignment2) {
		  	return alignment2 == buff.corrDetail[0];
	  	});
			break;
		case "trait":
			if (enemyTrait.some(function(trait) {
				return buff.corrDetail.includes(trait) === true;
			})) {
				test = true;
			}
			break;
		case "debuff":
			test = enemyDebuff.some(function(debuff) {
				return debuff == buff.corrDetail[0];
			});
			break;
		default:
			break;
	}
	if (test == true) {
		currentEDEffective = true;
		universalBuffTemp[2] += buff[lv];
	}
}

function updateNPPreReq(npRU) {
	var npRUCheck;
	if (npRU == "RU") {
		npRUCheck = true;
	} else {
		npRUCheck = false;
	}
	currentNPBuffList = multiFilter(currentNPBuffList, {
		npRU: [npRUCheck],
		chance: useStrict
	});
	var activeNPBuff = currentNPBuffList;
	$(activeNPBuff).each(function() {
		switch (this.effect) {
			case "class":
				currentTempAffinity = affinity.filter(function(value) {
					return value.classes = this.corrDetail[0];
				});
				break;
			case "npmult":			// NP with additional multiplier that correlate with OC lv (Arash)
			case "hpmult":			// NP with additional multiplier that correlate with HP value (Anne&Mary, Hijikata)
				currentNPAddMult.type = this.effect;
				currentNPAddMult.npLV = this.npLV;
				currentNPAddMult["1"] = this["1"];
				currentNPAddMult["2"] = this["2"];
				currentNPAddMult["3"] = this["3"];
				currentNPAddMult["4"] = this["4"];
				currentNPAddMult["5"] = this["5"];
				break;
			default:
				break;
		}
	});
}

function updateNPBuff() {
	var nplv = currentNPLV;
	var oclv = currentOCLV;
	var checkRU = currentNPRU;
	var activeNPBuff = currentNPBuffList;
	$(activeNPBuff).each(function() {					// Check if buff correlate with NP lv or oc lv
		if (this.npLV == true) {
			var lv = nplv;
		} else {
			var lv = oclv;
		}

		switch (this.effect) {
			case "dmg":
				universalBuffTemp[0] += this[lv];
				break;
			case "adddmg":
				universalBuffTemp[1] += this[lv];
				break;
			case "npdmg":
				universalBuffTemp[2] += this[lv];
				break;
			case "buster":
				universalBuffTemp[3] += this[lv];
				break;
			case "arts":
				universalBuffTemp[4] += this[lv];
				break;
			case "quick":
				universalBuffTemp[5] += this[lv];
				break;
			case "def":
			case "accdef":
				universalBuffTemp[0] += this[lv];
				break;
			case "nped":
			case "skilled":
				updateNPED(this, lv, this.effect);
				break;
			default:
				break;
		}
	});
}

function updateNPED(buff, lv, category) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			if (enemyClass.some(function(classes) {
				return buff.corrDetail.includes(classes) === true;
			})) {
				test = true;
			}
			break;
		case "gender":
			test = enemyGender.some(function(gender) {
				return gender == buff.corrDetail[0];
			});
			break;
		case "alignment1":
			test = enemyAlignment1.some(function(alignment1) {
				return alignment1 == buff.corrDetail[0];
			});
			break;
		case "alignment2":
		  test = enemyAlignment2.some(function(alignment2) {
		  	return alignment2 == buff.corrDetail[0];
	  	});
			break;
		case "trait":
			if (enemyTrait.some(function(trait) {
				return buff.corrDetail.includes(trait) === true;
			})) {
				test = true;
			}
			break;
		case "debuff":
			test = enemyDebuff.some(function(debuff) {
				return debuff == buff.corrDetail[0];
			});
			break;
		case "class-trait":								// Compound criteria (Mysterious Heroine X [Alter])
			var testTable = [], test1 = false;
			if (enemyClass.some(function(classes) {
				return buff.corrDetail[0] == classes;
			})) {
				test1 = true;
			}
			testTable.push(test1);
			var traitList = enemyTrait;
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
		currentEDEffective = true;
		universalBuffTemp[6] = buff[lv];
	} else if (test == true && category == "skilled") {		// Skill ED given by NP buff (Beni-enma)
		currentEDEffective = true;
		universalBuffTemp[2] += buff[lv];
	}
}

function updatePassiveBuff(npRU) {
	universalBuffTemp[0] += currentServantInfo[0]["npAtk" + npRU];

	universalBuffTemp[1] += currentServantInfo[0].divinity;

	universalBuffTemp[2] += currentServantInfo[0]["npDmgUp" + npRU];

	universalBuffTemp[3] += currentServantInfo[0].passiveBuster;
	universalBuffTemp[3] += currentServantInfo[0]["npBuster" + npRU];

	universalBuffTemp[4] += currentServantInfo[0].passiveArts;
	universalBuffTemp[4] += currentServantInfo[0]["npArts" + npRU];

	universalBuffTemp[5] += currentServantInfo[0].passiveQuick;
	universalBuffTemp[5] += currentServantInfo[0]["npQuick" + npRU];
}

function updateUniversalBuff() {
	var cardList = [];
	if ($("#rank-use-universal-buff").is(":checked")) {
		cardList = ["Common"];
	} else {
		cardList = ["Buster", "Arts", "Quick"];
	}
	$(cardList).each(function() {
		for (var i = 0; i < window["universalBuff" + this].length; i++) {
			window["universalBuff" + this][i] = window["buffList" + this][i];
		}

		if (window["ceInfo" + this][0] !== undefined) {
			updateCEAtk(this);
			if (window["ceBuffList" + this][0] !== undefined) {
				updateCEBuff(this);
			}
		}

		if (window["masterBuffList" + this][0] !== undefined) {
			updateMasterBuff(this);
		}
	});
}

function updateCEAtk(key) {
	currentCEInfo = [], currentCESave = [], currentCEBuffList = [];
	var ceInfo = {};
	var ceMax = false;
	var ceLV = "0";
	var atk = 0;
	switch (key) {
		case "Temp":
			var id = currentServantSave[0].data[17];
			currentCEInfo = ce.filter(function(essence) {
				return essence.id == id;
			});
			currentCESave = bgCE.filter(function(essence) {
				return essence.id == id;
			});
			ceInfo = currentCEInfo;
			ceMax = currentCESave[0].data[1];
			ceLV = currentCESave[0].data[2].toString();
			break;
		default:
			ceInfo = window["ceInfo" + key];
			ceMax = window["ceSave" + key][0];
			ceLV = window["ceSave" + key][1].toString();
			break;
	}

	if (ceInfo[0].defaultMax == true) {
		atk = ceInfo[0].maxAtk;
	} else {
		var sum = ceInfo[0].defaultAtk + ceInfo[0].maxAtk;
		var lvRef = ceAtk.filter(function(obj) {
			return obj.sum == sum.toString();
		});
		if (ceLV == "0") {
			ceLV = "20";
		}
		atk = lvRef[0][ceLV];
	}

	window["ceAtk" + key] = atk;
}

function updateCEBuff(key) {
	var ceInfo = [], ceBuffList = [], checkRU = false;
	switch (key) {
		case "Temp":
			var id = currentServantSave[0].data[17];
			currentCEBuffList = multiFilter(ceBuff, {
				id: [id],
				toSelf: [true],
				effect: ["dmg", "skilled", "adddmg", "buster", "arts", "quick", "npdmg", "def"]
			});
			ceInfo = currentCEInfo;
			ceBuffList = currentCEBuffList;
			checkRU = currentCESave[0].data[1];
			break;
		default:
			ceInfo = window["ceInfo" + key];
			ceBuffList = window["ceBuffList" + key];
			checkRU = $("#rank-ce-max").is(":checked");
			break;
	}
	var test = true;
	if (ceInfo[0].type == "羈絆禮裝") {			// Check if CE is a max bond CE
		if (ceInfo[0].corrSerID != currentServantInfo[0].id) {
			test = false;
		}
	}
	if (test == true) {
		var lv;
		if (checkRU) {
			lv = "max";
		} else {
			lv = "default";
		}
		var activeCEBuff = multiFilter(ceBuffList, {
			chance: useStrict
		});
		$(activeCEBuff).each(function() {
			switch (this.effect) {
				case "dmg":
					window["universalBuff" + key][0] += this[lv];
					break;
				case "adddmg":
					window["universalBuff" + key][1] += this[lv];
					break;
				case "npdmg":
					window["universalBuff" + key][2] += this[lv];
					break;
				case "buster":
					window["universalBuff" + key][3] += this[lv];
					break;
				case "arts":
					window["universalBuff" + key][4] += this[lv];
					break;
				case "quick":
					window["universalBuff" + key][5] += this[lv];
					break;
				case "def":
					window["universalBuff" + key][0] += this[lv];
					break;
				case "skilled":
					updateCEED(this, key);
					break;
				default:
					break;
			}
		});
	}
}

function updateCEED(buff, key) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			test = ( buff.corrDetail[0] == $("#rank-enemy-class").val() );
			break;
		case "gender":
			test = enemyGender.some(function(gender) {
				return gender == buff.corrDetail[0];
			});
			break;
		case "alignment1":
			test = enemyAlignment1.some(function(alignment1) {
				return alignment1 == buff.corrDetail[0];
			});
			break;
		case "alignment2":
			test = enemyAlignment2.some(function(alignment2) {
				return alignment2 == buff.corrDetail[0];
			});
			break;
		case "trait":
			test = enemyTrait.some(function(trait) {
				return trait == buff.corrDetail[0];
			});
			break;
		case "debuff":
			test = debuffList.some(function(debuff) {
				return debuff == buff.corrDetail[0];
			});
			break;
		default:
			break;
	}
	if (test == true) {
		window["universalBuff" + key][2] += buff[lv];
	}
}

function updateMasterBuff(key) {
	currentMasterSave = [], currentMasterBuffList = [];
	var masterBuffList = [];
	var lv = "0";
	switch (key) {
		case "Temp":
			var name = currentServantSave[0].data[18];
			currentMasterSave = bgMaster.filter(function(code) {
				return code.name == name;
			});
			currentMasterBuffList = multiFilter(masterBuff, {
				name: [name],
				effect: ["dmg", "adddmg", "buster", "arts", "quick", "npdmg"]
			});
			masterBuffList = currentMasterBuffList;
			lv = currentMasterSave[0].data[1].toString();
			break;
		default:
			masterBuffList = window["masterBuffList" + key];
			lv = window["masterSave" + key].toString();
			break;
	}

	$(masterBuffList).each(function() {
		switch (this.effect) {
			case "dmg":
				window["universalBuff" + key][0] += this[lv];
				break;
			case "adddmg":
				window["universalBuff" + key][1] += this[lv];
				break;
			case "npdmg":
				window["universalBuff" + key][2] += this[lv];
				break;
			case "buster":
				window["universalBuff" + key][3] += this[lv];
				break;
			case "arts":
				window["universalBuff" + key][4] += this[lv];
				break;
			case "quick":
				window["universalBuff" + key][5] += this[lv];
				break;
			default:
				break;
		}
	});
}

function calcDmg(input) {
	var servantLv, atk, atkStatUp, totalAtk, npMultiplier, multLv;
	var key = "";
	if ($("#rank-use-inventory").is(":checked") && $("#rank-use-saved-data").is(":checked")) {
		servantLv = currentServantSave[0].data[1].toString();
		atkStatUp = currentServantSave[0].data[4];
		npLv = currentServantSave[0].data[2].toString();
	} else {
		servantLv = $("#rank-servant-lv").val();
		atkStatUp = parseInt($("#rank-servant-statup").val());
		npLv = currentNPLV.toString();
	}

	var servantAffList = affinity.filter(function(value) {
		return value.classes == currentServantInfo[0].classes;
	});
	var servantMult = multiplier.filter(function(value) {
		return value.classes == currentServantInfo[0].classes;
	});
	var servantAttrAffList = attrAffinity.filter(function(value) {
		return value.attribute == currentServantInfo[0].attribute;
	});
	var servantAtkList = servantAtk.filter(function(value) {
		return value.id == currentServantInfo[0].id;
	});

	if (servantLv == "0") {			// Check if default servant lv is in used
		atk = currentServantInfo[0].atk;
	} else {
		atk = servantAtkList[0][servantLv];
	}

	if (atkStatUp > 2000) {			// Check if ATK stats up exceed 2000
		atkStatUp = 2000
	} else if (atkStatUp < 0) {
		atkStatUp = 0
	}

	if ($("#rank-use-inventory").is(":checked") && $("#rank-use-saved-ce").is(":checked")) {
		key = "Temp";
	} else {
		key = input;
	}
	var ceAtk = window["ceAtk" + key];
	if (ceAtk > 2400) {			// Check if CE ATK exceed 2400
		ceAtk = 2400
	} else if (ceAtk < 0) {
		ceAtk = 0
	}

	var totalAtk = atk + atkStatUp + ceAtk;		// Calculate total ATK

	var npMultiplier = currentServantInfo[0]["np" + npLv + currentNPRU] / 100;

	var multLv;
	if (currentNPAddMult.npLV !== undefined) {		// Check if additional NP multiplier correlate with NP lv or oc lv
		if (currentNPAddMult.npLV) {
			multLv = npLv;
		} else {
			multLv = $("#rank-servant-npoc").val();
		}
	}
	switch (currentNPAddMult.type) {
		case undefined:			// No additional NP multiplier
			break;
		case "npmult":			// Correlate with oc lv (Arash)
			npMultiplier += currentNPAddMult[multLv];
			break;
		case "hpmult":			// Correlate with HP value (Anne&Mary, Hijikata)
			var hp = Number($("#rank-servant-hp").val());
			if (hp < 0) {		// Check the validity of HP value
				hp = Math.abs(hp);
			} else if (hp > 100) {
				hp = 100;
			}
			var addMult = currentNPAddMult[multLv] * [ 1 - ( hp / 100 ) ];
			npMultiplier += addMult;
			break;
	}

	var npColor = currentServantInfo[0].npColor;
	var cardMultiplier, cardBuff;
	switch (npColor) {		// Acquire card color multiplier
		case "Buster":
			cardMultiplier = 1.5;
			cardBuff = universalBuffTemp[3] / 100;
			break;
		case "Arts":
			cardMultiplier = 1;
			cardBuff = universalBuffTemp[4] / 100;
			break;
		case "Quick":
			cardMultiplier = 0.8;
			cardBuff = universalBuffTemp[5] / 100;
			break;
		default:
			break;
	}

	var classMultiplier = servantMult[0].multiplier;		// Acquire class multiplier

	var enemyClass = $("#rank-enemy-class").val();
	var affMultiplier;
	if (currentTempAffinity[0] !== undefined) {			// Acquire affinity relationship, check if temporary affinity is in effect
		affMultiplier = currentTempAffinity[0][enemyClass];
	} else {
		affMultiplier = servantAffList[0][enemyClass];
	}

	var advantage;			// Display advantage visually
	if (affMultiplier > 1) {
		advantage = "weak";
	} else if (affMultiplier < 1) {
		advantage = "resist";
	}

	var enemyAttr = $("#rank-enemy-attribute").val();
	var attrAffMultiplier = servantAttrAffList[0][enemyAttr];		// Acquire attribute affinity relationship

	var atkBuff = universalBuffTemp[0] / 100;
	var npDmgBuff = universalBuffTemp[2] / 100;
	var npEDBuff = universalBuffTemp[6] / 100;
	var addDmg = universalBuffTemp[1];

	// Generate output
	var dmgOutput = totalAtk * 0.23 * [ npMultiplier * cardMultiplier * ( 1 + cardBuff ) ] * classMultiplier * affMultiplier *
		attrAffMultiplier * ( 1 + atkBuff ) * ( 1 + npDmgBuff ) * npEDBuff + addDmg ;
	dmgOutput = Number(dmgOutput.toFixed(0));

	if (servantLv == 0) {
		servantLv = "預設";
	}

	var rankUp = "";
	if (currentNPRU == "RU") {
		rankUp = "已強化";
	}

	// Write output into array
	var output = {
		name: currentServantInfo[0].name,
		color: npColor,
		classes: currentServantInfo[0].classes,
		attribute: currentServantInfo[0].attribute,
		star: currentServantInfo[0].star,
		type: currentServantInfo[0].type,
		ed: currentEDEffective.toString(),
		lv: servantLv,
		atk: totalAtk,
		np: npLv,
		range: currentServantInfo[0].npRange,
		npmult: parseFloat(( npMultiplier * 100 ).toFixed(1)),
		npru: rankUp,
		nped: ( parseFloat(( npEDBuff * 100 ).toFixed(1)) - 100 ),
		npbuff: parseFloat(( npDmgBuff * 100 ).toFixed(1)),
		cardbuff: parseFloat(( cardBuff * 100 ).toFixed(1)),
		atkbuff: parseFloat(( atkBuff * 100 ).toFixed(1)),
		dmg: dmgOutput,
		adv: advantage
	};
	rankResult.push(output);
}

function clearRankResult() {
	var table = $("#rank-table");
	$(table).find(".result-row").each(function() {
		$(this).remove();
	});
}

let rankResultFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"],
	color: ["Buster", "Arts", "Quick"],
	range: ["全體", "單體"],
	ed: ["true", "false"],
	npru: ["", "已強化"]
};

function generateRankTable() {
	clearRankResult();

	var filteredResult = multiFilter(rankResult, rankResultFilter);

	sortDescend(filteredResult, "dmg");
	var i = 0;
	var max = filteredResult[0].dmg;
	var table = document.getElementById("rank-table");
	filteredResult.forEach(function(result) {
		i++;
		var percent = ( result.dmg / max ) * 100;
		var row = table.insertRow(-1);
		$(row).addClass("result-row");
		row.insertCell(-1).innerHTML = i;
		row.insertCell(-1).innerHTML = "<span class='" + result.color + "'>" + result.name + "</span>";
		row.insertCell(-1).innerHTML = "<img class='class-logo' src='images/class/" + result.classes + ".webp' />";
		row.insertCell(-1).innerHTML = result.attribute;
		row.insertCell(-1).innerHTML = result.lv;
		row.insertCell(-1).innerHTML = result.atk;
		row.insertCell(-1).innerHTML = result.np;
		row.insertCell(-1).innerHTML = result.range;
		row.insertCell(-1).innerHTML = result.npmult;
		row.insertCell(-1).innerHTML = result.npru;
		row.insertCell(-1).innerHTML = result.nped;
		row.insertCell(-1).innerHTML = result.npbuff;
		row.insertCell(-1).innerHTML = result.cardbuff;
		row.insertCell(-1).innerHTML = result.atkbuff;
		row.insertCell(-1).innerHTML = "<div class='rank-container'><div class='rank-bar " + result.adv + "' id='rank-bar-" + i + "'>" + result.dmg + "</div></div>";
		$("#rank-bar-" + i).css("width", percent + "%");
	});
}

// Update class filter
function rankClassChange(element, className) {
	var newClass = rankResultFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		rankResultFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		rankResultFilter.classes = newClass;
	}
}
function rankClassAll() {
	$(".rank-class").removeClass("dull");
	rankResultFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}
function rankClassNone() {
	$(".rank-class").removeClass("dull");
	$(".rank-class").addClass("dull");
	rankResultFilter.classes = [];
}

// Update star filter
function rankStarChange(element, starNo) {
	var newStar = rankResultFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		rankResultFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		rankResultFilter.star = newStar;
	}
}
function rankStarAll() {
	$(".rank-star").prop("checked", true);
	rankResultFilter.star = [0, 1, 2, 3, 4, 5];
}
function rankStarNone() {
	$(".rank-star").prop("checked", false);
	rankResultFilter.star = [];
}

// Update type filter
function rankTypeChange(element, typeName) {
	var newType = rankResultFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		rankResultFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		rankResultFilter.type = newType;
	}
}
function rankTypeAll() {
	$(".rank-type").prop("checked", true);
	rankResultFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"];
}
function rankTypeNone() {
	$(".rank-type").prop("checked", false);
	rankResultFilter.type = [];
}

// Update color filter
function rankColorChange(element, colorName) {
	var newColor = rankResultFilter.color;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		rankResultFilter.color = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		rankResultFilter.color = newColor;
	}
}
function rankColorAll() {
	$(".rank-color").prop("checked", true);
	rankResultFilter.color = ["Buster", "Arts", "Quick"];
}
function rankColorNone() {
	$(".rank-color").prop("checked", false);
	rankResultFilter.color = [];
}

// Update NP range filter
function rankRangeChange(element, rangeName) {
	var newRange = rankResultFilter.range;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		rankResultFilter.range = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		rankResultFilter.range = newRange;
	}
}
function rankRangeAll() {
	$(".rank-range").prop("checked", true);
	rankResultFilter.range = ["全體", "單體"];
}
function rankRangeNone() {
	$(".rank-range").prop("checked", false);
	rankResultFilter.range = [];
}

// Update ED filter
function rankEDChange(element, ed) {
	var newED = rankResultFilter.ed;
	if ($(element).prop("checked")) {
		newED.push(ed);
		rankResultFilter.ed = newED;
	} else {
		position = newED.indexOf(ed);
		newED.splice(position, 1);
		rankResultFilter.ed = newED;
	}
}
function rankEDAll() {
	$(".rank-ed").prop("checked", true);
	rankResultFilter.ed = ["true", "false"];
}
function rankEDNone() {
	$(".rank-ed").prop("checked", false);
	rankResultFilter.ed = [];
}

// Update NP Rank Up filter
function rankNPRUChange(element, npru) {
	var newNPRU = rankResultFilter.npru;
	if ($(element).prop("checked")) {
		newNPRU.push(npru);
		rankResultFilter.npru = newNPRU;
	} else {
		position = newNPRU.indexOf(npru);
		newNPRU.splice(position, 1);
		rankResultFilter.npru = newNPRU;
	}
}
function rankNPRUAll() {
	$(".rank-npru").prop("checked", true);
	rankResultFilter.npru = ["", "已強化"];
}
function rankNPRUNone() {
	$(".rank-npru").prop("checked", false);
	rankResultFilter.npru = [];
}

// Initialise all filters
function initialRankFilter() {
	rankClassAll();
	rankStarAll();
	rankTypeAll();
	rankColorAll();
	rankRangeAll();
	rankEDAll();
}
