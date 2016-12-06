(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var IncidenceModel = Backbone.Model.extend({
    setUrl: function(id) {
      var cancer_type = id.replace(/-/g, '_');
      var sql = "SELECT "+ cancer_type +"_incidence as value, iso3, country FROM ranking_cancer_avg WHERE "+ cancer_type +"_incidence IS NOT NULL ORDER BY "+ cancer_type +"_incidence DESC LIMIT 10";
      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql + '&api_key=' + gon.carto_key;
    },

    parse: function(response) {
      var data = response.rows || {};
      return data;
    }
  });

  var MortalityModel = Backbone.Model.extend({
    setUrl: function(id) {
      var cancer_type = id.replace(/-/g, '_');
      var sql = "SELECT "+ cancer_type +"_mortality as value, iso3, country FROM ranking_cancer_avg WHERE "+ cancer_type +"_mortality IS NOT NULL ORDER BY "+ cancer_type +"_mortality DESC LIMIT 10";

      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql + '&api_key=' + gon.carto_key;
    },

    parse: function(response) {
      var data = response.rows || {};
      return data;
    }
  });

  var SurvivorsModel = Backbone.Model.extend({
    setUrl: function(id) {
      var cancer_type = id.replace(/-/g, '_');
      var sql = "SELECT "+ cancer_type +"_surv as value, iso3, country FROM ranking_cancer_avg WHERE "+ cancer_type +"_surv IS NOT NULL ORDER BY "+ cancer_type +"_surv DESC LIMIT 10";

      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql + '&api_key=' + gon.carto_key;
    },

    parse: function(response) {
      var data = response.rows || {};
      return data;
    }
  });

  App.Presenter.CancerTypesData = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CancerTypesData.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.incidence = new IncidenceModel();
      this.mortality = new MortalityModel();
      this.survivors = new SurvivorsModel();


      this.incidenceRanking = new App.View.Ranking({
        el: '#incidenceRanking'
      })
      this.mortalityRanking = new App.View.Ranking({
        el: '#mortalityRanking'
      })
      this.survivorsRanking = new App.View.Ranking({
        el: '#survivorsRanking'
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
        // Incidence
        this.incidence.setUrl(this.state.attributes.cancer_type);
        this.incidence.fetch()
          .done(function(){
            var incidence = this.incidence.toJSON();
            this.renderRanking(this.incidenceRanking, '#incidenceRanking', 'Top 10 indidence', incidence);
          }.bind(this))

          .fail(function(){
            this.renderRanking(this.incidenceRanking, '#incidenceRanking', 'Top 10 indidence', null);
          }.bind(this))

        // Mortality
        this.mortality.setUrl(this.state.attributes.cancer_type);
        this.mortality.fetch()
          .done(function(){
            var mortality = this.mortality.toJSON();
            this.renderRanking(this.mortalityRanking, '#mortalityRanking', 'Top 10 mortality', mortality);
          }.bind(this))

          .fail(function(){
            this.renderRanking(this.mortalityRanking, '#mortalityRanking', 'Top 10 mortality', null);
          }.bind(this))


        // Survivors
        this.survivors.setUrl(this.state.attributes.cancer_type);
        this.survivors.fetch()
          .done(function(){
            var survivors = this.survivors.toJSON();
            this.renderRanking(this.survivorsRanking, '#survivorsRanking', 'Top 10 survivors', survivors);
          }.bind(this))

          .fail(function(){
            this.renderRanking(this.survivorsRanking, '#survivorsRanking', 'Top 10 survivors', null);
          }.bind(this))

      }
    },

    renderRanking: function(ranking, element, name, data) {
      ranking.setElement(element);
      ranking.cache();
      ranking.setData(data, name);
      ranking.render();
    }

  });

})(this.App);
