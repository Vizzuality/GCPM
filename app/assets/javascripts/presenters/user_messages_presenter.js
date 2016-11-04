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
        this.messageRequest(data.converId);
      }

      this.setState({ conversation: newConversation });
    },

    toggleConversation: function() {
      var $currentConversation = $(this.state.get('conversation'));
      var $conversations = $('.c-conversation');

      $conversations.toggleClass('-active', false);
      if ($currentConversation) {
        $currentConversation.toggleClass('-active', true);
      }
    },

    messageRequest: function(converId) {
      $.ajax({
        url: '/network/'+ gon.userId + '/messages/' + converId,
        type: 'GET',
        dataType: 'json',
        error: this.messageError.bind(this)
      });
    },

    messageError: function() {
      console.error('Error doing query');
    }

  });

})(this.App);
