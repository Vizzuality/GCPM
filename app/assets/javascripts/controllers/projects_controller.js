(function(App) {

  'use strict';

  App.Controller.Project = function() {};

  _.extend(App.Controller.Project.prototype, {

    new: function() {
      new App.Presenter.ProjectForm();
    },

    show: function(params) {
      var newParams = Object.assign({}, params, {dataType: 'info'});

      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(newParams);
      new App.View.DatesTimeline();
    }

  });

})(this.App);
