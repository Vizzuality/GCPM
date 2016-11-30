(function(App) {

  'use strict';

  App.View.UserNetworkLists = Backbone.View.extend({

    events: {
      'click .js-toggle-list': 'handleClick'
    },

    initialize: function() {
    },

    handleClick: function(e) {
      var name = $(e.target).closest('.c-network-list').data().name;
      this.trigger('click', name);
    },

    toggleList: function(name) {
      if (name) {
        var element = this.$el.filter('[data-name="' + name + '"]');

        this.$el.toggleClass('-open', false);
        element.toggleClass('-open', true);
      } else {
        this.$el.toggleClass('-open', false);
      }
    }


  });

})(this.App);
