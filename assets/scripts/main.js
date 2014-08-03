var fp = require('./fp');

function Coin(data) {
	ko.mapping.fromJS(data, {}, this);
}

function initKO() {
	var $container = $('[data-view="checkout"]');
	var $views = $('.screen');
	var $coinView = $('[data-role="coins"]');

	$views.hide();

	var model = {
		'photo': 1,
		'coins': [],
		'selectedDenom': 0,
		uploadPhoto: function() {
			fp.upload(function(err, image) {
				model.photo(image.url);
			});
		},
		goToCoins: function() {
			$views.hide();
			$coinView.show();
		},
		denoms: [100, 500, 600],
		addCoin: function() {
			var coin = model.coins.mappedCreate({
				"amount": model.selectedDenom(),
				"address": "",
				"full": false
			});

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