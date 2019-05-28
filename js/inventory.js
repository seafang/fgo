// Sync background data
var servants = parent.servants;
var ce = parent.ce;
var master = parent.master;
var cc = parent.cc;
var currentSave = parent.currentSave;
var bgServant = parent.bgServant;
var bgCE = parent.bgCE;
var bgMaster = parent.bgMaster;
var customBuff = parent.customBuff;
var favouritePage = parent.favouritePage;

$(document).ready(function() {
	initialInventoryFilter();		// Initialise filters, generate new table & apply saved data
	generateInventory();
	loadSave();
	updateCounter();
	checkFavourite();
	$(".favouritebtn").click(function() {
		var url = $(this).attr("data-src");
		setFavourite(url);
	});
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
	npColor: ["Buster", "Arts", "Quick"],
	npRange: ["全體", "單體", "輔助", "其他"],
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
				npSymb = "♣";
				break;
			case "輔助":
				npSymb = "♥";
				break;
			case "其他":
				npSymb = "♦";
				break;
		}
		row.insertCell(-1).innerHTML = "<img class='servant-img' src='" + servant.imgID + "' />";
		row.insertCell(-1).innerHTML = "<span class='" + servant.npColor + "'>" + npSymb + " " +
			servant.name + "</span>";
		row.insertCell(-1).innerHTML = "<img class='class-logo' src='images/class/" + servant.classes + ".webp' title='" + servant.classes + "' />";

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
		var card = ["Buster", "Arts", "Quick"];
		var i = 1;
		var cardHTML = "";
		$(card).each(function() {
			var count = servant[this + "No"];
			while (count > 0) {
				cardHTML += "<span><img class='card-logo inventory-card-logo dull' src='images/command/" +
					this + ".webp' data-value='" + i + "' /><img class='code-logo inventory-code-logo' src='' data-value='" + i + "' data-id='0' /></span>";
				i++;
				count--;
			}
		});
		row.insertCell(-1).innerHTML = cardHTML;

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
	inventoryFilter.npColor = ["Buster", "Arts", "Quick"];
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
	inventoryFilter.npRange = ["全體", "單體", "輔助", "其他"];
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
					enableOption(ownershipToggle, false);
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
				$(this).find(".event-ED").val(servant[0].data[19]);
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
	$("#servant-inventory select").change(function() {
		update(this);
	});
	$("#servant-inventory input").change(function() {
		update(this);
	});
	$(".owned").change(function() {
		updateOwnership(this);
		enableOption(this, true);
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

// Update data on change
function update(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var info = {};
	if (bgServant[0] !== undefined) {			// Remove existing data
		var position = bgServant.findIndex(function(obj) {
			return obj.id == rowID;
		});
		if (position !== -1) {
			bgServant.splice(position, 1);
		}
	}
	info.id = rowID;
	info.data = [];
	info.data[0] = $(row).find(".owned").is(":checked");			// Ownership
	info.data[1] = Number($(row).find(".inventory-lv").val());		// Servant lv
	info.data[2] = Number($(row).find(".nplv").val());			// NP lv
	info.data[3] = $(row).find(".np-rankup").is(":checked");		// NP rankup
	info.data[4] = Number($(row).find(".statup").val());			// Stats up (ATK)
	info.data[5] = Number($(row).find(".skill1-lv").val());			// Skill 1 lv
	info.data[6] = $(row).find(".skill1-rankup").is(":checked");		// Skill 1 rankup
	info.data[7] = Number($(row).find(".skill2-lv").val());			// Skill 2 lv
	info.data[8] = $(row).find(".skill2-rankup").is(":checked");		// Skill 2 rankup
	info.data[9] = Number($(row).find(".skill3-lv").val());			// Skill 3 lv
	info.data[10] = $(row).find(".skill3-rankup").is(":checked");		// Skill 3 rankup
	info.data[11] = Number($(row).find(".inventory-code-logo[data-value='1']").attr("data-id"));	// Commoand card 1 command code
	info.data[12] = Number($(row).find(".inventory-code-logo[data-value='2']").attr("data-id"));	// Commoand card 2 command code
	info.data[13] = Number($(row).find(".inventory-code-logo[data-value='3']").attr("data-id"));	// Commoand card 3 command code
	info.data[14] = Number($(row).find(".inventory-code-logo[data-value='4']").attr("data-id"));	// Commoand card 4 command code
	info.data[15] = Number($(row).find(".inventory-code-logo[data-value='5']").attr("data-id"));	// Commoand card 5 command code
										// data[16] = teammate
										// data[17] = CE
										// data[18] = mystic code
	info.data[19] = Number($(row).find(".event-ED").val());			// Event ED buff
	bgServant.push(info);
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

// Update ownership status to background array
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

// Enable fields on change in ownership status
function enableOption(element, changeTriggered) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var skillList = ["skill1", "skill2", "skill3"];
	if ($(element).is(":checked")) {
		$(row).find("select").prop("disabled", false);
		npRankUpCheck(row);
		$(row).find(".statup").prop("disabled", false);
		$(row).find(".skill-logo").removeClass("dull");
		$(row).find(".inventory-card-logo").removeClass("dull");
		$(skillList).each(function() {
			skillRankUpCheck(row, this);
			updateSkillImg($(row).find("." + this + "-rankup"), this);
		});
		$(row).find(".event-ED").prop("disabled", false);
		var position = bgServant.findIndex(function(obj) {
			return obj.id == rowID;
		});
		if (changeTriggered) {
			bgServant[position].data[16] = "不使用隊友";			// No teammate by default
			bgServant[position].data[17] = 0;							// No CE by default
			bgServant[position].data[18] = "不使用魔術禮裝";				// No mystic code by default
		}
	} else {								// Initialise all fields, delete entry
		$(row).find("select").prop("disabled", true);
		$(row).find("input").prop("disabled", true);
		$(element).prop("disabled", false);
		$(row).find(".inventory-lv").val(0);
		$(row).find(".nplv").val(1);
		$(row).find(":checkbox").prop("checked", false);
		$(row).find(".statup").val(0);
		$(row).find(".skill-logo").addClass("dull");
		$(row).find(".inventory-card-logo").addClass("dull");
		$(row).find(".inventory-code-logo").attr({
			"src": "",
			"data-id": 0
		});
		$(row).find(".skil1-lv").val(1);
		$(skillList).each(function() {
			updateSkillImg($(row).find("." + this + "-rankup"), this);
		});
		$(row).find(".event-ED").val(0);
		var position = bgServant.findIndex(function(obj) {
			return obj.id == rowID;
		});
		bgServant.splice(position, 1);
	}
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

// Enable NP rankup toggle
function npRankUpCheck(row) {
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID;
	});
	$(row).find(".np-rankup").prop("disabled", !target.npRankUp);
}

// Enable skill rankup toggle
function skillRankUpCheck(row, skill) {
	var rowID = Number($(row).find("td:first").html());
	var target = servants.find(function(obj) {
		return obj.id == rowID;
	});
	$(row).find("." + skill + "-rankup").prop("disabled", !target[skill + "RU"]);
}

// Update skill images
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

// Clear all event ED buff fields
function clearInventoryEventBuff() {
	$("#servant-inventory").find(".inventory-row").each(function() {
		$(this).find(".event-ED").val(0)
	});
	if (bgServant[0] !== undefined) {
		$(bgServant).each(function() {
			this.data[19] = 0;
		});
		currentSave.servant = bgServant;
		parent.bgServant = bgServant;
		parent.currentSave = currentSave;
		save();
	}
}

/* Inventory Teammate Modal */
var activeSetup = "不使用隊友";			// No teammate by default

let inventoryTeammateServantFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"],		// Exclude Mashu
	npColor: ["Buster", "Arts", "Quick"],
	npRange: ["全體", "單體"],			// Exclude support & other
	owned: [true],				// Include owned servant only
};

$(document).ready(function() {
	// Open teammate setup modal
	$("#inventory-teammate-modalbtn").click(function() {
		openModal("#inventory-teammate-modal");
		initialInventoryTeammateServant();
		loadInventoryTeammateServantImg();
		$(".inventory-teammate-option[value='不使用隊友']").prop("checked", true);		// "No teammate" as default
		selectInventoryTeammate();
		applyInventoryTeammateSelection();
	});

	// Change in class filtering criteria
	$(".inventory-teammate-servant-class").click(function() {
		var servantClass = $(this).attr("title");
		inventoryTeammateServantClassChange(this, servantClass);
	});
	$("#inventory-teammate-servant-class-setbtn").click(function() {
		inventoryTeammateServantClassAll();
	});
	$("#inventory-teammate-servant-class-resetbtn").click(function() {
		inventoryTeammateServantClassNone();
	});

	// Change in star filtering criteria
	$(".inventory-teammate-servant-star").change(function() {
		var star = Number($(this).val());
		inventoryTeammateServantStarChange(this, star);
	});
	$("#inventory-teammate-servant-star-setbtn").click(function() {
		inventoryTeammateServantStarAll();
	});
	$("#inventory-teammate-servant-star-resetbtn").click(function() {
		inventoryTeammateServantStarNone();
	});

	// Change in type filtering criteria
	$(".inventory-teammate-servant-type").change(function() {
		var type = $(this).val();
		inventoryTeammateServantTypeChange(this, type);
	});
	$("#inventory-teammate-servant-type-setbtn").click(function() {
		inventoryTeammateServantTypeAll();
	});
	$("#inventory-teammate-servant-type-resetbtn").click(function() {
		inventoryTeammateServantTypeNone();
	});

	// Change in NP color filtering criteria
	$(".inventory-teammate-servant-color").change(function() {
		var color = $(this).val();
		inventoryTeammateServantColorChange(this, color);
	});
	$("#inventory-teammate-servant-color-setbtn").click(function() {
		inventoryTeammateServantColorAll();
	});
	$("#inventory-teammate-servant-color-resetbtn").click(function() {
		inventoryTeammateServantColorNone();
	});

	// Change in NP range filtering criteria
	$(".inventory-teammate-servant-range").change(function() {
		var range = $(this).val();
		inventoryTeammateServantRangeChange(this, range);
	});
	$("#inventory-teammate-servant-range-setbtn").click(function() {
		inventoryTeammateServantRangeAll();
	});
	$("#inventory-teammate-servant-range-resetbtn").click(function() {
		inventoryTeammateServantRangeNone();
	});

	// Update selection highlight on change in setup
	$(".inventory-teammate-option").change(function() {
		selectInventoryTeammate();
		applyInventoryTeammateSelection();
	});

	// Save custom setup
	$("#inventory-teammate-custom-setup input").change(function() {
		saveCustomBuff(this);
	});

	// Apply filter & generate new image list
	$("#inventory-teammate-servant-filterbtn").click(function() {
		loadInventoryTeammateServantImg();
		applyInventoryTeammateSelection();
	});

	// Select all for current setup
	$("#inventory-teammate-servant-selection-setbtn").click(function() {
		teammateModalSelectAllServant();
	});

	// Deselect all for current setup
	$("#inventory-teammate-servant-selection-resetbtn").click(function() {
		teammateModalDeselectAllServant();
	});
});

// Retrieve current setup info
function selectInventoryTeammate() {
	var buffList = [];
	activeSetup = $(".inventory-teammate-option:checked").val();
	if (activeSetup == "自訂 I" || activeSetup == "自訂 II" || activeSetup == "自訂 III") {		// Enable fields with custom setup chosen
		buffList = customBuff[0][activeSetup];
		$("#inventory-teammate-custom-setup").find("input").prop("disabled", false);
	} else {
		buffList = inventoryTeammateBuff[activeSetup];
		$("#inventory-teammate-custom-setup").find("input").prop("disabled", true);
	}

	if (activeSetup == "不使用隊友") {				// Hide deselect button with "no teammate" chosen
		$("#inventory-teammate-servant-selection-resetbtn").hide();
	} else {
		$("#inventory-teammate-servant-selection-resetbtn").show();
	}

	// Apply saved setup data
	$("#inventory-atk-buff").val(buffList[0]);
	$("#inventory-add-atk").val(buffList[1]);
	$("#inventory-np-buff").val(buffList[2]);
	$("#inventory-Buster-buff").val(buffList[3]);
	$("#inventory-Arts-buff").val(buffList[4]);
	$("#inventory-Quick-buff").val(buffList[5]);
}

// Save custom setup
function saveCustomBuff(element) {
	if (Number($(element).val()) < 0) {
		$(element).val(0);
	}
	var newBuff = [];
	$("#inventory-teammate-custom-setup input").each(function() {
		newBuff.push(Number($(this).val()));
	});
	newBuff[6] = 100;
	customBuff[0][activeSetup] = newBuff;
	currentSave.customBuff = customBuff;
	parent.customBuff = customBuff;
	parent.currentSave = currentSave;
	save();
}

// Generate image list
function loadInventoryTeammateServantImg() {
	var filteredServant = multiFilter(servants, inventoryTeammateServantFilter);
	var servantID = filteredServant.map(function(servant) {
		return servant.id;
	});
	$("#inventory-teammate-servant-img").html("");
	var imglist = "";
	$(servantID).each(function(index, value) {
		imglist += "<img class='servant-img inventory-teammate-modal-img' src='images/servant/" + value +
		".webp' data-id='" + value + "' />"
	});
	$("#inventory-teammate-servant-img").html(imglist);

	// Attach event hander to the images
	$(".inventory-teammate-modal-img").ready(function() {
		$(".inventory-teammate-modal-img").click(function() {
			teammateModalSelectServant(this);
		});
	});
}

// Highlight selected servant
function applyInventoryTeammateSelection() {
	$(".inventory-teammate-modal-img").removeClass("selected");
	var target = bgServant.filter(function(obj) {
		return obj.data[16] == activeSetup;
	});
	var list = target.map(function(obj) {
		return obj.id;
	});
	$(list).each(function() {
		$(".inventory-teammate-modal-img[data-id='" + this + "']").addClass("selected");
	});
}

// Update data on select
function teammateModalSelectServant(img) {
	if (activeSetup == "不使用隊友" && $(img).hasClass("selected")) {			// Disallow deselect for "no teammate" option
		alarm("「不使用隊友」為預設選項，無法取消。\n如果希望為從者設定隊友，請先選擇隊友組合。")
	} else {
		var id = Number($(img).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		if ($(img).hasClass("selected")) {				// Remove setup on deselect
			$(img).removeClass("selected");
			bgServant[position].data[16] = "不使用隊友";
		} else {							// Save setup on select
			$(img).addClass("selected");
			bgServant[position].data[16] = activeSetup;
		}
		currentSave.servant = bgServant;
		parent.bgServant = bgServant;
		parent.currentSave = currentSave;
		save();
	}
}

// Select all for current option
function teammateModalSelectAllServant() {
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

// Deselect all for current option
function teammateModalDeselectAllServant() {
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

// Change in class filtering criteria
function inventoryTeammateServantClassChange(element, className) {
	var newClass = inventoryTeammateServantFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		inventoryTeammateServantFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		inventoryTeammateServantFilter.classes = newClass;
	}
}
function inventoryTeammateServantClassAll() {
	$(".inventory-teammate-servant-class").removeClass("dull");
	inventoryTeammateServantFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}
function inventoryTeammateServantClassNone() {
	$(".inventory-teammate-servant-class").addClass("dull");
	inventoryTeammateServantFilter.classes = [];
}

// Change in star filtering criteria
function inventoryTeammateServantStarChange(element, starNo) {
	var newStar = inventoryTeammateServantFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		inventoryTeammateServantFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		inventoryTeammateServantFilter.star = newStar;
	}
}
function inventoryTeammateServantStarAll() {
	$(".inventory-teammate-servant-star").prop("checked", true);
	inventoryTeammateServantFilter.star = [0, 1, 2, 3, 4, 5];
}
function inventoryTeammateServantStarNone() {
	$(".inventory-teammate-servant-star").prop("checked", false);
	inventoryTeammateServantFilter.star = [];
}

// Change in type filtering criteria
function inventoryTeammateServantTypeChange(element, typeName) {
	var newType = inventoryTeammateServantFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		inventoryTeammateServantFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		inventoryTeammateServantFilter.type = newType;
	}
}
function inventoryTeammateServantTypeAll() {
	$(".inventory-teammate-servant-type").prop("checked", true);
	inventoryTeammateServantFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"];
}
function inventoryTeammateServantTypeNone() {
	$(".inventory-teammate-servant-type").prop("checked", false);
	inventoryTeammateServantFilter.type = [];
}

// Change in NP color filtering criteria
function inventoryTeammateServantColorChange(element, colorName) {
	var newColor = inventoryTeammateServantFilter.npColor;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		inventoryTeammateServantFilter.npColor = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		inventoryTeammateServantFilter.npColor = newColor;
	}
}
function inventoryTeammateServantColorAll() {
	$(".inventory-teammate-servant-color").prop("checked", true);
	inventoryTeammateServantFilter.npColor = ["Buster", "Arts", "Quick"];
}
function inventoryTeammateServantColorNone() {
	$(".inventory-teammate-servant-color").prop("checked", false);
	inventoryTeammateServantFilter.npColor = [];
}

