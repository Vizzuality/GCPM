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
      this.modal = new App.View.Modal({
        className: '-tiny'
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
      App.on('Messages:created', function(){
        this.state.set('user', null);
        this.openNotice('<h2>Message sent!</h2><p>Check your messages tab to see your conversations</p>');
      }, this)
    },

    changeUser: function() {
      this.investigatorActions.toggleForm(this.state.get('user'));
    },

    rebindElement: function() {
      this.investigatorActions.setElement('#investigatorsActionsView');
      this.investigatorActions.cache();
    },

    openNotice: function(text) {
      this.modal.open(text);
    }


  });

})(this.App);
