/* Misc */
function toggleFilter(button, element) {
	if ($(button).html() == "+") {
		$(button).html("–");
	} else {
		$(button).html("+");
	}
	$(element).toggle(300);
}

/* Common Enemy Modal */
let commonEnemyFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner",
	"Beast I", "Beast II", "Beast III／L", "Beast III／R", "All"],
	timeline: ["第一部", "亞種特異點", "第二部", "活動限定"],
	type: ["小怪", "頭目", "活動亞種 (小怪)", "活動亞種 (頭目)", "特殊"],
	race: []
};

$(document).ready(function() {
	$("#common-enemy-all-resetbtn").click(function() {
		initialCommonEnemy();
	});

	$(".enemy-family-heading").click(function() {
		var value = $(this).attr("data-corr");
		if ($(this).children("span.right").html() == "▼") {
			$(this).children("span.right").html("▲");
			$(this).css("border-bottom", "solid");
			$(".enemy-family-category[data-corr='" + value + "']").css("display", "flex");
		} else {
			$(this).children("span.right").html("▼");
			if (!$(this).hasClass("enemy-family-heading-last")) {
				$(this).css("border-bottom", "none");
			}
			$(".enemy-family-category[data-corr='" + value + "']").hide();
		}
	});

	// Change in class filtering criteria
	$(".common-enemy-class").click(function() {
		var servantClass = $(this).attr("title");
		commonEnemyClassChange(this, servantClass);
	});
	$("#common-enemy-class-setbtn").click(function() {
		commonEnemyClassAll();
	});
	$("#common-enemy-class-resetbtn").click(function() {
		commonEnemyClassNone();
	});

	// Change in timeline filtering criteria
	$(".common-enemy-timeline").click(function() {
		var timeline = $(this).val();
		commonEnemyTimelineChange(this, timeline);
	});
	$("#common-enemy-timeline-setbtn").click(function() {
		commonEnemyTimelineAll();
	});
	$("#common-enemy-timeline-resetbtn").click(function() {
		commonEnemyTimelineNone();
	});

	// Change in type filtering criteria
	$(".common-enemy-type").click(function() {
		var type = $(this).val();
		commonEnemyTypeChange(this, type);
	});
	$("#common-enemy-type-setbtn").click(function() {
		commonEnemyTypeAll();
	});
	$("#common-enemy-type-resetbtn").click(function() {
		commonEnemyTypeNone();
	});

	// Change in race filtering criteria
	$(".common-enemy-race").click(function() {
		var race = $(this).val();
		commonEnemyRaceChange(this, race);
	});
	$("#common-enemy-race-setbtn").click(function() {
		commonEnemyRaceAll();
	});
	$("#common-enemy-race-resetbtn").click(function() {
		commonEnemyRaceNone();
	});

	// Apply filter & generate new image list
	$("#common-enemy-filterbtn").click(function() {
		loadCommonEnemyImg();
	});
});

// Generate image list
function loadCommonEnemyImg() {
	var filteredCommonEnemy = multiFilter(common, commonEnemyFilter);
	var commonEnemyName = filteredCommonEnemy.map(function(enemy) {
		return enemy.name;
	});
	$("#common-enemy-img").html("");
	var imglist = "";
	$(commonEnemyName).each(function() {
		imglist += "<img class='enemy-img common-enemy-modal-img' src='images/enemy/" + this +
			".webp' title='" + this + "' />"
	});
	$("#common-enemy-img").html(imglist);
	commonEnemyBind();
}

// Attach event handlers to the images
function commonEnemyBind() {
	$(".common-enemy-modal-img").ready(function() {
		$(".common-enemy-modal-img").click(function() {
			var name = $(this).attr("title");
			pickEnemy(2, name);
		});
	});
}

// Change in class filtering criteria
function commonEnemyClassChange(element, className) {
	var newClass = commonEnemyFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		commonEnemyFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		commonEnemyFilter.classes = newClass;
	}
}

function commonEnemyClassAll() {
	$(".common-enemy-class").removeClass("dull");
	commonEnemyFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner",
	"Beast I", "Beast II", "Beast III／L", "Beast III／R", "All"];
}

function commonEnemyClassNone() {
	$(".common-enemy-class").addClass("dull");
	commonEnemyFilter.classes = [];
}

// Change in timeline filtering criteria
function commonEnemyTimelineChange(element, timeline) {
	var newTimeline = commonEnemyFilter.timeline;
	if ($(element).prop("checked")) {
		newTimeline.push(timeline);
		commonEnemyFilter.timeline = newTimeline;
	} else {
		position = newTimeline.indexOf(timeline);
		newTimeline.splice(position, 1);
		commonEnemyFilter.timeline = newTimeline;
	}
}

function commonEnemyTimelineAll() {
	$(".common-enemy-timeline").prop("checked", true);
	commonEnemyFilter.timeline = ["第一部", "亞種特異點", "第二部", "活動限定"];
}

function commonEnemyTimelineNone() {
	$(".common-enemy-timeline").prop("checked", false);
	commonEnemyFilter.timeline = [];
}

// Change in type filtering criteria
function commonEnemyTypeChange(element, typeName) {
	var newType = commonEnemyFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		commonEnemyFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		commonEnemyFilter.type = newType;
	}
}

function commonEnemyTypeAll() {
	$(".common-enemy-type").prop("checked", true);
	commonEnemyFilter.type = ["小怪", "頭目", "活動亞種 (小怪)", "活動亞種 (頭目)", "特殊"];
}

function commonEnemyTypeNone() {
	$(".common-enemy-type").prop("checked", false);
	commonEnemyFilter.type = [];
}