// Change in NP range filtering criteria
function inventoryTeammateServantRangeChange(element, rangeName) {
	var newRange = inventoryTeammateServantFilter.npRange;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		inventoryTeammateServantFilter.npRange = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		inventoryTeammateServantFilter.npRange = newRange;
	}
}
function inventoryTeammateServantRangeAll() {
	$(".inventory-teammate-servant-range").prop("checked", true);
	inventoryTeammateServantFilter.npRange = ["全體", "單體"];
}
function inventoryTeammateServantRangeNone() {
	$(".inventory-teammate-servant-range").prop("checked", false);
	inventoryTeammateServantFilter.npRange = [];
}

// Initialise all filters
function initialInventoryTeammateServant() {
	inventoryTeammateServantClassAll();
	inventoryTeammateServantStarAll();
	inventoryTeammateServantTypeAll();
	inventoryTeammateServantColorAll();
	inventoryTeammateServantRangeAll();
}


/* Inventory CE Modal */
var activeCE = "不使用禮裝";			// No CE by default
var activeCEID = 0;

let inventoryCEFilter = {
	star: [0, 3, 4, 5],
	type: ["其他", "常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"],
	effect: ["特殊", "攻擊力", "Buster性能", "Arts性能", "Quick性能", "寶具威力", "起始NP", "每回合NP",
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加",
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP",
		"狀態耐性", "狀態無效", "狀態成功率", "其他"],
	frequent: [true, false],
	owned: [true],				// Include owned CE only
};

