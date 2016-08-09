(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Editproject = App.Controller.Page.extend({

    index: function(params) {
      new App.View.AddNewProject();
    },

  });


})(this.App);
