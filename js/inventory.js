// Generate inventory table
let inventoryFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動", "固有從者"],
	npColor: ["Buster", "Art", "Quick"],
	npRange: ["全體", "單體", "輔助"]
};

function clearInventory() {
	$("#servant-inventory").find(".inventory-row").each(function(){
		$(this).remove();
	});
}

function generateInventory() {
	var filteredServant = multiFilter(servants, inventoryFilter);
	clearInventory();
	var table = document.getElementById("servant-inventory");
	filteredServant.forEach(function(servant) {					
		var row = table.insertRow(-1);				
		$(row).addClass("inventory-row");				
		$(row).attr("id", "inventory-row-" + servant.id);				
		row.insertCell(-1).innerHTML = servant.id;				
		row.insertCell(-1).innerHTML = "<img class='profile-img' src='" + servant.imgID + "' />";				
		row.insertCell(-1).innerHTML = servant.name;				
		row.insertCell(-1).innerHTML = "<img class='class-logo' src='images/class/" + servant.classes + ".png' />";				
		var starHTML = "";				
		switch (servant.star) {				
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
		row.insertCell(-1).innerHTML = "<span class='star'>" + starHTML + "</span>";				
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='owned' value='true' onchanged=\inventoryToggle('this')\"><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<select class='narrow inventory-lv'>" + lvDropDown + "</select>";				
		row.insertCell(-1).innerHTML = "<select class='tight nplv'><option value='np1'>1</option><option value='np2'>2</option>" + 				
			"<option value='np3'>3</option><option value='np4'>4</option><option value='np5'>5</option></select>";	
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='np-rankup' value='true'><span class='slider'></span></label>";
		row.insertCell(-1).innerHTML = "<input type='number' class='narrow statup' value='0' min='0' max='2000'>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill1' src='' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill1-lv'><option value='1'>1</option>" + 				
			"<option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option>" + 			
			"<option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill1-rankup' value='true' onchange=\setSkillImg('this', '.skill1')\"><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill2' src='' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill2-lv'><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option>" + 			
			"<option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill2-rankup' value='true' onchange=\setSkillImg('this', '.skill2')\"><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill3' src='' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill3-lv'><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option>" + 			
			"<option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill3-rankup' value='true' onchange=\setSkillImg('this', '.skill3')\"><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "";				
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
	inventoryFilter.classes = [""];
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
	inventoryFilter.star = [NaN];
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
	inventoryFilter.type = [""];
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
	inventoryFilter.npColor = [""];
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
	inventoryFilter.npRange = [""];
}

function initialInventoryFilter() {
	inventoryClassAll();
	inventoryStarAll();
	inventoryTypeAll();
	inventoryColorAll();
	inventoryRangeAll();
}

// Apply saved data
function loadSave() {
	if (bgServant[0] !== undefined) {
		$("#servant-inventory").find(".inventory-row").each(function(){
			var rowID = $(this).find("td:first").html();
			var servant = bgServant.filter(function(obj) {
				return obj.id == rowID;
			});
			if (servant.data[0] == true) {
				$(this).find(".owned").attr("checked", true);
			}
			$(this).find(".inventory-lv").val(servant.data[1]);
			$(this).find(".nplv").val(servant.data[2]);
			if (servant.data[3] == true) {
				$(this).find(".np-rankup").attr("checked", true);
			}
			$(this).find(".statupv").val(servant.data[4]);
			$(this).find(".skill1-lv").val(servant.data[5]);
			if (servant.data[6] == true) {
				$(this).find(".skill1-rankup").attr("checked", true);
			}
			$(this).find(".skill2-lv").val(servant.data[7]);
			if (servant.data[8] == true) {
				$(this).find(".skill2-rankup").attr("checked", true);
			}
			$(this).find(".skill3-lv").val(servant.data[9]);
			if (servant.data[10] == true) {
				$(this).find(".skill3-rankup").attr("checked", true);
			}
		});
	}
}
