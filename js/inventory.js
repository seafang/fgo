var servants = parent.servants;
var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;

$(document).ready(function() {
	initialInventoryFilter();
	generateInventory();
	loadSave();
});

// Generate inventory table
let inventoryFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動", "固有從者"],
	npColor: ["Buster", "Art", "Quick"],
	npRange: ["全體", "單體", "輔助"],
	owned: [true, false]
};

$(document).ready(function() {
	$(".inventory-class").click(function() {
		var servantClass = $(this).attr("title");
		inventoryClassChange(this, servantClass);
	});
	$("#inventory-class-setbtn").click(function() {
		inventoryClassAll();
	});
	$("#inventory-class-resetbtn").click(function() {
		inventoryClassNone();
	});
	$(".inventory-star").change(function() {
		var star = Number($(this).val());
		inventoryStarChange(this, star);
	});
	$("#inventory-star-setbtn").click(function() {
		inventoryStarAll();
	});
	$("#inventory-star-resetbtn").click(function() {
		inventoryStarNone();
	});
	$(".inventory-type").change(function() {
		var type = $(this).val();
		inventoryTypeChange(this, type);
	});
	$("#inventory-type-setbtn").click(function() {
		inventoryTypeAll();
	});
	$("#inventory-type-resetbtn").click(function() {
		inventoryTypeNone();
	});
	$(".inventory-color").change(function() {
		var color = $(this).val();
		inventoryColorChange(this, color);
	});
	$("#inventory-color-setbtn").click(function() {
		inventoryColorAll();
	});
	$("#inventory-color-resetbtn").click(function() {
		inventoryColorNone();
	});
	$(".inventory-range").change(function() {
		var range = $(this).val();
		inventoryRangeChange(this, range);
	});
	$("#inventory-range-setbtn").click(function() {
		inventoryRangeAll();
	});
	$("#inventory-range-resetbtn").click(function() {
		inventoryRangeNone();
	});
	$("#inventory-owned").change(function() {
		inventoryInclusiveChange(this);
	});
	$("#inventory-applybtn").click(function() {
		generateInventory();
		loadSave();
	});
});

function clearInventory() {
	$("#servant-inventory").find(".inventory-row").each(function(){
		$(this).remove();
	});
}

function generateInventory() {
	var filteredServant = multiFilter(servants, inventoryFilter);
	var npSymb = "";
	clearInventory();
	var table = document.getElementById("servant-inventory");
	filteredServant.forEach(function(servant) {				
		var row = table.insertRow(-1);				
		$(row).addClass("inventory-row");				
		$(row).attr("id", "inventory-row-" + servant.id);				
		row.insertCell(-1).innerHTML = servant.id;
		switch (servant.npRange) {
			case "單體":
				npSymb = "♠";
				break;
			case "全體":
				npSymb = "♦";
				break;
			case "輔助":
				npSymb = "♥";
				break;
		}
		row.insertCell(-1).innerHTML = "<img class='profile-img' src='" + servant.imgID + "' />";				
		row.insertCell(-1).innerHTML = "<span class='" + servant.npColor + "'>" + npSymb + " " + 
			servant.name + "</span>";				
		row.insertCell(-1).innerHTML = "<img class='class-logo' src='images/class/" + servant.classes + ".webp' />";				
		var starHTML = "";				
		switch (servant.star) {				
			case 0:
			default:
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
		}				
		row.insertCell(-1).innerHTML = "<span class='star'>" + starHTML + "</span>";				
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='owned' value='true'><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<select class='narrow inventory-lv' disabled>" + lvDropDown + "</select>";				
		row.insertCell(-1).innerHTML = "<select class='tight nplv' disabled><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select>";	
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='np-rankup' value='true' disabled><span class='slider'></span></label>";
		row.insertCell(-1).innerHTML = "<input type='number' class='narrow statup' value='0' min='0' max='2000' disabled>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill1-logo dull' src='" + servant.skill1ImgID + "' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill1-lv' disabled><option value='1'>1</option>" + 				
			"<option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option>" + 			
			"<option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill1-rankup' value='true' disabled><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill2-logo dull' src='" + servant.skill2ImgID + "' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill2-lv' disabled><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option>" + 			
			"<option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill2-rankup' value='true' disabled><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill3-logo dull' src='" + servant.skill3ImgID + "' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill3-lv' disabled><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option>" + 			
			"<option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill3-rankup' value='true' disabled><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "";				
		row.insertCell(-1).innerHTML = "";	
		row.insertCell(-1).innerHTML = "";
		row.insertCell(-1).innerHTML = "<input type='number' class='narrow event-ED' value='0' min='0'>";			
	});
}

function inventoryClassChange(element, className) {
	var newClass = inventoryFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		inventoryFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		inventoryFilter.classes = newClass;
	}
}

function inventoryClassAll() {
	$(".inventory-class").removeClass("dull");
	inventoryFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}

