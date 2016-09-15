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
      this.state = new StateModel();
      this.toolbar = new App.View.Toolbar({ el: '#toolbar' });

      this.setEvents();
      this.setSubscriptions();
      this.setState(params);
    },

    setEvents: function() {
      this.state.on('change', this.renderToolbar, this);
      this.toolbar.on('action', function(actionName) {
        App.trigger('Toolbar:action', actionName);
      }, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this);
    },

    setState: function(state) {
      if (state.data) {
        state.dataSingular = state.data.slice(0, state.data.length - 1);
      }
      this.state.set(state);
    },

    renderToolbar: function() {
      var data = this.state.attributes;
      if (USER_ID) {
        data.userId = USER_ID;
      }
      this.toolbar.render(data);
      App.trigger('Toolbar:change', this.state.attributes);
    }

  });

})(this.App);
