(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.MessagesActions = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.MessagesActions.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.messagesActions = new App.View.MessagesActions({
        el: '.js-messages-actions-view'
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

      this.messagesActions.on('toggle', function(user) {
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
      this.messagesActions.toggleForm(this.state.get('user'));
    },

    rebindElement: function() {
      this.messagesActions.setElement('.js-messages-actions-view');
      this.messagesActions.cache();
    },

    openNotice: function(text) {
      this.modal.open(text);
    }

  });

})(this.App);