// Change in race filtering criteria
function commonEnemyRaceChange(element, raceName) {
	var newRace = commonEnemyFilter.race;
	if ($(element).prop("checked")) {
		newRace.push(raceName);
		commonEnemyFilter.race = newRace;
	} else {
		position = newRace.indexOf(raceName);
		newRace.splice(position, 1);
		commonEnemyFilter.race = newRace;
	}
}

function commonEnemyRaceAll() {
	$(".common-enemy-race").prop("checked", true);
	commonEnemyFilter.race = ["士兵", "海盜", "凱爾特士兵", "亞馬遜人", "皮克特人", "肅正騎士", "醉酒城裡人",
	       "失心之人", "流氓", "雀蜂", "酷吏", "殺戮獵兵", "近衛兵", "獸人", "蛇女", "半人馬",
	       "雅嘎", "從者", "哈桑", "瓦爾基里", "獸", "拉赫穆", "魔神", "骷髏兵", "龍牙兵",
	       "殭屍", "屍人", "鬼魂", "七人禦佐姬", "巨大鬼魂", "黑武者", "食屍鬼", "惡魔",
	       "凝視者", "鬼", "小鬼", "大鬼", "門", "手", "雷石", "魔偶", "人工生命體",
	       "咒語書", "魔法杖", "女官", "自動人偶", "混沌機械兵", "機械化步兵", "自動防衛裝置",
	       "英靈兵", "多多益善號", "迷你信", "巨大信", "翅刃蟲", "寄居蟹", "魔豬", "巨大魔豬",
	       "烏利迪姆", "烏伽爾", "斬首雞", "灰狼", "魔猿", "雙足飛龍", "龍", "穆修胡休",
	       "奇美拉", "海魔", "守護者", "雙角獸", "噬魂者", "斯芬克斯", "伊夫利塔", "許德拉",
	       "夏塔克鳥", "鵺", "巨人", "空想樹", "其他"];
}

function commonEnemyRaceNone() {
	$(".common-enemy-race").prop("checked", false);
	commonEnemyFilter.race = [];
}

// Initialise all filters
function initialCommonEnemy() {
	commonEnemyClassAll();
	commonEnemyTimelineAll();
	commonEnemyTypeAll();
	commonEnemyRaceNone();
}


/* Servant Enemy Modal */
let servantEnemyFilter = {
	classes: [], // Empty list by default
	star: []
};

$(document).ready(function() {
	$("#servant-enemy-all-resetbtn").click(function() {
		initialServantEnemy();
	});

	// Change in class filtering criteria
	$(".servant-enemy-class").click(function() {
		var servantClass = $(this).attr("title");
		servantEnemyClassChange(this, servantClass);
	});
	$("#servant-enemy-class-setbtn").click(function() {
		servantEnemyClassAll();
	});
	$("#servant-enemy-class-resetbtn").click(function() {
		servantEnemyClassNone();
	});

	// Change in star filtering criteria
	$(".servant-enemy-star").change(function() {
		var star = Number($(this).val());
		servantEnemyStarChange(this, star);
	});
	$("#servant-enemy-star-setbtn").click(function() {
		servantEnemyStarAll();
	});
	$("#servant-enemy-star-resetbtn").click(function() {
		servantEnemyStarNone();
	});

	// Apply filter & generate new image list
	$("#servant-enemy-filterbtn").click(function() {
		loadServantEnemyImg();
	});
});

// Generate image list
function loadServantEnemyImg() {
	var filteredServantEnemy = multiFilter(servants, servantEnemyFilter);
	var servantEnemyID = filteredServantEnemy.map(function(servant) { // Map an array with servant ID & name that matched criteria
		return [servant.id, servant.name];
	});
	$("#servant-enemy-img").html("");
	var imglist = "";
	$(servantEnemyID).each(function() {
		imglist += "<img class='servant-img servant-enemy-modal-img' src='images/servant/" + this[0] +
			".webp' title='" + this[1] + "' data-id='" + this[0] + "' />"
	});
	$("#servant-enemy-img").html(imglist);
	servantEnemyBind();
}

// Attach event handlers to the images
function servantEnemyBind() {
	$(".servant-enemy-modal-img").ready(function() {
		$(".servant-enemy-modal-img").click(function() {
			var id = Number($(this).attr("data-id"));
			pickEnemy(1, id);
		});
	});
}

// Change in class filtering criteria
function servantEnemyClassChange(element, className) {
	var newClass = servantEnemyFilter.classes;
	if ($(element).hasClass("dull")) { // Check if the class had been deselected
		$(element).removeClass("dull"); // Reselect the class
		newClass.push(className); // Add the class back into the filter list
		servantEnemyFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className); // Search the location of the class in the filter list
		newClass.splice(position, 1); // Remove the class from the filter list
		$(element).addClass("dull"); // Deselect the class
		servantEnemyFilter.classes = newClass;
	}
}

function servantEnemyClassAll() {
	$(".servant-enemy-class").removeClass("dull"); // Reselect all classes
	servantEnemyFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"]; // Return the filter list to default
}

function servantEnemyClassNone() {
	$(".servant-enemy-class").addClass("dull"); // Deselect all classes
	servantEnemyFilter.classes = []; // Empty the filter list
}

// Change in star filtering criteria
function servantEnemyStarChange(element, starNo) {
	var newStar = servantEnemyFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		servantEnemyFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		servantEnemyFilter.star = newStar;
	}
}

function servantEnemyStarAll() {
	$(".servant-enemy-star").prop("checked", true);
	servantEnemyFilter.star = [0, 1, 2, 3, 4, 5];
}

function servantEnemyStarNone() {
	$(".servant-enemy-star").prop("checked", false);
	servantEnemyFilter.star = [];
}

// Initialise all filters
function initialServantEnemy() {
	servantEnemyClassNone();
	servantEnemyStarNone();
}


