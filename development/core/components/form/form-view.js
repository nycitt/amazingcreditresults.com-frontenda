// form-view.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"backbone",
	"backboneForms",
	"core/components/form/custom-templates"
], function(
	Base, 
	Backbone,
	BackboneForms,
	customTemplates
) {
	return Base.extend({
		// if we need to insert inside view define the target here
		formArea: undefined,
		
		// form class needs to be added
		formClass: undefined,
		
		// hooks
		extraHooks : {
			'objectModifications' : ['objectModification'],
			'after:compileJSON': ['addRequiredAttribute']
		},
		
		// before render
		objectModification: function() {
			// add schema objects
			if(this.addSchema) {
				_.each(this.addSchema, function(attr, name) {
					this.schema[name] = attr;
				}.bind(this));
			}
		},
		
		formReset: function() {
			this.$el.find("form")[0].reset();
		},
		
		addValidationToSchema: function(field) {
			//if(_.isArray(field)) {
            // var ob = this.schema;
				// _.each(field, function(name, num) {
					// if(num == 0) 
						// ob = ob[name];
					// else 
						// ob = ob.subSchema[name];	
				// }.bind(this));
			try {
				this.schema[(_.isArray(field))?field[0]:field].required = true;
			} catch(e) {}
				//ob.required = true;
			//} else {
			//	this.schema[field].required = true;
			//}
		},
		
		afterRender: function() {
			if(this.model && this.model.validate) {
				var validFields = this.model.validate();
				 _.each(validFields, function(msg, field) {
					if(field.indexOf(".") != -1) {
							var s = field.split(".");
							this.addValidationToSchema(s);
						} else {
							this.addValidationToSchema(field);
						}
				 }.bind(this));
			}
			
			var user = Backbone.Model.extend({
				schema: this.schema
			});
			
			this.form = new Backbone.Form({
			    model: new user((this.model)?this.model.toJSON():{}),
			    'submitButton': this.submitButtonText
			});
			 
			this.form.on('submit', function(form, titleEditor, extra) {
			  form.preventDefault();
			  if(!this.validateForms())
			  	this.handleFormSubmit(this.getFormValue());
			}.bind(this));
			this.form.render();
			
			if(this.formClass) {
				this.form.$el.addClass(this.formClass);
			}
			
			if(this.formArea)
				this.$el.find(this.formArea).html(this.form.el);
			else
				this.$el.html(this.form.el);				
		},
		
		// reset form values
		
		// validate forms return false if it has errors
		validateForms: function() {
			var errors = this.form.commit();
			return !!errors;
		},
		
		// return form all values
		getFormValue: function() {
			return this.form.getValue();
		}
		
	});
});
