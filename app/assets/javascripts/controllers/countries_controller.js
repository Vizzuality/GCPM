(function(App) {

  'use strict';

  App.Controller.Countries = function() {};

  _.extend(App.Controller.Countries.prototype, {

    index: function(params) {
      new App.Presenter.CountriesList(params);
    },

    show: function(params) {
      var newParams = _.extend({}, { data: 'data' }, params);
      new App.Presenter.MapVis(newParams);
      new App.Presenter.TabNav(newParams);
      new App.Presenter.CountryData(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.ShowMore(newParams);
    }

  });

})(this.App);
