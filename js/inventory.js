// Sync background data
var servants = parent.servants;
var ce = parent.ce;
var cc = parent.cc;
var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;
var customBuff = parent.customBuff;

$(document).ready(function() {
	initialInventoryFilter();		// Initialise filters, generate new table & apply saved data
	generateInventory();
	loadSave();
	updateCounter();
});

// Update page height
$(document).on("click", function() {
	updateCounter();
});

function updateCounter() {
	var height = $("#servant-inventory-header").outerHeight() + $("#servant-inventory-content").outerHeight() + 500;
	$("#servant-inventory-counter").html(height);
}

let inventoryFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動", "固有從者"],
	npColor: ["Buster", "Art", "Quick"],
	npRange: ["全體", "單體", "輔助"],
	owned: [true, false]
};

// Generate inventory table
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
	
	// Generate new table
	$("#inventory-filterbtn").click(function() {
		generateInventory();
		loadSave();
	});
	
	// Open teammate setup modal
	$("#inventory-teammate-modalbtn").click(function() {
		openModal("#inventory-teammate-modal");
		initialInventoryTeammate();
		loadInventoryTeammateImg();
		applyInventoryTeammateSelection();
	});
	
	// Open ce setup modal
/*	$("#inventory-ce-modalbtn").click(function() {
		openModal("#inventory-ce-modal");
		initialInventoryCE();
		loadInventoryCEImg();
	});*/
	
	// Open command code modal
	$(".inventory-code-logo").click(function() {
		if (!$(this).hasClass("dull")) {
			var row = $(this).parents("tr");
			var rowID = Number($(row).find("td:first").html());
			setCaller(rowID);
			positionMarker = Number($(this).attr("data-value"));
			openModal("#inventory-code-modal");
			initialInventoryCode();
			loadInventoryCodeImg();
		}
	});
});

// Clear current table
function clearInventory() {
	$("#servant-inventory").find(".inventory-row").each(function() {
		$(this).remove();
	});
}

// Generate new table
function generateInventory() {
	var filteredServant = multiFilter(servants, inventoryFilter);
	clearInventory();
	var table = document.getElementById("servant-inventory");
	filteredServant.forEach(function(servant) {				
		var row = table.insertRow(-1);
		var npSymb = "";
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
		
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='owned'><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<select class='narrow inventory-lv' disabled>" + lvDropDown + "</select>";				
		row.insertCell(-1).innerHTML = "<select class='tight nplv' disabled><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option></select>";	
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='np-rankup' disabled><span class='slider'></span></label>";
		row.insertCell(-1).innerHTML = "<input type='number' class='narrow statup' value='0' min='0' max='2000' disabled>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill1-logo dull' src='" + servant.skill1ImgID + "' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill-lv skill1-lv' disabled><option value='1'>1</option>" + 				
			"<option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option>" + 			
			"<option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill-rankup skill1-rankup' disabled><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill2-logo dull' src='" + servant.skill2ImgID + "' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill-lv skill2-lv' disabled><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option>" + 			
			"<option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill-rankup skill2-rankup' disabled><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill3-logo dull' src='" + servant.skill3ImgID + "' />";				
		row.insertCell(-1).innerHTML = "<select class='slim skill-lv skill3-lv' disabled><option value='1'>1</option><option value='2'>2</option>" + 				
			"<option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option>" + 			
			"<option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='skill-rankup skill3-rankup' disabled><span class='slider'></span></label>";			
		
		// Insert element for command codes
		var card = ["Buster", "Art", "Quick"];
		var i = 1;
		$(card).each(function() {
			var count = servant[this + "No"];
			while (count > 0) {
				row.insertCell(-1).innerHTML = "<img class='card-logo inventory-card-logo dull' src='images/command/" + 
					this + ".webp' data-value='" + i + "' /><img class='code-logo inventory-code-logo src='' data-value='" + i + "' data-id='0' />";
				i++;
				count--;
			}
		});
		
		row.insertCell(-1).innerHTML = "<input type='number' class='narrow event-ED' value='0' min='0' disabled>";			
	});
}

// Update class filter
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

// Update star filter
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

// Update type filter
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

// Update color filter
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

// Update NP range filter
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

// Update ownership filter
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

// Initialise all filters
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
				$(this).find(".inventory-code-logo").each(function() {
					var value = Number($(this).attr("data-value"));
					var codeInfo = cc.filter(function(obj) {
						return obj.id == servant[0].data[value + 10];
					});
					$(this).attr({
						"src": codeInfo[0].logoID,
						"data-id": servant[0].data[value + 10]
					});
				});
				$(this).find(".event-ED").val(servant[0].data[18]);
			}
		});
	}
}

