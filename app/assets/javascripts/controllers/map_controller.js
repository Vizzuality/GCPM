(function(App) {

  'use strict';

  App.Controller.Map = function() {};

  _.extend(App.Controller.Map.prototype, {

    index: function(params) {
      new App.Presenter.Map(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.Toolbar(params);
      new App.Presenter.FilterForm(params);
      new App.Presenter.Breadcrumbs(params);
      // new App.Presenter.UserNav(params);
      new App.Presenter.ShowMore(params);
      // new App.Presenter.Legends(params);
      new App.Presenter.Remote();
    }

  });

})(this.App);
