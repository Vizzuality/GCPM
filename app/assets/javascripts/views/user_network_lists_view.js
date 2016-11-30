(function(App) {

  'use strict';

  App.View.UserNetworkLists = Backbone.View.extend({

    events: {
      'click .js-toggle-list': 'handleClick'
    },

    initialize: function() {
    },

    handleClick: function(e) {
      this.list = $(e.target).closest('.c-network-list')
      var name = this.list.data().name;

      this.trigger('click', name);
    },

    toggleList: function(name) {
      if (name) {
        this.$el.toggleClass('-open', false);
        this.list.toggleClass('-open', true);

        this.list[0].scrollIntoView();
      } else {
        this.$el.toggleClass('-open', false);
      }
    }

  });

})(this.App);