$(document).ready(function() {
	// Open ce setup modal
	$("#inventory-ce-modalbtn").click(function() {
		openModal("#inventory-ce-modal");
		initialInventoryCE();
		loadInventoryCEImg();
		initialInventoryCEServant();
		loadInventoryCEServantImg();
		$(".inventory-ce-modal-img[data-id='0']").addClass("selected");
		$("#inventory-ce-selection").html("不使用禮裝");
	});
});

// CE selection
$(document).ready(function() {
	$(".inventory-ce-star").change(function() {
		var star = Number($(this).val());
		inventoryCEStarChange(this, star);
	});
	$("#inventory-ce-star-setbtn").click(function() {
		inventoryCEStarAll();
	});
	$("#inventory-ce-star-resetbtn").click(function() {
		inventoryCEStarNone();
	});

	$(".inventory-ce-type").change(function() {
		var type = $(this).val();
		inventoryCETypeChange(this, type);
	});
	$("#inventory-ce-type-setbtn").click(function() {
		inventoryCETypeAll();
	});
	$("#inventory-ce-type-resetbtn").click(function() {
		inventoryCETypeNone();
	});

	$(".inventory-ce-effect").change(function() {
		var effect = $(this).val();
		inventoryCEEffectChange(this, effect);
	});
	$("#inventory-ce-effect-setbtn").click(function() {
		inventoryCEEffectAll();
	});
	$("#inventory-ce-effect-resetbtn").click(function() {
		inventoryCEEffectNone();
	});

	$("#inventory-ce-frequent").change(function() {
		inventoryCEFrequentChange(this);
	});

	$("#inventory-ce-filterbtn").click(function() {
		loadInventoryCEImg();
	});
});

