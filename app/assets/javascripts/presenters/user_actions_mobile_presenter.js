(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UserActionsMobile = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UserActionsMobile.prototype, {

    initialize: function() {
      this.state = new StateModel({ active: false });

      this.userActionsMobile = new App.View.UserActionsMobile({
        el: '#userActionsMobile'
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      this.state.on('change', this.toggleActions, this);
      this.userActionsMobile.on('click', this.setActionsMenu, this);
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true})
        .set(newState);
    },

    setActionsMenu: function() {
      this.setState({ active: !this.state.get('active') });
    },

    toggleActions: function() {
      this.userActionsMobile.toggleActionsMenu(this.state.get('active'));
    }

  });

})(this.App);
