var servants = parent.servants;
var ce = parent.ce;
var master = parent.master;

var skillBuff = parent.skillBuff;
var npBuff = parent.npBuff;
var atk = parent.atk;
var ceBuff = parent.ceBuff;
var ceAtk = parent.ceAtk;
var masterBuff = parent.masterBuff;

var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;
var bgMaster = parent.bgMaster;

var modalCaller = "";

// Layout
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
});

$(document).on( "click", "scroll", function() {
	updateCounter();
});

function updateCounter() {
	var height = $("#enemy-info").outerHeight() + $("#environment-info").outerHeight() + $("#servant-info").outerHeight() +
		$("#ce-info").outerHeight() + $("#master-info").outerHeight() + $("#teammate-info").outerHeight() + 
		$("#buff-info").outerHeight() + 600;
	$("#calc-counter").html(height);
}

function toggleTeammate(button, element) {
	if ($(button).html() == "接疊▲") {
		$(button).html("展開▼");
		$(".teammate-detail").hide(300);
	} else {
		$(button).html("接疊▲");
		$(".allow-toggle").show(300);
	}
}

// Set Enemy
var enemyInfo = [];
var debuff = [];
var enemy1Debuff = [], enemy2Debuff = [], enemy3Debuff = [];
var enemy1Trait = [], enemy2Trait = [], enemy3Trait = [];

$(document).ready(function() {
	$("#common-enemy-modalbtn").click(function() {
		openModal("#common-enemy-modal");
		initialCommonEnemy();
		loadCommonEnemyImg();
	});
	$("#servant-enemy-modalbtn").click(function() {
		openModal("#servant-enemy-modal");
		initialServantEnemy();
		loadServantEnemyImg();
	});
	$("#current-enemy-resetbtn").click(function() {
		resetCurrentEnemy();
	});
	$(".current-enemy-debuff").change(function() {
		updateDebuff();
	});
	$("#enemy1-applytn").click(function() {
		setEnemy("#enemy1");
	});
	$("#enemy2-applytn").click(function() {
		setEnemy("#enemy2");
	});
	$("#enemy3-applytn").click(function() {
		setEnemy("#enemy3");
	});
	$("#enemy1-resetbtn").click(function() {
		resetEnemy("#enemy1");
	});
	$("#enemy2-resetbtn").click(function() {
		resetEnemy("#enemy2");
	});
	$("#enemy3-resetbtn").click(function() {
		resetEnemy("#enemy3");
	});
});

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
}

function pickEnemy(type, enemyID) {
	closeModal();
	if (type === 1) {
		enemyInfo = servants.filter(function(obj) {
			return obj.id == enemyID;
		});
	} else {
		enemyInfo = commons.filter(function(obj) {
			return obj.id == enemyID;
		});
	}
	if ($("#enemy-setup-collapsebtn").html() == "展開▼") {
		$("#enemy-setup-collapsebtn").html("接疊▲");
		$("#enemy-setup-collapsible").toggle(300);
	}
	$("#current-enemy-img").attr("src", enemyInfo[0].imgID);
	$("#current-enemy-name").html(enemyInfo[0].name);
	if (enemyInfo[0].classes) {
		$("#current-enemy-class").val(enemyInfo[0].classes);
		$("#current-enemy-class").attr("data-class", enemyInfo[0].classes);
	} else {
		$("#current-enemy-class").val("Saber");
		$("#current-enemy-class").attr("data-class", "Saber");
	}
	$("#current-enemy-gender").val(enemyInfo[0].gender);
	$("#current-enemy-attribute").val(enemyInfo[0].attribute);
	$("#current-enemy-alignment1").val(enemyInfo[0].alignment1);
	$("#current-enemy-alignment2").val(enemyInfo[0].alignment2);
	$(".current-enemy-trait").prop("checked", false);
	var trait = [];
	var trait = enemyInfo[0].trait;
	$.each(trait, function(index, value) {
		$("input.current-enemy-trait[value=" + value + "]").prop("checked", true)
	});
}

function resetCurrentEnemy() {
	$("#current-enemy-img").attr("src", "images/bg_logo.webp");
	$("#current-enemy-name").html("未選定/自訂敵人");
	$("#current-enemy-class").val("Saber");
	$("#current-enemy-gender").val("男性");
	$("#current-enemy-attribute").val("天");
	$("#current-enemy-alignment1").val("秩序");
	$("#current-enemy-alignment2").val("善");
	if ($("#enemy-setup-collapsebtn").html() == "展開▼") {
		$("#enemy-setup-collapsebtn").html("接疊▲");
		$("#enemy-setup-collapsible").toggle(300);
	}
	$(".current-enemy-trait").prop("checked", false);
}

function setEnemy(element) {
	$(element).show();
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
	var debuffList = "";
	$(debuff).each(function(key, value) {
		debuffList += "<img class='debuff-logo left' src='" + value.src + "' />";
	});
	$(element).find(".enemy-debuff").html(debuffList);
	switch (element) {
		case "#enemy1":
			enemy1Debuff = debuff;
			break;
		case "#enemy2":
			enemy2Debuff = debuff;
			break;
		case "#enemy3":
			enemy3Debuff = debuff;
			break;
		default:
			break;
	}
	var imgURL = "images/class/" + encodeURI($("#current-enemy-class").val()) + ".webp";
	$(element).find(".enemy-class").attr({
		src: imgURL,
		alt: $("#current-enemy-class").val()
	});
	$(element).find(".enemy-gender").html($("#current-enemy-gender").val());
	$(element).find(".enemy-attribute").html($("#current-enemy-attribute").val());
	$(element).find(".enemy-alignment1").html($("#current-enemy-alignment1").val());
	$(element).find(".enemy-alignment2").html($("#current-enemy-alignment2").val());
	var trait = [];
	$(".current-enemy-trait:checked").each(function() {
		trait.push($(this).val())
	});
	switch (element) {
		case "#enemy1":
			enemy1Trait = trait;
			break;
		case "#enemy2":
			enemy2Trait = trait;
			break;
		case "#enemy3":
			enemy3Trait = trait;
			break;
		default:
			break;
	}
	$(element).find(".enemy-trait").html(trait.join(", "));
	updateBuff();
}

function resetEnemy(element) {
	$(element).hide();
	$(element).find(".enemy-img").attr("src", "images/bg_logo.webp");
	$(element).find(".enemy-name").html("");
	switch (element) {
		case "#enemy1":
			enemy1Debuff = [];
			break;
		case "#enemy2":
			enemy2Debuff = [];
			break;
		case "#enemy3":
			enemy3Debuff = [];
			break;
		default:
			break;
	}
	$(element).find(".enemy-class").attr("src", "images/class/Unknown.webp");
	$(element).find(".enemy-gender").html("");
	$(element).find(".enemy-attribute").html("");
	$(element).find(".enemy-alignment1").html("");
	$(element).find(".enemy-alignment2").html("");
	$(element).find(".enemy-trait").html("");
	switch (element) {
		case "#enemy1":
			enemy1Trait = [];
			break;
		case "#enemy2":
			enemy2Trait = [];
			break;
		case "#enemy3":
			enemy3Trait = [];
			break;
		default:
			break;
	}
	updateBuff();
}

