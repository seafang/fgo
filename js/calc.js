var servants = parent.servants;
var ce = parent.ce;
var master = parent.master;
var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;
var bgMaster = parent.bgMaster;
var modalCaller = "";

// Set Enemy
var enemyInfo = [];
var debuff = [];
var enemy1Debuff = [], enemy2Debuff = [], enemy3Debuff = [];
var enemy1Trait = [], enemy2Trait = [], enemy3Trait = [];

$(document).ready(function() {
	$(".current-enemy-debuff").change(function() {
		updateDebuff();
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
	} else {
		$("#current-enemy-class").val("Saber");
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
	$("#current-enemy-img").attr("src", "images/bg_logo.png");
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
		$(element).find(".enemy-img").attr("src", "images/bg_logo.png");
	} else {
		$(element).find(".enemy-img").attr("src", $("#current-enemy-img").attr("src"));
	}
	if ($("#current-enemy-name").html() == "未選定/自訂敵人"){
		$(element).find(".enemy-name").html("自訂敵人");
	} else {
		$(element).find(".enemy-name").html($("#current-enemy-name").html());
	}
	var debuffList = "";
	$(debuff).each(function() {
		debuffList += "<img class='debuff-logo left' src='" + $(this).attr("data-src") + "' />";
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
	}
	var imgURL = "images/class/" + encodeURI($("#current-enemy-class").val()) + ".png";
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
	}
	$(element).find(".enemy-trait").html(trait.join(", "));
}

function resetEnemy(element) {
	$(element).hide();
	$(element).find(".enemy-img").attr("src", "images/bg_logo.png");
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
	}
	$(element).find(".enemy-class").attr("src", "images/class/Unknown.png");
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

$(document).ready(function() {
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
	switch (modalCaller) {
		case "servant":
			toServant(servantID);
			break;
		case "teammate1":
			toTeammate(1, servantID);
			break;
		case "teammate2":
			toTeammate(2, servantID);
			break;
		case "teammate3":
			toTeammate(3, servantID);
			break;
		case "teammate4":
			toTeammate(4, servantID);
			break;
		case "teammate5":
			toTeammate(5, servantID);
			break;
	}
	modalCaller = "";
}

function toServant(servantID) {
	servantInfo = servants.filter(function(obj) {
		return obj.id == servantID;
	});
	if ($("#servant-setup-collapsebtn").html() == "展開▼") {
		$("#servant-setup-collapsebtn").html("接疊▲");
		$("#servant-setup-collapsible").toggle(300);
	}
	$("#current-servant-img").attr("src", servantInfo[0].imgID);
	$("#current-servant-name").html(servantInfo[0].name);
	$("#current-servant-class").attr({
		"src": "images/class/" + servantInfo[0].classes + ".png",
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
	setSkill(skill1Toggle, 'skill1');
	setSkill(skill2Toggle, 'skill2');
	setSkill(skill3Toggle, 'skill3');
}

function resetServant() {
	setCurrentServantInfo();
	setCurrentServantNP();
	var skill1Toggle = $("#check-skill1-rankup");
	var skill2Toggle = $("#check-skill2-rankup");
	var skill3Toggle = $("#check-skill3-rankup");
	setSkill(skill1Toggle, 'skill1');
	setSkill(skill2Toggle, 'skill2');
	setSkill(skill3Toggle, 'skill3');
}

function setCurrentServantInfo() {
	if (servantSave[0] != undefined) {
		$("#current-servant-lv").val(servantSave[0].data[1]);
		$("#current-servant-nplv").val(servantSave[0].data[2]);
		$("#current-servant-statup").val(servantSave[0].data[4]);
		$("#current-servant-hp").val(100);
		$("#current-servant-rankup").attr("checked", servantSave[0].data[3]);
		$("#current-servant-npoc").val("oc1");
		$("#use-skill1").prop("checked", false);
		$("#skill1-img").removeClass("dull");
		$("#skill1-img").addClass("dull");
		$("#skill1-lv").val(servantSave[0].data[5]);
		$("#check-skill1-rankup").attr("checked", servantSave[0].data[6]);
		$("#use-skill2").prop("checked", false);
		$("#skill2-img").removeClass("dull");
		$("#skill2-img").addClass("dull");
		$("#skill2-lv").val(servantSave[0].data[7]);
		$("#check-skill2-rankup").attr("checked", servantSave[0].data[8]);
		$("#use-skill3").prop("checked", false);
		$("#skill3-img").removeClass("dull");
		$("#skill3-img").addClass("dull");
		$("#skill3-lv").val(servantSave[0].data[9]);
		$("#check-skill3-rankup").attr("checked", servantSave[0].data[10]);
	} else {
		$("#current-servant-lv").val(0);
		$("#current-servant-nplv").val(1);
		$("#current-servant-statup").val(0);
		$("#current-servant-hp").val(100);
		$("#current-servant-rankup").attr("checked", false);
		$("#current-servant-npoc").val("oc1");
		$("#skill1-lv").val(1);
		$("#check-skill1-rankup").attr("checked", false);
		$("#skill2-lv").val(1);
		$("#check-skill2-rankup").attr("checked", false);
		$("#skill3-lv").val(1);
		$("#check-skill3-rankup").attr("checked", false);
	}
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

function setSkill(toggle, skill) {
	if ($(toggle).is(":checked")) {
		$("#" + skill + "-img").attr("src", servantInfo[0][skill + "RUImgID"]);
		$("#" + skill + "-name").html(servantInfo[0][skill + "RUName"]);
		$("#" + skill + "-dscrp").html(servantInfo[0][skill + "RUDscrp"]);
		if (!servantInfo[0][skill + "RUBuff"].some(function(value) {
			return value == "card" || value == "dmg"
		})) {
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
		if (!servantInfo[0][skill + "Buff"].some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-" + skill).prop("disabled", true);
			$("#" + skill + "-lv").prop("disabled", true);
		} else {
			$("#use-" + skill).prop("disabled", false);
			$("#" + skill + "-lv").prop("disabled", false);
		}
	}
}

//Set Servant CE
var ceInfo = [];
var ceSave = [];

$(document).ready(function() {
	$("#servant-ce-max").change(function() {
		setCurrentServantCEEffect(this);
	});
});

function pickCE(essenceID) {
	closeModal();
	ceInfo = ce.filter(function(obj) {
		return obj.ceID == essenceID;
	});
	if ($("#ce-setup-collapsebtn").html() == "展開▼") {
		$("#ce-setup-collapsebtn").html("接疊▲");
		$("#ce-setup-collapsible").toggle(300);
	}
	$("#servant-ce-img").attr("src", ceInfo[0].ceImgID);
	$("#servant-ce-name").html(ceInfo[0].ceName);
	var starHTML = "";
	switch (ceInfo[0].ceStar) {
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

//Set Master Mystic Code
var masterInfo = [];
var masterSave = [];

$(document).ready(function() {
	generateMasterSelection();
	$("#master-name-selection").change(function() {
		setMaster(this);
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
		var masterInfo = master.filter(function(obj) {
			return obj.masterName == name;
		});
		$("#master-img1").attr("src", masterInfo.masterImgID1);
		$("#master-img2").attr("src", masterInfo.masterImgID2);
		$("#master-lv").prop("disabled", false);
		$("#master-skill1-logo").attr("src", masterInfo.skill1ImgID);
		if (!masterInfo[0].skill1Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#check-master-skill1").prop("disabled", true);
		} else {
			$("#check-master-skill1").prop("disabled", false);
		}
		$("#master-skill2-logo").attr("src", masterInfo.skill2ImgID);
		if (!masterInfo[0].skill2Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#check-master-skill2").prop("disabled", true);
		} else {
			$("#check-master-skill2").prop("disabled", false);
		}
		$("#master-skill3-logo").attr("src", masterInfo.skill3ImgID);
		if (!masterInfo[0].skill3Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#check-master-skill3").prop("disabled", true);
		} else {
			$("#check-master-skill3").prop("disabled", false);
		}
		$("#master-skill1-dscrp").html(masterInfo.skill1Dscrp);
		$("#master-skill2-dscrp").html(masterInfo.skill2Dscrp);
		$("#master-skill3-dscrp").html(masterInfo.skill3Dscrp);
		var masterSave = bgMaster.filter(function(obj) {
			return obj.name == name;
		});
		applyMaster();
	}
}

function applyMaster() {
	$("#master-skill1-logo").removeClass("dull");
	$("#master-skill1-logo").addClass("dull");
	$("#check-master-skill1").prop("checked", false);
	$("#master-skill2-logo").removeClass("dull");
	$("#master-skill2-logo").addClass("dull");
	$("#check-master-skill2").prop("checked", false);
	$("#master-skill3-logo").removeClass("dull");
	$("#master-skill3-logo").addClass("dull");
	$("#check-master-skill3").prop("checked", false);
	if (masterSave[0] != undefined) {
		$("#master-lv").val(ceSave[0].data[1]);
	} else {
		$("#master-lv").val(1);
	}
}
