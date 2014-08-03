var server = 'http://107.170.237.226:49160';

function makeModel(opts, cb) {
	console.log('model opts', opts);

	if (opts.face === 'https://raw.githubusercontent.com/morgante/facecoin/master/yc.png') {
		cb(null, 'https://cdn.rawgit.com/morgante/facecoin-models/master/obj/yc.obj');
	}

	if (opts.face === 'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/128/leaf.png') {
		cb(null, 'https://cdn.rawgit.com/morgante/facecoin-models/master/obj/leaf.obj');
	}

	var url = server + '/?url=' + opts.face + '&type=' + opts.type;

	$.get(url, function(data, a, b) {
		var obj = data;

		cb(null, server + '/' + obj);
	});
}

module.exports = {
	make: makeModel
};