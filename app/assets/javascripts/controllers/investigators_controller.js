(function(App) {

  'use strict';

  App.Controller.Investigators = function() {};

  _.extend(App.Controller.Investigators.prototype, {

    index: function(params) {
    },

    show: function(params) {
      var newParams = _.extend({}, { data: gon.isMobile ? 'projects' : 'data' }, params);

      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.ShowMore(newParams);
      new App.Presenter.Notice();
      new App.Presenter.MessagesActions(newParams);
      new App.Presenter.UsersSearch(newParams);
      new App.Presenter.InvestigatorData(newParams);

      if (!gon.isMobile) {
        new App.Presenter.MapVis(newParams);
      } else {
        new App.Presenter.UserActionsMobile(newParams);
      }
    }

  });

})(this.App);
