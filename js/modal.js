// Servant enemy modal
let servantEnemyFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5]
};

function loadServantEnemyImg() {
	var filteredServantEnemy = multiFilter(servants, servantEnemyFilter);
	var servantEnemyID = filteredServantEnemy.map(function (servantEnemy) {
		return servantEnemy.id
	});
	$("#servant-enemy-img").html("");
	var imglist = "";	
	$.each(servantEnemyID, function(index, value) {
		imglist += "<img class='left servant-img' src='images/servant/" + value +
		".webp' onclick='pickEnemy(1, " + value + ")' />"
	});
	$("#servant-enemy-img").html(imglist);
}

function servantEnemyClassChange(element, className) {
	var newClass = servantEnemyFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		servantEnemyFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		servantEnemyFilter.classes = newClass;
	}
}

function servantEnemyClassAll() {
	$(".servant-enemy-class").removeClass("dull");
	servantEnemyFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}

function servantEnemyClassNone() {
	$(".servant-enemy-class").removeClass("dull");
	$(".servant-enemy-class").addClass("dull");
	servantEnemyFilter.classes = [];
}

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

function initialServantEnemy() {
	servantEnemyClassAll();
	servantEnemyStarAll();
}


//Servant modal
let servantFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"],
	attribute: ["天", "地", "人", "星", "獸"],
	gender: ["男性", "女性", "不明"],
	alignment1: ["秩序", "中立", "混沌"],
	alignment2: ["善", "中庸", "惡", "狂", "花嫁", "夏"],
	npColor: ["Buster", "Art", "Quick"],
	npRange: ["全體", "單體"],
	extraDamage: ["無特攻", "Saber", "Ruler", "男性", "女性", "混沌", "惡", "天之力", "地之力", 
		"人之力", "人型", "從者", "人類", "神性", "王", "羅馬", "希臘神話系男性", "人類威脅", "阿爾托莉亞臉", 
		"亞瑟", "所愛之人", "騎乘", "龍", "魔性", "猛獸", "死靈", "惡魔", "超巨大", "毒"],
	owned: [true, false]
};

function loadServantImg() {
	var filteredServant = multiFilter(servants, servantFilter);
	var servantID = filteredServant.map(function (servant) {
		return servant.id
	});
	$("#servant-img").html("");
	var imglist = "";	
	$.each(servantID, function(index, value) {
		imglist += "<img class='left servant-img' src='images/servant/" + value +
		".webp' onclick='pickServant(" + value + ")' />"
	});
	$("#servant-img").html(imglist);
}

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
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}

function servantClassNone() {
	$(".servant-class").removeClass("dull");
	$(".servant-class").addClass("dull");
	servantFilter.classes = [];
}

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
	servantFilter.npColor = ["Buster", "Art", "Quick"];
}

function servantColorNone() {
	$(".servant-color").prop("checked", false);
	servantFilter.npColor = [];
}

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
	servantFilter.extraDamage = ["無特攻", "Saber", "Ruler", "男性", "女性", "混沌", "惡", "天之力", "地之力", 
		      "人之力", "人型", "從者", "人類", "神性", "王", "羅馬", "希臘神話系男性", "人類威脅", "阿爾托莉亞臉", 
		      "亞瑟", "所愛之人", "騎乘", "龍", "魔性", "猛獸", "死靈", "惡魔", "超巨大", "毒"];
}

function servantEDNone() {
	$(".servant-ed").prop("checked", false);
	servantFilter.extraDamage = [];
}

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

function initialServant() {
	servantClassAll();
	servantStarAll();
	servantTypeAll();
	servantAttributeAll();
	servantGenderAll();
	servantAlignment1All();
	servantAlignment2All();
	servantColorAll();
	servantRangeAll();
	servantEDAll();
	servantInclusiveReset();
}

// CE modal
let ceFilter = {
	ceStar: [1, 2, 3, 4, 5],
	ceType: ["常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"],
	ceEffect: ["攻擊力", "Buster性能", "Art性能", "Quick性能", "寶具威力", "起始NP", "每回合NP", 
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", 
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP", 
		"狀態耐性", "狀態無效", "狀態成功率", "其他"],
	owned: [true, false]
};

function loadCEImg() {
	var filteredCE = multiFilter(ce, ceFilter);
	var ceID = filteredServant.map(function (essence) {
		return ce.ceID
	});
	$("#ce-img").html("");
	var imglist = "";	
	$.each(ceID, function(index, value) {
		imglist += "<img class='left ce-img' src='images/ce/" + value +
		".webp' onclick='pickCE(" + value + ")' />"
	});
	$("#ce-img").html(imglist);
}

function ceStarChange(element, starNo) {
	var newStar = ceFilter.ceStar;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		ceFilter.ceStar = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		ceFilter.ceStar = newStar;
	}
}

function ceStarAll() {
	$(".ce-star").prop("checked", true);
	ceFilter.ceStar = [1, 2, 3, 4, 5];
}

function ceStarNone() {
	$(".ce-star").prop("checked", false);
	ceFilter.ceStar = [];
}

function ceTypeChange(element, typeName) {
	var newType = ceFilter.ceType;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		ceFilter.ceType = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		ceFilter.ceType = newType;
	}
}

function ceTypeAll() {
	$(".ce-type").prop("checked", true);
	ceFilter.ceType = ["常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"];
}

function ceTypeNone() {
	$(".ce-type").prop("checked", false);
	ceFilter.ceType = [];
}

function ceEffectChange(element, effect) {
	var newEffect = ceFilter.ceEffect;
	if ($(element).prop("checked")) {
		newEffect.push(effect);
		ceFilter.ceEffect = newEffect;
	} else {
		position = newEffect.indexOf(effect);
		newEffect.splice(position, 1);
		ceFilter.ceEffect = newEffect;
	}
}

function ceEffectAll() {
	$(".ce-effect").prop("checked", true);
	ceFilter.ceEffect = ["攻擊力", "Buster性能", "Art性能", "Quick性能", "寶具威力", "起始NP", "每回合NP", 
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", 
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP", 
		"狀態耐性", "狀態無效", "狀態成功率", "其他"];
}

function ceEffectNone() {
	$(".ce-effect").prop("checked", false);
	ceFilter.ceEffect = [];
}

function ceInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		ce.owned = [true];
	} else {
		ce.owned = [true, false];
	}
}

function ceInclusiveReset() {
	$("#modal-ce-owned").prop("checked", false);
	ceFilter.owned = [true, false];
}

function initialCE() {
	ceStarAll();
	ceTypeAll();
	ceEffectAll();
	ceInclusiveReset();
}


