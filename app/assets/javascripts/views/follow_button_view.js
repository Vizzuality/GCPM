(function(App) {

  'use strict';

  App.View.FollowButton = Backbone.View.extend({

    events: {
      'click .js-btn-follow' : 'onClickToggleFollow'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$btnFollow = this.$el.find('.js-btn-follow');
    },

    setFollowed: function(follow) {
      this.$btnFollow
        .text((follow.followed) ? 'Unfollow' : 'Follow')
        .data('followed', follow.followed);
    },

    onClickToggleFollow: function(e) {
      e && e.preventDefault();
      var data = {
        follow_id: $(e.currentTarget).data('id'),
        follow_resource: $(e.currentTarget).data('resource'),
        followed: $(e.currentTarget).data('followed')
      };
      this.trigger('toggle', data)
    }

  });

})(this.App);