/* Servant Modal */
let servantFilter = {
	classes: [], // Empty filter by default
	star: [],
	type: [],
	attribute: ["天", "地", "人", "星", "獸"],
	gender: ["男性", "女性", "不明"],
	alignment1: ["秩序", "中立", "混沌"],
	alignment2: ["善", "中庸", "惡", "狂", "花嫁", "夏"],
	npColor: ["Buster", "Arts", "Quick"],
	npRange: ["全體", "單體"], // Exclude support & other
	ability: ["必中", "無敵貫通", "無視防禦", "不適用"],
	extraDamage: ["無特攻", "男性", "女性", "混沌", "惡", "天之力", "地之力",
		"人之力", "人型", "從者", "人類", "神性", "王", "羅馬", "希臘神話系男性", "人類威脅", "阿爾托莉亞臉",
		"亞瑟", "所愛之人", "騎乘", "龍", "魔性", "猛獸", "死靈", "惡魔", "超巨大", "毒", "Saber", "Saber職階從者"],
	owned: [true, false],
};

$(document).ready(function() {
	$("#servant-all-resetbtn").click(function() {
		initialServant();
	});

	$("#servant-modal-filter-box-toggle").click(function() {
		toggleFilter(this, "#servant-modal-filter-box-content");
	});

	// Change in class filtering criteria
	$(".servant-class").click(function() {
		var servantClass = $(this).attr("title");
		servantClassChange(this, servantClass);
	});
	$("#servant-class-setbtn").click(function() {
		servantClassAll();
	});
	$("#servant-class-resetbtn").click(function() {
		servantClassNone();
	});

	// Change in star filtering criteria
	$(".servant-star").change(function() {
		var star = Number($(this).val());
		servantStarChange(this, star);
	});
	$("#servant-star-setbtn").click(function() {
		servantStarAll();
	});
	$("#servant-star-resetbtn").click(function() {
		servantStarNone();
	});

	// Change in type filtering criteria
	$(".servant-type").change(function() {
		var type = $(this).val();
		servantTypeChange(this, type);
	});
	$("#servant-type-setbtn").click(function() {
		servantTypeAll();
	});
	$("#servant-type-resetbtn").click(function() {
		servantTypeNone();
	});

	// Change in attribute filtering criteria
	$(".servant-attribute").change(function() {
		var attribute = $(this).val();
		servantAttributeChange(this, attribute);
	});
	$("#servant-attribute-setbtn").click(function() {
		servantAttributeAll();
	});
	$("#servant-attribute-resetbtn").click(function() {
		servantAttributeNone();
	});

	// Change in gender filtering criteria
	$(".servant-gender").change(function() {
		var gender = $(this).val();
		servantGenderChange(this, gender);
	});
	$("#servant-gender-setbtn").click(function() {
		servantGenderAll();
	});
	$("#servant-gender-resetbtn").click(function() {
		servantGenderNone();
	});

	// Change in alignment 1 filtering criteria
	$(".servant-alignment1").change(function() {
		var alignment1 = $(this).val();
		servantAlignment1Change(this, alignment1);
	});
	$("#servant-alignment1-setbtn").click(function() {
		servantAlignment1All();
	});
	$("#servant-alignment1-resetbtn").click(function() {
		servantAlignment1None();
	});

	// Change in alignment 2 filtering criteria
	$(".servant-alignment2").change(function() {
		var alignment2 = $(this).val();
		servantAlignment2Change(this, alignment2);
	});
	$("#servant-alignment2-setbtn").click(function() {
		servantAlignment2All();
	});
	$("#servant-alignment2-resetbtn").click(function() {
		servantAlignment2None();
	});

	// Change in NP color filtering criteria
	$(".servant-color").change(function() {
		var color = $(this).val();
		servantColorChange(this, color);
	});
	$("#servant-color-setbtn").click(function() {
		servantColorAll();
	});
	$("#servant-color-resetbtn").click(function() {
		servantColorNone();
	});

	// Change in NP range filtering criteria
	$(".servant-range").change(function() {
		var range = $(this).val();
		servantRangeChange(this, range);
	});
	$("#servant-range-setbtn").click(function() {
		servantRangeAll();
	});
	$("#servant-range-resetbtn").click(function() {
		servantRangeNone();
	});

	// Change in ability filtering criteria
	$(".servant-ability").change(function() {
		var ability = $(this).val();
		servantAbilityChange(this, ability);
	});
	$("#servant-ability-setbtn").click(function() {
		servantAbilityAll();
	});
	$("#servant-ability-resetbtn").click(function() {
		servantAbilityNone();
	});

	// Change in extra-damage filtering criteria
	$(".servant-ed").change(function() {
		var ed = $(this).val();
		servantEDChange(this, ed);
	});
	$("#servant-ed-setbtn").click(function() {
		servantEDAll();
	});
	$("#servant-ed-resetbtn").click(function() {
		servantEDNone();
	});

	// Change in ownership filtering criteria
	$("#servant-owned").change(function() {
		servantInclusiveChange(this);
	});

	// Apply filter & generate new image list
	$("#servant-filterbtn").click(function() {
		loadServantImg();
	});
});

// Generate image list
function loadServantImg() {
	var filteredServant = multiFilter(servants, servantFilter);
	var servantList = filteredServant.map(function(servant) {
		return [servant.id, servant.name];
	});
	$("#servant-img").html("");
	var imglist = "";
	$(servantList).each(function() {
		imglist += "<img class='servant-img servant-modal-img' src='images/servant/" + this[0] +
			".webp' title='" + this[1] + "' data-id='" + this[0] + "' />"
	});
	$("#servant-img").html(imglist);
	servantBind();
}

// Attach event handler to images
function servantBind() {
	if ($(parent.document).contents().find("iframe").attr("src") != "sim.html") {
		$(".servant-modal-img").ready(function() {
			$(".servant-modal-img").click(function() {
				var id = Number($(this).attr("data-id"));
				pickServant(id);
			});
		});
	} else {
		$(".servant-modal-img").ready(function() {
			$(".servant-modal-img").click(function() {
				var id = Number($(this).attr("data-id"));
				pickServant(modalCaller, id, false);
			});
		});
	}
}

