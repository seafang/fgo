var currentSave = parent.currentSave;
var bgCE = parent.bgCE;

$(document).ready(function() {
	initialCEInventoryFilter();
	generateCEInventory();
	loadCESave();
});

// Generate ce inventory table
let ceInventoryFilter = {
	star: [1, 2, 3, 4, 5],
	type: ["常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"],
	buff: ["攻擊力", "Buster性能", "Art性能", "Quick性能", "寶具威力", "起始NP", "每回合NP", 
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", 
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP", 
		"狀態耐性", "狀態無效", "狀態成功率", "其他"],
	owned: [true, false]
};

function clearCEInventory() {
	$("#ce-inventory").find(".ce-inventory-row").each(function(){
		$(this).remove();
	});
}

function generateCEInventory() {
	var filteredCE = multiFilter(ce, ceInventoryFilter);
	clearCEInventory();
	var table = document.getElementById("ce-inventory");
	filteredCE.forEach(function(essence) {				
		var row = table.insertRow(-1);				
		$(row).addClass("ce-inventory-row");				
		$(row).attr("id", "ce-inventory-row-" + essence.ceID);				
		row.insertCell(-1).innerHTML = essence.ceID;
		row.insertCell(-1).innerHTML = "<img class='essence-img' src='" + essence.ceImgID + "' />";				
		row.insertCell(-1).innerHTML = essence.ceName;								
		var starHTML = "";				
		switch (essence.ceStar) {	
			case 1:
			default:
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
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='ce-owned' value='true'><span class='slider'></span></label>";			
		row.insertCell(-1).innerHTML = "<label class='switch'><input type='checkbox' class='ce-max' value='true' disabled><span class='slider'></span></label>";
		if (essence.defaultMax == true) {
			$(row).addClass("ce-default-max");
		}
		row.insertCell(-1).innerHTML = "<select class='narrow ce-inventory-lv' disabled>" + lvDropDown + "</select>";
		if (essence.defaultMax == true) {
			row.insertCell(-1).innerHTML = "<span class='ce-effect'>" + essence.maxEffect + "</span>";
		} else {
			row.insertCell(-1).innerHTML = "<span class='ce-effect'>" + essence.defaultEffect + "</span>";
		}
	});
}

function ceInventoryStarChange(element, starNo) {
	var newStar = ceInventoryFilter.star;
	if ($(element).prop("checked")) {
		newStar.push(starNo);
		ceInventoryFilter.star = newStar;
	} else {
		position = newStar.indexOf(starNo);
		newStar.splice(position, 1);
		ceInventoryFilter.star = newStar;
	}
}

function ceInventoryStarAll() {
	$(".ce-inventory-star").prop("checked", true);
	ceInventoryFilter.star = [1, 2, 3, 4, 5];
}

function ceInventoryStarNone() {
	$(".ce-inventory-star").prop("checked", false);
	ceInventoryFilter.star = [];
}

function ceInventoryTypeChange(element, typeName) {
	var newType = ceInventoryFilter.type;
	if ($(element).prop("checked")) {
		newType.push(typeName);
		ceInventoryFilter.type = newType;
	} else {
		position = newType.indexOf(typeName);
		newType.splice(position, 1);
		ceInventoryFilter.type = newType;
	}
}

function ceInventoryTypeAll() {
	$(".ce-inventory-type").prop("checked", true);
	ceInventoryFilter.type = ["常駐", "常駐/活動", "活動限定", "期間限定", "活動兌換", "羈絆禮裝", "限時兌換"];
}

function ceInventoryTypeNone() {
	$(".ce-inventory-type").prop("checked", false);
	ceInventoryFilter.type = [];
}

function ceInventoryBuffChange(element, buffName) {
	var newBuff = ceInventoryFilter.buff;
	if ($(element).prop("checked")) {
		newBuff.push(buffName);
		ceInventoryFilter.buff = newBuff;
	} else {
		position = newBuff.indexOf(buffName);
		newBuff.splice(position, 1);
		ceInventoryFilter.buff = newBuff;
	}
}

function ceInventoryBuffAll() {
	$(".ce-inventory-buff").prop("checked", true);
	ceInventoryFilter.buff = ["攻擊力", "Buster性能", "Art性能", "Quick性能", "寶具威力", "起始NP", "每回合NP", 
		"NP獲得量", "獲得爆擊星", "爆擊星掉落率", "爆擊威力", "爆擊星集中度", "特攻", "傷害附加", 
		"防禦力", "特防", "傷害減免", "迴避", "無敵", "毅力", "必中", "無敵貫通", "目標集中", "HP", 
		"狀態耐性", "狀態無效", "狀態成功率", "其他"];
}

function ceInventoryBuffNone() {
	$(".ce-inventory-buff").prop("checked", false);
	ceInventoryFilter.buff = [];
}

function ceInventoryInclusiveChange(element) {
	var value = $(element).is(":checked");
	if (value == true) {
		ceInventoryFilter.owned = [true];
	} else {
		ceInventoryFilter.owned = [true, false];
	}
}

function ceInventoryInclusiveReset() {
	$("#ce-inventory-owned").prop("checked", false);
	ceInventoryFilter.owned = [true, false];
}

function initialCEInventoryFilter() {
	ceInventoryStarAll();
	ceInventoryTypeAll();
	ceInventoryBuffAll();
	ceInventoryInclusiveReset();
}

// Apply saved ce data
function loadCESave() {
	if (bgCE[0] !== undefined) {
		$("#ce-inventory").find(".ce-inventory-row").each(function(){
			var rowID = Number($(this).find("td:first").html());
			var ownershipToggle = $(this).find(".ce-owned");
			var maxToggle = $(row).find(".ce-max");
			var essence = bgCE.filter(function(obj) {
				return obj.id == rowID;
			});
			if (essence[0] !== undefined) {
				if (essence[0].data[0] == true) {
					$(this).find(".ce-owned").attr("checked", true);
					enableCEOption(ownershipToggle);
				}
				if (servant[0].data[2] == true) {
					$(this).find(".ce-max").attr("checked", true);
					updateCEDscrp(maxToggle);
				}
				$(this).find(".ce-inventory-lv").val(essence[0].data[2]);
			}
		});
	}
}

// Update ce data
$(document).ready(function() {
	$(".ce-default-max").find(".ce-max").each(function() {
		$(this).prop("checked", true);
	});
	$("select").change(function() {
		updateCE(this)
	});
	$("input").change(function() {
		updateCE(this)
	});
	$(".ce-owned").change(function() {
		updateCEOwnership(this);
		enableCEOption(this);
	});
	$(".ce-max").change(function() {
		updateCEDscrp(this)
	});
});

function updateCE(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var info = {};
	if (bgCE[0] !== undefined) {
		var position = bgCE.findIndex(function(obj) {
			return obj.id == rowID; 
		});
		if (position !== -1) {
			bgCE.splice(position, 1);
		}
	}
	info.id = rowID;
	info.data = [];
	info.data[0] = $(row).find(".ce-owned").is(":checked");
	info.data[1] = $(row).find(".ce-max").is(":checked");
	var maxLV;
	switch (essence.ceStar) {	
			case 1:
			default:
				maxLV = 50;		
				break;		
			case 2:			
				maxLV = 55;		
				break;		
			case 3:			
				maxLV = 60;		
				break;		
			case 4:			
				maxLV = 80;		
				break;		
			case 5:			
				maxLV = 100;		
				break;				
		}
	if (Number($(row).find(".ce-inventory-lv").val()) > maxLV) {
		$(row).find(".ce-inventory-lv").val(maxLV);
	}
	info.data[2] = Number($(row).find(".ce-inventory-lv").val());
	bgCE.push(info);
	currentSave.ce = bgCE;
	parent.bgCE = bgCE;
	parent.currentSave = currentSave;
	save();
}

function updateCEOwnership(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var newValue = $(row).find(".ce-owned").is(":checked");
	var position = ce.findIndex(function(obj) {
		return obj.id == rowID;
	});
	ce[position].owned = newValue;
	parent.ce = ce;
}

function enableCEOption(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	if ($(element).is(":checked")) {
		if (!$(row).hasClass("ce-default-max")) {
			$(row).find(".ce-max").prop("disabled", false);
		}
		$(row).find(".ce-inventory-lv").prop("disabled", false);
	} else {
		if (!$(row).hasClass("ce-default-max")) {
			$(row).find(".ce-max").prop("checked", false);
			$(row).find(".ce-max").prop("disabled", true);
			updateCEDscrp(element);
		}
		$(row).find(".ce-inventory-lv").val(0);
		$(row).find(".ce-inventory-lv").prop("disabled", true);
		updateCE(element);
	}
}

function updateCEDscrp(element) {
	var row = $(element).parents("tr");
	var rowID = Number($(row).find("td:first").html());
	var target = ce.find(function(obj) {
		return obj.id == rowID; 
	});
	if ($(element).is(":checked")) {
		$(row).find(".ce-effect").html(target.maxEffect);
	} else {
		$(row).find(".ce-effect").html(target.defaultEffect);
	}
}


