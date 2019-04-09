// Load data
var affinity = JSON.parse(classAdvantage);
var multiplier = JSON.parse(classBaseMultiplier);
var attrAffinity = JSON.parse(attributeAdvantage);

var servants = JSON.parse(servant);
var ce = JSON.parse(craftEssence);
var master = JSON.parse(mysticCode);

var skillBuff = JSON.parse(servantSkillBuff);
var npBuff = JSON.parse(servantNPBuff);
var atk = JSON.parse(servantATK);
var ceBuff =  JSON.parse(craftEssenceBuff);
var ceAtk = JSON.parse(craftEssenceATK);
var masterBuff = JSON.parse(mysticCodeBuff);

// Load save
var currentSave = {};
var bgServant = [], bgCE = [], bgMaster = [];

$(document).ready(function() {
	generateSaveList();
	getSave();
});
