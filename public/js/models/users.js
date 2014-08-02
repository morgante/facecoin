define([
	'jquery',
	'underscore',
    'backbone'
], function ($, _, Backbone) {
	
	// User Model
	// ---------------
	var User = Backbone.Model.extend({
	
		url: '/api/models/user.json',
	
		defaults: function() {
			return {
			};
		}
	
	});
	
	// Users Collection
	// ---------------
	var Users = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: User,
	
		url: '/api/models/users.json',
	
	});

	// Note that we export the entire collection
    return new Users;
});