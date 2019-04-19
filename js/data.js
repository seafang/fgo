// Filter function
/**
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria as the property names
 * @return {Array}
 */
function multiFilter(array, filters) {
	var filterKeys = Object.keys(filters);
	return array.filter(function(item) {
		return filterKeys.every(function(key) {
			/* if (!filters[key].length) return true; */		// Skip empty criteria
			if (Array.isArray(item[key])) {
				var test = [];
				item[key].forEach(function(value) {
					test.push(filters[key].includes(value));  
				});
				return test.some(function (value){
					return true === value;
				});
			}
			return filters[key].includes(item[key]);
		});
	});
}

// Compare & sort array elements
function sortArray(array, key) {
	array.sort(function(a, b) {
		return a[key] - b[key];
	});
}

// Load save
function generateSaveList() {
	var option1 = {}, option2 = {}, option3 = {}, option4 = {};
	var save1 = JSON.parse(localStorage.getItem("save1"));
	var save2 = JSON.parse(localStorage.getItem("save2"));
	var save3 = JSON.parse(localStorage.getItem("save3"));
	var save4 = JSON.parse(localStorage.getItem("save4"));
	var select = $("#inventory-save");
	select.html("");
	if (save1 != null) {
		option1 = {value: "save1", text: save1.title};
	} else {
		option1 = {value: "save1", text: "(未建立)"};
	}
	if (save2 != null) {
		option2 = {value: "save2", text: save2.title};
	} else {
		option2 = {value: "save2", text: "(未建立)"};
	}
	if (save3 != null) {
		option3 = {value: "save3", text: save3.title};
	} else {
		option3 = {value: "save3", text: "(未建立)"};
	}
	if (save4 != null) {
		option4 = {value: "save4", text: save4.title};
	} else {
		option4 = {value: "save4", text: "(未建立)"};
	}
	select.append($('<option>', option1));
	select.append($('<option>', option2));
	select.append($('<option>', option3));
	select.append($('<option>', option4));
}

// Acquire existing save or create blank save
function getSave() {
	var saveSlot = $("#inventory-save").val();
	var title = $("#inventory-save").find("option:selected").html();
	if (title == "(未建立)") {
		$("#save-title").val("");
		currentSave.saveSlot = saveSlot;
		currentSave.title = "未命名存檔";
		
		// Set Mashu as default servant
		currentSave.servant = [{"id":1, "data":[true, 0, 3, false, 0, 1, false, 1, false, 1, false, null, null, null, null, null, null, null, 0]}];
		
		currentSave.ce = [];
		
		// Set Chaldea as default mystic code
		currentSave.master = [{"name":"迦勒底", "data":[true, 1]}];
		
		currentSave.customBuff = [{
			"自訂 I": [0, 0, 0, 0, 0, 0],
			"自訂 II": [0, 0, 0, 0, 0, 0],
			"自訂 III": [0, 0, 0, 0, 0, 0],
		}];
		
		save();
		generateSaveList()
		bgServant = currentSave.servant;
		bgMaster = currentSave.master;
		customBuff = currentSave.customBuff;
		servantOwnership();
		ceOwnership();
		ceFrequent();
		masterOwnership();
	} else {
		$("#save-title").val(title);
		currentSave = JSON.parse(localStorage.getItem(saveSlot));
		bgServant = currentSave.servant;
		bgCE = currentSave.ce;
		bgMaster = currentSave.master;
		customBuff = currentSave.customBuff;
		servantOwnership();
		ceOwnership();
		ceFrequent();
		masterOwnership();
	}
}

// Save new name
function saveName() {
	if ($("#save-title").val() == "" || $("#save-title").val() == " " || $("#save-title").val() == "(未建立)") {
		alert("請先輸入存檔名稱！");
	} else {
		var title = $("#save-title").val();
		if (confirm("命名目前存檔為： 「" + title + "」？")) {
			currentSave.title = title;
			save();
			alert("存檔已被命名為" + title);
			generateSaveList();
		}
	}
}

// Delete save
function clearSave() {
	if (confirm("確認要清除以下存檔？ \n 「" + currentSave.title + "」 \n 被清除的存檔無法復原，本頁面亦會重新整理。")) {
		localStorage.removeItem(currentSave.saveSlot);
		currentSave = {};
		bgServant = [], bgCE = [], bgMaster = [];
		alert("存檔已被刪除。");
		window.location.reload(true);
	}
}

// Save current save
function save() {
	localStorage.setItem(currentSave.saveSlot, JSON.stringify(currentSave));
}

// Update servant owenrship status to background array
function servantOwnership() {
	servants.forEach(function(servant) {
		var id = servant.id;
		var target = bgServant.find(function(obj) {
			return obj.id == id; 
		});
		if (target !== undefined) {
			servant.owned = target.data[0];
		} else {
			servant.owned = false;
		}
	});
}

// Update ce owenrship status to background array
function ceOwnership() {
	ce.forEach(function(essence) {
		var id = essence.id;
		var target = bgCE.find(function(obj) {
			return obj.id == id; 
		});
		if (target !== undefined) {
			essence.owned = target.data[0];
		} else {
			essence.owned = false;
		}
	});
}

