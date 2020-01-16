var affinity = parent.affinity;
var multiplier = parent.multiplier;
var attrAffinity = parent.attrAffinity;

var common, servants;
var ce = parent.ce;
var master = parent.master;
var cc = parent.cc;

var skillBuff, npBuff, servantAtk;
var ceBuff = parent.ceBuff;
var ceAtk = parent.ceAtk;
var masterBuff = parent.masterBuff;
/* var ccBuff = parent.ccBuff; */

var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;
var bgMaster = parent.bgMaster;
var favouritePage = parent.favouritePage;

var modalCaller = "";

/* Layout */
$(document).ready(function() {
	updateCounter();
	$("#sim-enemy-setup-collapsebtn").click(function() {
		toggle(this, "#sim-enemy-setup-collapsible");
	});
	$(".sim-turn-togglebtn").click(function() {
		toggleEnemy(this);
	});
	$("#sim-master-setup-collapsebtn").click(function() {
		toggle(this, "#sim-master-setup-collapsible");
	});
	$(".sim-team-togglebtn").click(function() {
		toggleDetail(this);
	});

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
});

// Update page height
$(document).on("click", function() {
	updateCounter();
});

function updateCounter() {
	var height = $("#sim-enemy-info").outerHeight() + $("#sim-enemy-summary").outerHeight() + $("#sim-environment-info").outerHeight() +
		$("#sim-master-info").outerHeight() + $("#team-info").outerHeight() + $("#card-info").outerHeight() + $("#buff-assign-info").outerHeight() +
		1000;
	$("#sim-counter").html(height);
}

function toggleEnemy(button) {
	var turn = $(button).parents(".sim-turn-detail");
	if ($(button).html() == "接疊 ▲") {
		$(button).html("展開 ▼");
		$(turn).find(".sim-enemy-toggle").each(function() {
			$(this).hide(300);
		});
	} else {
		$(button).html("接疊 ▲");
		$(turn).find(".sim-enemy-toggle").each(function() {
			$(this).show(300);
			$(this).css("display", "flex");
		});
	}
}

function toggleDetail(button) {
	var member = $(button).attr("data-member");
	if ($(button).html() == "接疊 ▲") {
		$(button).html("展開 ▼");
		$("#" + member).find(".sim-member-toggle").each(function() {
			$(this).hide(300);
		});
	} else {
		$(button).html("接疊 ▲");
		$("#" + member).find(".sim-member-toggle").each(function() {
			$(this).show(300);
			$(this).css("display", "flex");
		});
	}
}

