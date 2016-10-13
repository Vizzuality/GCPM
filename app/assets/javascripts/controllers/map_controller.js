(function(App) {

  'use strict';

  App.Controller.Map = function() {};

  _.extend(App.Controller.Map.prototype, {

    index: function(params) {
      new App.Presenter.Remote();
      new App.Presenter.Map(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.Actionbar(params);
      new App.Presenter.Toolbar(params);
      new App.Presenter.FilterForm(params);
      new App.Presenter.Breadcrumbs(params);
      new App.Presenter.Layers(params);
      new App.Presenter.SortBy(params);
      new App.Presenter.ShowMore(params);
      new App.Presenter.Share(params);
    }

  });

})(this.App);
