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
      App.on('Router:change Map:change', this.setState, this);
    },

    setState: function(newState) {
      if (!newState.data) {
        newState.data = 'projects';
      }
      this.state.set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    activeItem: function() {
      this.tabnav.setActive(this.getState());
      this.updateURI();
    },

    updateURI: function() {
      var uri = new URI('');
      var params = this.getState();
      var newUrl = uri.query(_.omit(params, 'dataSingular', 'vars')).toString();
      this.tabnav.updateUrl(newUrl);
    }

  });


})(this.App);
