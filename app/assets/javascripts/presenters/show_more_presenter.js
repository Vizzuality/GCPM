(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ShowMore = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ShowMore.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.view = new App.View.ShowMoreButton({ el: '#showMoreButton' });
      this.setEvents();
      this.setSubscriptions();
    },

    setSubscriptions: function() {
      App.on('Router:change Map:change', this.setState, this);
      App.on('Remote:load', this.rebindElement, this);
    },

    setEvents: function() {
      this.state.on('change', this.updateURI, this);
    },

    setState: function(state) {
      if (!state.page) {
        state.page = 1;
      }
      this.state.set(state);
    },

    getState: function() {
      return this.state.attributes;
    },

    updateURI: function() {
      var uri = new URI();
      var params = this.getState();
      var newParams = _.omit(_.extend({}, params, {
        page: parseInt(params.page || 1) + 1
      }), 'vars');
      var newUrl = uri.query(newParams).toString();
      this.view.updateUrl(newUrl);
    },

    rebindElement: function() {
      this.view.setElement('#' + this.view.$el.attr('id'));
    }

  });

})(this.App);
