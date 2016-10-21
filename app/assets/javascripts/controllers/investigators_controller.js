(function(App) {

  'use strict';

  App.Controller.Investigators = function() {};

  _.extend(App.Controller.Investigators.prototype, {

    index: function(params) {
    },

    show: function(params) {
      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.FollowButton(params);
      new App.Presenter.ShowMore(params);
    }

  });

})(this.App);
