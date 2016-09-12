(function(App) {

  'use strict';

  App.Controller.Project = function() {};

  _.extend(App.Controller.Project.prototype, {

    new: function() {
      new App.Presenter.ProjectForm();
    }

  });

})(this.App);