// Set Battlefield
var battlefield = [];

$(document).ready(function() {
	$(".battlefield-type").change(function() {
		updateBattlefield();
	});
	$("#battlefield-type11").change(function() {
		if ($(this).is(":checked")) {
			$("#battlefield-type8").prop("checked", true);
		}
	});
	$("#battlefield-resetbtn").click(function() {
		resetBattlefield();
	});
});

function updateBattlefield() {
	battlefield = [];
	$(".battlefield-type").each(function() {
		if ($(this).is(":checked")) {
			battlefield.push($(this).val());
		}
	});
}

function resetBattlefield() {
	battlefield = [];
	$(".battlefield-type").each(function() {
		$(this).prop("checked", false);
	});
}

// Set Servant
var servantInfo = [];
var servantSave = [];
var skillBuffList = [], npBuffList = [];

$(document).ready(function() {
	$("#servant-modalbtn").click(function() {
		if ($("#enemy1-name").html() != "" || $("#enemy2-name").html() != "" || $("#enemy3-name").html() != "") {
			openModal("#servant-modal");
			initialServant();
			loadServantImg();
		} else {
			alert("請先設定敵人！");
		}
	});
	$("#servant-resetbtn").click(function() {
		resetServant();
	});
	$("#current-servant-rankup").change(function() {
		setCurrentServantNP();
	});
	$("#check-skill1-rankup").change(function() {
		setSkill(this, 'skill1');
	});
	$("#check-skill2-rankup").change(function() {
		setSkill(this, 'skill2');
	});
	$("#check-skill3-rankup").change(function() {
		setSkill(this, 'skill3');
	});
});

