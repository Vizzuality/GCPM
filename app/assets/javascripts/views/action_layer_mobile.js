(function(App) {

  'use strict';

  App.View.ActionLayerMobile = Backbone.View.extend({

    events: {
      'click': 'handleClick'
    },

    handleClick: function() {
      this.trigger('click');
    }

  });

})(this.App);