// Change in class filtering criteria
function servantClassChange(element, className) {
	var newClass = servantFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		servantFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		servantFilter.classes = newClass;
	}
}

function servantClassAll() {
	$(".servant-class").removeClass("dull");
	servantFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Ruler", "Avenger", "Mooncancer", "Foreigner"]; // Exclude Mashu
}

function servantClassNone() {
	$(".servant-class").addClass("dull");
	servantFilter.classes = [];
}

// Change in star filtering criteria
function servantStarChange(element, starNo) {
	var newStar = servantFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		servantFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		servantFilter.star = newStar;
	}
}

function servantStarAll() {
	$(".servant-star").prop("checked", true);
	servantFilter.star = [0, 1, 2, 3, 4, 5];
}

function servantStarNone() {
	$(".servant-star").prop("checked", false);
	servantFilter.star = [];
}

// Change in type filtering criteria
function servantTypeChange(element, typeName) {
	var newType = servantFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		servantFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		servantFilter.type = newType;
	}
}

function servantTypeAll() {
	$(".servant-type").prop("checked", true);
	servantFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"];
}

function servantTypeNone() {
	$(".servant-type").prop("checked", false);
	servantFilter.type = [];
}

// Change in attribute filtering criteria
function servantAttributeChange(element, attributeName) {
	var newAttribute = servantFilter.attribute;
	if ($(element).prop("checked")) {
		newAttribute.push(attributeName);
		servantFilter.attribute = newAttribute;
	} else {
		position = newAttribute.indexOf(attributeName);
		newAttribute.splice(position, 1);
		servantFilter.attribute = newAttribute;
	}
}

function servantAttributeAll() {
	$(".servant-attribute").prop("checked", true);
	servantFilter.attribute = ["天", "地", "人", "星", "獸"];
}

function servantAttributeNone() {
	$(".servant-attribute").prop("checked", false);
	servantFilter.attribute = [];
}

// Change in gender filtering criteria
function servantGenderChange(element, genderName) {
	var newGender = servantFilter.gender;
	if ($(element).prop("checked")) {
		newGender.push(genderName);
		servantFilter.gender = newGender;
	} else {
		position = newGender.indexOf(genderName);
		newGender.splice(position, 1);
		servantFilter.gender = newGender;
	}
}

function servantGenderAll() {
	$(".servant-gender").prop("checked", true);
	servantFilter.gender = ["男性", "女性", "不明"];
}

function servantGenderNone() {
	$(".servant-gender").prop("checked", false);
	servantFilter.gender = [];
}

// Change in alignment 1 filtering criteria
function servantAlignment1Change(element, alignment1Name) {
	var newAlignment1 = servantFilter.alignment1;
	if ($(element).prop("checked")) {
		newAlignment1.push(alignment1Name);
		servantFilter.alignment1 = newAlignment1;
	} else {
		position = newAlignment1.indexOf(alignment1Name);
		newAlignment1.splice(position, 1);
		servantFilter.alignment1 = newAlignment1;
	}
}

function servantAlignment1All() {
	$(".servant-alignment1").prop("checked", true);
	servantFilter.alignment1 = ["秩序", "中立", "混沌"];
}

function servantAlignment1None() {
	$(".servant-alignment1").prop("checked", false);
	servantFilter.alignment1 = [];
}

// Change in alignment 2 filtering criteria
function servantAlignment2Change(element, alignment2Name) {
	var newAlignment2 = servantFilter.alignment2;
	if ($(element).prop("checked")) {
		newAlignment2.push(alignment2Name);
		servantFilter.alignment2 = newAlignment2;
	} else {
		position = newAlignment2.indexOf(alignment2Name);
		newAlignment2.splice(position, 1);
		servantFilter.alignment2 = newAlignment2;
	}
}

function servantAlignment2All() {
	$(".servant-alignment2").prop("checked", true);
	servantFilter.alignment2 = ["善", "中庸", "惡", "狂", "花嫁", "夏"];
}

function servantAlignment2None() {
	$(".servant-alignment2").prop("checked", false);
	servantFilter.alignment2 = [];
}

// Change in NP color filtering criteria
function servantColorChange(element, colorName) {
	var newColor = servantFilter.npColor;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		servantFilter.npColor = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		servantFilter.npColor = newColor;
	}
}

function servantColorAll() {
	$(".servant-color").prop("checked", true);
	servantFilter.npColor = ["Buster", "Arts", "Quick"];
}

function servantColorNone() {
	$(".servant-color").prop("checked", false);
	servantFilter.npColor = [];
}

// Change in NP range filtering criteria
function servantRangeChange(element, rangeName) {
	var newRange = servantFilter.npRange;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		servantFilter.npRange = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		servantFilter.npRange = newRange;
	}
}

function servantRangeAll() {
	$(".servant-range").prop("checked", true);
	servantFilter.npRange = ["全體", "單體"];
}

function servantRangeNone() {
	$(".servant-range").prop("checked", false);
	servantFilter.npRange = [];
}

// Change in NP ability filtering criteria
function servantAbilityChange(element, abilityName) {
	var newAbility = servantFilter.ability;
	if ($(element).prop("checked")) {
		newAbility.push(abilityName);
		servantFilter.ability = newAbility;
	} else {
		position = newAbility.indexOf(abilityName);
		newAbility.splice(position, 1);
		servantFilter.ability = newAbility;
	}
}

function servantAbilityAll() {
	$(".servant-ability").prop("checked", true);
	servantFilter.ability = ["必中", "無敵貫通", "無視防禦", "不適用"];
}

