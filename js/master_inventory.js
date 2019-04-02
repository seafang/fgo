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

