(function(App) {

  'use strict';

  App.View.MessagesList = Backbone.View.extend({

    template: HandlebarsTemplates['messages_list'],

    initialize: function() {
      this.messages = [];
    },

    render: function() {
      this.$el.html(this.template({ messages: this.messages }));

      // Rebinding elements and events
      this.delegateEvents();

      return this;
    },

    updateData: function(messages) {
      if (messages && messages instanceof Array && messages.length > 0) {
        this.messages = messages;
      } else {
        this.messages = [];
      }
    }

  });

})(this.App);
