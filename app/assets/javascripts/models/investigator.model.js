(function(App) {

  'use strict';

  App.Model = App.Model || {};

  App.Model.Investigator = Backbone.Model.extend({

    url: '/api/investigators',

    parse: function(data) {
      return data;
    },

    save: function (key, val, options) {
     this.beforeSave(key, val, options);
     return this;
     return Backbone.Model.prototype.save.call(this, key, val, options);
   },

	beforeSave: function (key, val, options) {
		$.ajax({
			type: "POST",
			url: this.url+'?token='+AUTH_TOKEN,
			data: JSON.stringify({
			  "investigator" : {
					"name" 		: this.attributes.name,
					"email" 	: this.attributes.email,
					"website" 	: this.attributes.website
				}
			}),
			contentType: "application/json",
			dataType: 'json',
			complete: function(data) {
			   console.log(data);
			}
		});
	}

});

})(this.App);
