// dashboard.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"baseLayout",
	"hbs!adminProduct/templates/layout",
	"hbs!adminProduct/templates/create",
	"adminProduct/views/list",
	"adminProduct/views/create"
], function(
	BaseLayout,
	templateView,
	editLayout,
	listProducts,
	createProductView
) {
	return BaseLayout.extend({
		pageType: 'admin',
		
		events: {
			'click .add-new-card': 'addNewCard',
			'click .delete-selected': 'deleteSelected'
		},
		
		deleteSelected: function() {
			this.productList.deleteRecords();
		},
		
		addNewCard: function(e) {
			e.preventDefault();
			App.routing.navigate("admin/product/create", {
				trigger : true
			});
		},
		
		initializeBefore: function(options) {
			if(options && options.page == "create") {
				this.template = editLayout;
			} else {
				this.template = templateView;
			}
		},
		
		initializeAfter: function(options) {
			if(options && options.id) {
				this.setViewInLayout('.create', new createProductView(options));
			} else {
				this.productList = new listProducts(options);
				this.setViewInLayout('.list-product', this.productList);							
			}
		}
	});
});
