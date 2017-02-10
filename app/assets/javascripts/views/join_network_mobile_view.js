(function(App) {

  'use strict';

  App.View.JoinNetworkMobile = Backbone.View.extend({

    events: {
      'click .js-action-network': 'handleClick',
      'click .js-action-close': 'handleClick'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$htmlBody = $('html, body');
    },

    handleClick: function() {
      this.trigger('click');
    },

    toggleNetworkMenu: function() {
      this.$el.toggleClass('-open');
      this.$htmlBody.toggleClass('-no-overflow');
    }

  });

})(this.App);
