var currentSave = parent.currentSave;
var bgCE = parent.bgCE;

$(document).ready(function() {
	initialCEInventoryFilter();
	generateCEInventory();
	loadCESave();
});
