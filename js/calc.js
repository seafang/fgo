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

$(document).click(function() {
	updateCounter();
});

function updateCounter() {
	var height = $("#enemy-info").outerHeight() + $("#servant-info").outerHeight() + $("#ce-info").outerHeight() +
		$("#master-info").outerHeight() + $("#teammate-info").outerHeight() + $("#buff-info").outerHeight() + 600;
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
		default:
			enemy1Debuff = debuff;
			break;
		case "#enemy2":
			enemy2Debuff = debuff;
			break;
		case "#enemy3":
			enemy3Debuff = debuff;
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
		default:
			enemy1Trait = trait;
			break;
		case "#enemy2":
			enemy2Trait = trait;
			break;
		case "#enemy3":
			enemy3Trait = trait;
			break;
	}
	$(element).find(".enemy-trait").html(trait.join(", "));
}

function resetEnemy(element) {
	$(element).hide();
	$(element).find(".enemy-img").attr("src", "images/bg_logo.webp");
	$(element).find(".enemy-name").html("");
	switch (element) {
		case "#enemy1":
		default:
			enemy1Debuff = [];
			break;
		case "#enemy2":
			enemy2Debuff = [];
			break;
		case "#enemy3":
			enemy3Debuff = [];
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
		default:
			enemy1Trait = [];
			break;
		case "#enemy2":
			enemy2Trait = [];
			break;
		case "#enemy3":
			enemy3Trait = [];
			break;
	}
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
	skillBuffList = multiFilter(skillBuff, {id: servantID});
	npBuffList = multiFilter(npBuff, {id: servantID});
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
			starHTML = "Error";
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
	}
	$("#current-servant-hp").val(100);
	$("#current-servant-npoc").val("oc1");
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
	ceBuffList = multiFilter(ceBuff, {ceID: essenceID});
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
			starHTML = "Error";
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
}

