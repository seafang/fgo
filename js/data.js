// Load servant data
var servants = JSON.parse(servant);

// Filter function
/**
 * @param  {Array}  array: the array to filter
 * @param  {Object} filters: an object with the filter criteria as the property names
 * @return {Array}
 */
function multiFilter(array, filters) {
	const filterKeys = Object.keys(filters);
	return array.filter((item) => {
		return filterKeys.every(key => {
			if (!filters[key].length) return true;
			return filters[key].includes(item[key]);
		});
	});
}