function servantAbilityNone() {
	$(".servant-ability").prop("checked", false);
	servantFilter.ability = [];
}

// Change in extra-damage filtering criteria
function servantEDChange(element, edName) {
	var newED = servantFilter.extraDamage;
	if ($(element).prop("checked")) {
		newED.push(edName);
		servantFilter.extraDamage = newED;
	} else {
		position = newED.indexOf(edName);
		newED.splice(position, 1);
		servantFilter.extraDamage = newED;
	}
}

function servantEDAll() {
	$(".servant-ed").prop("checked", true);
	servantFilter.extraDamage = ["無特攻", "男性", "女性", "混沌", "惡", "天之力", "地之力",
		      "人之力", "人型", "從者", "人類", "神性", "王", "羅馬", "希臘神話系男性", "人類威脅", "阿爾托莉亞臉",
		      "亞瑟", "所愛之人", "騎乘", "龍", "魔性", "猛獸", "死靈", "惡魔", "超巨大", "毒", "Saber", "Saber職階從者"];
}

function servantEDNone() {
	$(".servant-ed").prop("checked", false);
	servantFilter.extraDamage = [];
}

// Change in ownership filtering criteria
function servantInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		servantFilter.owned = [true];
	} else {
		servantFilter.owned = [true, false];
	}
}

function servantInclusiveReset() {
	$("#servant-owned").prop("checked", false);
	servantFilter.owned = [true, false];
}

// Initialise all filters
function initialServant() {
	servantClassNone();
	servantStarNone();
	servantTypeNone();
	servantAttributeAll();
	servantGenderAll();
	servantAlignment1All();
	servantAlignment2All();
	servantColorAll();
	servantRangeAll();
	servantAbilityAll();
	servantEDAll();
	servantInclusiveReset();
}


/* CE Modal */
let ceFilter = {
	star: [],
	type: [],
	effect: ["攻擊力", "Buster性能", "Arts性能", "Quick性能", "寶具威力", "起始NP", "每回合NP",
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加",
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP",
		"狀態耐性", "狀態無效", "狀態成功率", "其他"],
	frequent: [true, false],
	owned: [true, false]
};


$(document).ready(function() {
	$("#ce-all-resetbtn").click(function() {
		initialCE();
	});

	// Change in star filtering criteria
	$(".ce-star").change(function() {
		var star = Number($(this).val());
		ceStarChange(this, star);
	});
	$("#ce-star-setbtn").click(function() {
		ceStarAll();
	});
	$("#ce-star-resetbtn").click(function() {
		ceStarNone();
	});

	// Change in type filtering criteria
	$(".ce-type").change(function() {
		var type = $(this).val();
		ceTypeChange(this, type);
	});
	$("#ce-type-setbtn").click(function() {
		ceTypeAll();
	});
	$("#ce-type-resetbtn").click(function() {
		ceTypeNone();
	});

	// Change in effect filtering criteria
	$(".ce-effect").change(function() {
		var effect = $(this).val();
		ceEffectChange(this, effect);
	});
	$("#ce-effect-setbtn").click(function() {
		ceEffectAll();
	});
	$("#ce-effect-resetbtn").click(function() {
		ceEffectNone();
	});

	// Change in ownership filtering criteria
	$("#modal-ce-owned").change(function() {
		ceInclusiveChange(this);
	});

	// Change in frequency filtering criteria
	$("#modal-ce-frequent").change(function() {
		ceFrequentChange(this);
	});

	// Apply filters and generate image list
	$("#ce-filterbtn").click(function() {
		loadCEImg();
	});
});

// Apply filters and generate image list
function loadCEImg() {
	var filteredCE = multiFilter(ce, ceFilter);
	var ceList = filteredCE.map(function(essence) {
		return [essence.id, essence.name];
	});
	$("#ce-img").html("");
	var imglist = "";
	$(ceList).each(function() {
		imglist += "<img class='essence-img ce-modal-img' src='images/ce/" + this[0] +
			".webp' title='" + this[1] + "' data-id='" + this[0] + "' />"
	});
	$("#ce-img").html(imglist);
	ceBind();
}

// Attach event handler to the images
function ceBind() {
	if ($(parent.document).contents().find("iframe").attr("src") != "sim.html") {
		$(".ce-modal-img").ready(function() {
			$(".ce-modal-img").click(function() {
				var id = Number($(this).attr("data-id"));
				pickCE(id);
			});
		});
	} else {
		$(".ce-modal-img").ready(function() {
			$(".ce-modal-img").click(function() {
				var id = Number($(this).attr("data-id"));
				pickCE(modalCaller, id);
			});
		});
	}
}

// Change in star filtering criteria
function ceStarChange(element, starNo) {
	var newStar = ceFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		ceFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		ceFilter.star = newStar;
	}
}

function ceStarAll() {
	$(".ce-star").prop("checked", true);
	ceFilter.star = [3, 4, 5]; // Only includes CE at or above 3 stars
}

function ceStarNone() {
	$(".ce-star").prop("checked", false);
	ceFilter.star = [];
}

// Change in type filtering criteria
function ceTypeChange(element, typeName) {
	var newType = ceFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		ceFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		ceFilter.type = newType;
	}
}

function ceTypeAll() {
	$(".ce-type").prop("checked", true);
	ceFilter.type = ["常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"];
}

function ceTypeNone() {
	$(".ce-type").prop("checked", false);
	ceFilter.type = [];
}

// Change in effect filtering criteria
function ceEffectChange(element, effect) {
	var newEffect = ceFilter.effect;
	if ($(element).prop("checked")) {
		newEffect.push(effect);
		ceFilter.effect = newEffect;
	} else {
		position = newEffect.indexOf(effect);
		newEffect.splice(position, 1);
		ceFilter.effect = newEffect;
	}
}

