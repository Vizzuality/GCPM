(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CountryData = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CountryData.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.params = params;
      this.getCountryData();
    },

    getCountryData: function() {
      var sql = "SELECT * from radiotherapy_centers_all_countries where iso3='" + this.params.vars[0] + "'";
      $.getJSON('https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' +
        sql + '&api_key=' + gon.carto_key, function(data) {
        $.each(data.rows, function(key, val) {


        });
      });
    }

  });

})(this.App);