function reapplyCE() {
	setCurrentServantCE();
	var ceToggle = $("#servant-ce-max");
	setCurrentServantCEEffect(ceToggle);
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
	updateCEAtk();
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
		masterBuffList = multiFilter(masterBuff, {masterName: name});
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
var teammate1skillSet = {no: []}, teammate2skillSet = {no: []}, teammate3skillSet = {no: []}, teammate4skillSet = {no: []}, teammate5skillSet = {no: []};
var teammate1SkillBuffList = [], teammate2SkillBuffList = [], teammate3SkillBuffList = [], teammate4SkillBuffList = [], teammate5SkillBuffList = [];
var teammate1NPBuffList = [], teammate2NPBuffList = [], teammate3NPBuffList = [], teammate4NPBuffList = [], teammate5NPBuffList = [];
var teammate1CEInfo = [], teammate2CEInfo = [], teammate3CEInfo = [], teammate4CEInfo = [], teammate5CEInfo = [];
var teammate1CESave = [], teammate2CESave = [], teammate3CESave = [], teammate4CESave = [], teammate5CESave = [];
var teammate1CEBuffList = [], teammate2CEBuffList = [], teammate3CEBuffList = [], teammate4CEBuffList = [], teammate5CEBuffList = [];

$(document).ready(function() {
	$("#teammate1-modalbtn").click(function() {
		if ($("#current-servant-name").html() != "未選定從者") {
			openModal("#teammate-modal");
			setCaller("teammate1");
			initialTeammate();
			loadTeammateImg();
		} else {
			alert("請先設定從者！");
		}
	});
	$("#teammate1-ce-modalbtn").click(function() {
		if ($("#teammate1 .teammate-name").html() != "未選定隊友") {
			openModal("#teammate-ce-modal");
			setCaller("teammate1");
			initialTeammateCE();
			loadTeammateCEImg();
		} else {
			alert("請先設定隊友！");
		}
	});
	$("#teammate1-reapplybtn").click(function() {
		reapplyTeammate("teammate1");
	});
	$("#teammate1-ce-resetbtn").click(function() {
		resetTeammateCE("teammate1");
	});
	$("#teammate1-resetbtn").click(function() {
		if ($("#teammate-setup-collapsebtn").html() == "接疊▲") {
			$("#teammate-setup-collapsebtn").html("展開▼");
		}
		resetTeammate("teammate1");
	});
	$("#teammate2-extendbtn").click(function() {
		$(this).hide();
		extend("teammate2");
	});
	$("#teammate2-modalbtn").click(function() {
		if ($("#current-servant-name").html() != "未選定從者") {
			openModal("#teammate-modal");
			setCaller("teammate2");
			initialTeammate();
			loadTeammateImg();
		} else {
			alert("請先設定從者！");
		}
	});
	$("#teammate2-ce-modalbtn").click(function() {
		if ($("#teammate1 .teammate-name").html() != "未選定隊友") {
			openModal("#teammate-ce-modal");
			setCaller("teammate2");
			initialTeammateCE();
			loadTeammateCEImg();
		} else {
			alert("請先設定隊友！");
		}
	});
	$("#teammate2-reapplybtn").click(function() {
		reapplyTeammate("teammate2");
	});
	$("#teammate2-ce-resetbtn").click(function() {
		resetTeammateCE("teammate2");
	});
	$("#teammate2-resetbtn").click(function() {
		resetTeammate("teammate2");
	});
	$(".teammate-np-rankup").change(function() {
		setTeammateNP(this);
	});
	$(".teammate-skill1-rankup").change(function() {
		setTeammateSkill(this);
	});
	$(".teammate-skill2-rankup").change(function() {
		setTeammateSkill(this);
	});
	$(".teammate-skill3-rankup").change(function() {
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
		default:
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
	}
	modalCaller = "";
}

function toTeammate(value, teammateID) {
	var section = $("#" + value);
	window[value + "Info"] = servants.filter(function(obj) {
		return obj.id == teammateID;
	});
	window[value + "SkillBuffList"] = multiFilter(skillBuff, {id: teammateID});
	window[value + "NPBuffList"] = multiFilter(npBuff, {id: teammateID});
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
			starHTML = "Error";
	}
	section.find(".teammate-star").html(starHTML);
	section.find(".teammate-star").removeClass("dull");
	section.find(".teammate-np-rankup").prop("disabled", !info[0].npRankUp);
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
		default:
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
	}
	modalCaller = "";
}

function toTeammateCE(value, ceID) {
	var section = $("#" + value);
	window[value + "CEInfo"] = ce.filter(function(obj) {
		return obj.ceID == ceID;
	});
	window[value + "CEBuffList"] = multiFilter(ceBuff, {"ceID": ceID});
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
			starHTML = "Error";
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
var tempAlignment1 = [], tempAlignment2 = [], tempTrait = [];
var skillSet = {no: []};

$(document).ready(function() {
	$("#battlefield-setup input:checkbox").change(function() {
		updateBuff();
	});
	$("#current-servant-nplv").change(function() {
		if (servantInfo[0].id == 15) {
			updateBuff();
		}
	});
	$(".update-trigger").change(function() {
		updateBuff();
	});
	$(".use-skill").change(function() {
		updateSkillSet(this);
		updateBuff();
	});
});

function updateSkillSet(toggle) {
	var skill = $(toggle).val();
	if ($(toggle).is(":checked")) {
		skillSet.no.push(skill);
	} else {
		var position = skillSet.no.indexOf(skill);
		skillSet.no.splice(position, 1);
	}
}

function updateBuff() {
	$("#buff-info").find("input").each(function() {
		$(this).val(0);
	});
	updateCEAtk();
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

function updateSkillBuff() {
	
}

function updateNPBuff() {
	
}

function updateCEBuff() {
	
}

function updateMasterBuff() {
	
}

function updateTeammateSkillBuff(section) {
	
}

function updateTeammateNPBuff(section) {
	
}

function updateTeammateCEBuff(section) {
	
}
