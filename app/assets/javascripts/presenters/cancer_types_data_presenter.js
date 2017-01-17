(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var CancerModel = Backbone.Model.extend({
    setUrl: function(slug, sql) {
      var cancer_type = slug.replace(/-/g, '_');

      _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
      };

      var urlTemplate = _.template(sql);
      var sql_parsed = urlTemplate({CANCER_TYPE: cancer_type });

      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql_parsed + '&api_key=' + gon.carto_key;
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
      this.widgets = new App.Collection.Widgets({
        innerPage: 'cancer_types'
      });

      this.modal = new App.View.Modal();

      this.setEvents();
      this.setSubscriptions();
      this.cache();
      this.setState(params);
      this.renderSubviews();
    },

    cache: function() {
      this.$cancerRanking = $('#cancerRanking');
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
        this.widgets.fetch({add: true}).done(function() {
          this.modelsRanking = [];
          this.typesRanking = [];
          this.rankingWidgets = [];
          this.graphWidgets = [];
          this.cancerWidgets = this.widgets.toJSON();

          this.filterWidgets(this.cancerWidgets);
          if (this.graphWidgets.length > 0) {
            new App.Presenter.Widgets({
              data: 'data',
              innerPage: 'cancer_types'
            });
            $('#graphicWidgets').toggleClass('-hidden', false);
          }

          this.setModelsArray(this.rankingWidgets);
          this.fetchModels(this.modelsRanking);

          this.setModelsEvents(this.typesRanking);

        }.bind(this));
      }
    },

    setModelsArray: function(rankingWidgets) {
      _.each(rankingWidgets, function(widget) {
        this.cancerModel = new CancerModel();
        this.renderRankingContainer(widget.slug);

        this.typeRanking = new App.View.Ranking({
          el: '#' + widget.slug
        });
        this.typesRanking.push(this.typeRanking);

        this.cancerModel.info = widget.source;
        this.cancerModel.setUrl(this.state.attributes.cancer_type, widget.query);
        this.cancerModel.options = {
          slug: widget.slug,
          type: this.typeRanking,
          name: widget.name
        };
        this.modelsRanking.push(this.cancerModel);

      }.bind(this));
    },

    filterWidgets: function(cancerWidgets) {
      _.each(cancerWidgets, function(widget) {
        widget.graphic_type === 'ranking' ?
          this.rankingWidgets.push(widget) :
          this.graphWidgets.push(widget);
      }.bind(this));
    },

    fetchModels: function(modelsRanking) {
      _.each(modelsRanking, function(model) {
        model.fetch()
          .done(function(){
            this.renderRanking(model.options.type, model, '#' + model.options.slug,
              model.options.name, model.attributes);
          }.bind(this))
          .fail(function(){
            this.renderRanking(model.options.type, model, '#' + model.options.slug,
              model.options.name, null);
          }.bind(this));
      }.bind(this));
    },

    setModelsEvents: function(typesRanking) {
      _.each(typesRanking, function(type) {
        type.on('info', function(info){ this.modal.open(info); }, this);
      }.bind(this));
    },

    renderRankingContainer: function(slug) {
      var template = HandlebarsTemplates['cancer_ranking'];
      this.$cancerRanking.append(template({ id: slug }));
    },

    renderRanking: function(ranking, model, element, name, data) {
      ranking.setElement(element);
      ranking.cache();
      ranking.setData(model, data, name);
      ranking.render();
    }

  });

})(this.App);