// Generate image list
function loadInventoryCEImg() {
	var filteredCE = multiFilter(ce, inventoryCEFilter);
	var essenceID = filteredCE.map(function(essence) {
		return essence.id;
	});
	$("#inventory-ce-img").html("");
	var imglist = "";
	$(essenceID).each(function(index, value) {
		imglist += "<img class='essence-img inventory-ce-modal-img' src='images/ce/" + value +
		".webp' data-id='" + value + "' />"
	});
	$("#inventory-ce-img").html(imglist);

	// Attach event hander to the images
	$(".inventory-ce-modal-img").ready(function() {
		$(".inventory-ce-modal-img").click(function() {
			$(".inventory-ce-modal-img").removeClass('selected');
			$(this).addClass("selected");
			var id = Number($(this).attr("data-id"));
			selectInventoryCE(id);
			applyInventoryCESelection(id);
		});
	});

	$(".inventory-ce-modal-img[data-id='" + activeCEID + "']").addClass("selected");
}

// Set active CE
function selectInventoryCE(id) {
	var essence = ce.filter(function(essence) {
		return essence.id == id;
	});
	activeCE = essence[0].name;
	activeCEID = id;
	$("#inventory-ce-selection").html(activeCE);

	if (activeCEID == 0) {				// Hide deselect button with "no ce" chosen
		$("#inventory-ce-servant-selection-resetbtn").hide();
	} else {
		$("#inventory-ce-servant-selection-resetbtn").show();
	}
}

// Highlight selected servant
function applyInventoryCESelection() {
	$(".inventory-ce-modal-servant-img").removeClass("selected");
	var target = bgServant.filter(function(obj) {
		return obj.data[17] == activeCEID;
	});
	var list = target.map(function(obj) {
		return obj.id;
	});
	$(list).each(function() {
		$(".inventory-ce-modal-servant-img[data-id='" + this + "']").addClass("selected");
	});
}

