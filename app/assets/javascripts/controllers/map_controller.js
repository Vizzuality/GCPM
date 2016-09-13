(function(App) {

  'use strict';

  App.Controller.Map = function() {};

  _.extend(App.Controller.Map.prototype, {

    index: function(params) {
      new App.Presenter.Map(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.Toolbar(params);
      new App.Presenter.FilterForm(params);
    }

  });

})(this.App);
