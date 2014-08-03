var fp = require('./fp');
var BTC = require('bitcoinjs-lib');
var _ = require('lodash');
var models = require('./models');
var icons = require('./icons');

require('./bindings');

function Coin(data) {
	ko.mapping.fromJS(data, {}, this);
}

var connection = new WebSocket('ws://ws.blockchain.info/inv');
var subs = {};

connection.onmessage = function(e) {
	var message = JSON.parse(e.data);

	var data = message.x;

	data.out.forEach(function(out) {
		if (subs[out.addr] !== undefined) {
			subs[out.addr](out);
		}
	});

	console.log(message);
};


function subscribeToAddress(address, cb) {
	subs[address] = cb;

	var op = {"op":"addr_sub", "addr": address};

	console.log(address);

	connection.send(JSON.stringify(op));
}

function initKO() {
	var $container = $('[data-view="checkout"]');
	var $views = $('.screen');
	var $uploadView = $('[data-role="upload"]');
	var $coinView = $('[data-role="coins"]');
	var $previewView = $('[data-role="preview"]');

	$views.hide();

	var model = {
		'photo': '',
		'page': 'upload',
		'coins': [],
		'iconSearch': '',
		'icons': [
			'https://cdn3.iconfinder.com/data/icons/meteocons/512/cloud-128.png',
			'https://cdn3.iconfinder.com/data/icons/meteocons/512/sun-cloud-128.png',
			'https://cdn3.iconfinder.com/data/icons/meteocons/512/sun-symbol-128.png',
			'https://cdn2.iconfinder.com/data/icons/windows-8-metro-style/128/leaf.png',
			'https://cdn3.iconfinder.com/data/icons/wpzoom-developer-icon-set/500/100-128.png'
		],
		moreIcons: [
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png',
			'https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519687-194_LightBulb-128.png'
		],
		showingMoreIcons: true,
		'selectedDenom': 0,
		uploadPhoto: function() {
			fp.upload(function(err, image) {
				model.photo(image.url);

				model.goToCoins();
			});
		},
		goToUpload: function() {
			model.page('upload');
			$views.hide();
			$uploadView.show();
		},
		goToCoins: function() {
			model.page('coins');
			$views.hide();
			$coinView.show();
		},
		denoms: [100, 500, 600],
		addCoin: function() {
			var key = BTC.ECKey.makeRandom();
			var address = key.pub.getAddress().toString();

			address = '15X4BiV7bc5xN2EYPyPagtayHnFWEQ24zr'; // testing

			var coin = model.coins.mappedCreate({
				"amount": model.selectedDenom(),
				"address": address,
				"privateKey": key.toWIF(),
				"model": "",
				"confirmed": false
			});

			function confirm() {
				coin.confirmed(true);
			}

			subscribeToAddress(address, function(data) {
				console.log('got data', data);
				confirm();
			});

			models.make({
				"face": model.photo()
			}, function(err, model) {
				coin.model(model);
			});

			setTimeout(confirm, 500);

			return coin;
		},
		goPreview: function() {
			model.page('preview');
			$views.hide();
			$previewView.show();
		}
	};

	var spec = {
		"coins": {
			"create": function(options) {
				var data = options.data;

				return new Coin(data);
			},
			"key": function(data) {
				return ko.utils.unwrapObservable(data.id);
			}
		}
	};

	model = ko.mapping.fromJS(model, spec);

	model.selectIcon = function(context) {
		model.photo(context);
		model.goToCoins();
	};

	model.toggleIcons = function() {
		model.showingMoreIcons(!model.showingMoreIcons());
	};

	model.iconSearch.subscribe(_.throttle(function(value) {
		console.log('query', value);

		icons.get({query: value}, function(err, data) {
			model.moreIcons.removeAll();

			_.each(data, function(icon) {
				_.find(icon.raster_sizes, function(size) {
					if (size.size_width >= 128) {
						model.moreIcons.push(size.formats[0].preview_url);

						return true;
					}
				});
			});
		});

	}, 100, {
		"leading": true,
		"trailing": true
	}));

	

	model.canProceed = ko.computed(function() {
		if (model.page() === 'coins') {
			if (model.coins().length > 0) {
				return _.every(model.coins(), function(coin) {
					return coin.confirmed();
				});
			}
		}

		return false;
	});

	model.coin = ko.computed(function() {
		var coins = model.coins();

		if (coins.length < 1) {
			return undefined;
		} else {
			return coins[0];
		}
	});

	model.coin.subscribe(function(coin) {
		coin.model.subscribe(function(url) {
			console.log('model', url);

			var viewer = new JSC3D.Viewer(document.getElementById('modelPreview'));

			viewer.setParameter('SceneUrl',         model.coin().model());
			viewer.setParameter('ModelColor',       '#CAA618');
			viewer.setParameter('BackgroundColor1', '#FFF');
			viewer.setParameter('BackgroundColor2', '#383840');
			viewer.setParameter('RenderMode',       'flat');

			viewer.init();

			$('#loadingModel').hide();
		});
	});

	ko.applyBindings(model, $container.get(0));

	model.goToUpload();
}


function init() {
	initKO();
}

$(init);