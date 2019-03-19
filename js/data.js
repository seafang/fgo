// Load data
var servants = JSON.parse(servant);

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
			if (!filters[key].length) return true;
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

// Load save
var save1 = localStorage.getItem("save1");
var save2 = localStorage.getItem("save2");
var save3 = localStorage.getItem("save3");
var save4 = localStorage.getItem("save4");
var currentStorage = {};

function initialSave() {
	var currentStorage = save1;
	var select = $("#inventory-save");
	var option1, option2, option3, option4 = {};
	if (save1.length > 0) {
		option1 = {value: "save1", text: save1.title};
	} else {
		option1 = {value: "save1", text: "(無存檔)"};
	}
	if (save2.length > 0) {
		option2 = {value: "save2", text: save2.title};
	} else {
		option2 = {value: "save2", text: "(無存檔)"};
	}
	if (save3.length > 0) {
		option3 = {value: "save3", text: save3.title};
	} else {
		option3 = {value: "save3", text: "(無存檔)"};
	}
	if (save4.length > 0) {
		option4 = {value: "save4", text: save4.title};
	} else {
		option4 = {value: "save4", text: "(無存檔)"};
	}
	select.append($('<option>', option1));
	select.append($('<option>', option2));
	select.append($('<option>', option3));
	select.append($('<option>', option4));
}

function pickSave() {
}

var lvDropDown = "<option value='default'>預設</option>\
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
