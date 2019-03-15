// Set Enemy
function pickEnemy(type, enemyID) {
	closeModal();
	var enemyInfo = {};
	if (type === 1) {
		enemyInfo = servants.filter(function(obj) {
			return obj.id == enemyID;
		});
	} else {
		enemyInfo = commons.filter(function(obj) {
			return obj.id == enemyID;
		});
	}
	$("#current-enemy-name").html(enemyInfo.name);
	if (enemyInfo.classes) {
		$("#current-enemy-class").val(enemyInfo.classes);
	} else {
		$("#current-enemy-class").val("Saber");
	}
	$("#current-enemy-gender").val(enemyInfo.gender);
	$("#current-enemy-attribute").val(enemyInfo.attribute);
	$("#current-enemy-alignment1").val(enemyInfo.alignment1);
	$("#current-enemy-alignment2").val(enemyInfo.alignment2);
	$("#current-enemy-trait").html(enemyInfo.trait);
}

function setEnemy(element) {
	$(element).show();
	$(element).find(".enemy-name").html(enemyInfo.name);
	$(element).find(".enemy-class").html(enemyInfo.classes);
	$(element).find(".enemy-gender").html(enemyInfo.gender);
	$(element).find(".enemy-attribute").html(enemyInfo.attribute);
	$(element).find(".enemy-alignment1").html(enemyInfo.alignment1);
	$(element).find(".enemy-alignment2").html(enemyInfo.alignment2);
	$(element).find(".enemy-trait").html(enemyInfo.trait);
}

function resetEnemy(element) {
	$(element).hide();
	$(element).find(".enemy-name").html("");
	$(element).find(".enemy-class").html("");
	$(element).find(".enemy-gender").html("");
	$(element).find(".enemy-attribute").html("");
	$(element).find(".enemy-alignment1").html("");
	$(element).find(".enemy-alignment2").html("");
	$(element).find(".enemy-trait").html("");
}