function ceEffectAll() {
	$(".ce-effect").prop("checked", true);
	ceFilter.effect = ["攻擊力", "Buster性能", "Arts性能", "Quick性能", "寶具威力", "起始NP", "每回合NP",
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加",
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP",
		"狀態耐性", "狀態無效", "狀態成功率", "其他"];
}

function ceEffectNone() {
	$(".ce-effect").prop("checked", false);
	ceFilter.effect = [];
}

// Change in ownership filtering criteria
function ceInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		ceFilter.owned = [true];
	} else {
		ceFilter.owned = [true, false];
	}
}

function ceInclusiveReset() {
	$("#modal-ce-owned").prop("checked", false);
	ceFilter.owned = [true, false];
}

// Change in frequency filtering criteria
function ceFrequentChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		ceFilter.frequent = [true];
	} else {
		ceFilter.frequent = [true, false];
	}
}

function ceFrequentReset() {
	$("#modal-ce-frequent").prop("checked", false);
	ceFilter.frequent = [true, false];
}

// Initialise all filters
function initialCE() {
	ceStarNone();
	ceTypeNone();
	ceEffectAll();
	ceInclusiveReset();
	ceFrequentReset();
}


// Teammate Modal
let teammateFilter = {
	classes: [],
	star: [],
	type: [],
	attribute: ["天", "地", "人", "星", "獸"],
	gender: ["男性", "女性", "不明"],
	alignment1: ["秩序", "中立", "混沌"],
	alignment2: ["善", "中庸", "惡", "狂", "花嫁", "夏"],
	npColor: ["Buster", "Arts", "Quick"],
	npRange: ["全體", "單體", "輔助"],
	owned: [true, false]
};

$(document).ready(function() {
	$("#teammate-all-resetbtn").click(function() {
		initialTeammate();
	});

	$("#teammate-modal-filter-box-toggle").click(function() {
		toggleFilter(this, "#teammate-modal-filter-box-content");
	});

	// Change in class filtering criteria
	$(".teammate-class").click(function() {
		var teammateClass = $(this).attr("title");
		teammateClassChange(this, teammateClass);
	});
	$("#teammate-class-setbtn").click(function() {
		teammateClassAll();
	});
	$("#teammate-class-resetbtn").click(function() {
		teammateClassNone();
	});

	// Change in star filtering criteria
	$(".teammate-star").change(function() {
		var star = Number($(this).val());
		teammateStarChange(this, star);
	});
	$("#teammate-star-setbtn").click(function() {
		teammateStarAll();
	});
	$("#teammate-star-resetbtn").click(function() {
		teammateStarNone();
	});

	// Change in type filtering criteria
	$(".teammate-type").change(function() {
		var type = $(this).val();
		teammateTypeChange(this, type);
	});
	$("#teammate-type-setbtn").click(function() {
		teammateTypeAll();
	});
	$("#teammate-type-resetbtn").click(function() {
		teammateTypeNone();
	});

	// Change in attribute filtering criteria
	$(".teammate-attribute").change(function() {
		var attribute = $(this).val();
		teammateAttributeChange(this, attribute);
	});
	$("#teammate-attribute-setbtn").click(function() {
		teammateAttributeAll();
	});
	$("#teammate-attribute-resetbtn").click(function() {
		teammateAttributeNone();
	});

	// Change in gender filtering criteria
	$(".teammate-gender").change(function() {
		var gender = $(this).val();
		teammateGenderChange(this, gender);
	});
	$("#teammate-gender-setbtn").click(function() {
		teammateGenderAll();
	});
	$("#teammate-gender-resetbtn").click(function() {
		teammateGenderNone();
	});

	// Change in alignment 1 filtering criteria
	$(".teammate-alignment1").change(function() {
		var alignment1 = $(this).val();
		teammateAlignment1Change(this, alignment1);
	});
	$("#teammate-alignment1-setbtn").click(function() {
		teammateAlignment1All();
	});
	$("#teammate-alignment1-resetbtn").click(function() {
		teammateAlignment1None();
	});

	// Change in alignment 2 filtering criteria
	$(".teammate-alignment2").change(function() {
		var alignment2 = $(this).val();
		teammateAlignment2Change(this, alignment2);
	});
	$("#teammate-alignment2-setbtn").click(function() {
		teammateAlignment2All();
	});
	$("#teammate-alignment2-resetbtn").click(function() {
		teammateAlignment2None();
	});

	// Change in NP color filtering criteria
	$(".teammate-color").change(function() {
		var color = $(this).val();
		teammateColorChange(this, color);
	});
	$("#teammate-color-setbtn").click(function() {
		teammateColorAll();
	});
	$("#teammate-color-resetbtn").click(function() {
		teammateColorNone();
	});

	// Change in NP range filtering criteria
	$(".teammate-range").change(function() {
		var range = $(this).val();
		teammateRangeChange(this, range);
	});
	$("#teammate-range-setbtn").click(function() {
		teammateRangeAll();
	});
	$("#teammate-range-resetbtn").click(function() {
		teammateRangeNone();
	});

	// Change in ownership filtering criteria
	$("#teammate-owned").change(function() {
		teammateInclusiveChange(this);
	});

	// Apply filters and generate image list
	$("#teammate-filterbtn").click(function() {
		loadTeammateImg();
	});
});

// Apply filters and generate image list
function loadTeammateImg() {
	var filteredTeammate = multiFilter(servants, teammateFilter);
	var teammateList = filteredTeammate.map(function(teammate) {
		return [teammate.id, teammate.name];
	});
	$("#teammate-img").html("");
	var imglist = "";
	$(teammateList).each(function() {
		imglist += "<img class='teammate-img teammate-modal-img' src='images/servant/" + this[0] +
			".webp' title='" + this[1] + "' data-id='" + this[0] + "' />"
	});
	$("#teammate-img").html(imglist);
	teammateBind();
}

