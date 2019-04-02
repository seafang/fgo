var servants = parent.servants;
var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;

// Set Enemy
var enemyInfo = {};

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
	$(element).find(".enemy-trait").html(trait.join(", "));
}

function resetEnemy(element) {
	$(element).hide();
	$(element).find(".enemy-img").attr("src", "images/bg_logo.png");
	$(element).find(".enemy-name").html("");
	$(element).find(".enemy-class").attr("src", "images/class/Unknown.png");
	$(element).find(".enemy-gender").html("");
	$(element).find(".enemy-attribute").html("");
	$(element).find(".enemy-alignment1").html("");
	$(element).find(".enemy-alignment2").html("");
	$(element).find(".enemy-trait").html("");
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
	$("#current-servant-rankup").prop("disabled", !servantInfo[0].npRankUp);
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
	setSkill(skill1Toggle, 'skill1');
	setSkill(skill1Toggle, 'skill1');
}

function setCurrentServantInfo() {
	if (servantSave[0] != undefined) {
		$("#current-servant-lv").val(servantSave[0].data[1]);
		$("#current-servant-nplv").val(servantSave[0].data[2]);
		$("#current-servant-statup").val(servantSave[0].data[4]);
		$("#current-servant-hp").val(100);
		if (servantSave[0].data[3] == true) {
			$("#current-servant-rankup").attr("checked", true);
		}
		$("#current-servant-npoc").val("oc1");
		$("#skill1-lv").val(servantSave[0].data[5]);
		if (servantSave[0].data[6] == true) {
			$("#check-skill1-rankup").attr("checked", true);
		}
		$("#skill2-lv").val(servantSave[0].data[7]);
		if (servantSave[0].data[8] == true) {
			$("#check-skill2-rankup").attr("checked", true);
		}
		$("#skill3-lv").val(servantSave[0].data[9]);
		if (servantSave[0].data[10] == true) {
			$("#check-skill3-rankup").attr("checked", true);
		}
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
	var section = $(toggle).parents(".servant-skill-detail");
	if ($(toggle).is(":checked")) {
		$(section).find(".skill-img").attr("src", servantInfo[0][skill + "RUImgID"]);
		$(section).find(".skill-name").html(servantInfo[0][skill + "RUName"]);
		$(section).find(".skill-dscrp").html(servantInfo[0][skill + "RUDscrp"]);
		if (!servantInfo[0].skill1RUBuff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-skill1").prop("disable", true);
			$("#skill1-lv").prop("disable", true);
		} else {
			$("#use-skill1").prop("disable", false);
			$("#skill1-lv").prop("disable", false);
		}
		if (!servantInfo[0].skill2RUBuff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-skill2").prop("disable", true);
			$("#skill2-lv").prop("disable", true);
		} else {
			$("#use-skill2").prop("disable", false);
			$("#skill2-lv").prop("disable", false);
		}
		if (!servantInfo[0].skill3RUBuff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-skill3").prop("disable", true);
			$("#skill3-lv").prop("disable", true);
		} else {
			$("#use-skill3").prop("disable", false);
			$("#skill3-lv").prop("disable", false);
		}
	} else {
		$(section).find(".skill-img").attr("src", servantInfo[0][skill + "ImgID"]);
		$(section).find(".skill-name").html(servantInfo[0][skill + "Name"]);
		$(section).find(".skill-dscrp").html(servantInfo[0][skill + "Dscrp"]);
		if (!servantInfo[0].skill1Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-skill1").prop("disable", true);
			$("#skill1-lv").prop("disable", true);
		} else {
			$("#use-skill1").prop("disable", false);
			$("#skill1-lv").prop("disable", false);
		}
		if (!servantInfo[0].skill2Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-skill2").prop("disable", true);
			$("#skill2-lv").prop("disable", true);
		} else {
			$("#use-skill2").prop("disable", false);
			$("#skill2-lv").prop("disable", false);
		}
		if (!servantInfo[0].skill3Buff.some(function(value) {
			return value == "card" || value == "dmg"
		})) {
			$("#use-skill3").prop("disable", true);
			$("#skill3-lv").prop("disable", true);
		} else {
			$("#use-skill3").prop("disable", false);
			$("#skill3-lv").prop("disable", false);
		}
	}
}
