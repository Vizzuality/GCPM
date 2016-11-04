(function(App) {

  'use strict';

  App.View.UserMessages = Backbone.View.extend({

    events: {
      'click .js-subject-action': 'toggleConversation'
    },

    initialize: function() {
    },

    toggleConversation: function(e) {
      var element = $(e.target).closest('.c-conversation')[0];
      this.trigger('click', { conversation: element });
    }

  });

})(this.App);
