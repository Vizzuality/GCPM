(function(App) {

  'use strict';

  App.View.ShowMoreButton = Backbone.View.extend({

    updateUrl: function(url) {
      if (url && typeof url === 'string') {
        this.$el.attr('href', url);
      }
    }

  });

})(this.App);
