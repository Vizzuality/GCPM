(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var CountryModel = Backbone.Model.extend({
    setUrl: function(iso) {
      var sql = "SELECT * from canceratlas_downloadabledata where iso3='" + iso + "'";
      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql + '&api_key=' + gon.carto_key;
    },

    parse: function(response) {
      var data = response.rows[0];
      // Exceptions:
      // Parse screening programs
      data.screening_programs = !!_.filter(_.pick(data,
        'breast_cancer_screening_programscountries_with_organized_or_uno',
        'cervical_cancer_screening_programscountries_with_organized_or_u',
        'colorectal_cancer_screening_programscountries_with_organized_or'), function(param){
          return param === 'Has screening program'
        }).length;

      return data;
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
      this.renderSubviews();
    },

    setEvents: function() {
      this.state.on('change', this.renderSubviews, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
      App.on('Remote:load', this.renderSubviews, this);
    },

    setState: function(newState) {
      this.state
        .set(newState, { silent: true });
    },

    getState: function() {
      return this.state.attributes;
    },

    renderSubviews: function() {
      if (this.state.get('data') === 'data') {
        this.country.setUrl(this.state.attributes.vars[0]);
        this.country.fetch()
          .done(function(){
            var country = this.country.toJSON();

            this.countryData.setElement('#countryData');
            this.countryData.setOptions(country);
            this.countryData.render();
          }.bind(this));
      }
    }
  });

})(this.App);
