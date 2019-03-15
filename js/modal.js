// Servant enemy modal
let servantEnemyFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5]
};

/*function loadServantEnemyImg() {
	var imglist = "";
	servantEnemyID.forEach(myFunction(id) {
		imglist += "<img class='left servant-img' src='images/servant/" + id +
		".png' onclick='setServantEnemy(" + id + ")' />"
	});
	$("#servant-enemy-img").html(imglist);
}*/

function loadServantEnemyImg() {
	var filteredServantEnemy = multiFilter(servants, servantEnemyFilter);
	var servantEnemyID = filteredServantEnemy.map(function (servantEnemy) {
		return servantEnemy.id
	});
	$("#servant-enemy-img").html("");
	var imglist = "";
	var arrayLength = servantEnemyID.length;
	for (i = 0; i < arrayLength; i++) {
		imglist += "<img class='left servant-img' src='images/servant/" + servantEnemyID[i] +
		".png' onclick='setEnemy(servant, " + servantEnemyID[i] + ")' />"
	};
	$("#servant-enemy-img").html(imglist);
}

function servantEnemyFilterChange(element, className) {
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
	servantEnemyFilter.classes = [""];
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
	servantEnemyFilter.star = [NaN];
}

function initialServantEnemy() {
	servantEnemyClassAll();
	servantEnemyStarAll();
}
