(function(App) {

  'use strict';

  App.Controller.Events = function() {};

  _.extend(App.Controller.Events.prototype, {

    show: function(params) {
      var newParams = _.extend({}, params, {dataType: 'info'});

      new App.Presenter.MapVis(newParams);
      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.DatesTimeline(newParams);
      new App.Presenter.ShowMore(newParams);
    },

    new: function() {
      new App.Presenter.EventForm();
    },

    edit: function() {
      new App.Presenter.EventForm();
    }

  });

})(this.App);
