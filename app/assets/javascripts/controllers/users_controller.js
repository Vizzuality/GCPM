(function(App) {

  'use strict';

  App.Controller.Users = function() {};

  _.extend(App.Controller.Users.prototype, {

    show: function(params) {
      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.ShowMore(params);
    }

  });

})(this.App);
