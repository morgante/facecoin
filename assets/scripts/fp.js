filepicker.setKey("AqbY7pzi3SwCgUDoCBzBMz");

module.exports = {
	upload: function(cb) {
		filepicker.pickAndStore({mimetype:"image/*"}, {}, function(blobs) {
			console.log(blobs);
			cb(null, {
				url: blobs[0].url
			});
		});
	}
};