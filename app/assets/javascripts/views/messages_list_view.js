(function(App) {

  'use strict';

  App.View.MessagesList = Backbone.View.extend({

    template: HandlebarsTemplates['messages_list'],

    initialize: function(settings) {
      this.el = settings && settings.el;
      this.messages = [];
      this.render();
    },

    render: function() {
      this.$el.html(this.template({ messages: this.messages }));
      return this;
    },

    updateData: function(messages) {
      if (messages && messages instanceof Array && messages.length > 0) {
        this.messages = messages;
      } else {
        this.messages = [];
      }

      this.render();
    }

  });

})(this.App);
