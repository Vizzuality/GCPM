(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var IncidenceModel = Backbone.Model.extend({

    info: '<div> <h2>Incidence</h2> <p> GLOBOCAN 2012, IARC -11.8.2014: <a href="http://globocan.iarc.fr/Pages/glossary.aspx">http://globocan.iarc.fr/Pages/glossary.aspx</a> </p> <p>Incidence is the number of new cases arising in a given period in a specified population. This information is collected routinely by cancer registries. It can be expressed as an absolute number of cases per year or as a rate per 100,000 persons per year.<sup>*</sup> The rate provides an approximation of the average risk of developing a cancer. </p> <p> <sup>*</sup> Only age-standardized rates per 100,000 persons per year are shown here </p> </div>',

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

    info: '<div> <h2>Mortality</h2> <p> GLOBOCAN 2012, IARC -11.8.2014: <a href="http://globocan.iarc.fr/Pages/glossary.aspx">http://globocan.iarc.fr/Pages/glossary.aspx</a> </p> <p>Mortality is the number of deaths occurring in a given period in a specified population. It can be expressed as an absolute number of deaths per year or as a rate per 100,000 persons per year.<sup>*</sup> </p> <p> <sup>*</sup> Only age-standardized rates per 100,000 persons per year are shown here </p> </div>',

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

    info: '<div> <h2>Survivors</h2> <p>Values of Cancer Survivors are taken with age-standardized estimates, adults (aged 15-99 years) diagnosed 2005-2009. For Breast Cancer are just for Females.</p> </div>',

    setUrl: function(id) {
      var cancer_type = id.replace(/-/g, '_');
      // round( CAST(c as numeric), 2 )
      var sql = "SELECT round( CAST("+ cancer_type +"_surv as numeric), 2 ) as value, iso3, country FROM ranking_cancer_avg WHERE "+ cancer_type +"_surv IS NOT NULL ORDER BY "+ cancer_type +"_surv DESC LIMIT 10";

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

      this.modal = new App.View.Modal();

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

      this.incidenceRanking.on('info', function(info){ this.modal.open(info); }, this);
      this.mortalityRanking.on('info', function(info){ this.modal.open(info); }, this);
      this.survivorsRanking.on('info', function(info){ this.modal.open(info); }, this);

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
            this.renderRanking(this.incidenceRanking, this.incidence, '#incidenceRanking', 'Top 10 indidence', incidence);
          }.bind(this))

          .fail(function(){
            this.renderRanking(this.incidenceRanking, this.incidence, '#incidenceRanking', 'Top 10 indidence', null);
          }.bind(this))

        // Mortality
        this.mortality.setUrl(this.state.attributes.cancer_type);
        this.mortality.fetch()
          .done(function(){
            var mortality = this.mortality.toJSON();
            this.renderRanking(this.mortalityRanking, this.mortality, '#mortalityRanking', 'Top 10 mortality', mortality);
          }.bind(this))

          .fail(function(){
            this.renderRanking(this.mortalityRanking, this.mortality, '#mortalityRanking', 'Top 10 mortality', null);
          }.bind(this))


        // Survivors
        this.survivors.setUrl(this.state.attributes.cancer_type);
        this.survivors.fetch()
          .done(function(){
            var survivors = this.survivors.toJSON();
            this.renderRanking(this.survivorsRanking, this.survivors, '#survivorsRanking', 'Top 10 survivors', survivors);
          }.bind(this))

          .fail(function(){
            this.renderRanking(this.survivorsRanking, this.survivors, '#survivorsRanking', 'Top 10 survivors', null);
          }.bind(this))

      }
    },

    renderRanking: function(ranking, model, element, name, data) {
      ranking.setElement(element);
      ranking.cache();
      ranking.setData(model, data, name);
      ranking.render();
    }

  });

})(this.App);
