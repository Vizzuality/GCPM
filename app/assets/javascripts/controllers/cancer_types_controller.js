(function(App) {

  'use strict';

  App.Controller.CancerTypes = function() {};

  _.extend(App.Controller.CancerTypes.prototype, {

    index: function(params) {
      new App.Presenter.CancerTypesList(params);
    },

    show: function(params) {
      var newParams = _.extend({}, {
        data: 'data',
        cancer_type: params.vars[0]
      }, params);


      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.ShowMore(newParams);
      new App.Presenter.CancerTypesData(newParams);

      if (gon.isMobile) {
        new App.Presenter.UserActionsMobile(newParams);
      } else {
        new App.Presenter.MapVis(newParams);
      }
    }

  });

})(this.App);
