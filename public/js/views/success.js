define([
	'jquery',
	'underscore',
    'backbone',
	'text!templates/success.html'
], function ($, _, Backbone, template) {
	// The Home View
	// ---------------

	return Backbone.View.extend({

		el: '#content',
		
		template: _.template( template ),
		
		events: {
		},

		next: function() {
		},

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function (opts) {
			this.router = opts.router;
			this.render();
				
		},

		render: function () {
									
			this.$el.html( this.template({
			}) );
			
			return this;
		}

	});
	
});