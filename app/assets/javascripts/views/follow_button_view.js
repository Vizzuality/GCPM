(function(App) {

  'use strict';

  App.View.FollowButton = Backbone.View.extend({

    events: {
      'click .js-btn-follow' : 'onClickToggleFollow'
    },

    initialize: function() {
    },

    onClickToggleFollow: function(e) {
      e && e.preventDefault();
      var data = {
        id: $(e.currentTarget).data('id'),
        resource: $(e.currentTarget).data('resource'),
        followed: $(e.currentTarget).data('followed')
      };
      this.trigger('toggle', data)
    }

  });

})(this.App);