function pickServant(servantID) {
	closeModal();
	servantInfo = servants.filter(function(obj) {
		return obj.id == servantID;
	});
	skillBuffList = multiFilter(skillBuff, {
		id: [servantID],
		toSelf: [true],
		effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def", "class", "trait"]
	});
	npBuffList = multiFilter(npBuff, {
		id: [servantID],
		toSelf: [true],
		buffFirst: [true],
		effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def", "class", "trait"]
	});
	if ($("#servant-setup-collapsebtn").html() == "展開▼") {
		$("#servant-setup-collapsebtn").html("接疊▲");
		$("#servant-setup-collapsible").toggle(300);
	}
	$("#current-servant-img").attr("src", servantInfo[0].imgID);
	$("#current-servant-name").html(servantInfo[0].name);
	$("#current-servant-class").attr({
		"src": "images/class/" + servantInfo[0].classes + ".webp",
		"data-class": servantInfo[0].classes
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
	$("#current-servant-lv").prop("disabled", false);
	$("#current-servant-nplv").prop("disabled", false);
	$("#current-servant-statup").prop("disabled", false);
	$("#current-servant-hp").prop("disabled", false);
	$("#current-servant-rankup").prop("disabled", !servantInfo[0].npRankUp);
	$("#current-servant-npoc").prop("disabled", false);
	$("#current-servant-gender").html(servantInfo[0].gender);
	$("#current-servant-attribute").html(servantInfo[0].attribute);
	$("#current-servant-alignment").html(servantInfo[0].alignment1 + ", " + servantInfo[0].alignment2);
	$("#current-servant-trait").html(servantInfo[0].trait.join(", "));
	$("#current-servant-np").removeClass("Buster Art Quick")
	$("#current-servant-np").addClass(servantInfo[0].npColor)
	servantSave = bgServant.filter(function(obj) {
		return obj.id == servantID;
	});
	$("#check-skill1-rankup").prop("disabled", !servantInfo[0].skill1RU);
	$("#check-skill2-rankup").prop("disabled", !servantInfo[0].skill2RU);
	$("#check-skill3-rankup").prop("disabled", !servantInfo[0].skill3RU);
	setCurrentServantInfo();
	setCurrentServantNP();
	var skill1Toggle = $("#check-skill1-rankup");
	var skill2Toggle = $("#check-skill2-rankup");
	var skill3Toggle = $("#check-skill3-rankup");
	setSkill(skill1Toggle);
	setSkill(skill2Toggle);
	setSkill(skill3Toggle);
	updateBuff();
}

function resetServant() {
	setCurrentServantInfo();
	setCurrentServantNP();
	var skill1Toggle = $("#check-skill1-rankup");
	var skill2Toggle = $("#check-skill2-rankup");
	var skill3Toggle = $("#check-skill3-rankup");
	setSkill(skill1Toggle);
	setSkill(skill2Toggle);
	setSkill(skill3Toggle);
	updateBuff();
}

function setCurrentServantInfo() {
	if (servantSave[0] != undefined) {
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
		$("#current-servant-lv").val(0);
		$("#current-servant-nplv").val(1);
		$("#current-servant-statup").val(0);
		$("#current-servant-rankup").prop("checked", false);
		$("#skill1-lv").val(1);
		$("#check-skill1-rankup").prop("checked", false);
		$("#skill2-lv").val(1);
		$("#check-skill2-rankup").prop("checked", false);
		$("#skill3-lv").val(1);
		$("#check-skill3-rankup").prop("checked", false);
		$("#event-buff").val(0);
	}
	$("#current-servant-hp").val(100);
	$("#current-servant-npoc").val("1");
	$("#use-skill1").prop("checked", false);
	$("#skill1-img").addClass("dull");
	$("#use-skill2").prop("checked", false);
	$("#skill2-img").addClass("dull");
	$("#use-skill3").prop("checked", false);
	$("#skill3-img").addClass("dull");
}

function setCurrentServantNP() {
	if ($("#current-servant-rankup").is(":checked")) {
		$("#current-servant-np").html(servantInfo[0].np + " " + servantInfo[0].npRURank);
		$("#current-servant-npdscrp").html(servantInfo[0].npRUDscrp);
	} else {
		$("#current-servant-np").html(servantInfo[0].np + " " + servantInfo[0].npRank);
		$("#current-servant-npdscrp").html(servantInfo[0].npDscrp);
	}
}

function setSkill(toggle) {
	var skill = $(toggle).val();
	if ($(toggle).is(":checked")) {
		$("#" + skill + "-img").attr("src", servantInfo[0][skill + "RUImgID"]);
		$("#" + skill + "-name").html(servantInfo[0][skill + "RUName"]);
		$("#" + skill + "-dscrp").html(servantInfo[0][skill + "RUDscrp"]);
		if (servantInfo[0][skill + "RUDmgBuff"] == false) {
			$("#use-" + skill).prop("disabled", true);
			$("#" + skill + "-lv").prop("disabled", true);
		} else {
			$("#use-" + skill).prop("disabled", false);
			$("#" + skill + "-lv").prop("disabled", false);
		}
	} else {
		$("#" + skill + "-img").attr("src", servantInfo[0][skill + "ImgID"]);
		$("#" + skill + "-name").html(servantInfo[0][skill + "Name"]);
		$("#" + skill + "-dscrp").html(servantInfo[0][skill + "Dscrp"]);
		if (servantInfo[0][skill + "DmgBuff"] == false) {
			$("#use-" + skill).prop("disabled", true);
			$("#" + skill + "-lv").prop("disabled", true);
		} else {
			$("#use-" + skill).prop("disabled", false);
			$("#" + skill + "-lv").prop("disabled", false);
		}
	}
}

// Set Servant CE
var ceInfo = [];
var ceSave = [];
var ceBuffList = [];

$(document).ready(function() {
	$("#servant-ce-modalbtn").click(function() {
		if ($("#current-servant-name").html() != "未選定從者") {
			openModal("#ce-modal");
			initialCE();
			loadCEImg();
		} else {
			alert("請先設定從者！");
		}
	});
	$("#servant-ce-reapplybtn").click(function() {
		reapplyCE();
	});
	$("#servant-ce-resetbtn").click(function() {
		resetCE();
	});
	$("#servant-ce-max").change(function() {
		setCurrentServantCEEffect(this);
	});
	$("#servant-ce-lv").change(function() {
		updateCEAtk();
	});
});

function pickCE(essenceID) {
	closeModal();
	ceInfo = ce.filter(function(obj) {
		return obj.ceID == essenceID;
	});
	ceBuffList = multiFilter(ceBuff, {
		ceID: [essenceID],
		toSelf: [true],
		effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "igndef", "enemytrait"]
	});
	if ($("#ce-setup-collapsebtn").html() == "展開▼") {
		$("#ce-setup-collapsebtn").html("接疊▲");
		$("#ce-setup-collapsible").toggle(300);
	}
	$("#servant-ce-img").attr("src", ceInfo[0].ceImgID);
	$("#servant-ce-name").html(ceInfo[0].ceName);
	var starHTML = "";
	switch (ceInfo[0].ceStar) {
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
	$("#servant-ce-star").attr("data-star", ceInfo[0].ceStar);
	$("#servant-ce-max").prop("disabled", ceInfo[0].defaultMax);
	$("#servant-ce-lv").prop("disabled", false);
	ceSave = bgCE.filter(function(obj) {
		return obj.id == essenceID;
	});
	setCurrentServantCE();
	var ceToggle = $("#servant-ce-max");
	setCurrentServantCEEffect(ceToggle);
	updateCEAtk();
	updateBuff();
}

function reapplyCE() {
	setCurrentServantCE();
	var ceToggle = $("#servant-ce-max");
	setCurrentServantCEEffect(ceToggle);
	updateCEAtk();
	updateBuff();
}

function resetCE() {
	ceInfo = [];
	ceSave = [];
	ceBuffList = [];
	$("#servant-ce-img").attr("src", "");
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

function setCurrentServantCE() {
	if (ceSave[0] != undefined) {
		$("#servant-ce-max").prop("checked", ceSave[0].data[1]);
		$("#servant-ce-lv").val(ceSave[0].data[2]);
	} else {
		if (ceInfo[0] != undefined) {
			$("#servant-ce-max").prop("checked", ceInfo[0].defaultMax);
		} else {
			$("#servant-ce-max").prop("checked", false);
		}
		$("#servant-ce-lv").val(0);
	}
}

function setCurrentServantCEEffect(toggle) {
	if (ceInfo[0] != undefined) {
		if ($(toggle).is(":checked")) {
			$("#servant-ce-dscrp").html(ceInfo[0].maxEffect);
		} else {
			$("#servant-ce-dscrp").html(ceInfo[0].defaultEffect);
		}
	}
}

// Set Master Mystic Code
var masterInfo = [];
var masterSave = [];
var masterBuffList = [];

$(document).ready(function() {
	generateMasterSelection();
	$("#master-name-selection").click(function() {
		if ($("#current-servant-name").html() == "未選定從者") {
			alert("請先設定從者！");
		}
	});
	$("#master-name-selection").change(function() {
		setMaster(this);
	});
	$("#master-resetbtn").click(function() {
		applyMaster();
	});
});

function generateMasterSelection() {
	$(master).each(function(index, value) {
		var select = $("#master-name-selection");
		var name = value.masterName;
		var option = {value: name, text: name};
		select.append($('<option>', option));
	});
}

function setMaster(element) {
	if ($(element).val() == "none") {
		if ($("#master-setup-collapsebtn").html() == "接疊▲") {
			$("#master-setup-collapsebtn").html("展開▼");
			$("#master-setup-collapsible").toggle(300);
		}
		masterInfo = [];
		masterSave = [];
		masterBuffList = [];
		masterSkillSet = [];
		$("#master-img1").attr("src", "");
		$("#master-img2").attr("src", "");
		$("#master-lv").val(1);
		$("#master-lv").prop("disabled", true);
		$("#master-skill1-logo").attr("src", "");
		$("#master-skill1-logo").removeClass("dull");
		$("#check-master-skill1").prop("checked", false);
		$("#check-master-skill1").prop("disabled", true);
		$("#master-skill2-logo").attr("src", "");
		$("#master-skill2-logo").removeClass("dull");
		$("#check-master-skill2").prop("checked", false);
		$("#check-master-skill2").prop("disabled", true);
		$("#master-skill3-logo").attr("src", "");
		$("#master-skill3-logo").removeClass("dull");
		$("#check-master-skill3").prop("checked", false);
		$("#check-master-skill3").prop("disabled", true);
		$("#master-skill1-dscrp").html("");
		$("#master-skill2-dscrp").html("");
		$("#master-skill3-dscrp").html("");
	} else {
		if ($("#master-setup-collapsebtn").html() == "展開▼") {
			$("#master-setup-collapsebtn").html("接疊▲");
			$("#master-setup-collapsible").toggle(300);
		}
		var name = $(element).val();
		masterInfo = master.filter(function(obj) {
			return obj.masterName == name;
		});
		masterBuffList = multiFilter(masterBuff, {
			masterName: [name],
			effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "igndef", "enemytrait"]
		});
		$("#master-img1").attr("src", masterInfo[0].masterImgID1);
		$("#master-img2").attr("src", masterInfo[0].masterImgID2);
		$("#master-lv").prop("disabled", false);
		$("#master-skill1-logo").attr("src", masterInfo[0].skill1ImgID);
		if (!masterInfo[0].skill1Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#check-master-skill1").prop("disabled", true);
		} else {
			$("#check-master-skill1").prop("disabled", false);
		}
		$("#master-skill2-logo").attr("src", masterInfo[0].skill2ImgID);
		if (!masterInfo[0].skill2Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#check-master-skill2").prop("disabled", true);
		} else {
			$("#check-master-skill2").prop("disabled", false);
		}
		$("#master-skill3-logo").attr("src", masterInfo[0].skill3ImgID);
		if (!masterInfo[0].skill3Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#check-master-skill3").prop("disabled", true);
		} else {
			$("#check-master-skill3").prop("disabled", false);
		}
		$("#master-skill1-dscrp").html(masterInfo[0].skill1Dscrp);
		$("#master-skill2-dscrp").html(masterInfo[0].skill2Dscrp);
		$("#master-skill3-dscrp").html(masterInfo[0].skill3Dscrp);
		masterSave = bgMaster.filter(function(obj) {
			return obj.name == name;
		});
		applyMaster();
	}
}

function applyMaster() {
	$("#master-skill1-logo").addClass("dull");
	$("#check-master-skill1").prop("checked", false);
	$("#master-skill2-logo").addClass("dull");
	$("#check-master-skill2").prop("checked", false);
	$("#master-skill3-logo").addClass("dull");
	$("#check-master-skill3").prop("checked", false);
	if (masterSave[0] != undefined) {
		$("#master-lv").val(ceSave[0].data[1]);
	} else {
		$("#master-lv").val(1);
	}
}

// Set Teammates
var teammate1Info = [], teammate2Info = [], teammate3Info = [], teammate4Info = [], teammate5Info = [];
var teammate1Save = [], teammate2Save = [], teammate3Save = [], teammate4Save = [], teammate5Save = [];
var teammate1SkillBuffList = [], teammate2SkillBuffList = [], teammate3SkillBuffList = [], teammate4SkillBuffList = [], teammate5SkillBuffList = [];
var teammate1NPBuffList = [], teammate2NPBuffList = [], teammate3NPBuffList = [], teammate4NPBuffList = [], teammate5NPBuffList = [];
var teammate1CEInfo = [], teammate2CEInfo = [], teammate3CEInfo = [], teammate4CEInfo = [], teammate5CEInfo = [];
var teammate1CESave = [], teammate2CESave = [], teammate3CESave = [], teammate4CESave = [], teammate5CESave = [];
var teammate1CEBuffList = [], teammate2CEBuffList = [], teammate3CEBuffList = [], teammate4CEBuffList = [], teammate5CEBuffList = [];

$(document).ready(function() {
	$(".teammate-modalbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		if ($("#current-servant-name").html() != "未選定從者") {
			openModal("#teammate-modal");
			setCaller(teammate);
			initialTeammate();
			loadTeammateImg();
		} else {
			alert("請先設定從者！");
		}
	});
	$(".teammate-ce-modalbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		if ($("#" + teammate + " .teammate-name").html() != "未選定隊友") {
			openModal("#teammate-ce-modal");
			setCaller(teammate);
			initialTeammateCE();
			loadTeammateCEImg();
		} else {
			alert("請先設定隊友！");
		}
	});
	$(".teammate-reapplybtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		reapplyTeammate(teammate);
	});
	$(".teammate-ce-resetbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		resetTeammateCE(teammate);
	});
	$(".teammate-resetbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		if ($("#teammate-setup-collapsebtn").html() == "接疊▲") {
			$("#teammate-setup-collapsebtn").html("展開▼");
		}
		resetTeammate(teammate);
	});
	$(".teammate-extendbtn").click(function() {
		var teammate = $(this).attr("data-teammate");
		$(this).hide();
		extend(teammate);
	});
	$(".teammate-np-rankup").change(function() {
		setTeammateNP(this);
	});
	$(".teammate-skill-rankup").change(function() {
		setTeammateSkill(this);
	});
});

