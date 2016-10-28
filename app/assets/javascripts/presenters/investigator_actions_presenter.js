(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorActions = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorActions.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.investigatorActions = new App.View.InvestigatorActions({
        el: '#investigatorsActionsView'
      });

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    setEvents: function() {
      this.state.on('change:user', this.changeUser.bind(this));

      this.investigatorActions.on('toggle', function(user) {
        this.state.set('user', user);
      }.bind(this));
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this)
      App.on('Remote:load', this.rebindElement, this)
    },

    changeUser: function() {
      this.investigatorActions.toggleForm(this.state.get('user'));
    },

    rebindElement: function() {
      this.investigatorActions.setElement('#investigatorsActionsView');
      this.investigatorActions.cache();
    }

  });

})(this.App);
