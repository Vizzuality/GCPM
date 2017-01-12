(function(App) {

  'use strict';

  App.Controller.Events = function() {};

  _.extend(App.Controller.Events.prototype, {

    show: function(params) {
      var newParams = _.extend({}, params, {dataType: 'info'});

      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.DatesTimeline(newParams);
      new App.Presenter.ShowMore(newParams);

      if (!gon.isMobile) {
        new App.Presenter.MapVis(newParams, {
          map: {
            maxZoom: 13
          }
        });
      } else {
        new App.Presenter.UserActionsMobile(newParams);
      }
    },

    new: function() {
      new App.Presenter.EventForm();
    },

    edit: function() {
      new App.Presenter.EventForm();
    }

  });

})(this.App);