// Change in star filters
function inventoryCEStarChange(element, starNo) {
	var newStar = inventoryCEFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		inventoryCEFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		inventoryCEFilter.star = newStar;
	}
}
function inventoryCEStarAll() {
	$(".inventory-ce-star").prop("checked", true);
	inventoryCEFilter.star = [0, 3, 4, 5];
}
function inventoryCEStarNone() {
	$(".inventory-ce-star").prop("checked", false);
	inventoryCEFilter.star = [0];
}

// Change in type filters
function inventoryCETypeChange(element, typeName) {
	var newType = inventoryCEFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		inventoryCEFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		inventoryCEFilter.type = newType;
	}
}
function inventoryCETypeAll() {
	$(".inventory-ce-type").prop("checked", true);
	inventoryCEFilter.type = ["其他", "常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"];
}
function inventoryCETypeNone() {
	$(".inventory-ce-type").prop("checked", false);
	inventoryCEFilter.type = ["其他"];
}

// Change in effect filters
function inventoryCEEffectChange(element, effectName) {
	var newEffect = inventoryCEFilter.effect;
	if ($(element).prop("checked")) {
		newEffect.push(effectName);
		inventoryCEFilter.effect = newEffect;
	} else {
		position = newEffect.indexOf(effectName);
		newEffect.splice(position, 1);
		inventoryCEFilter.effect = newEffect;
	}
}
function inventoryCEEffectAll() {
	$(".inventory-ce-effect").prop("checked", true);
	inventoryCEFilter.effect = ["特殊", "攻擊力", "Buster性能", "Arts性能", "Quick性能", "寶具威力", "起始NP", "每回合NP",
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加",
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP",
		"狀態耐性", "狀態無效", "狀態成功率", "其他"];
}
function inventoryCEEffectNone() {
	$(".inventory-ce-effect").prop("checked", false);
	inventoryCEFilter.effect = ["特殊"];
}

// Change in frequency criteria
function inventoryCEFrequentChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		inventoryCEFilter.frequent = [true];
	} else {
		inventoryCEFilter.frequent = [true, false];
	}
}
function inventoryCEFrequentReset() {
	$("#inventory-ce-frequent").prop("checked", false);
	inventoryCEFilter.frequent = [true, false];
}

// Initialise all filters
function initialInventoryCE() {
	inventoryCEStarAll();
	inventoryCETypeAll();
	inventoryCEEffectAll();
	inventoryCEFrequentReset();
}


let inventoryCEServantFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"],		// Exclude Mashu
	npColor: ["Buster", "Arts", "Quick"],
	npRange: ["全體", "單體"],			// Exclude support & other
	owned: [true],				// Include owned servant only
};

// Servant selection
$(document).ready(function() {
	// Change in class filtering criteria
	$(".inventory-ce-servant-class").click(function() {
		var ceClass = $(this).attr("title");
		inventoryCEServantClassChange(this, ceClass);
	});
	$("#inventory-ce-servant-class-setbtn").click(function() {
		inventoryCEServantClassAll();
	});
	$("#inventory-ce-servant-class-resetbtn").click(function() {
		inventoryCEServantClassNone();
	});

	// Change in star filtering criteria
	$(".inventory-ce-servant-star").change(function() {
		var star = Number($(this).val());
		inventoryCEServantStarChange(this, star);
	});
	$("#inventory-ce-servant-star-setbtn").click(function() {
		inventoryCEServantStarAll();
	});
	$("#inventory-ce-servant-star-resetbtn").click(function() {
		inventoryCEServantStarNone();
	});

	// Change in type filtering criteria
	$(".inventory-ce-servant-type").change(function() {
		var type = $(this).val();
		inventoryCEServantTypeChange(this, type);
	});
	$("#inventory-ce-servant-type-setbtn").click(function() {
		inventoryCEServantTypeAll();
	});
	$("#inventory-ce-servant-type-resetbtn").click(function() {
		inventoryCEServantTypeNone();
	});

	// Change in NP color filtering criteria
	$(".inventory-ce-servant-color").change(function() {
		var color = $(this).val();
		inventoryCEServantColorChange(this, color);
	});
	$("#inventory-ce-servant-color-setbtn").click(function() {
		inventoryCEServantColorAll();
	});
	$("#inventory-ce-servant-color-resetbtn").click(function() {
		inventoryCEServantColorNone();
	});

	// Change in NP range filtering criteria
	$(".inventory-ce-servant-range").change(function() {
		var range = $(this).val();
		inventoryCEServantRangeChange(this, range);
	});
	$("#inventory-ce-servant-range-setbtn").click(function() {
		inventoryCEServantRangeAll();
	});
	$("#inventory-ce-servant-range-resetbtn").click(function() {
		inventoryCEServantRangeNone();
	});

	// Apply filter & generate new image list
	$("#inventory-ce-servant-filterbtn").click(function() {
		loadInventoryCEServantImg();
		applyInventoryCESelection();
	});

	// Select all for current setup
	$("#inventory-ce-servant-selection-setbtn").click(function() {
		ceModalSelectAllServant();
	});

	// Deselect all for current setup
	$("#inventory-ce-servant-selection-resetbtn").click(function() {
		ceModalDeselectAllServant();
	});
});

// Generate image list
function loadInventoryCEServantImg() {
	var filteredServant = multiFilter(servants, inventoryCEServantFilter);
	var servantID = filteredServant.map(function(servant) {
		return servant.id;
	});
	$("#inventory-ce-servant-img").html("");
	var imglist = "";
	$(servantID).each(function(index, value) {
		imglist += "<img class='servant-img inventory-ce-modal-servant-img' src='images/servant/" + value +
		".webp' data-id='" + value + "' />"
	});
	$("#inventory-ce-servant-img").html(imglist);

	// Attach event hander to the images
	$(".inventory-ce-modal-servant-img").ready(function() {
		$(".inventory-ce-modal-servant-img").click(function() {
			ceModalSelectServant(this);
		});
	});

	applyInventoryCESelection(activeCEID);
}

