(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.TabNav = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.TabNav.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.tabnav = new App.View.TabNav({ el: '#dataTabNav' });

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setEvents: function() {
      this.state.on('change', this.activeItem, this);
      this.tabnav.on('change', function(value) {
        this.setState({ data: value });
        App.trigger('TabNav:change', this.getState());
      }, this);
    },

    setSubscriptions: function() {
      App.on('Router:change', this.setState, this);
    },

    setState: function(state) {
      this.state.set(_.pick(state, 'data'));
    },

    getState: function() {
      return this.state.attributes;
    },

    activeItem: function() {
      this.tabnav.setActive(this.getState());
    }

  });


})(this.App);
