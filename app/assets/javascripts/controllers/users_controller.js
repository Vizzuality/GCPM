(function(App) {

  'use strict';

  App.Controller.Users = function() {};

  _.extend(App.Controller.Users.prototype, {

    show: function(params) {
      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.ShowMore(params);
      new App.Presenter.InvestigatorActions(params);
      new App.Presenter.UserMessages(params);
      new App.Presenter.UsersSearch(params);
    }

  });

})(this.App);