// Update data on select
function ceModalSelectServant(img) {
	if (activeCEID == 0 && $(img).hasClass("selected")) {			// Disallow deselect for "no teammate" option
		alarm("「不使用禮裝」為預設選項，無法取消。\n如果希望為從者設定禮裝，請先選擇禮裝。")
	} else {
		var id = Number($(img).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		if ($(img).hasClass("selected")) {				// Remove setup on deselect
			$(img).removeClass("selected");
			bgServant[position].data[17] = 0;
		} else {							// Save setup on select
			$(img).addClass("selected");
			bgServant[position].data[17] = id;
		}
		currentSave.servant = bgServant;
		parent.bgServant = bgServant;
		parent.currentSave = currentSave;
		save();
	}
}

// Select all for current option
function ceModalSelectAllServant() {
	$(".inventory-ce-modal-servant-img").each(function() {
		$(this).addClass("selected");
		var id = Number($(this).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		bgServant[position].data[17] = activeCEID;
	});
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

// Deselect all for current option
function ceModalDeselectAllServant() {
	$(".inventory-ce-modal-servant-img").each(function() {
		$(this).addClass("selected");
		var id = Number($(this).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		bgServant[position].data[17] = 0;
	});
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

// Change in class filtering criteria
function inventoryCEServantClassChange(element, className) {
	var newClass = inventoryCEServantFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		inventoryCEServantFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		inventoryCEServantFilter.classes = newClass;
	}
}
function inventoryCEServantClassAll() {
	$(".inventory-ce-servant-class").removeClass("dull");
	inventoryCEServantFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}
function inventoryCEServantClassNone() {
	$(".inventory-ce-servant-class").addClass("dull");
	inventoryCEServantFilter.classes = [];
}

// Change in star filtering criteria
function inventoryCEServantStarChange(element, starNo) {
	var newStar = inventoryCEServantFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		inventoryCEServantFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		inventoryCEServantFilter.star = newStar;
	}
}
function inventoryCEServantStarAll() {
	$(".inventory-ce-servant-star").prop("checked", true);
	inventoryCEServantFilter.star = [0, 1, 2, 3, 4, 5];
}
function inventoryCEServantStarNone() {
	$(".inventory-ce-servant-star").prop("checked", false);
	inventoryCEServantFilter.star = [];
}

// Change in type filtering criteria
function inventoryCEServantTypeChange(element, typeName) {
	var newType = inventoryCEServantFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		inventoryCEServantFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		inventoryCEServantFilter.type = newType;
	}
}
function inventoryCEServantTypeAll() {
	$(".inventory-ce-servant-type").prop("checked", true);
	inventoryCEServantFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"];
}
function inventoryCEServantTypeNone() {
	$(".inventory-ce-servant-type").prop("checked", false);
	inventoryCEServantFilter.type = [];
}

// Change in NP color filtering criteria
function inventoryCEServantColorChange(element, colorName) {
	var newColor = inventoryCEServantFilter.npColor;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		inventoryCEServantFilter.npColor = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		inventoryCEServantFilter.npColor = newColor;
	}
}
function inventoryCEServantColorAll() {
	$(".inventory-ce-servant-color").prop("checked", true);
	inventoryCEServantFilter.npColor = ["Buster", "Arts", "Quick"];
}
function inventoryCEServantColorNone() {
	$(".inventory-ce-servant-color").prop("checked", false);
	inventoryCEServantFilter.npColor = [];
}

// Change in NP range filtering criteria
function inventoryCEServantRangeChange(element, rangeName) {
	var newRange = inventoryCEServantFilter.npRange;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		inventoryCEServantFilter.npRange = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		inventoryCEServantFilter.npRange = newRange;
	}
}
function inventoryCEServantRangeAll() {
	$(".inventory-ce-servant-range").prop("checked", true);
	inventoryCEServantFilter.npRange = ["全體", "單體"];
}
function inventoryCEServantRangeNone() {
	$(".inventory-ce-servant-range").prop("checked", false);
	inventoryCEServantFilter.npRange = [];
}

// Initialise all filters
function initialInventoryCEServant() {
	inventoryCEServantClassAll();
	inventoryCEServantStarAll();
	inventoryCEServantTypeAll();
	inventoryCEServantColorAll();
	inventoryCEServantRangeAll();
}

/* Inventory Mystic Code Modal */
var activeMaster = "不使用魔術禮裝";			// No mystic code by default

let inventoryMasterServantFilter = {
	classes: ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
		"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"],
	star: [0, 1, 2, 3, 4, 5],
	type: ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"],		// Exclude Mashu
	npColor: ["Buster", "Arts", "Quick"],
	npRange: ["全體", "單體"],			// Exclude support & other
	owned: [true],				// Include owned servant only
};

