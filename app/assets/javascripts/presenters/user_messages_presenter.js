(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UserMessages = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UserMessages.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      this.userMessages = new App.View.UserMessages({
        el: '.c-conversation'
      });

      this.setEvents();
      this.setSubscriptions();
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

      App.on('Remote:load', function(params){
        if (params.data === 'messages') {
          this.userMessages.setElement('.c-conversation');
        }
      }.bind(this));
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
        $('.c-conversation .conversation-body').hide();
        $(conversation).find('.conversation-body').show();
      } else {
        $('.c-conversation .conversation-body').hide();
      }
    }

  });

})(this.App);
