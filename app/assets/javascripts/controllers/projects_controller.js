(function(App) {

  'use strict';

  App.Controller.Project = function() {};

  _.extend(App.Controller.Project.prototype, {

    new: function() {
      new App.Presenter.ProjectForm();
    },

    show: function(params) {
      new App.Presenter.MapVis(params);
      new App.View.DatesTimeline();
    }

  });

})(this.App);



