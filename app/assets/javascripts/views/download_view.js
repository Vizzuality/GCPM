/* global ga */
(function(App) {

  'use strict';

  App.View.Download = Backbone.View.extend({

    events: {
      'click a' : 'onClickDownload'
    },

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
    },

    onClickDownload: function() {
      ga('send', 'event', 'Download', 'Projects');
    }

  });

})(this.App);
