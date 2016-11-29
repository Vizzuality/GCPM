(function(App) {

  'use strict';

  App.View.FollowButton = Backbone.View.extend({

    template: HandlebarsTemplates['follow'],

    events: {
      'click .js-btn-follow' : 'onClickToggleFollow'
    },

    initialize: function(params) {
      this.cache();
    },

    cache: function() {
      this.$btnFollow = this.$el.find('.js-btn-follow');
    },

    setFollowed: function(follow, mobile) {
      this.$btnFollow
        .html(this.template({ followed: follow.followed, mobile: gon.isMobile }))
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
