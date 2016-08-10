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
    var data = null;
    if (!!this.attributes.organization_id) {
      data = {
        "investigator" : {
          "name"    : this.attributes.name,
          "email"   : this.attributes.email,
          "website"   : this.attributes.website,
          "address_ids": [this.attributes.organization_id[0]]
          }
      }
    } else {
      data = {
        "investigator" : {
          "name"    : this.attributes.name,
          "email"   : this.attributes.email,
          "website"   : this.attributes.website,
          "addresses_attributes": [{
              "country_id"            : this.attributes.country_org,
               "city"                 : this.attributes.city_org,
               "latitude"             : this.attributes.latitude_org,
               "longitude"            : this.attributes.longitude_org,
               "line_1"               : this.attributes.line_1_org,
               "line_2"               : this.attributes.line_2_org,
               "line_3"               : this.attributes.line_3_org,
               "postcode"             : this.attributes.postcode_org,
               "primary"              : this.attributes.primary_org,
               "state"                : this.attributes.state_org,
               "state_code"           : this.attributes.statecode_org,
               "geonames_city_id"     : this.attributes.geonames_city_id,
               "organization_attributes": {
                "name"                : this.attributes.name_org,
               "acronym"              : this.attributes.acronym_org,
                  "email_address"     : this.attributes.email_org,
                  "established"       : this.attributes.established_org,
                  "organization_type_id": this.attributes.organization_type_id
                }
          }]
        }
      }
    }
		$.ajax({
			type: "POST",
			url: this.url+'?token='+AUTH_TOKEN,
			data: JSON.stringify(data),
			contentType: "application/json",
			dataType: 'json',
			complete: function(data) {
			   App.Events.trigger('Modal:close', this);
         App.Events.trigger('Editproject:updateLastInvestigators', this);
			}
		});
	}

});

})(this.App);
