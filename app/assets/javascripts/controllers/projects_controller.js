(function(App) {

  'use strict';

  App.Controller.Project = function() {};

  _.extend(App.Controller.Project.prototype, {

    new: function() {
      new App.Presenter.CreateProjectForm();
    },

    edit: function(params){
      new App.Presenter.EditProjectForm(params);
    },

    show: function(params) {
      var newParams = _.extend({}, params, {dataType: 'info'});

      new App.Presenter.TabNav(newParams);
      new App.Presenter.FollowButton(newParams);
      new App.Presenter.DatesTimeline(newParams);
      new App.Presenter.Notice();

      if (!gon.isMobile) {
        new App.Presenter.MapVis(newParams);
      } else {
        new App.Presenter.UserActionsMobile(newParams);
      }
    }

  });

})(this.App);