function extend(element) {
	$("#" + element).show();
	$("#" + element).addClass("allow-toggle");
}

function pickTeammate(teammateID) {
	closeModal();
	switch (modalCaller) {
		case "teammate1":
			toTeammate("teammate1", teammateID);
			break;
		case "teammate2":
			toTeammate("teammate2", teammateID);
			break;
		case "teammate3":
			toTeammate("teammate3", teammateID);
			break;
		case "teammate4":
			toTeammate("teammate4", teammateID);
			break;
		case "teammate5":
			toTeammate("teammate5", teammateID);
			break;
		default:
			break;
	}
	modalCaller = "";
}

function toTeammate(value, teammateID) {
	var section = $("#" + value);
	window[value + "Info"] = servants.filter(function(obj) {
		return obj.id == teammateID;
	});
	window[value + "SkillBuffList"] = multiFilter(skillBuff, {
		id: [teammateID],
		range: ["team", "single", "all-enemy", "single-enemy"],
		effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "igndef", "enemytrait"]
	});
	window[value + "NPBuffList"] = multiFilter(npBuff, {
		id: [teammateID],
		range: ["team", "single", "all-enemy", "single-enemy"],
		effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "igndef", "enemytrait"]
	});
	var info = window[value + "Info"];
	if ($("#teammate-setup-collapsebtn").html() == "展開▼") {
		$("#teammate-setup-collapsebtn").click();
	}
	section.find(".teammate-img").attr("src", info[0].imgID);
	section.find(".teammate-name").html(info[0].name);
	section.find(".teammate-class").attr({
		"src": "images/class/" + info[0].classes + ".webp",
		"data-class": info[0].classes
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
	section.find(".teammate-np-rankup").prop("disabled", !info[0].npRankUp);
	section.find(".teammate-nplv").prop("disabled", false);
	section.find(".teammate-npoc").prop("disabled", false);
	section.find(".teammate-np-name").removeClass("Buster Art Quick");
	section.find(".teammate-np-name").addClass(info[0].npColor);
	window[value + "Save"] = bgServant.filter(function(obj) {
		return obj.id == teammateID;
	});
	section.find(".teammate-skill1-rankup").prop("disabled", !info[0].skill1RU);
	section.find(".teammate-skill2-rankup").prop("disabled", !info[0].skill2RU);
	section.find(".teammate-skill3-rankup").prop("disabled", !info[0].skill3RU);
	setTeammateInfo(value);
	var npToggle = section.find(".teammate-np-rankup");
	var skill1Toggle = section.find(".teammate-skill1-rankup");
	var skill2Toggle = section.find(".teammate-skill2-rankup");
	var skill3Toggle = section.find(".teammate-skill3-rankup");
	setTeammateNP(npToggle);
	setTeammateSkill(skill1Toggle);
	setTeammateSkill(skill2Toggle);
	setTeammateSkill(skill3Toggle);
}

function reapplyTeammate(value) {
	setTeammateInfo(value);
	var section = $("#" + value);
	var npToggle = section.find(".teammate-np-rankup");
	var skill1Toggle = section.find(".teammate-skill1-rankup");
	var skill2Toggle = section.find(".teammate-skill2-rankup");
	var skill3Toggle = section.find(".teammate-skill3-rankup");
	setTeammateNP(npToggle);
	setTeammateSkill(skill1Toggle);
	setTeammateSkill(skill2Toggle);
	setTeammateSkill(skill3Toggle);
	if (section.find(".teammate-ce-name").html() != "未選定禮裝") {
		setTeammateCE(value);
		var ceToggle = section.find(".teammate-ce-max");
		setTeammateCEEffect(ceToggle);
	}
}

function resetTeammate(value) {
	window[value + "Info"] = [];
	window[value + "Save"] = [];
	window[value + "CEInfo"] = [];
	window[value + "CESave"] = [];
	window[value + "SkillSet"] = [];
	window[value + "SkillBuffList"] = [];
	window[value + "NPBuffList"] = [];
	window[value + "CEBuffList"] = [];
	var section = $("#" + value);
	section.hide();
	if (value != "teammate1") {
		section.removeClass("allow-toggle");
		$("#" + value + "-extendbtn").show();
	}
	section.find(".teammate-img").attr("src", "");
	section.find(".teammate-name").html("未選定隊友");
	section.find(".teammate-class").attr({
		"src": "images/class/Unknown.webp",
		"data-class": ""
	});
	section.find(".teammate-star").html("★★★★★");
	section.find(".teammate-star").addClass("dull");
	if (section.find(".teammate-ce-name").html() != "未選定禮裝") {
		section.find(".teammate-ce-img").attr("src", "");
		section.find(".teammate-ce-name").html("未選定禮裝");
		section.find(".teammate-ce-star").html("★★★★★");
		section.find(".teammate-ce-star").addClass("dull");
		section.find(".teammate-ce-max").prop("checked", false);
		section.find(".teammate-ce-max").prop("disabled", true);
		section.find(".teammate-ce-dscrp").html("");
	}
	section.find(".teammate-np").prop("checked", false);
	section.find(".teammate-np").prop("disabled", true);
	section.find(".teammate-np-rankup").prop("checked", false);
	section.find(".teammate-np-rankup").prop("disabled", true);
	section.find(".teammate-nplv").val(1);
	section.find(".teammate-nplv").prop("disabled", true);
	section.find(".teammate-npoc").val(1);
	section.find(".teammate-npoc").prop("disabled", true);
	section.find(".teammate-np-name").removeClass("Buster Art Quick");
	section.find(".teammate-np-name").html("");
	section.find(".teammate-np-dscrp").html("");
	section.find(".teammate-skill1").prop("checked", false);
	section.find(".teammate-skill1").prop("disabled", true);
	section.find(".teammate-skill1-rankup").prop("checked", false);
	section.find(".teammate-skill1-rankup").prop("disabled", true);
	section.find(".teammate-skill1-lv").val(1);
	section.find(".teammate-skill1-lv").prop("disabled", true);
	section.find(".teammate-skill1-img").attr("src", "");
	section.find(".teammate-skill1-name").html("");
	section.find(".teammate-skill1-dscrp").html("");
	section.find(".teammate-skill2").prop("checked", false);
	section.find(".teammate-skill2").prop("disabled", true);
	section.find(".teammate-skill2-rankup").prop("checked", false);
	section.find(".teammate-skill2-rankup").prop("disabled", true);
	section.find(".teammate-skill2-lv").val(1);
	section.find(".teammate-skill2-lv").prop("disabled", true);
	section.find(".teammate-skill2-img").attr("src", "");
	section.find(".teammate-skill2-name").html("");
	section.find(".teammate-skill2-dscrp").html("");
	section.find(".teammate-skill3").prop("checked", false);
	section.find(".teammate-skill3").prop("disabled", true);
	section.find(".teammate-skill3-rankup").prop("checked", false);
	section.find(".teammate-skill3-rankup").prop("disabled", true);
	section.find(".teammate-skill3-lv").val(1);
	section.find(".teammate-skill3-lv").prop("disabled", true);
	section.find(".teammate-skill3-img").attr("src", "");
	section.find(".teammate-skill3-name").html("");
	section.find(".teammate-skill3-dscrp").html("");
}

function setTeammateInfo(value) {
	var section = $("#" + value);
	var save = window[value + "Save"];
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
		section.find(".teammate-skill1-lv").val(1);
		section.find(".teammate-skill1-rankup").prop("checked", false);
		section.find(".teammate-skill2-lv").val(1);
		section.find(".teammate-skill2-rankup").prop("checked", false);
		section.find(".teammate-skill3-lv").val(1);
		section.find(".teammate-skill3-rankup").prop("checked", false);
	}
	section.find(".teammate-nplv").val(1);
	section.find(".teammate-npoc").val(1);
	section.find(".teammate-skill1").prop("checked", false);
	section.find(".teammate-skill1-img").addClass("dull");
	section.find(".teammate-skill2").prop("checked", false);
	section.find(".teammate-skill2-img").addClass("dull");
	section.find(".teammate-skill3").prop("checked", false);
	section.find(".teammate-skill3-img").addClass("dull");
}