function inventoryClassNone() {
	$(".inventory-class").removeClass("dull");
	$(".inventory-class").addClass("dull");
	inventoryFilter.classes = [];
}

function inventoryStarChange(element, starNo) {
	var newStar = inventoryFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		inventoryFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		inventoryFilter.star = newStar;
	}
}

function inventoryStarAll() {
	$(".inventory-star").prop("checked", true);
	inventoryFilter.star = [0, 1, 2, 3, 4, 5];
}

function inventoryStarNone() {
	$(".inventory-star").prop("checked", false);
	inventoryFilter.star = [];
}

function inventoryTypeChange(element, typeName) {
	var newType = inventoryFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		inventoryFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		inventoryFilter.type = newType;
	}
}

function inventoryTypeAll() {
	$(".inventory-type").prop("checked", true);
	inventoryFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動", "固有從者"];
}

function inventoryTypeNone() {
	$(".inventory-type").prop("checked", false);
	inventoryFilter.type = [];
}

function inventoryColorChange(element, colorName) {
	var newColor = inventoryFilter.npColor;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		inventoryFilter.npColor = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		inventoryFilter.npColor = newColor;
	}
}

function inventoryColorAll() {
	$(".inventory-color").prop("checked", true);
	inventoryFilter.npColor = ["Buster", "Art", "Quick"];
}

function inventoryColorNone() {
	$(".inventory-color").prop("checked", false);
	inventoryFilter.npColor = [];
}

function inventoryRangeChange(element, rangeName) {
	var newRange = inventoryFilter.npRange;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		inventoryFilter.npRange = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		inventoryFilter.npRange = newRange;
	}
}

function inventoryRangeAll() {
	$(".inventory-range").prop("checked", true);
	inventoryFilter.npRange = ["全體", "單體", "輔助"];
}

function inventoryRangeNone() {
	$(".inventory-range").prop("checked", false);
	inventoryFilter.npRange = [];
}

function inventoryInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		inventoryFilter.owned = [true];
	} else {
		inventoryFilter.owned = [true, false];
	}
}

function inventoryInclusiveReset() {
	$("#inventory-owned").prop("checked", false);
	inventoryFilter.owned = [true, false];
}

function initialInventoryFilter() {
	inventoryClassAll();
	inventoryStarAll();
	inventoryTypeAll();
	inventoryColorAll();
	inventoryRangeAll();
	inventoryInclusiveReset();
}

// Apply saved data
function loadSave() {
	if (bgServant[0] !== undefined) {
		$("#servant-inventory").find(".inventory-row").each(function(){
			var rowID = Number($(this).find("td:first").html());
			var ownershipToggle = $(this).find(".owned");
			var skill1Toggle = $(this).find(".skill1-rankup");
			var skill2Toggle = $(this).find(".skill2-rankup");
			var skill3Toggle = $(this).find(".skill3-rankup");
			var servant = bgServant.filter(function(obj) {
				return obj.id == rowID;
			});
			if (servant[0] !== undefined) {
				if (servant[0].data[0] == true) {
					$(this).find(".owned").attr("checked", true);
					enableOption(ownershipToggle);
				}
				$(this).find(".inventory-lv").val(servant[0].data[1]);
				$(this).find(".nplv").val(servant[0].data[2]);
				if (servant[0].data[3] == true) {
					$(this).find(".np-rankup").attr("checked", true);
				}
				$(this).find(".statup").val(servant[0].data[4]);
				$(this).find(".skill1-lv").val(servant[0].data[5]);
				if (servant[0].data[6] == true) {
					$(this).find(".skill1-rankup").attr("checked", true);
					updateSkillImg(skill1Toggle, 'skill1');
				}
				$(this).find(".skill2-lv").val(servant[0].data[7]);
				if (servant[0].data[8] == true) {
					$(this).find(".skill2-rankup").attr("checked", true);
					updateSkillImg(skill2Toggle, 'skill2');
				}
				$(this).find(".skill3-lv").val(servant[0].data[9]);
				if (servant[0].data[10] == true) {
					$(this).find(".skill3-rankup").attr("checked", true);
					updateSkillImg(skill3Toggle, 'skill3');
				}
			}
		});
	}
}

// Update data
$(document).ready(function() {
	$("#inventory-row-1").find(".owned").prop("disabled", true);
	$("select").change(function() {
		update(this);
	});
	$("input").change(function() {
		update(this);
	});
	$(".owned").change(function() {
		updateOwnership(this);
		enableOption(this);
	});
	$(".skill1-rankup").change(function() {
		updateSkillImg(this, 'skill1');
	});
	$(".skill2-rankup").change(function() {
		updateSkillImg(this, 'skill2');
	});
	$(".skill3-rankup").change(function() {
		updateSkillImg(this, 'skill3');
	});
});

