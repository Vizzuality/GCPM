/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();
  var FollowModel = Backbone.Model.extend();

  App.Presenter.FollowButton = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FollowButton.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.follow = new FollowModel();

      this.followButton = new App.View.FollowButton({
        el: '#followButton'
      });

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    setEvents: function() {
      this.followButton.on('toggle', function(data) {
        this.follow.set(data, { silent: true });
        this.followRequest();
      }, this);

      this.follow.on('change:followed', function() {
        this.followButton.setFollowed(this.follow.toJSON());
      }, this);
    },

    followRequest: function() {
      var type = (this.follow.attributes.followed) ? 'DELETE' : 'POST';
      $.ajax({
        url: '/follows/'+ this.follow.attributes.follow_resource + '/' + this.follow.attributes.follow_id,
        type: type,
        dataType: 'json',
        success: this.followSuccess.bind(this),
        error: this.followError.bind(this)
      })

    },

    followSuccess: function() {
      var followed = this.follow.get('followed');
      this.follow.set('followed', !followed);
      ga('send', 'event', 'Subscribe', 'Follow', 'Follow '+ this.follow.get('follow_resource') + ' ' +  this.follow.get('follow_id'));
      window.location.reload();
    },

    followError: function() {
      console.error('Error doing query');
    },

    setSubscriptions: function() {
    }

  });

})(this.App);