$(document).ready(function() {
	// Open master setup modal
	$("#inventory-master-modalbtn").click(function() {
		openModal("#inventory-master-modal");
		inventoryGenerateMasterSelection();
		$("#inventory-master-selection").val("不使用魔術禮裝");			// "No mystic code" as default
		initialInventoryMasterServant();
		loadInventoryMasterServantImg();
		selectInventoryMaster();
		applyInventoryMasterSelection();
	});

	// Change in class filtering criteria
	$(".inventory-master-servant-class").click(function() {
		var servantClass = $(this).attr("title");
		inventoryMasterServantClassChange(this, servantClass);
	});
	$("#inventory-master-servant-class-setbtn").click(function() {
		inventoryMasterServantClassAll();
	});
	$("#inventory-master-servant-class-resetbtn").click(function() {
		inventoryMasterServantClassNone();
	});

	// Change in star filtering criteria
	$(".inventory-master-servant-star").change(function() {
		var star = Number($(this).val());
		inventoryMasterServantStarChange(this, star);
	});
	$("#inventory-master-servant-star-setbtn").click(function() {
		inventoryMasterServantStarAll();
	});
	$("#inventory-master-servant-star-resetbtn").click(function() {
		inventoryMasterServantStarNone();
	});

	// Change in type filtering criteria
	$(".inventory-master-servant-type").change(function() {
		var type = $(this).val();
		inventoryMasterServantTypeChange(this, type);
	});
	$("#inventory-master-servant-type-setbtn").click(function() {
		inventoryMasterServantTypeAll();
	});
	$("#inventory-master-servant-type-resetbtn").click(function() {
		inventoryMasterServantTypeNone();
	});

	// Change in NP color filtering criteria
	$(".inventory-master-servant-color").change(function() {
		var color = $(this).val();
		inventoryMasterServantColorChange(this, color);
	});
	$("#inventory-master-servant-color-setbtn").click(function() {
		inventoryMasterServantColorAll();
	});
	$("#inventory-master-servant-color-resetbtn").click(function() {
		inventoryMasterServantColorNone();
	});

	// Change in NP range filtering criteria
	$(".inventory-master-servant-range").change(function() {
		var range = $(this).val();
		inventoryMasterServantRangeChange(this, range);
	});
	$("#inventory-master-servant-range-setbtn").click(function() {
		inventoryMasterServantRangeAll();
	});
	$("#inventory-master-servant-range-resetbtn").click(function() {
		inventoryMasterServantRangeNone();
	});

	// Update selection highlight on change in setup
	$("#inventory-master-selection").change(function() {
		selectInventoryMaster();
		applyInventoryMasterSelection();
	});

	// Apply filter & generate new image list
	$("#inventory-master-servant-filterbtn").click(function() {
		loadInventoryMasterServantImg();
		applyInventoryMasterSelection();
	});

	// Select all for current setup
	$("#inventory-master-servant-selection-setbtn").click(function() {
		masterModalSelectAllServant();
	});

	// Deselect all for current setup
	$("#inventory-master-servant-selection-resetbtn").click(function() {
		masterModalDeselectAllServant();
	});
});

// Generate mystic code dropdown list
function inventoryGenerateMasterSelection() {
	$(master).each(function(index, value) {
		var select = $("#inventory-master-selection");
		var name = value.name;
		var option = {value: name, text: name};
		select.append($('<option>', option));
	});
}

// Retrieve current setup info
function selectInventoryMaster() {
	activeMaster = $("#inventory-master-selection").val();

	if (activeMaster == "不使用魔術禮裝") {				// Hide deselect button with "no mystic code" chosen
		$("#inventory-master-servant-selection-resetbtn").hide();
	} else {
		$("#inventory-master-servant-selection-resetbtn").show();
	}
}

// Generate image list
function loadInventoryMasterServantImg() {
	var filteredServant = multiFilter(servants, inventoryMasterServantFilter);
	var servantID = filteredServant.map(function(servant) {
		return servant.id;
	});
	$("#inventory-master-servant-img").html("");
	var imglist = "";
	$(servantID).each(function(index, value) {
		imglist += "<img class='servant-img inventory-master-modal-img' src='images/servant/" + value +
		".webp' data-id='" + value + "' />"
	});
	$("#inventory-master-servant-img").html(imglist);

	// Attach event hander to the images
	$(".inventory-master-modal-img").ready(function() {
		$(".inventory-master-modal-img").click(function() {
			masterModalSelectServant(this);
		});
	});
}

// Highlight selected servant
function applyInventoryMasterSelection() {
	$(".inventory-master-modal-img").removeClass("selected");
	var target = bgServant.filter(function(obj) {
		return obj.data[18] == activeMaster;
	});
	var list = target.map(function(obj) {
		return obj.id;
	});
	$(list).each(function() {
		$(".inventory-master-modal-img[data-id='" + this + "']").addClass("selected");
	});
}

