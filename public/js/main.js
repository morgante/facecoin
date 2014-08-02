// global backbone
var app = app || {};

define([
	'jquery',
	'underscore',
    'backbone',
	'app/views/home',
	'app/views/coins',
	'app/views/ship',
	'app/views/success'
], function ($, _, Backbone, HomeView, CoinView, ShipView, SuccessView) {

	var Workspace = Backbone.Router.extend({

		routes: {
			'_=_': 'home', // hack for strange bug
			'*path': "home"
		},
		
		home: function() {
			new HomeView({router: this});
		},

		coins: function() {
			new CoinView({router: this});
		},

		ship: function() {
			new ShipView({router: this});
		},

		success: function() {
			new SuccessView({router: this});
		}

	});
	
	app.router = new Workspace();
		
	Backbone.history.start({pushState: true});
	
});