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
		$("input.current-enemy-trait[value="+value+"]").prop("checked", true)
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
	$(element).find(".enemy-trait").html(trait.toString());
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
var servantInfo = {};

function pickServant(servantID) {
	closeModal();
	servantInfo = servants.filter(function(obj) {
		return obj.id == servantID;
	});
	if ($("#servant-setup-collapsebtn").html() == "展開▼") {
		$("#servant-setup-collapsebtn").html("接疊▲");
		$("#servant-setup-collapsible").toggle(300);
	}
	$("#current-servant-img").attr("src", servantInfo[0].imgid);
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
	setCurrentServantInfo();
	$("#current-servant-gender").html(enemyInfo[0].gender);
	$("#current-servant-attribute").html(enemyInfo[0].attribute);
	$("#current-servant-alignment").html(enemyInfo[0].alignment1 + ", " + enemyInfo[0].alignment2);
	$("#current-servant-trait").html(enemyInfo[0].trait.toString());
	setCurrentServantNP();
	setSkill('#servant-skill1');
	setSkill('#servant-skill2');
	setSkill('#servant-skill3');
}

function resetServant() {
	setCurrentServantInfo();
	$("#current-servant-npoc").val("oc1");
	setSkill('#servant-skill1');
	setSkill('#servant-skill2');
	setSkill('#servant-skill3');
}
