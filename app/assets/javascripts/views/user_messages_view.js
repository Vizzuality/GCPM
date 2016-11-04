(function(App) {

  'use strict';

  App.View.UserMessages = Backbone.View.extend({

    events: {
      'click .js-subject-action': 'toggleConversation'
    },

    initialize: function() {
    },

    toggleConversation: function(e) {
      var conversation = $(e.target).closest('.c-conversation');

      if (conversation.hasClass('-unread')) {
        conversation.removeClass('-unread');
      }

      this.trigger('click', {
        conversation: conversation[0],
        converId: conversation.data().converId
      });
    }

  });

})(this.App);
