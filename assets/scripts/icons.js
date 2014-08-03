function getIcons(options, cb) {
	var url = 'https://api.iconfinder.com/v2/icons/search?query=' + options.query + '&count=50&premium=0';

	$.get(url, function(data) {
		cb(null, data.icons);
	});
}

module.exports = {
	get: getIcons
};