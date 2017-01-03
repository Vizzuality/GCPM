(function(App) {

  'use strict';

  App.Controller.Specialities = function() {};

  _.extend(App.Controller.Specialities.prototype, {

    show: function(params) {
      var newParams = _.extend({}, {
        speciality: params.vars[0]
      }, params);


      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.ShowMore(newParams);

      if (gon.isMobile) {
        new App.Presenter.UserActionsMobile(newParams);
      } else {
        new App.Presenter.MapVis(newParams);
      }
    }

  });

})(this.App);
