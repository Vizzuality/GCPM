(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.JoinNetworkMobile = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.JoinNetworkMobile.prototype, {

    initialize: function() {
      this.state = new StateModel({ open: false });

      this.network = new App.View.JoinNetworkMobile({
        el: '#networkMobile'
      });

      this.setEvents();
    },

    setEvents: function() {
      this.network.on('click', this.handleClick, this);
      this.state.on('change', this.toggleNetworkMenu, this);
    },

    setState: function(newState) {
      this.state.set(newState);
    },

    handleClick: function() {
      this.setState({ open: !this.state.get('open') });
    },

    toggleNetworkMenu: function() {
      this.network.toggleNetworkMenu();
    }

  });

})(this.App);