// Update data
$(document).ready(function() {
	$("#inventory-event-buff-resetbtn").click(function() {
		clearInventoryEventBuff();
	});
	$("#inventory-row-1").find(".owned").prop("disabled", true);
	$("#inventory-row-1").find(".nplv").prop("disabled", true);
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
	info.data[11] = Number($(row).find(".inventory-code-logo[data-value='1']").attr("data-id"));
	info.data[12] = Number($(row).find(".inventory-code-logo[data-value='2']").attr("data-id"));
	info.data[13] = Number($(row).find(".inventory-code-logo[data-value='3']").attr("data-id"));
	info.data[14] = Number($(row).find(".inventory-code-logo[data-value='4']").attr("data-id"));
	info.data[15] = Number($(row).find(".inventory-code-logo[data-value='5']").attr("data-id"));
	info.data[18] = Number($(row).find(".event-ED").val());
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
	var skillList = ["skill1", "skill2", "skill3"];
	if ($(element).is(":checked")) {
		$(row).find("select").prop("disabled", false);
		$(row).find(".np-rankup").prop("disabled", false);
		npRankUpCheck(row);
		$(row).find(".statup").prop("disabled", false);
		$(row).find(".skill-logo").removeClass("dull");
		$(row).find(".inventory-command-logo").removeClass("dull");
		$(row).find(".skill-rankup").prop("disabled", false);
		$(skillList).each(function() {
			skillRankUpCheck(row, this);
			updateSkillImg(this + "Toggle", this);
		});
		$(row).find(".event-ED").prop("disabled", false);
		var position = bgServant.findIndex(function(obj) {
			return obj.id == rowID; 
		});
		bgServant.splice(position, 1);
	} else {
		$(row).find("select").prop("disabled", true);
		$(row).find("input").prop("disabled", true);
		$(element).prop("disabled", false);
		$(row).find(".inventory-lv").val(0);
		$(row).find(".nplv").val(1);
		$(row).find(":checkbox").prop("checked", false);
		$(row).find(".statup").val(0);
		$(row).find(".skill-logo").addClass("dull");
		$(row).find(".inventory-command-logo").addClass("dull");
		$(row).find(".inventory-code-logo").attr({
			"src": "",
			"data-id": 0
		});
		$(row).find(".skil1-lv").val(1);
		$(skillList).each(function() {
			updateSkillImg(this + "Toggle", this);
		});
		$(row).find(".event-ED").val(0);
		update(element);
		var position = bgServant.findIndex(function(obj) {
			return obj.id == rowID; 
		});
		bgServant[position].data[16] = "不使用隊友";
	}
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}	

function npRankUpCheck(row) {
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID; 
	});
	$(row).find(".np-rankup").prop("disabled", !target.npRankUp);
}	

function skillRankUpCheck(row, skill) {
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID; 
	});
	$(row).find("." + skill + "-rankup").prop("disabled", !target[skill + "RU"]);
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

function clearInventoryEventBuff() {
	$("#servant-inventory").find(".inventory-row").each(function() {
		$(this).find(".event-ED").val(0)
	});
	if (bgServant[0] !== undefined) {
		$(bgServant).each(function() {
			this.data[18] = 0;
		});
		currentSave.servant = bgServant;
		parent.bgServant = bgServant;
		parent.currentSave = currentSave;
		save();
	}
}

/* Inventory Teammate Modal */
var activeSetup = "不使用隊友";

let inventoryTeammateFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"],		// Exclude Mashu
	npColor: ["Buster", "Art", "Quick"],
	npRange: ["全體", "單體"],			// Exclude support & other
	owned: [true],				// Include owned servant only
	npDmg: [true]
};

