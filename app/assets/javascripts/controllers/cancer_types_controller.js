(function(App) {

  'use strict';

  App.Controller.CancerTypes = function() {};

  _.extend(App.Controller.CancerTypes.prototype, {

    index: function(params) {
      new App.Presenter.CancerTypesList(params);
    },

    show: function(params) {
      var newParams = _.extend({}, { data: 'projects' }, params);

      new App.Presenter.MapVis(newParams);
      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.ShowMore(newParams);
    }

  });

})(this.App);
