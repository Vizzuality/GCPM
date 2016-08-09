(function(App) {

  'use strict';

  App.Controller = App.Controller || {};

  App.Controller.Editproject = App.Controller.Page.extend({

    index: function(params) {
      console.log(params);
      new App.View.AddNewProject();
    },

  });


})(this.App);