// Update data on select
function masterModalSelectServant(img) {
	if (activeMaster == "不使用魔術禮裝" && $(img).hasClass("selected")) {			// Disallow deselect for "no mystic code" option
		alarm("「不使用魔術禮裝」為預設選項，無法取消。\n如果希望為從者設定魔術禮裝，請先選擇魔術禮裝。")
	} else {
		var id = Number($(img).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		if ($(img).hasClass("selected")) {				// Remove setup on deselect
			$(img).removeClass("selected");
			bgServant[position].data[18] = "不使用魔術禮裝";
		} else {							// Save setup on select
			$(img).addClass("selected");
			bgServant[position].data[18] = activeMaster;
		}
		currentSave.servant = bgServant;
		parent.bgServant = bgServant;
		parent.currentSave = currentSave;
		save();
	}
}

// Select all for current option
function masterModalSelectAllServant() {
	$(".inventory-master-modal-img").each(function() {
		$(this).addClass("selected");
		var id = Number($(this).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		bgServant[position].data[18] = activeMaster;
	});
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

// Deselect all for current option
function masterModalDeselectAllServant() {
	$(".inventory-master-modal-img").each(function() {
		$(this).addClass("selected");
		var id = Number($(this).attr("data-id"));
		var position = bgServant.findIndex(function(obj) {
			return obj.id == id;
		});
		bgServant[position].data[18] = "不使用魔術禮裝";
	});
	currentSave.servant = bgServant;
	parent.bgServant = bgServant;
	parent.currentSave = currentSave;
	save();
}

// Change in class filtering criteria
function inventoryMasterServantClassChange(element, className) {
	var newClass = inventoryMasterServantFilter.classes;
	if ($(element).hasClass("dull")) {
		$(element).removeClass("dull");
		newClass.push(className);
		inventoryMasterServantFilter.classes = newClass;
	} else {
		position = newClass.indexOf(className);
		newClass.splice(position, 1);
		$(element).addClass("dull");
		inventoryMasterServantFilter.classes = newClass;
	}
}
function inventoryMasterServantClassAll() {
	$(".inventory-teammate-servant-class").removeClass("dull");
	inventoryMasterServantFilter.classes = ["Saber", "Archer", "Lancer", "Rider", "Caster", "Assassin",
	"Berserker", "Shielder", "Ruler", "Avenger", "Mooncancer", "Foreigner"];
}
function inventoryMasterServantClassNone() {
	$(".inventory-teammate-servant-class").addClass("dull");
	inventoryMasterServantFilter.classes = [];
}

// Change in star filtering criteria
function inventoryMasterServantStarChange(element, starNo) {
	var newStar = inventoryMasterServantFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		inventoryMasterServantFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		inventoryMasterServantFilter.star = newStar;
	}
}
function inventoryMasterServantStarAll() {
	$(".inventory-teammate-servant-star").prop("checked", true);
	inventoryMasterServantFilter.star = [0, 1, 2, 3, 4, 5];
}
function inventoryMasterServantStarNone() {
	$(".inventory-teammate-servant-star").prop("checked", false);
	inventoryMasterServantFilter.star = [];
}

// Change in type filtering criteria
function inventoryMasterServantTypeChange(element, typeName) {
	var newType = inventoryMasterServantFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		inventoryMasterServantFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		inventoryMasterServantFilter.type = newType;
	}
}
function inventoryMasterServantTypeAll() {
	$(".inventory-teammate-servant-type").prop("checked", true);
	inventoryMasterServantFilter.type = ["常駐", "劇情池限定", "友情池限定", "期間限定", "活動"];
}
function inventoryMasterServantTypeNone() {
	$(".inventory-teammate-servant-type").prop("checked", false);
	inventoryMasterServantFilter.type = [];
}

// Change in NP color filtering criteria
function inventoryMasterServantColorChange(element, colorName) {
	var newColor = inventoryMasterServantFilter.npColor;
	if ($(element).prop("checked")) {
		newColor.push(colorName);
		inventoryMasterServantFilter.npColor = newColor;
	} else {
		position = newColor.indexOf(colorName);
		newColor.splice(position, 1);
		inventoryMasterServantFilter.npColor = newColor;
	}
}
function inventoryMasterServantColorAll() {
	$(".inventory-teammate-servant-color").prop("checked", true);
	inventoryMasterServantFilter.npColor = ["Buster", "Arts", "Quick"];
}
function inventoryMasterServantColorNone() {
	$(".inventory-teammate-servant-color").prop("checked", false);
	inventoryMasterServantFilter.npColor = [];
}

// Change in NP range filtering criteria
function inventoryMasterServantRangeChange(element, rangeName) {
	var newRange = inventoryMasterServantFilter.npRange;
	if ($(element).prop("checked")) {
		newRange.push(rangeName);
		inventoryMasterServantFilter.npRange = newRange;
	} else {
		position = newRange.indexOf(rangeName);
		newRange.splice(position, 1);
		inventoryMasterServantFilter.npRange = newRange;
	}
}
function inventoryMasterServantRangeAll() {
	$(".inventory-teammate-servant-range").prop("checked", true);
	inventoryMasterServantFilter.npRange = ["全體", "單體"];
}
function inventoryMasterServantRangeNone() {
	$(".inventory-teammate-servant-range").prop("checked", false);
	inventoryMasterServantFilter.npRange = [];
}

// Initialise all filters
function initialInventoryMasterServant() {
	inventoryMasterServantClassAll();
	inventoryMasterServantStarAll();
	inventoryMasterServantTypeAll();
	inventoryMasterServantColorAll();
	inventoryMasterServantRangeAll();
}

/* Command Code Modal */
var modalCaller = "";
var positionMarker = 0;

let inventoryCodeFilter = {
	star: [0, 1, 2, 3, 4, 5],
	effect: ["獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", "傷害減免", "必中",
		 "HP", "弱化狀態解除", "弱化狀態耐性", "弱化狀態無效", "強化狀態解除", "弱化狀態賦予", "其他"]
};

$(document).ready(function() {
	// Open command code modal
	$(".inventory-card-logo").click(function() {
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
	$(".code-star").prop("checked", true);
 	inventoryCodeFilter.star = [0, 1, 2, 3, 4, 5];
}
function codeStarNone() {
	$(".code-star").prop("checked", false);
 	inventoryCodeFilter.star = [0];
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
	$(".code-effect").prop("checked", true);
	inventoryCodeFilter.effect = ["獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", "傷害減免", "必中",
		 "HP", "弱化狀態解除", "弱化狀態耐性", "弱化狀態無效", "強化狀態解除", "弱化狀態賦予", "其他"];
}
function codeEffectNone() {
	$(".code-effect").prop("checked", false);
	inventoryCodeFilter.effect = ["其他"];
}

// Initialise all filters
function initialInventoryCode() {
	codeStarAll();
	codeEffectAll();
}

// Pick command code
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
