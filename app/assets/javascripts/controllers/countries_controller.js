(function(App) {

  'use strict';

  App.Controller.Countries = function() {};

  _.extend(App.Controller.Countries.prototype, {

    index: function(params) {
      new App.Presenter.CountriesList(params);
    },

    show: function(params) {
      var newParams = _.extend({}, {
        data: 'data',
        iso: params.vars[0]
      }, params);

      new App.Presenter.TabNav(newParams);
      new App.Presenter.CountryData(newParams);
      new App.Presenter.Widgets(newParams);
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
