(function(App) {

  'use strict';

  App.View.ShareButton = Backbone.View.extend({

    events: {
      'click': 'triggerShareModal',
    },

    initialize: function() {
    },

    triggerShareModal: function() {
      App.trigger('Actionbar:save', this);
    }

  });

})(this.App);
