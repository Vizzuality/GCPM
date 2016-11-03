(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UserMessages = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UserMessages.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.userMessages = new App.View.UserMessages({
        el: '.c-conversation'
      });

      this.cache();
      this.setEvents();
      this.setSubscriptions();
    },

    cache: function() {
      this.conversations = $('.c-conversation .conversation-body');
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    setEvents: function() {
      this.state.on('change', this.toggleConversation.bind(this));
    },

    setSubscriptions: function() {
      this.userMessages.on('click', this.setConversation.bind(this));
    },

    setConversation: function(data) {
      var newConversation = null;

      if (data.conversation !== this.state.get('conversation')) {
        newConversation = data.conversation;
      }

      this.setState({ conversation: newConversation });
    },

    toggleConversation: function() {
      var conversation = this.state.get('conversation');
      if (conversation) {
        this.conversations.hide();
        $(conversation).find('.conversation-body').show();
      } else {
        this.conversations.hide();
      }
    }


  });

})(this.App);
