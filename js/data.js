// Load servant data
var servants = JSON.parse(servant);

// Filter function
/**
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria as the property names
 * @return {Array}
 */

/* function multiFilter(array, filters) {
	var filterKeys = Object.keys(filters);
	return array.filter(function (item) {
		return filterKeys.every(function (key) {
			if (!filters[key].length) return true;
			return filters[key].includes(item[key]);
		});
	});
}*/

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
