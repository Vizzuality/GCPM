(function(App) {

  'use strict';

  App.Controller.CancerTypes = function() {};

  _.extend(App.Controller.CancerTypes.prototype, {

    index: function(params) {
      new App.Presenter.CancerTypesList(params);
    },

    show: function(params) {
      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.ShowMore(params);
    }

  });

})(this.App);