function setTeammateNP(toggle) {
	var section = $(toggle).parents(".teammate-detail");
	var value = section.attr("id");
	var info = window[value + "Info"];
	if ($(toggle).is(":checked")) {
		section.find(".teammate-np-name").html(info[0].np + " " + info[0].npRURank);
		section.find(".teammate-np-dscrp").html(info[0].npRUDscrp);
		if (info[0].npRUDmgToTeam == false) {
			section.find(".teammate-np").prop("disabled", true);
		} else {
			section.find(".teammate-np").prop("disabled", false);
		}
	} else {
		section.find(".teammate-np-name").html(info[0].np + " " + info[0].npRank);
		section.find(".teammate-np-dscrp").html(info[0].npDscrp);
		if (info[0].npDmgToTeam == false) {
			section.find(".teammate-np").prop("disabled", true);
		} else {
			section.find(".teammate-np").prop("disabled", false);
		}
	}
}

function setTeammateSkill(toggle) {
	var section = $(toggle).parents(".teammate-detail");
	var value = section.attr("id");
	var skill = $(toggle).val();
	var info = window[value + "Info"];
	if ($(toggle).is(":checked")) {
		section.find(".teammate-" + skill + "-img").attr("src", info[0][skill + "RUImgID"]);
		section.find(".teammate-" + skill + "-name").html(info[0][skill + "RUName"]);
		section.find(".teammate-" + skill + "-dscrp").html(info[0][skill + "RUDscrp"]);
		if (info[0][skill + "RUDmgToTeam"] == false) {
			section.find(".teammate-" + skill).prop("disabled", true);
			section.find(".teammate-" + skill + "-lv").prop("disabled", true);
		} else {
			section.find(".teammate-" + skill).prop("disabled", false);
			section.find(".teammate-" + skill + "-lv").prop("disabled", false);
		}
	} else {
		section.find(".teammate-" + skill + "-img").attr("src", info[0][skill + "ImgID"]);
		section.find(".teammate-" + skill + "-name").html(info[0][skill + "Name"]);
		section.find(".teammate-" + skill + "-dscrp").html(info[0][skill + "Dscrp"]);
		if (info[0][skill + "DmgToTeam"] == false) {
			section.find(".teammate-" + skill).prop("disabled", true);
			section.find(".teammate-" + skill + "-lv").prop("disabled", true);
		} else {
			section.find(".teammate-" + skill).prop("disabled", false);
			section.find(".teammate-" + skill + "-lv").prop("disabled", false);
		}
	}
}