$(document).ready(function() {
	// Change in class filtering criteria
	$(".inventory-teammate-class").click(function() {
		var servantClass = $(this).attr("title");
		inventoryTeammateClassChange(this, servantClass);
	});
	$("#inventory-teammate-class-setbtn").click(function() {
		inventoryTeammateClassAll();
	});
	$("#inventory-teammate-class-resetbtn").click(function() {
		inventoryTeammateClassNone();
	});
	
	// Change in star filtering criteria
	$(".inventory-teammate-star").change(function() {
		var star = Number($(this).val());
		inventoryTeammateStarChange(this, star);
	});
	$("#inventory-teammate-star-setbtn").click(function() {
		inventoryTeammateStarAll();
	});
	$("#inventory-teammate-star-resetbtn").click(function() {
		inventoryTeammateStarNone();
	});
	
	// Change in type filtering criteria
	$(".inventory-teammate-type").change(function() {
		var type = $(this).val();
		inventoryTeammateTypeChange(this, type);
	});
	$("#inventory-teammate-type-setbtn").click(function() {
		inventoryTeammateTypeAll();
	});
	$("#inventory-teammate-type-resetbtn").click(function() {
		inventoryTeammateTypeNone();
	});
	
	// Change in NP color filtering criteria
	$(".inventory-teammate-color").change(function() {
		var color = $(this).val();
		inventoryTeammateColorChange(this, color);
	});
	$("#inventory-teammate-color-setbtn").click(function() {
		inventoryTeammateColorAll();
	});
	$("#inventory-teammate-color-resetbtn").click(function() {
		inventoryTeammateColorNone();
	});
	
	// Change in NP range filtering criteria
	$(".inventory-teammate-range").change(function() {
		var range = $(this).val();
		inventoryTeammateRangeChange(this, range);
	});
	$("#inventory-teammate-range-setbtn").click(function() {
		inventoryTeammateRangeAll();
	});
	$("#inventory-teammate-range-resetbtn").click(function() {
		inventoryTeammateRangeNone();
	});
	
	$(".inventory-teammate-option").change(function() {
		selectInventoryTeammate();
		applyInventoryTeammateSelection();
	});
	
	$("#inventory-teammate-custom-setup input").change(function() {
		saveCustomBuff(this);
	});
	
	// Apply filter & generate new image list
	$("#inventory-teammate-filterbtn").click(function() {
		loadInventoryTeammateImg();
		applyInventoryTeammateSelection();
	});
	
	$(".inventory-teammate-modal-img").click(function() {
		selectServant(this);
	});
	
	$("#inventory-teammate-selection-setbtn").click(function() {
		selectAllServant();
	});
	
	$("#inventory-teammate-selection-resetbtn").click(function() {
		deselectAllServant();
	});
});

function selectInventoryTeammate() {
	var buffList = [];
	activeSetup = $(".inventory-teammate-option:checked").val();
	if (activeSetup == "自訂 I" || activeSetup == "自訂 II" || activeSetup == "自訂 III") {
		buffList = customBuff[0][activeSetup];
		$("#inventory-teammate-custom-setup").find("input").prop("disabled", false);
	} else {
		buffList = inventoryTeammateBuff[activeSetup];
		$("#inventory-teammate-custom-setup").find("input").prop("disabled", true);
	}
	
	if (activeSetup == "不使用隊友") {
		$("#inventory-teammate-selection-setbtn").hide();
		$("#inventory-teammate-selection-resetbtn").hide();
	} else {
		$("#inventory-teammate-selection-setbtn").show();
		$("#inventory-teammate-selection-resetbtn").show();
	}
	
	$("#inventory-atk-buff").val(buffList[0]);
	$("#inventory-add-atk").val(buffList[1]);
	$("#inventory-np-buff").val(buffList[2]);
	$("#inventory-Buster-buff").val(buffList[3]);
	$("#inventory-Art-buff").val(buffList[4]);
	$("#inventory-Quick-buff").val(buffList[5]);
}

function saveCustomBuff(element) {
	if (Number($(element).val()) < 0) {
		$(element).val(0);
	}
	var newBuff = [];
	$("#inventory-teammate-custom-setup input").each(function() {
		newBuff.push(Number($(this).val()));
	});
	customBuff[0][activeSetup] = newBuff;
	currentSave.customBuff = customBuff;
	parent.customBuff = customBuff;
	parent.currentSave = currentSave;
	save();
}

// Generate image list
function loadInventoryTeammateImg() {
	var filteredServant = multiFilter(servants, servantFilter);
	var servantID = filteredServant.map(function(servant) {
		return servant.id
	});
	$("#inventory-teammate-img").html("");
	var imglist = "";	
	$(servantID).each(function(index, value) {
		imglist += "<img class='servant-img inventory-teammate-modal-img' src='images/servant/" + value +
		".webp' data-id='" + value + "' />"
	});
	$("#inventory-teammate-img").html(imglist);
}

function applyInventoryTeammateSelection() {
	$(".inventory-teammate-modal-img").removeClass("selected");
	var list = bgServant[0].filter(function(obj) {
		return obj.data[16] == activeSetup;
	});
	$(list).each(function() {
		$(".inventory-teammate-modal-img[data-id:'" + this + "']").addClass("selected");
	});
}

