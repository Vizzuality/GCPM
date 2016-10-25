(function(App) {

  'use strict';

  App.View.Download = Backbone.View.extend({

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$link = this.$el.find('a');
    },

    toggleBtn: function(toggle) {
      this.$el.toggleClass('-hidden', !toggle);
    },

    updateUrl: function(url) {
      if (url && typeof url === 'string') {
        this.$link.attr('href', url);
      }
    }

  });

})(this.App);
