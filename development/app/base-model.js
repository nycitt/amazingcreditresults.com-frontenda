// base-model.js
// --------------
// Requires define
// Return Backbone Base Model {Object}

define([
	"backbone",
	"core/components/endpoints/endpoints",
	"backboneValidator"
	], function(
	Backbone,
	EndPoint
	) {

	return Backbone.Model.extend({
		// fetch the modelautomatically if set to true
		autoFetch: false,
		
		// has the model been fetched
		fetched: false,
		
		fetchedDfd: false,
		
		initialize: function() {
			if(this.autoFetch) 
				this.fetch();
		},
		
		// get the url
		getUrl: function(name, params) {
			return EndPoint.getUrl(name, params);
		},
		
		fetch: function() {
			this.fetchedDfd = new $.Deferred();
			
			this.listenTo(this, 'sync', function() {
				this.fetched = true;
				this.fetchedDfd.resolve.apply(this, arguments);
			}.bind(this));

			this.listenTo(this, 'error', function() {
				this.fetched = false;
				this.fetchedDfd.reject.apply(this, arguments);
			}.bind(this));
			
			return Backbone.Model.prototype.fetch.apply(this, arguments);
		}
		
		
	});
});