function selectServant(img) {
	if (activeSetup == "不使用隊友" && $(img).hasClass("selected")) {
		alarm("「不使用隊友」為預設選項，無法取消。\n如果希望為從者設定隊友，請先選擇隊友組合。")
	} else {
		var id = Number($(img).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		if ($(img).hasClass("selected")) {
			$(img).removeClass("selected");
			bgServant[position].data[16] = "不使用隊友";
		} else {
			$(img).addClass("selected");
			bgServant[position].data[16] = activeSetup;
		}
		currentSave.servant = bgServant;
		parent.bgServant = bgServant;
		parent.currentSave = currentSave;
		save();
	}
}

function selectAllServant() {
	$(".inventory-teammate-modal-img").each(function() {
		$(this).addClass("selected");
		var id = Number($(this).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		bgServant[position].data[16] = activeSetup;
	});
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

function deselectAllServant() {
	$(".inventory-teammate-modal-img").each(function() {
		$(this).addClass("selected");
		var id = Number($(this).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		bgServant[position].data[16] = "不使用隊友";
	});
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}
		     
/* Command Code Modal */
var modalCaller = "";
var positionMarker = 0;

let inventoryCodeFilter = {
	star: [1, 2, 3, 4, 5],
	effect: ["獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", "傷害減免", "必中", 
		 "HP", "弱化狀態解除", "弱化狀態耐性", "弱化狀態無效", "強化狀態解除", "弱化狀態賦予"]
};

$(document).ready(function() {
	// Change in star filtering criteria
	$(".code-star").change(function() {
		var star = Number($(this).val());
		codeStarChange(this, star);
	});
	$("#code-star-setbtn").click(function() {
		codeStarAll();
	});
	$("#code-star-resetbtn").click(function() {
		codeStarNone();
	});
	
	// Change in effect filtering criteria
	$(".code-effect").change(function() {
		var effect = $(this).val();
		codeEffectChange(this, effect);
	});
	$("#code-effect-setbtn").click(function() {
		codeEffectAll();
	});
	$("#code-effect-resetbtn").click(function() {
		codeEffectNone();
	});
	
	// Apply filters and generate image list
	$("#code-filterbtn").click(function() {
		loadInventoryCodeImg();
	});
});

// Apply filters and generate image list
function loadInventoryCodeImg() {
	var filteredCode = multiFilter(cc, inventoryCodeFilter);
	var codeID = filteredCode.map(function(code) {
		return code.id
	});
	$("#code-img").html("");
	var imglist = "";	
	$(codeID).each(function(index, value) {
		imglist += "<img class='code-img code-modal-img' src='images/code/" + value +
		".webp' data-id='" + value + "' />"
	});
	$("#code-img").html(imglist);
	codeBind();
}

// Attach event handler to the images
function codeBind() {
	$(".code-modal-img").ready(function() {
		$(".code-modal-img").click(function() {
			var id = Number($(this).attr("data-id"));
			pickCode(modalCaller, positionMarker, id);
		});
	});
}

// Change in star filtering criteria
function codeStarChange(element, starNo) {
	var newStar = inventoryCodeFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
	 	inventoryCodeFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
	 	inventoryCodeFilter.star = newStar;
	}
}
function codeStarAll() {
	$(".ce-star").prop("checked", true);
 	inventoryCodeFilter.star = [1, 2, 3, 4, 5];
}
function codeStarNone() {
	$(".ce-star").prop("checked", false);
 	inventoryCodeFilter.star = [];
}

// Change in effect filtering criteria
function codeEffectChange(element, effect) {
	var newEffect = inventoryCodeFilter.effect;
	if ($(element).prop("checked")) {
		newEffect.push(effect);
		inventoryCodeFilter.effect = newEffect;
	} else {
		position = newEffect.indexOf(effect);
		newEffect.splice(position, 1);
		inventoryCodeFilter.effect = newEffect;
	}
}
function codeEffectAll() {
	$(".ce-effect").prop("checked", true);
	inventoryCodeFilter.effect = [];
}
function codeEffectNone() {
	$(".ce-effect").prop("checked", false);
	inventoryCodeFilter.effect = ["獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", "傷害減免", "必中", 
		 "HP", "弱化狀態解除", "弱化狀態耐性", "弱化狀態無效", "強化狀態解除", "弱化狀態賦予"];
}


// Initialise all filters
function initialInventoryCode() {
	codeStarAll();
	codeEffectAll();
}

function pickCode(target, position, id) {
	closeModal();
	modalCaller = "";
	positionMarker = 0;
	var row = $("#inventory-row-" + target);
	var img = $(row).find(".inventory-code-logo[data-value='" + position + "']");
	var codeInfo = cc.filter(function(obj) {
		return obj.id == id;
	});
	$(img).attr({
		"src": codeInfo[0].logoID,
		"data-id": id
	});
	update(img);
}
