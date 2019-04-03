var master = parent.master;
var currentSave = parent.currentSave;
var bgMaster = parent.bgMaster;

$(document).ready(function() {
	generateMasterInventory();
	loadMasterSave();
});

function clearMasterInventory() {
	$("#master-inventory").find(".master-inventory-row").each(function(){
		$(this).remove();
	});
}

function generateMasterInventory() {
	clearMasterInventory();
	var table = document.getElementById("master-inventory");
	master.forEach(function(code) {				
		var row = table.insertRow(-1);				
		$(row).addClass("master-inventory-row");				
		$(row).attr("id", "inventory-row-" + code.masterName);				
		row.insertCell(-1).innerHTML = code.masterName;
		row.insertCell(-1).innerHTML = "<img class='master-img' src='" + code.masterImgID1 + "' />" + 
			"<img class='master-img' src='" + code.masterImgID2 + "' />";								
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='master-owned' value='true'><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<select class='narrow master-inventory-lv' disabled><option value='1'>1</option>" + 				
			"<option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option>" + 			
			"<option value='7'>7</option><option value='8'>8</option><option value='9'>9</option><option value='10'>10</option></select>";
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill1-logo dull' src='" + code.skill1ImgID + "' />";
		row.insertCell(-1).innerHTML = code.skill1Dscrp;
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill2-logo dull' src='" + code.skill2ImgID + "' />";
		row.insertCell(-1).innerHTML = code.skill2Dscrp;
		row.insertCell(-1).innerHTML = "<img class='skill-logo skill3-logo dull' src='" + code.skill3ImgID + "' />";
		row.insertCell(-1).innerHTML = code.skill3Dscrp;
	});
}

// Apply saved data
function loadMasterSave() {
	if (bgMaster[0] !== undefined) {
		$("#master-inventory").find(".master-inventory-row").each(function(){
			var rowName = $(this).find("td:first").html();
			var ownershipToggle = $(this).find(".master-owned");
			var master = bgMaster.filter(function(obj) {
				return obj.name == rowName;
			});
			if (master[0] !== undefined) {
				if (master[0].data[0] == true) {
					$(this).find(".master-owned").attr("checked", true);
					enableMasterOption(ownershipToggle);
				}
				$(this).find(".master-inventory-lv").val(master[0].data[1]);
			}
		});
	}
}

// Update data
$(document).ready(function() {
	$("#inventory-row-迦勒底").find(".master-owned").prop("disabled", true);
	$("select").change(function() {
		updateMaster(this);
	});
	$(".master-owned").change(function() {
		updateMasterOwnership(this);
		enableMasterOption(this);
	});
});

function updateMaster(element) {
	var row = $(element).parents("tr");
	var rowName = $(row).find("td:first").html();
	var info = {};
	if (bgServant[0] !== undefined) {
		var position = bgMaster.findIndex(function(obj) {
			return obj.name == rowName; 
		});
		if (position !== -1) {
			bgMaster.splice(position, 1);
		}
	}
	info.name = rowName;
	info.data = [];
	info.data[0] = $(row).find(".master-owned").is(":checked");
	info.data[1] = Number($(row).find(".master-inventory-lv").val());
	bgMaster.push(info);
	currentSave.master = bgMaster;
	parent.bgMaster = bgMaster;
	parent.currentSave = currentSave;
	save();
}

function updateMasterOwnership(element) {
	var row = $(element).parents("tr");
	var rowName = $(row).find("td:first").html();
	var newValue = $(row).find(".master-owned").is(":checked");
	var position = master.findIndex(function(obj) {
		return obj.masterName == rowName;
	});
	master[position].owned = newValue;
	parent.master = master;
}

function enableMasterOption(element) {
	var row = $(element).parents("tr");
	var rowName = $(row).find("td:first").html();
	if ($(element).is(":checked")) {
		$(row).find(".master-inventory-lv").prop("disabled", false);
		$(row).find(".skill1-logo").removeClass("dull");
		$(row).find(".skill2-logo").removeClass("dull");
		$(row).find(".skill3-logo").removeClass("dull");
	} else {
		$(row).find(".master-inventory-lv").val(0);
		$(row).find(".master-inventory-lv").prop("disabled", true);
		$(row).find(".skill1-logo").addClass("dull");
		$(row).find(".skill2-logo").addClass("dull");
		$(row).find(".skill3-logo").addClass("dull");
		update(element);
	}
}
