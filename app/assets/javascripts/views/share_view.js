(function(App) {

  'use strict';

  App.View.Share = Backbone.View.extend({

    template: HandlebarsTemplates['share'],

    events: {
      'focus .js-input-share': 'triggerSelect',
      'click .js-btn-share': 'triggerCopy'
    },

    initialize: function() {
    },

    cache: function() {
      this.$inputShare = this.$el.find('.js-input-share');
      this.$btnShare = this.$el.find('.js-btn-share');
    },

    render: function() {
      this.$el.html(this.template({
        url: window.location.href
      }));

      // Rebinding elements and events
      this.delegateEvents();

      this.cache();

      return this;
    },

    triggerSelect: function() {
      this.$inputShare.select();
    },

    triggerCopy: function() {
      this.$inputShare.select();

      try {
        document.execCommand('copy');
        this.$btnShare
          .html('copied');

      } catch(err) {
        console.error(err);
      }
    }

  });

})(this.App);
