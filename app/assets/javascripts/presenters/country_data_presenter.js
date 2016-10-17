(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var CountryModel = Backbone.Model.extend({
    setUrl: function(iso) {
      var sql = "SELECT * from canceratlas_downloadabledata where iso3='" + iso + "'";
      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql + '&api_key=' + gon.carto_key;
    },

    parse: function(response) {
      return response.rows[0];
    }
  });

  App.Presenter.CountryData = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CountryData.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.country = new CountryModel();

      this.countryData = new App.View.CountryData({
        el: '#countryData'
      })

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setEvents: function() {
      this.state.on('change', this.changeData, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
    },

    setState: function(newState) {
      this.state
        .set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    changeData: function() {
      if (this.state.get('data') === 'data') {
        this.country.setUrl(this.state.attributes.vars[0]);
        this.country.fetch().done(function(){
          this.updateData();
        }.bind(this));
      }
    },

    updateData: function() {
      var country = this.country.toJSON();
      this.countryData.setElement('#countryData');
      this.countryData.setOptions(country);
      this.countryData.render();
    }

  });

})(this.App);