// Attach event handler to the images
function teammateBind() {
	$(".teammate-modal-img").ready(function() {
		$(".teammate-modal-img").click(function() {
			var id = Number($(this).attr("data-id"));
			pickTeammate(modalCaller, id, false);
		});
	});
}

// Change in class filtering criteria
function teammateClassChange(element, className) {
	var newClass = teammateFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		teammateFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		teammateFilter.classes = newClass;
	}
}

function teammateClassAll() {
	$(".teammate-class").removeClass("dull");
	teammateFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}

function teammateClassNone() {
	$(".teammate-class").addClass("dull");
	teammateFilter.classes = [];
}

// Change in star filtering criteria
function teammateStarChange(element, starNo) {
	var newStar = teammateFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		teammateFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		teammateFilter.star = newStar;
	}
}

function teammateStarAll() {
	$(".teammate-star").prop("checked", true);
	teammateFilter.star = [0, 1, 2, 3, 4, 5];
}

function teammateStarNone() {
	$(".teammate-star").prop("checked", false);
	teammateFilter.star = [];
}

// Change in type filtering criteria
function teammateTypeChange(element, typeName) {
	var newType = teammateFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		teammateFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		teammateFilter.type = newType;
	}
}

function teammateTypeAll() {
	$(".teammate-type").prop("checked", true);
	teammateFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動", "固有從者"];
}

function teammateTypeNone() {
	$(".teammate-type").prop("checked", false);
	teammateFilter.type = [];
}

// Change in attribute filtering criteria
function teammateAttributeChange(element, attributeName) {
	var newAttribute = teammateFilter.attribute;
	if ($(element).prop("checked")) {
		newAttribute.push(attributeName);
		teammateFilter.attribute = newAttribute;
	} else {
		position = newAttribute.indexOf(attributeName);
		newAttribute.splice(position, 1);
		teammateFilter.attribute = newAttribute;
	}
}

function teammateAttributeAll() {
	$(".teammate-attribute").prop("checked", true);
	teammateFilter.attribute = ["天", "地", "人", "星", "獸"];
}

function teammateAttributeNone() {
	$(".teammate-attribute").prop("checked", false);
	teammateFilter.attribute = [];
}

// Change in gender filtering criteria
function teammateGenderChange(element, genderName) {
	var newGender = teammateFilter.gender;
	if ($(element).prop("checked")) {
		newGender.push(genderName);
		teammateFilter.gender = newGender;
	} else {
		position = newGender.indexOf(genderName);
		newGender.splice(position, 1);
		teammateFilter.gender = newGender;
	}
}

function teammateGenderAll() {
	$(".teammate-gender").prop("checked", true);
	teammateFilter.gender = ["男性", "女性", "不明"];
}

function teammateGenderNone() {
	$(".teammate-gender").prop("checked", false);
	teammateFilter.gender = [];
}

// Change in alignment 1 filtering criteria
function teammateAlignment1Change(element, alignment1Name) {
	var newAlignment1 = teammateFilter.alignment1;
	if ($(element).prop("checked")) {
		newAlignment1.push(alignment1Name);
		teammateFilter.alignment1 = newAlignment1;
	} else {
		position = newAlignment1.indexOf(alignment1Name);
		newAlignment1.splice(position, 1);
		teammateFilter.alignment1 = newAlignment1;
	}
}

function teammateAlignment1All() {
	$(".teammate-alignment1").prop("checked", true);
	teammateFilter.alignment1 = ["秩序", "中立", "混沌"];
}

function teammateAlignment1None() {
	$(".teammate-alignment1").prop("checked", false);
	teammateFilter.alignment1 = [];
}

// Change in alignment 2 filtering criteria
function teammateAlignment2Change(element, alignment2Name) {
	var newAlignment2 = teammateFilter.alignment2;
	if ($(element).prop("checked")) {
		newAlignment2.push(alignment2Name);
		teammateFilter.alignment2 = newAlignment2;
	} else {
		position = newAlignment2.indexOf(alignment2Name);
		newAlignment2.splice(position, 1);
		teammateFilter.alignment2 = newAlignment2;
	}
}

function teammateAlignment2All() {
	$(".teammate-alignment2").prop("checked", true);
	teammateFilter.alignment2 = ["善", "中庸", "惡", "狂", "花嫁", "夏"];
}

function teammateAlignment2None() {
	$(".teammate-alignment2").prop("checked", false);
	teammateFilter.alignment2 = [];
}

// Change in NP color filtering criteria
function teammateColorChange(element, colorName) {
	var newColor = teammateFilter.npColor;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		teammateFilter.npColor = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		teammateFilter.npColor = newColor;
	}
}

function teammateColorAll() {
	$(".teammate-color").prop("checked", true);
	teammateFilter.npColor = ["Buster", "Arts", "Quick"];
}

function teammateColorNone() {
	$(".teammate-color").prop("checked", false);
	teammateFilter.npColor = [];
}

// Change in NP range filtering criteria
function teammateRangeChange(element, rangeName) {
	var newRange = teammateFilter.npRange;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		teammateFilter.npRange = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		teammateFilter.npRange = newRange;
	}
}

function teammateRangeAll() {
	$(".teammate-range").prop("checked", true);
	teammateFilter.npRange = ["全體", "單體", "輔助"];
}

function teammateRangeNone() {
	$(".teammate-range").prop("checked", false);
	teammateFilter.npRange = [];
}

// Change in ownership filtering criteria
function teammateInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		teammateFilter.owned = [true];
	} else {
		teammateFilter.owned = [true, false];
	}
}

function teammateInclusiveReset() {
	$("#teammate-owned").prop("checked", false);
	teammateFilter.owned = [true, false];
}

