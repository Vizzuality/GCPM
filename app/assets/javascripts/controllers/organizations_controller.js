(function(App) {

  'use strict';

  App.Controller.Organizations = function() {};

  _.extend(App.Controller.Organizations.prototype, {

    index: function(params) {
    },

    show: function(params) {
      new App.Presenter.TabNav(params);
      new App.Presenter.ShowMore(params);

      if (gon.isMobile) {
        new App.Presenter.UserActionsMobile(params);
      } else {
        new App.Presenter.MapVis(params);
      }
    }

  });

})(this.App);