// Update ce frequency status to background array
function ceFrequent() {
	ce.forEach(function(essence) {
		var id = essence.id;
		var target = bgCE.find(function(obj) {
			return obj.id == id; 
		});
		if (target !== undefined) {
			essence.frequent = target.data[3];
		} else {
			essence.frequent = false;
		}
	});
}

// Update mystic code owenrship status to background array
function masterOwnership() {
	master.forEach(function(code) {
		var name = code.name;
		var target = bgMaster.find(function(obj) {
			return obj.name == name; 
		});
		if (target !== undefined) {
			code.owned = target.data[0];
		} else {
			code.owned = false;
		}
	});
}

var inventoryTeammateBuff = {
	"不使用隊友": [0, 0, 0, 0, 0, 0],
	"孔明": [30, 500, 0, 0, 0, 0],
	"雙孔明": [60, 1000, 0, 0, 0, 0],
	"梅林": [20, 0, 0, 50, 0, 0],
	"雙梅林": [40, 0, 0, 100, 0, 0],
	"玉藻前": [0, 0, 30, 0, 50, 0],
	"雙玉藻前": [0, 0, 60, 0, 100, 0],
	"斯卡蒂": [30, 0, 0, 0, 0, 50],
	"雙斯卡蒂": [60, 0, 0, 0, 0, 100],
	"梅林 + 孔明": [50, 500, 0, 50, 0, 0],
	"玉藻前 + 孔明": [30, 500, 30, 0, 50, 0],
	"斯卡蒂 + 孔明": [60, 500, 0, 0, 0, 50],
};

var lvDropDown = "<option value='0'>預設</option>\
	<option value='100'>100</option>\
	<option value='99'>99</option>\
	<option value='98'>98</option>\
	<option value='97'>97</option>\
	<option value='96'>96</option>\
	<option value='95'>95</option>\
	<option value='94'>94</option>\
	<option value='93'>93</option>\
	<option value='92'>92</option>\
	<option value='91'>91</option>\
	<option value='90'>90</option>\
	<option value='89'>89</option>\
	<option value='88'>88</option>\
	<option value='87'>87</option>\
	<option value='86'>86</option>\
	<option value='85'>85</option>\
	<option value='84'>84</option>\
	<option value='83'>83</option>\
	<option value='82'>82</option>\
	<option value='81'>81</option>\
	<option value='80'>80</option>\
	<option value='79'>89</option>\
	<option value='78'>88</option>\
	<option value='77'>77</option>\
	<option value='76'>76</option>\
	<option value='75'>75</option>\
	<option value='74'>74</option>\
	<option value='73'>73</option>\
	<option value='72'>72</option>\
	<option value='71'>71</option>\
	<option value='70'>70</option>\
	<option value='69'>69</option>\
	<option value='68'>68</option>\
	<option value='67'>67</option>\
	<option value='66'>66</option>\
	<option value='65'>65</option>\
	<option value='64'>64</option>\
	<option value='63'>63</option>\
	<option value='62'>62</option>\
	<option value='61'>61</option>\
	<option value='60'>60</option>\
	<option value='59'>59</option>\
	<option value='58'>58</option>\
	<option value='57'>57</option>\
	<option value='56'>56</option>\
	<option value='55'>55</option>\
	<option value='54'>54</option>\
	<option value='53'>53</option>\
	<option value='52'>52</option>\
	<option value='51'>51</option>\
	<option value='50'>50</option>\
	<option value='49'>49</option>\
	<option value='48'>48</option>\
	<option value='47'>47</option>\
	<option value='46'>46</option>\
	<option value='45'>45</option>\
	<option value='44'>44</option>\
	<option value='43'>43</option>\
	<option value='42'>42</option>\
	<option value='41'>41</option>\
	<option value='40'>40</option>\
	<option value='39'>39</option>\
	<option value='38'>38</option>\
	<option value='37'>37</option>\
	<option value='36'>36</option>\
	<option value='35'>35</option>\
	<option value='34'>34</option>\
	<option value='33'>33</option>\
	<option value='32'>32</option>\
	<option value='31'>31</option>\
	<option value='30'>30</option>\
	<option value='29'>29</option>\
	<option value='28'>28</option>\
	<option value='27'>27</option>\
	<option value='26'>26</option>\
	<option value='25'>25</option>\
	<option value='24'>24</option>\
	<option value='23'>23</option>\
	<option value='22'>22</option>\
	<option value='21'>21</option>\
	<option value='20'>20</option>\
	<option value='19'>19</option>\
	<option value='18'>18</option>\
	<option value='17'>17</option>\
	<option value='16'>16</option>\
	<option value='15'>15</option>\
	<option value='14'>14</option>\
	<option value='13'>13</option>\
	<option value='12'>12</option>\
	<option value='11'>11</option>\
	<option value='10'>10</option>\
	<option value='9'>9</option>\
	<option value='8'>8</option>\
	<option value='7'>7</option>\
	<option value='6'>6</option>\
	<option value='5'>5</option>\
	<option value='4'>4</option>\
	<option value='3'>3</option>\
	<option value='2'>2</option>\
	<option value='1'>1</option>";