// Initialise all filters
function initialTeammate() {
	teammateClassNone();
	teammateStarNone();
	teammateTypeNone();
	teammateAttributeAll();
	teammateGenderAll();
	teammateAlignment1All();
	teammateAlignment2All();
	teammateColorAll();
	teammateRangeAll();
	teammateInclusiveReset();
}


/* Teammate CE Modal */
let teammateCEFilter = {
	star: [],
	type: [],
	effect: ["攻擊力", "Buster性能", "Arts性能", "Quick性能", "寶具威力", "特攻", "傷害附加"],
	owned: [true, false],
	frequent: [true, false],
	dmgToTeam: [true] // Only includes CE with effects reflect upon damage output
};

$(document).ready(function() {
	$("#teammate-ce-all-resetbtn").click(function() {
		initialTeammateCE();
	});

	// Change in star filtering criteria
	$(".teammate-ce-star").change(function() {
		var star = Number($(this).val());
		teammateCEStarChange(this, star);
	});
	$("#teammate-ce-star-setbtn").click(function() {
		teammateCEStarAll();
	});
	$("#teammate-ce-star-resetbtn").click(function() {
		teammateCEStarNone();
	});

	// Change in type filtering criteria
	$(".teammate-ce-type").change(function() {
		var type = $(this).val();
		teammateCETypeChange(this, type);
	});
	$("#teammate-ce-type-setbtn").click(function() {
		teammateCETypeAll();
	});
	$("#teammate-ce-type-resetbtn").click(function() {
		teammateCETypeNone();
	});

	// Change in effect filtering criteria
	$(".teammate-ce-effect").change(function() {
		var effect = $(this).val();
		teammateCEEffectChange(this, effect);
	});
	$("#teammate-ce-effect-setbtn").click(function() {
		teammateCEEffectAll();
	});
	$("#teammate-ce-effect-resetbtn").click(function() {
		teammateCEEffectNone();
	});

	// Change in ownership filtering criteria
	$("#modal-teammate-ce-owned").change(function() {
		teammateCEInclusiveChange(this);
	});

	// Change in ownership filtering criteria
	$("#modal-teammate-ce-frequent").change(function() {
		teammateCEFrequentChange(this);
	});

	// Apply filters and generate image list
	$("#teammate-ce-filterbtn").click(function() {
		loadTeammateCEImg();
	});
});

// Apply filters and generate image list
function loadTeammateCEImg() {
	var filteredCE = multiFilter(ce, teammateCEFilter);
	var ceList = filteredCE.map(function(essence) {
		return [essence.id, essence.name];
	});
	$("#teammate-ce-img").html("");
	var imglist = "";
	$(ceList).each(function() {
		imglist += "<img class='essence-img teammate-ce-modal-img' src='images/ce/" + this[0] +
			".webp' title='" + this[1] + "' data-id='" + this[0] + "' />"
	});
	$("#teammate-ce-img").html(imglist);
	teammateCEBind();
}

// Attach event handler to the images
function teammateCEBind() {
	$(".teammate-ce-modal-img").ready(function() {
		$(".teammate-ce-modal-img").click(function() {
			var id = Number($(this).attr("data-id"));
			pickTeammateCE(modalCaller, id);
		});
	});
}

// Change in star filtering criteria
function teammateCEStarChange(element, starNo) {
	var newStar = teammateCEFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		teammateCEFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		teammateCEFilter.star = newStar;
	}
}

function teammateCEStarAll() {
	$(".teammate-ce-star").prop("checked", true);
	teammateCEFilter.star = [3, 4, 5];
}

function teammateCEStarNone() {
	$(".teammate-ce-star").prop("checked", false);
	teammateCEFilter.star = [];
}

// Change in type filtering criteria
function teammateCETypeChange(element, typeName) {
	var newType = teammateCEFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		teammateCEFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		teammateCEFilter.type = newType;
	}
}

function teammateCETypeAll() {
	$(".teammate-ce-type").prop("checked", true);
	teammateCEFilter.type = ["常駐", "活動限定", "期間限定", "活動兌換", "羈絆禮裝"];
}

function teammateCETypeNone() {
	$(".teammate-ce-type").prop("checked", false);
	teammateCEFilter.type = [];
}

// Change in effect filtering criteria
function teammateCEEffectChange(element, effect) {
	var newEffect = teammateCEFilter.effect;
	if ($(element).prop("checked")) {
		newEffect.push(effect);
		teammateCEFilter.effect = newEffect;
	} else {
		position = newEffect.indexOf(effect);
		newEffect.splice(position, 1);
		teammateCEFilter.effect = newEffect;
	}
}

function teammateCEEffectAll() {
	$(".teammate-ce-effect").prop("checked", true);
	teammateCEFilter.effect = ["攻擊力", "Buster性能", "Arts性能", "Quick性能", "寶具威力", "特攻", "傷害附加"]; // Only includes CE benefitial to the team
}

function teammateCEEffectNone() {
	$(".teammate-ce-effect").prop("checked", false);
	teammateCEFilter.effect = [];
}

// Change in ownership filtering criteria
function teammateCEInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		teammateCEFilter.owned = [true];
	} else {
		teammateCEFilter.owned = [true, false];
	}
}

function teammateCEInclusiveReset() {
	$("#modal-teammate-ce-owned").prop("checked", false);
	teammateCEFilter.owned = [true, false];
}

// Change in frequency filtering criteria
function teammateCEFrequentChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		teammateCEFilter.frequent = [true];
	} else {
		teammateCEFilter.frequent = [true, false];
	}
}

function teammateCEFrequentReset() {
	$("#modal-teammate-ce-frequent").prop("checked", false);
	teammateCEFilter.frequent = [true, false];
}

// Initialise all filters
function initialTeammateCE() {
	teammateCEStarNone();
	teammateCETypeNone();
	teammateCEEffectAll();
	teammateCEInclusiveReset();
	teammateCEFrequentReset();
}