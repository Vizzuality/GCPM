(function(App) {

  'use strict';

  App.Controller.Countries = function() {};

  _.extend(App.Controller.Countries.prototype, {

    index: function(params) {
      new App.Presenter.CountriesList(params);
    },

    show: function(params) {
      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(params);
      new App.Presenter.CountryData(params);
      new App.Presenter.ShowMore(params);
    }

  });

})(this.App);