function pickTeammateCE(ceID) {
	closeModal();
	switch (modalCaller) {
		case "teammate1":
			toTeammateCE("teammate1", ceID);
			break;
		case "teammate2":
			toTeammateCE("teammate2", ceID);
			break;
		case "teammate3":
			toTeammateCE("teammate3", ceID);
			break;
		case "teammate4":
			toTeammateCE("teammate4", ceID);
			break;
		case "teammate5":
			toTeammateCE("teammate5", ceID);
			break;
		default:
			break;
	}
	modalCaller = "";
}

function toTeammateCE(value, ceID) {
	var section = $("#" + value);
	window[value + "CEInfo"] = ce.filter(function(obj) {
		return obj.ceID == ceID;
	});
	window[value + "CEBuffList"] = multiFilter(ceBuff, {
		"ceID": [ceID],
		range: ["team", "all-enemy", "single-enemy"],
		effect: ["dmg", "ed", "adddmg", "buster", "art", "quick", "npdmg", "def",
			"class", "alignment1", "alignment2", "trait", "igndef", "enemytrait"]
	});
	var info = window[value + "CEInfo"];
	section.find(".teammate-ce-img").attr("src", info[0].ceImgID);
	section.find(".teammate-ce-name").html(info[0].ceName);
	var starHTML = "";
	switch (info[0].ceStar) {
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
	section.find(".teammate-ce-star").html(starHTML);
	section.find(".teammate-ce-star").removeClass("dull");
	section.find(".teammate-ce-max").prop("disabled", info[0].defaultMax);
	window[value + "CESave"] = bgCE.filter(function(obj) {
		return obj.id == essenceID;
	});
	setTeammateCE(value);
	var ceToggle = section.find(".teammate-ce-max");
	setTeammateCEEffect(ceToggle);
}

function resetTeammateCE(value) {
	window[value + "CEInfo"] = [];
	window[value + "CESave"] = [];
	window[value + "CEBuffList"] = [];
	if (section.find(".teammate-ce-name").html() != "未選定禮裝") {
		section.find(".teammate-ce-img").attr("src", "");
		section.find(".teammate-ce-name").html("未選定禮裝");
		section.find(".teammate-ce-star").html("★★★★★");
		section.find(".teammate-ce-star").addClass("dull");
		section.find(".teammate-ce-max").prop("checked", false);
		section.find(".teammate-ce-max").prop("disabled", true);
		section.find(".teammate-ce-dscrp").html("");
	}
}

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

// Update Buff
var skillSet = [];
var masterSkillSet = [];
var teammate1SkillSet = [], teammate2SkillSet = [], teammate3SkillSet = [], teammate4SkillSet = [], teammate5SkillSet = [];
var useStrict = [true, false];
var includeAfterDefeat = [true, false];
var tempAlignment1 = [], tempAlignment2 = [], tempTrait = [], ignoreDef = false;
var tempEnemyTrait = [];

$(document).ready(function() {
	$("#battlefield-setup input:checkbox").change(function() {
		updateBuff();
	});
	$("#use-strict-mode").change(function() {
		if ($(this).is(":checked")) {
			useStrict = [false];
		} else {
			useStrict = [true, false];
		}	
	});
	$("#include-after-defeat").change(function() {
		if ($(this).is(":checked")) {
			includeAfterDefeat = [true, false];
		} else {
			includeAfterDefeat = [false];
		}	
	});
	$(".update-trigger").change(function() {
		updateBuff();
	});
	$(".use-skill").change(function() {
		updateSkillSet(this);
		updateBuff();
	});
	$(".check-master-skill").change(function() {
		updateMasterSkillSet(this);
		updateBuff();
	});
	$(".teammate-skill1").change(function() {
		updateTeammateSkillSet(this);
		updateBuff();
	});
	$(".teammate-skill2").change(function() {
		updateTeammateSkillSet(this);
		updateBuff();
	});
	$(".teammate-skill3").change(function() {
		updateTeammateSkillSet(this);
		updateBuff();
	});
});

function updateSkillSet(toggle) {
	var skill = $(toggle).val();
	if ($(toggle).is(":checked")) {
		masterSkillSet.push(skill);
	} else {
		var position = masterSkillSet.indexOf(skill);
		masterSkillSet.splice(position, 1);
	}
}

function updateMasterSkillSet(toggle) {
	var skill = $(toggle).val();
	if ($(toggle).is(":checked")) {
		skillSet.push(skill);
	} else {
		var position = skillSet.indexOf(skill);
		skillSet.splice(position, 1);
	}
}

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

function updateBuff() {
	tempAlignment1 = [], tempAlignment2 = [], tempTrait = [], ignoreDef = false;
	tempEnemyTrait = [];
	updatePassiveBuff();
	updateSkillPreReq();
	updateNPPreReq();
	updateCEPreReq();
	$(".teammate-detail").each(function() {
		if ($(this).find(".teammate-name").html() != "未選定隊友") {
			updateTeammateSkillPreReq(this);
			updateTeammateNPPreReq(this);
			if ($(this).find(".teammate-ce-name").html() != "未選定禮裝") {
				updateTeammateCEPreReq(this);
			}
		}
	});
	updateSkillBuff();
	updateNPBuff();
	updateCEBuff();
	updateMasterBuff();
	$(".teammate-detail").each(function() {
		if ($(this).find(".teammate-name").html() != "未選定隊友") {
			updateTeammateSkillBuff(this);
			updateTeammateNPBuff(this);
			if ($(this).find(".teammate-ce-name").html() != "未選定禮裝") {
				updateTeammateCEBuff(this);
			}
		}
	});
}

function updateCEAtk() {
	if (ceInfo[0] === undefined) {
		$("#ce-atk").val(0);
	} else if (ceInfo[0].defaultMax == true) {
		$("#ce-atk").val(ceInfo[0].maxAtk);
	} else {
		var maxLV;
		switch (ceInfo[0].ceStar) {
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
		if (!$("#servant-ce-max").is(":checked")) {
			maxLV = 20;
		}
		if (Number($("#servant-ce-lv").val()) > maxLV) {
			$("#servant-ce-lv").val(maxLV);
		}
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

function updateEventBuff() {
	if (servantSave[0] != undefined) {
		$("#event-buff").val(servantSave[0].data[18]);
	}
}

function updatePassiveBuff() {
	$("#buff-info").find("input").each(function() {
		$(this).val(0);
	});
	var buster = Number($("#Buster-buff").val());	
	buster += servantInfo[0].passiveBuster;
	if ($("#current-servant-rankup").is(":checked")) {
		buster += servantInfo[0].npBusterRU;
	} else {
		buster += servantInfo[0].npBuster;
	}
	$("#Buster-buff").val(buster);
	var art = Number($("#Art-buff").val());	
	art += servantInfo[0].passiveArt;
	if ($("#current-servant-rankup").is(":checked")) {
		art += servantInfo[0].npArtRU;
	} else {
		art += servantInfo[0].npArt;
	}
	$("#Art-buff").val(art);
	var quick = Number($("#Quick-buff").val());	
	quick += servantInfo[0].passiveQuick;
	if ($("#current-servant-rankup").is(":checked")) {
		quick += servantInfo[0].npQuickRU;
	} else {
		quick += servantInfo[0].npQuick;
	}
	$("#Quick-buff").val(quick);
	var divinity = Number($("#add-atk").val());	
	divinity += servantInfo[0].divinity;	
	$("#add-atk").val(divinity);
	var npdmg = Number($("#np-buff").val());	
	if ($("#current-servant-rankup").is(":checked")) {
		npdmg += servantInfo[0].npDmgUpRU;
	} else {
		npdmg += servantInfo[0].npDmgUp;
	}	
	$("#np-buff").val(npdmg);
	var atk = Number($("#atk-buff").val());	
	if ($("#current-servant-rankup").is(":checked")) {
		atk += servantInfo[0].npAtkRU;
	} else {
		atk += servantInfo[0].npAtk;
	}	
	$("#atk-buff").val(atk);
}

function updateSkillPreReq() {
	$(skillSet).each(function() {
		var checkRU = $("#check-" + this + "-rankup").is(":checked");
		var activeSkillBuff = multiFilter(skillBuffList, {
			no: [this.toString()],
			skillRU: [checkRU],
			selective: useStrict,
			afterDefeat: includeAfterDefeat
		});
		$(activeSkillBuff).each(function() {
			switch (this.effect) {
				case "alignment1":
					tempAlignment1.push(this.corrDetail);
					break;
				case "alignment2":
					tempAlignment2.push(this.corrDetail);
					break;
				case "trait":
					tempTrait.push(this.corrDetail);
					break;
				case "igndef":
					ignoreDef = true;
					break;
				case "enemytrait":
					tempEnemyTrait.push(this.corrDetail);
					break;
				default:
					break;
			}
		});
	});
}

function updateNPPreReq() {
	var checkRU = $("#current-servant-rankup").is(":checked");
	var activeNPBuff = multiFilter(npBuffList, {
		npRU: [checkRU],
		chance: useStrict
	});
	$(activeNPBuff).each(function() {
		switch (this.effect) {
			case "alignment1":
				tempAlignment1.push(this.corrDetail);
				break;
			case "alignment2":
				tempAlignment2.push(this.corrDetail);
				break;
			case "trait":
				tempTrait.push(this.corrDetail);
				break;
			case "igndef":
				ignoreDef = true;
				break;
			case "enemytrait":
				tempEnemyTrait.push(this.corrDetail);
				break;
			default:
				break;
		}
	});	
}

function updateCEPreReq() {
	var activeCEBuff = multiFilter(ceBuffList, {
		chance: useStrict,
		afterDefeat: includeAfterDefeat
	});
	$(activeCEBuff).each(function() {
		switch (this.effect) {			
			case "igndef":
				ignoreDef = true;
				break;
			default:
				break;
		}
	});
}

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
					tempAlignment1.push(this.corrDetail);
					break;
				case "alignment2":
					tempAlignment2.push(this.corrDetail);
					break;
				case "trait":
					tempTrait.push(this.corrDetail);
					break;
				case "igndef":
					ignoreDef = true;
					break;
				case "enemytrait":
					tempEnemyTrait.push(this.corrDetail);
					break;
				default:
					break;
			}
		});
	});
}

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
				tempAlignment1.push(this.corrDetail);
				break;
			case "alignment2":
				tempAlignment2.push(this.corrDetail);
				break;
			case "trait":
				tempTrait.push(this.corrDetail);
				break;
			case "igndef":
				ignoreDef = true;
				break;
			case "enemytrait":
				tempEnemyTrait.push(this.corrDetail);
				break;
			default:
				break;
		}
	});
}

