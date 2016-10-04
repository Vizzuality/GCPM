(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({

    defaults: {
      'sortby': 'title_asc', // title_asc, title_desc, created_as, created_desc
      'data': 'projects',
      'dataSingular': 'project',
      'layer': null
    }

  });

  App.Presenter.Toolbar = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Toolbar.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      this.toolbar = new App.View.Toolbar({ el: '#toolbar' });
      this.sortby = new App.Presenter.SortBy({ el: '#sortby' });

      this.setEvents();
      this.setSubscriptions();
      this.setState(params);
      this.sortby.setState({ value: this.state.defaults.sortby })
      this.renderToolbar();
    },

    setEvents: function() {
      this.state.on('change', this.renderToolbar, this);
      this.toolbar.on('action', function(actionName) {
        App.trigger('Toolbar:action', actionName);
      }, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
      App.on('SortBy:change', this.setState, this);
    },

    setState: function(state) {
      if (state.data) {
        state.dataSingular = state.data.slice(0, state.data.length - 1);
      }
      this.state.set(state);
    },

    renderToolbar: function() {
      var data = this.state.attributes;
      if (window.USER_ID) {
        data.userId = window.USER_ID;
      }
      this.toolbar.render(data);
      this.sortby.setOptions();
      this.sortby.setElement('#sortby');
      this.sortby.render();

      App.trigger('Toolbar:change', this.state.attributes);
    }

  });

})(this.App);
