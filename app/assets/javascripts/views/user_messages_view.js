(function(App) {

  'use strict';

  App.View.UserMessages = Backbone.View.extend({

    events: {
      'click .js-subject-action': 'toggleConversation'
    },

    initialize: function() {
    },

    toggleConversation: function(e) {
      var btnRemove = $(e.currentTarget).find('.js-btn-remove')[0];
      if (!btnRemove.contains(e.target)) {
        var conversation = $(e.target).closest('.c-conversation');
        this.trigger('click', { conversation: conversation[0] });
      }
    },

    removeUnreadClass: function(conversation) {
      conversation.removeClass('-unread');
    }

  });

})(this.App);