function update(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var info = {};
	if (bgServant[0] !== undefined) {
		var position = bgServant.findIndex(function(obj) {
			return obj.id == rowID; 
		});
		if (position !== -1) {
			bgServant.splice(position, 1);
		}
	}
	info.id = rowID;
	info.data = [];
	info.data[0] = $(row).find(".owned").is(":checked");
	info.data[1] = Number($(row).find(".inventory-lv").val());
	info.data[2] = Number($(row).find(".nplv").val());
	info.data[3] = $(row).find(".np-rankup").is(":checked");
	info.data[4] = Number($(row).find(".statup").val());
	info.data[5] = Number($(row).find(".skill1-lv").val());
	info.data[6] = $(row).find(".skill1-rankup").is(":checked");
	info.data[7] = Number($(row).find(".skill2-lv").val());
	info.data[8] = $(row).find(".skill2-rankup").is(":checked");
	info.data[9] = Number($(row).find(".skill3-lv").val());
	info.data[10] = $(row).find(".skill3-rankup").is(":checked");
	bgServant.push(info);
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

function updateOwnership(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var newValue = $(row).find(".owned").is(":checked");
	var position = servants.findIndex(function(obj) {
		return obj.id == rowID;
	});
	servants[position].owned = newValue;
	parent.servants = servants;
}

function enableOption(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var skill1Toggle = $(row).find(".skill1-rankup");
	var skill2Toggle = $(row).find(".skill2-rankup");
	var skill3Toggle = $(row).find(".skill3-rankup");
	if ($(element).is(":checked")) {
		$(row).find(".inventory-lv").prop("disabled", false);
		$(row).find(".nplv").prop("disabled", false);
		$(row).find(".np-rankup").prop("disabled", false);
		npRankUpCheck(row);
		$(row).find(".statup").prop("disabled", false);
		$(row).find(".skill1-logo").removeClass("dull");
		$(row).find(".skill1-lv").prop("disabled", false);
		$(row).find(".skill1-rankup").prop("disabled", false);
		skillRankUpCheck(row, 'skill1');
		updateSkillImg(skill1Toggle, 'skill1');
		$(row).find(".skill2-logo").removeClass("dull");
		$(row).find(".skill2-lv").prop("disabled", false);
		$(row).find(".skill2-rankup").prop("disabled", false);
		skillRankUpCheck(row, 'skill2');
		updateSkillImg(skill2Toggle, 'skill2');
		$(row).find(".skill3-logo").removeClass("dull");
		$(row).find(".skill3-lv").prop("disabled", false);
		$(row).find(".skill3-rankup").prop("disabled", false);
		skillRankUpCheck(row, 'skill3');
		updateSkillImg(skill3Toggle, 'skill3');
	} else {
		$(row).find(".inventory-lv").val(0);
		$(row).find(".inventory-lv").prop("disabled", true);
		$(row).find(".nplv").val(1);
		$(row).find(".nplv").prop("disabled", true);
		$(row).find(".np-rankup").prop("checked", false);
		$(row).find(".np-rankup").prop("disabled", true);
		$(row).find(".statup").val(0);
		$(row).find(".statup").prop("disabled", true);
		$(row).find(".skill1-logo").addClass("dull");
		$(row).find(".skill1-lv").val(1);
		$(row).find(".skill1-lv").prop("disabled", true);
		$(row).find(".skill1-rankup").prop("checked", false);
		$(row).find(".skill1-rankup").prop("disabled", true);
		updateSkillImg(skill1Toggle, 'skill1');
		$(row).find(".skill2-logo").addClass("dull");
		$(row).find(".skill2-lv").val(1);
		$(row).find(".skill2-lv").prop("disabled", true);
		$(row).find(".skill2-rankup").prop("checked", false);
		$(row).find(".skill2-rankup").prop("disabled", true);
		updateSkillImg(skill2Toggle, 'skill2');
		$(row).find(".skill3-logo").addClass("dull");
		$(row).find(".skill3-lv").val(1);
		$(row).find(".skill3-lv").prop("disabled", true);
		$(row).find(".skill3-rankup").prop("checked", false);
		$(row).find(".skill3-rankup").prop("disabled", true);
		updateSkillImg(skill3Toggle, 'skill3');
		update(element);
	}
}	

function npRankUpCheck(row) {
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID; 
	});
	if (target.npRankUp == false) {
		$(row).find(".np-rankup").prop("disabled", true);
	}
}	

function skillRankUpCheck(row, skill) {
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID; 
	});
	if (target[skill + "RU"] == false) {
		$(row).find("." + skill + "-rankup").prop("disabled", true);
	}
}	

function updateSkillImg(element, skill) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID; 
	});
	if ($(element).is(":checked")) {
		$(row).find("." + skill + "-logo").attr("src", target[skill + "RUImgID"]);
		if ($(row).find(".owned").is(":checked")) {
			$(row).find("." + skill + "-lv").prop("disabled", false);
		}
	} else {
		$(row).find("." + skill + "-logo").attr("src", target[skill + "ImgID"]);
		if (target[skill + "Name"] == "") {
			$(row).find("." + skill + "-lv").prop("disabled", true);
		}
	}
}