function updateTeammateCEPreReq(section) {
	var teammate = $(section).attr("id");
	var buffList = window[teammate + "CEBuffList"];
	var activeCEBuff = multiFilter(buffList, {
		chance: useStrict,
		afterDefeat: includeAfterDefeat
	});
	$(activeCEBuff).each(function() {
		switch (this.effect) {			
			case "igndef":
				ignoreDef = true;
				break;
			default:
				break;
		}
	});	
}

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
		$(activeSkillBuff).each(function() {
			var test = true;
			if (this.selective == true) {
				if (this.lookUp == "env") {
					if (!battlefield.some(function(env) {
						return env == buff.corrDetail;
					})) {
						test = false;
					}
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
					case "art":	
						var value = Number($("#Art-buff").val());	
						value += this[lv];	
						$("#Art-buff").val(value);
						break;
					case "quick":
						var value = Number($("#Quick-buff").val());	
						value += this[lv];	
						$("#Quick-buff").val(value);
						break;
					case "def":
						updateDefDebuff(this, 'enemy1', lv);	
						if (this.range == "all-enemy") {	
							updateDefDebuff(this, 'enemy2', lv);
							updateDefDebuff(this, 'enemy3', lv);
						}
						break;
					case "ed":		
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

function updateDefDebuff(buff, enemy, lv) {
	var field = $("#" + enemy + "-buff").find(".def-debuff");
	var value = Number($(field).val());
	value += buff[lv];
	$(field).val(value);
}

function updateSkillED(buff, enemy, lv) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			if (buff.corrDetail == $("#" + enemy + "-class").attr("alt")) {
				test = true;
			}
			break;
		case "gender":
			if (buff.corrDetail == $("#" + enemy + "-gender").html()) {
				test = true;
			}
			break;
		case "alignment1":
			if (buff.corrDetail == $("#" + enemy + "-alignment1").html()) {
				test = true;
			}
			break;
		case "alignment2":
			if (buff.corrDetail == $("#" + enemy + "-alignment2").html()) {
				test = true;
			}
			break;
		case "trait":
			var traitList = window[enemy + "Trait"]
			if (traitList.some(function(trait) {
				return trait == buff.corrDetail;
			})) {
				test = true;
			} else if (tempEnemyTrait.some(function(trait) {
				return trait == buff.corrDetail;
			})) {
				test = true;
			} 
			break;
		case "debuff":
			var debuffList = window[enemy + "Debuff"]
			if (debuffList.some(function(debuff) {
				return debuff == buff.corrDetail;
			})) {
				test = true;
			}
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

function updateNPBuff() {
	var nplv = $("#current-servant-nplv").val();
	var oclv = $("#current-servant-npoc").val();
	var checkRU = $("#current-servant-rankup").is(":checked");
	var activeNPBuff = multiFilter(npBuffList, {
		npRU: [checkRU],
		chance: useStrict
	});
	$(activeNPBuff).each(function() {
		if (this.npLV == true) {
			var lv = nplv;
		} else {
			var lv = oclv;
		}
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
			case "art":	
				var value = Number($("#Art-buff").val());	
				value += this[lv];	
				$("#Art-buff").val(value);
				break;
			case "quick":	
				var value = Number($("#Quick-buff").val());	
				value += this[lv];	
				$("#Quick-buff").val(value);
				break;
			case "def":	
				updateNPDefDebuff(this, 'enemy1', lv);	
				if (this.range == "all-enemy") {	
					updateNPDefDebuff(this, 'enemy2', lv);
					updateNPDefDebuff(this, 'enemy3', lv);
				}
				break;
			case "ed":	
				updateNPED(this, 'enemy1', lv);	
				updateNPED(this, 'enemy2', lv);	
				updateNPED(this, 'enemy3', lv);
				break;
			default:
				break;
		}
	});
}

function updateNPDefDebuff(buff, enemy, lv) {
	var field = $("#" + enemy + "-buff").find(".def-debuff");
	var value = Number($(field).val());
	value += buff[lv];
	$(field).val(value);
}

function updateNPED(buff, enemy, lv) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			if (buff.corrDetail == $("#" + enemy + "-class").attr("alt")) {
				test = true;
			}
			break;
		case "gender":
			if (buff.corrDetail == $("#" + enemy + "-gender").html()) {
				test = true;
			}
			break;
		case "alignment1":
			if (buff.corrDetail == $("#" + enemy + "-alignment1").html()) {
				test = true;
			}
			break;
		case "alignment2":
			if (buff.corrDetail == $("#" + enemy + "-alignment2").html()) {
				test = true;
			}
			break;
		case "trait":
			var traitList = window[enemy + "Trait"]
			if (traitList.some(function(trait) {
				return trait == buff.corrDetail;
			})) {
				test = true;
			} else if (tempEnemyTrait.some(function(trait) {
				return trait == buff.corrDetail;
			})) {
				test = true;
			}
			break;
		case "debuff":
			var debuffList = window[enemy + "Debuff"]
			if (debuffList.some(function(debuff) {
				return debuff == buff.corrDetail;
			})) {
				test = true;
			}
			break;
		default:
			break;
	}
	if (test == true) {
		var field = $("#" + enemy + "-buff").find(".np-ed");
		var value = Number($(field).val());
		value += buff[lv];
		$(field).val(value);
	}	
}

function updateCEBuff() {
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
			case "art":		
				var value = Number($("#Art-buff").val());	
				value += this[lv];	
				$("#Art-buff").val(value);	
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
			case "ed":		
				updateCEED(this, 'enemy1', lv);	
				updateCEED(this, 'enemy2', lv);	
				updateCEED(this, 'enemy3', lv);	
				break;	
			default:		
				break;
		}
	});
}

