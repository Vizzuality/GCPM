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

      this.render();
    },

    render: function() {
      this.getCountryData().done(function(data) {
        this.data = data.rows[0];
      });
    },

    getCountryData: function() {
      var sql = "SELECT * from canceratlas_downloadabledata where iso3='" + this.params.vars[0] + "'";
      return $.getJSON('https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' +
        sql + '&api_key=' + gon.carto_key);
    }

  });

})(this.App);
