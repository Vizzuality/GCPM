(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.FollowButton = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FollowButton.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.follow = new App.Model.Follow();

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
        this.follow.setUrl(data);
        this.follow.save();
      }, this);

      this.follow.on('change', function(){
        console.log(this.follow.toJSON());
      }, this)

      this.state.on('change', function() {

      }, this);
    },

    setSubscriptions: function() {
    }

  });

})(this.App);