/* Misc */
// Check if any servant appears more than twice on the team
function countDuplicate(newID) {
	var test = false;
	var list = [];
	var count = 0;
	var team = ["member1Info", "member2Info", "member3Info", "member4Info", "member5Info", "member6Info"];

	// Loop through the team for a complete lsit of teammates
	$(team).each(function() {
		if (window[this][0] !== undefined) {
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
var turn1enemy1Debuff = [],
	turn1enemy2Debuff = [],
	turn1enemy3Debuff = [],
	turn2enemy1Debuff = [],
	turn2enemy2Debuff = [],
	turn2enemy3Debuff = [],
	turn3enemy1Debuff = [],
	turn3enemy2Debuff = [],
	turn3enemy3Debuff = [];
var turn1enemy1Trait = [],
	turn1enemy2Trait = [],
	turn1enemy3Trait = [],
	turn2enemy1Trait = [],
	turn2enemy2Trait = [],
	turn2enemy3Trait = [],
	turn3enemy1Trait = [],
	turn3enemy2Trait = [],
	turn3enemy3Trait = [];

$(document).ready(function() {
	// Open modals
	$("#sim-common-enemy-modalbtn").click(function() {
		openModal("#common-enemy-modal");
		loadCommonEnemyImg();
	});
	$("#sim-servant-enemy-modalbtn").click(function() {
		openModal("#servant-enemy-modal");
		loadServantEnemyImg();
	});

	// Clear current enemy setup
	$("#sim-current-enemy-resetbtn").click(function() {
		resetCurrentSimEnemy();
	});

	// Update trait array
	$(".sim-current-enemy-trait").change(function() {
		updateSimEnemyTrait();
	});
	$(".sim-current-enemy-trait-resetbtn").click(function() {
		resetSimEnemyTrait();
	});

	// Update debuff array
	$(".sim-current-enemy-debuff").change(function() {
		updateSimEnemyDebuff();
	});
	$(".sim-current-enemy-debuff-resetbtn").click(function() {
		resetSimEnemyDebuff();
	});

	// Set enemy
	$(".sim-enemy-applybtn").click(function() {
		var turn = $(this).attr("data-turn");
		var enemy = $(this).attr("data-enemy");

		setSimEnemy(turn, enemy);
	});

	// Remove enemy
	$(".sim-enemy-resetbtn").click(function() {
		var turn = $(this).attr("data-turn");
		var enemy = $(this).attr("data-enemy");

		resetSimEnemy(turn, enemy);
	});
});

// Update trait array
function updateSimEnemyTrait() {
	trait = [];
	$(".sim-current-enemy-trait:checked").each(function() {
		trait.push($(this).val())
	});
	if (trait[0] !== undefined) {
		$("#sim-current-enemy-trait-label").addClass("highlight")
	} else {
		$("#sim-current-enemy-trait-label").removeClass("highlight")
	}
}

// Reset trait
function resetSimEnemyTrait() {
	$(".sim-current-enemy-trait-type").each(function() {
		$(this).prop("checked", false);
	});
	updateSimEnemyTrait();
}

// Update debuff array
function updateSimEnemyDebuff() {
	debuff = [];
	$(".sim-current-enemy-debuff").each(function() {
		if ($(this).is(":checked")) {
			var obj = {};
			obj.name = $(this).val();
			obj.src = $(this).attr("data-src");
			debuff.push(obj);
		}
	});
	if (debuff[0] !== undefined) {
		$("#sim-current-enemy-debuff-label").addClass("highlight")
	} else {
		$("#sim-current-enemy-debuff-label").removeClass("highlight")
	}
}

// Reset trait
function resetSimEnemyDebuff() {
	$(".sim-current-enemy-debuff").each(function() {
		$(this).prop("checked", false);
	});
	updateSimEnemyDebuff();
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
	if ($("#sim-enemy-setup-collapsebtn").html() == "展開 ▼") {
		$("#sim-enemy-setup-collapsebtn").click();
	}

	$("#sim-current-enemy-img").attr("src", enemyInfo[0].imgID);
	$("#sim-current-enemy-name").html(enemyInfo[0].name);

	// Set class to 'Saber' if it's a non-servant enemy without pre-designated class
	if (enemyInfo[0].classes !== "All") {
		$("#sim-current-enemy-class").val(enemyInfo[0].classes);
		$("#sim-current-enemy-class").attr("title", enemyInfo[0].classes);
	} else {
		$("#sim-current-enemy-class").val("Saber");
		$("#sim-current-enemy-class").attr("title", "Saber");
	}

	$("#sim-current-enemy-gender").val(enemyInfo[0].gender);
	$("#sim-current-enemy-attribute").val(enemyInfo[0].attribute);
	$("#sim-current-enemy-alignment1").val(enemyInfo[0].alignment1);
	$("#sim-current-enemy-alignment2").val(enemyInfo[0].alignment2);

	var mult = 1;
	switch (enemyInfo[0].classes) {
		case "Rider":
			mult = 1.1;
			break;
		case "Caster":
		case "Mooncancer":
			mult = 1.2;
			break;
		case "Assassin":
			mult = 0.9;
			break;
		case "Berserker":
			mult = 0.8;
			break;
		default:
			mult = 1;
			break;
	}
	$("#sim-current-enemy-class-np-multiplier").val(mult);
	if (type == 2) {
		$("#sim-current-enemy-race-np-multiplier").val(enemyInfo[0].raceMult);
	} else {
		$("#sim-current-enemy-race-np-multiplier").val(1);
	}

	// Loop through the trait list and check all corresponding traits
	$(".sim-current-enemy-trait").prop("checked", false);
	$(enemyInfo[0].trait).each(function(index, value) {
		$("input.sim-current-enemy-trait[value=" + value + "]").prop("checked", true)
	});
	updateSimEnemyTrait();
}

// Initialise enemy setup
function resetCurrentSimEnemy() {
	$("#sim-current-enemy-img").attr("src", "images/bg_logo.webp");
	$("#sim-current-enemy-name").html("未選定/自訂敵人");
	$("#sim-current-enemy-class").val("Saber");
	$("#sim-current-enemy-gender").val("無性別");
	$("#sim-current-enemy-attribute").val("天");
	$("#sim-current-enemy-alignment1").val("不適用");
	$("#sim-current-enemy-alignment2").val("不適用");
	$("#sim-current-enemy-class-np-multiplier").val(1);
	$("#sim-current-enemy-race-np-multiplier").val(1);
	if ($("#sim-enemy-setup-collapsebtn").html() == "展開 ▼") {
		$("#sim-enemy-setup-collapsebtn").click();
	}
	$("#sim-current-enemy-trait-resetbtn").click();
	$("#sim-current-enemy-debuff-resetbtn").click();
}

// Set the enemy
function setSimEnemy(turn, enemy) {
	var section = $(".sim-turn-detail[data-turn='" + turn + "']");
	var element = $(section).find(".sim-enemy-detail[data-enemy='" + enemy + "']");

	// Check if is customising enemy
	if ($("#sim-current-enemy-name").html() == "未選定/自訂敵人") {
		$(element).find(".sim-enemy-img").attr("src", "images/bg_logo.webp");
	} else {
		$(element).find(".sim-enemy-img").attr("src", $("#sim-current-enemy-img").attr("src"));
	}
	if ($("#sim-current-enemy-name").html() == "未選定/自訂敵人") {
		$(element).find(".sim-enemy-name").html("自訂敵人");
	} else {
		$(element).find(".sim-enemy-name").html($("#sim-current-enemy-name").html());
	}

	// Display debuffs as logo, update enemy debuff lsit
	var debuffList = "";
	$(debuff).each(function(key, value) {
		debuffList += "<img class='debuff-logo' src='" + value.src + "' />";
	});
	$(element).find(".sim-enemy-debuff").html(debuffList);
	window[turn + enemy + "Debuff"] = debuff;

	// Display class as logo
	var imgURL = "images/class/" + encodeURI($("#sim-current-enemy-class").val()) + ".webp";
	$(element).find(".sim-enemy-class").attr({
		src: imgURL,
		title: $("#sim-current-enemy-class").val()
	});


	$(element).find(".sim-enemy-gender").html($("#sim-current-enemy-gender").val());
	$(element).find(".sim-enemy-attribute").html($("#sim-current-enemy-attribute").val());
	$(element).find(".sim-enemy-alignment1").html($("#sim-current-enemy-alignment1").val());
	$(element).find(".sim-enemy-alignment2").html($("#sim-current-enemy-alignment2").val());

	var classMult = Number(Number($("#sim-current-enemy-class-np-multiplier").val()).toFixed(1));
	if (classMult < 0.8) {
		classMult = 0.8;
	} else if (classMult > 1.2) {
		classMult = 1.2;
	}
	$("#sim-current-enemy-class-np-multiplier").val(classMult);
	$(element).find(".sim-enemy-class-np-multiplier").html(classMult);

	var raceMult = Number(Number($("#sim-current-enemy-race-np-multiplier").val()).toFixed(1));
	if (raceMult != 1 || raceMult != 1.2) {
		raceMult = 1;
	}
	$("#sim-current-enemy-race-np-multiplier").val(raceMult);
	$(element).find(".sim-enemy-race-np-multiplier").html(raceMult);

	var hp = Number(Number($("#sim-current-enemy-hp").val()).toFixed(0));
	if (hp < 0) {
		hp = 0;
	}
	$("#sim-current-enemy-hp").val(hp);
	$(element).find(".sim-enemy-hp").html(hp);

	// Display trait as string list, update enemy trait list
	window[turn + enemy + "Trait"] = trait;
	var string = trait.join(", ");
	if (string.length !== 0) {
		$(element).find(".sim-enemy-trait").html(string);
	} else {
		$(element).find(".sim-enemy-trait").html("無");
	}
}

// Remove enemy
function resetSimEnemy(turn, enemy) {
	var section = $(".sim-turn-detail[data-turn='" + turn + "']");
	var element = $(section).find(".sim-enemy-detail[data-enemy='" + enemy + "']");
	$(element).find(".sim-enemy-img").attr("src", "images/bg_logo.webp");
	$(element).find(".sim-enemy-name").html("未設定");
	window[turn + enemy + "Debuff"] = [];
	$(element).find(".sim-enemy-class").attr("src", "images/class/Unknown.webp");
	$(element).find(".sim-enemy-gender").html("N/A");
	$(element).find(".sim-enemy-attribute").html("N/A");
	$(element).find(".sim-enemy-alignment1").html("N/A");
	$(element).find(".sim-enemy-alignment2").html("N/A");
	$(element).find(".sim-enemy-class-np-multiplier").html(1);
	$(element).find(".sim-enemy-race-np-multiplier").html(1);
	$(element).find(".sim-enemy-hp").html(0);
	$(element).find(".sim-enemy-trait").html("N/A");
	window[turn + enemy + "Trait"] = [];
}

/* Set Battlefield */
var battlefield = [];

$(document).ready(function() {
	// Update battlefield list
	$(".sim-battlefield-type").change(function() {
		updateSimBattlefield();
	});

	// If 'rock mountain' is selected, automatically select 'mountain' as well
	$("#sim-battlefield-type11").change(function() {
		if ($(this).is(":checked")) {
			$("#sim-battlefield-type8").prop("checked", true);
		}
	});

	// Reset battelfield
	$("#sim-battlefield-resetbtn").click(function() {
		resetSimBattlefield();
	});
});

// Update battlefield
function updateSimBattlefield() {
	battlefield = [];
	$(".sim-battlefield-type").each(function() {
		if ($(this).is(":checked")) {
			battlefield.push($(this).val());
		}
	});
	if (battlefield[0] !== undefined) {
		$("#sim-battelfield-setup-label").addClass("highlight")
	} else {
		$("#sim-battelfield-setup-label").removeClass("highlight")
	}
}

// Reset battlefield
function resetSimBattlefield() {
	$(".sim-battlefield-type").each(function() {
		$(this).prop("checked", false);
	});
	updateSimBattlefield();
}


/* Set Master Mystic Code */
var masterInfo = [];
var masterSave = [];
var masterBuffList = [];
var masterSkillSet = [];

$(document).ready(function() {
	// Check if servant is set, open modal box
	generateSimMasterSelection();
	$("#sim-master-name-selection").change(function() {
		if ($("#current-servant-name").html() == "未選定從者") {
			$("#sim-master-name-selection").val("不使用魔術禮裝");
			alert("請先設定從者！");
		}
	});

	// Apply chosen mystic code's info
	$("#sim-master-name-selection").change(function() {
		setSimMaster(this);
	});

	// Remove chosen mystic code
	$("#sim-master-resetbtn").click(function() {
		applySimMaster();
	});
});

// Generate mystic code dropdown list
function generateSimMasterSelection() {
	var select = $("#sim-master-name-selection");
	$(master).each(function(index, value) {
		var name = value.name;
		var option = {
			value: name,
			text: name
		};
		select.append($('<option>', option));
	});
}

// Check if mystic code is chosen, retrieve mystic code info
function setSimMaster(element) {
	if ($(element).val() == "不使用魔術禮裝") {
		// Hide set-up section
		if ($("#sim-master-setup-collapsebtn").html() == "接疊 ▲") {
			$("#sim-master-setup-collapsebtn").click();
		}

		$("#sim-master-resetbtn").hide();

		// Clear all arrays
		masterInfo = [];
		masterSave = [];
		masterBuffList = [];
		masterSkillSet = [];

		$("#sim-master-selection-label").removeClass("highlight");

		// Initialise all fields
		$("#sim-master-img1").attr("src", "");
		$("#sim-master-img2").attr("src", "");
		$("#sim-master-lv").val(1);
		$("#sim-master-lv").prop("disabled", true);

		var skilllist = ["skill1", "skill2", "skill3"];
		$(skilllist).each(function() {
			$("#sim-master-" + this + "-logo").attr("src", "");
			$("#sim-master-" + this + "-logo").removeClass("dull");
			$("#sim-master-" + this + "-name").html("");
			$("#sim-master-" + this + "-dscrp").html("");
		});
	} else {
		// Reveal set-up section if hiden
		if ($("#sim-master-setup-collapsebtn").html() == "展開 ▼") {
			$("#sim-master-setup-collapsebtn").click();
		}

		$("#sim-master-resetbtn").show();
		$("#sim-master-selection-label").addClass("highlight");

		var name = $(element).val();
		masterInfo = master.filter(function(obj) {
			return obj.name == name;
		});

		// Filter useful skill buffs by mystic code & dmage related buffs
		masterBuffList = multiFilter(masterBuff, {
			name: [name],
			effect: ["dmg", "adddmg", "buster", "arts", "quick", "npdmg", "nprate", "npgain", "starrate", "stargain", "crit"]
		});

		// Apply mystic code info
		$("#sim-master-img1").attr("src", masterInfo[0].imgID1);
		$("#sim-master-img2").attr("src", masterInfo[0].imgID2);
		$("#sim-master-lv").prop("disabled", false);

		// Set skill logos, determine if skills need to be disabled
		var skilllist = ["skill1", "skill2", "skill3"];
		$(skilllist).each(function() {
			$("#sim-master-" + this + "-logo").attr("src", masterInfo[0][this + "ImgID"]);
			$("#sim-master-" + this + "-name").html(masterInfo[0][this + "Name"]);
			$("#sim-master-" + this + "-dscrp").html(masterInfo[0][this + "Dscrp"]);
		});

		// Retrieve saved mystic code data
		masterSave = bgMaster.filter(function(obj) {
			return obj.name == name;
		});
		applySimMaster();
	}
}

// Retrieve saved mystic code data
function applySimMaster() {
	var skilllist = ["skill1", "skill2", "skill3"];
	$(skilllist).each(function() {
		$("#sim-master-" + this + "-logo").addClass("dull");
	});
	if (masterSave[0] != undefined) {
		$("#sim-master-lv").val(masterSave[0].data[1]);
	} else {
		$("#sim-master-lv").val(1);
	}
}


/*Set Servant*/
var member1Info = [],
	member2Info = [],
	member3Info = [],
	member4Info = [],
	member5Info = [],
	member6Info = [];
var member1Save = [],
	member2Save = [],
	member3Save = [],
	member4Save = [],
	member5Save = [],
	member5Save = [];
var member1AffList = [],
	member2AffList = [],
	member3AffList = [],
	member4AffList = [],
	member5AffList = [],
	member6AffList = [];
var member1Mult = [],
	member2Mult = [],
	member3Mult = [],
	member4Mult = [],
	member5Mult = [],
	member6Mult = [];
var member1AttrAffList = [],
	member2AttrAffList = [],
	member3AttrAffList = [],
	member4AttrAffList = [],
	member5AttrAffList = [],
	member6AttrAffList = [];
var member1AtkList = [],
	member2AtkList = [],
	member3AtkList = [],
	member4AtkList = [],
	member5AtkList = [],
	member6AtkList = [];
var member1SkillBuffList = [],
	member2SkillBuffList = [],
	member3SkillBuffList = [],
	member4SkillBuffList = [],
	member5SkillBuffList = [],
	member6SkillBuffList = [];
var member1NPBuffList = [],
	member2NPBuffList = [],
	member3NPBuffList = [],
	member4NPBuffList = [],
	member5NPBuffList = [],
	member6NPBuffList = [];
var member1CEInfo = [],
	member2CEInfo = [],
	member3CEInfo = [],
	member4CEInfo = [],
	member5CEInfo = [],
	member6CEInfo = [];
var member1CESave = [],
	member2CESave = [],
	member3CESave = [],
	member4CESave = [],
	member5CESave = [],
	member6CESave = [];
var member1CEBuffList = [],
	member2CEBuffList = [],
	member3CEBuffList = [],
	member4CEBuffList = [],
	member5CEBuffList = [],
	member6CEBuffList = [];
var member1Buff = [0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0],
	member2Buff = [0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0],
	member3Buff = [0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0],
	member4Buff = [0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0],
	member5Buff = [0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0],
	member6Buff = [0, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0];

$(document).ready(function() {
	// Check if servant is chosen, open modal box
	$(".member-modalbtn").click(function() {
		var member = $(this).attr("data-member");
		openModal("#servant-modal");
		setCaller(member);
		loadServantImg();
	});

	$(".member-ce-modalbtn").click(function() {
		var member = $(this).attr("data-member");
		openModal("#ce-modal");
		setCaller(member);
		loadServantImg();
	});
});