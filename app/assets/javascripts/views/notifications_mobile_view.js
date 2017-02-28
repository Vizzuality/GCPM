(function(App) {

  'use strict';

  App.View.NotificationsMobile = Backbone.View.extend({

    events: {
      'click .js-action-delete': 'refresh'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$badge = $('.c-badge.-notification');
    },

    refresh: function() {
      this.$el.html('<ul class="list menu-content notifications"><li class="-empty"><span>No notifications</span></li></ul>');
      this.$badge.hide();
    }

  });

})(this.App);
