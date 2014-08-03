var fp = require('./fp');
var BTC = require('bitcoinjs-lib');
var _ = require('lodash');

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
	var $coinView = $('[data-role="coins"]');

	$views.hide();

	var model = {
		'photo': 1,
		'page': 'upload',
		'coins': [],
		'selectedDenom': 0,
		uploadPhoto: function() {
			fp.upload(function(err, image) {
				model.photo(image.url);
			});
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
				"confirmed": false
			});

			function confirm() {
				coin.confirmed(true);
			}

			subscribeToAddress(address, function(data) {
				console.log('got data', data);
			});

			// testing
			setTimeout(confirm, 500);

			return coin;
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

	model.canProceed = ko.computed(function() {
		if (model.page() === 'coins') {
			if (model.coins().length > 0) {
				return _.every(model.coins(), function(coin) {
					console.log(coin.confirmed());
					return coin.confirmed();
				});
			}
		}

		return false;
	});

	model.goToCoins();

	ko.applyBindings(model, $container.get(0));
}


function init() {
	initKO();

	// var viewer = new JSC3D.Viewer(document.getElementById('cv'));

	// viewer.setParameter('SceneUrl',         '/model.stl');
	// viewer.setParameter('ModelColor',       '#CAA618');
	// viewer.setParameter('BackgroundColor1', '#E5D7BA');
	// viewer.setParameter('BackgroundColor2', '#383840');
	// viewer.setParameter('RenderMode',       'flat');

	// viewer.init();
}

$(init);