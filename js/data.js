//load servant data
var servants = JSON.parse(servant);

//filter function
/**
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria as the property names
 * @return {Array}
 */
function multiFilter(array, filters) {
	const filterKeys = Object.keys(filters);
	return array.filter((item) => {
		return filterKeys.every(key => {
			if (!filters[key].length) return true;
			return filters[key].includes(item[key]);
		});
	});
}

//servant enemy modal
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
		".png' onclick='setServantEnemy(" + servantEnemyID[i] + ")' />"
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
	servantEnemyFilter.classes = ["none"];
}

function servantEnemyStarChange(element, starNo) {
	var newStar = servantEnemyFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		servantEnemyFilter.star = newStar;
		$("#demo").append(servantEnemyFilter.star + "<br/>");
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		servantEnemyFilter.star = newStar;
		$("#demo").append(servantEnemyFilter.star + "<br/>");
	}
}

function servantEnemyStarAll() {
	$(".servant-enemy-star").prop("checked", true);
	servantEnemyFilter.star = [0, 1, 2, 3, 4, 5];
	$("#demo").append(servantEnemyFilter.star + "<br/>");
}

function servantEnemyStarNone() {
	$(".servant-enemy-star").prop("checked", false);
	servantEnemyFilter.star = [9];
	$("#demo").append(servantEnemyFilter.star + "<br/>");
}

function initialServantEnemy() {
	servantEnemyClassAll();
	servantEnemyStarAll();
}

function setServantEnemy(value) {
	servantEnemyID = value;
	closeModal('#servant-enemy-modal');
	initialServantEnemy();
}
