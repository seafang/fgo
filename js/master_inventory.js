var master = parent.master;
var currentSave = parent.currentSave;
var bgMaster = parent.bgMaster;
var favouritePage = parent.favouritePage;

$(document).ready(function() {
	generateMasterInventory();		// Generate inventory table
	loadMasterSave();		// Load saved data
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
	var height = $("#master-inventory-content").outerHeight() + 500;
	$("#master-inventory-counter").html(height);
}

// Clear current table
function clearMasterInventory() {
	$("#master-inventory").find(".master-inventory-row").each(function(){
		$(this).remove();
	});
}

// Generate inventory table
function generateMasterInventory() {
	clearMasterInventory();
	var table = document.getElementById("master-inventory");
	master.forEach(function(code) {
		var row = table.insertRow(-1);
		$(row).addClass("master-inventory-row");
		$(row).attr("id", "inventory-row-" + code.name);
		row.insertCell(-1).innerHTML = code.name;
		row.insertCell(-1).innerHTML = "<img class='master-img' src='" + code.imgID1 + "' />" +
			"<img class='master-img' src='" + code.imgID2 + "' />";
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='master-owned'><span class='slider'></span></label>";
		row.insertCell(-1).innerHTML = "<select class='tight master-inventory-lv' disabled><option value='1'>1</option>" +
			"<option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option>" +
			"<option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill1-logo dull' src='" + code.skill1ImgID + "' />";
		row.insertCell(-1).innerHTML = "<div>" + code.skill1Dscrp + "</div>";
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill2-logo dull' src='" + code.skill2ImgID + "' />";
		row.insertCell(-1).innerHTML = "<div>" + code.skill1Dscrp + "</div>";
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill3-logo dull' src='" + code.skill3ImgID + "' />";
		row.insertCell(-1).innerHTML = "<div>" + code.skill1Dscrp + "</div>";
	});
}

// Load saved data
function loadMasterSave() {
	if (bgMaster[0] !== undefined) {		// Check if save exists
		$("#master-inventory").find(".master-inventory-row").each(function(){
			var rowName = $(this).find("td:first").html();
			var ownershipToggle = $(this).find(".master-owned");
			var master = bgMaster.filter(function(obj) {
				return obj.name == rowName;
			});
			if (master[0] !== undefined) {
				if (master[0].data[0] == true) {		// Toggle if the mystic code is owned
					$(this).find(".master-owned").attr("checked", true);
					enableMasterOption(ownershipToggle);
				}
				$(this).find(".master-inventory-lv").val(master[0].data[1]);	// Update mystic code lv
			}
		});
	}
}

$(document).ready(function() {
	$("#inventory-row-迦勒底").find(".master-owned").prop("disabled", true);		// 迦勒底 is owned by default

	// Update save on change
	$("select").change(function() {
		updateMaster(this);
	});

	// Enable toggles on change in ownership
	$(".master-owned").change(function() {
		updateMasterOwnership(this);
		enableMasterOption(this);
	});
});

// Update mystic code save data
function updateMaster(element) {
	var row = $(element).parents("tr");
	var rowName = $(row).find("td:first").html();
	var info = {};

	// If there is an existing save for the mystic code, delete old save
	if (bgMaster[0] !== undefined) {
		var position = bgMaster.findIndex(function(obj) {
			return obj.name == rowName;
		});
		if (position !== -1) {
			bgMaster.splice(position, 1);
		}
	}

	info.name = rowName;
	info.data = [];
	info.data[0] = $(row).find(".master-owned").is(":checked");		// Ownership
	info.data[1] = Number($(row).find(".master-inventory-lv").val());	// Mystic code lv

	// Sync with background data
	bgMaster.push(info);
	currentSave.master = bgMaster;
	parent.bgMaster = bgMaster;
	parent.currentSave = currentSave;
	save();
}

// Update ownership status
function updateMasterOwnership(element) {
	var row = $(element).parents("tr");
	var rowName = $(row).find("td:first").html();
	var newValue = $(row).find(".master-owned").is(":checked");
	var position = master.findIndex(function(obj) {
		return obj.name == rowName;
	});
	master[position].owned = newValue;		// Update ownership status in database, allows filtering when needed
	parent.master = master;
}

// Enable toggles on change in ownership
function enableMasterOption(element) {
	var row = $(element).parents("tr");
	var rowName = $(row).find("td:first").html();
	if ($(element).is(":checked")) {		// When ownership is toggled 'true'
		$(row).find(".master-inventory-lv").prop("disabled", false);
		$(row).find(".skill1-logo").removeClass("dull");
		$(row).find(".skill2-logo").removeClass("dull");
		$(row).find(".skill3-logo").removeClass("dull");
	} else {					// Initialise all fields on disable
		$(row).find(".master-inventory-lv").val(0);
		$(row).find(".master-inventory-lv").prop("disabled", true);
		$(row).find(".skill1-logo").addClass("dull");
		$(row).find(".skill2-logo").addClass("dull");
		$(row).find(".skill3-logo").addClass("dull");
		updateMaster(element);
	}
}