function updateCEDefDebuff(buff, enemy, lv) {
	var field = $("#" + enemy + "-buff").find(".def-debuff");
	var value = Number($(field).val());
	value += buff[lv];
	$(field).val(value);
}

function updateCEED(buff, enemy, lv) {
	var test = false;
	switch (buff.lookUp) {
		case "class":
			if (buff.corrDetail == $("#" + enemy + "-class").attr("alt")) {
				test = true;
			}
			break;
		case "gender":
			if (buff.corrDetail == $("#" + enemy + "-gender").html()) {
				test = true;
			}
			break;
		case "alignment1":
			if (buff.corrDetail == $("#" + enemy + "-alignment1").html()) {
				test = true;
			}
			break;
		case "alignment2":
			if (buff.corrDetail == $("#" + enemy + "-alignment2").html()) {
				test = true;
			}
			break;
		case "trait":
			var traitList = window[enemy + "Trait"]
			if (traitList.some(function(trait) {
				return trait == buff.corrDetail;
			})) {
				test = true;
			} else if (tempEnemyTrait.some(function(trait) {
				return trait == buff.corrDetail;
			})) {
				test = true;
			} 
			break;
		case "debuff":
			var debuffList = window[enemy + "Debuff"]
			if (debuffList.some(function(debuff) {
				return debuff == buff.corrDetail;
			})) {
				test = true;
			}
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

function updateMasterBuff() {
	var lv = $("#master-lv").val();
	$(masterSkillSet).each(function() {
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
			case "art":		
				var value = Number($("#Art-buff").val());	
				value += this[lv];	
				$("#Art-buff").val(value);	
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
}

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
			if (this.selective == true) {
				switch (this.lookUp) {
					case "class":
						if (servantInfo[0].classes != this.corrDetail) {
							test = false;
						}
						break;
					case "gender":
						if (servantInfo[0].gender != this.corrDetail) {
							test = false;
						}
						break;
					case "alignment1":
						if (servantInfo[0].alignment1 != this.corrDetail) {
							if (!tempAlignment1.some(function(value) {
								return value == this.corrDetail;
							})) {
								test = false;
							}
						}
						break;
					case "alignment2":
						if (servantInfo[0].alignment2 != this.corrDetail) {
							if (!tempAlignment2.some(function(value) {
								return value == this.corrDetail;
							})) {
								test = false;
							}
						}
						break;
					case "trait":
						if (!servantInfo[0].trait.some(function(value) {
						    	return value == this.corrDetail;
						})) {
							if (!tempTrait.some(function(value) {
								return value == this.corrDetail;
							})) {
								test = false;
							}
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
					case "art":	
						var value = Number($("#Art-buff").val());	
						value += this[lv];	
						$("#Art-buff").val(value);
						break;
					case "quick":
						var value = Number($("#Quick-buff").val());	
						value += this[lv];	
						$("#Quick-buff").val(value);
						break;
					case "def":
						updateDefDebuff(this, 'enemy1', lv);	
						if (this.range == "all-enemy") {	
							updateDefDebuff(this, 'enemy2', lv);
							updateDefDebuff(this, 'enemy3', lv);
						}
						break;
					case "ed":		
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
			case "art":	
				var value = Number($("#Art-buff").val());	
				value += this[lv];	
				$("#Art-buff").val(value);
				break;
			case "quick":	
				var value = Number($("#Quick-buff").val());	
				value += this[lv];	
				$("#Quick-buff").val(value);
				break;
			case "def":	
				updateNPDefDebuff(this, 'enemy1', lv);	
				if (this.range == "all-enemy") {	
					updateNPDefDebuff(this, 'enemy2', lv);
					updateNPDefDebuff(this, 'enemy3', lv);
				}
				break;
			case "ed":	
				updateNPED(this, 'enemy1', lv);	
				updateNPED(this, 'enemy2', lv);	
				updateNPED(this, 'enemy3', lv);
				break;
			default:
				break;
		}
	});
}

function updateTeammateCEBuff(section) {
	var teammate = $(section).attr("id");
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
			case "art":		
				var value = Number($("#Art-buff").val());	
				value += this[lv];	
				$("#Art-buff").val(value);	
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
			case "ed":		
				updateCEED(this, 'enemy1', lv);	
				updateCEED(this, 'enemy2', lv);	
				updateCEED(this, 'enemy3', lv);	
				break;	
			default:		
				break;
		}
	});
}
