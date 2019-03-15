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
	$("#current-enemy-name").html(enemyInfo[0].name);
	if (enemyInfo.classes) {
		$("#current-enemy-class").val(enemyInfo[0].classes);
	} else {
		$("#current-enemy-class").val("Saber");
	}
	$("#current-enemy-gender").val(enemyInfo[0].gender);
	$("#current-enemy-attribute").val(enemyInfo[0].attribute);
	$("#current-enemy-alignment1").val(enemyInfo[0].alignment1);
	$("#current-enemy-alignment2").val(enemyInfo[0].alignment2);
	$("#current-enemy-trait").html(enemyInfo[0].trait);
}

function setEnemy(element) {
	$(element).show();
	$(element).find(".enemy-name").html(enemyInfo[0].name);
	$(element).find(".enemy-class").html(enemyInfo[0].classes);
	$(element).find(".enemy-gender").html(enemyInfo[0].gender);
	$(element).find(".enemy-attribute").html(enemyInfo[0].attribute);
	$(element).find(".enemy-alignment1").html(enemyInfo[0].alignment1);
	$(element).find(".enemy-alignment2").html(enemyInfo[0].alignment2);
	$(element).find(".enemy-trait").html(enemyInfo[0].trait);
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
