var server = 'http://107.170.237.226:49160';

function makeModel(opts, cb) {
	console.log('model opts', opts);

	var url = server + '/?url=' + opts.face;

	$.get(url, function(data, a, b) {
		var obj = data;

		cb(null, server + '/' + obj);
	});
}

module.exports = {
	make: makeModel
};