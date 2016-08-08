(function(App) {

  'use strict';

  function initApp() {
    // var app = new App.MainView();
    // if (Backbone.History.started) {
    //   app.stop();
    // }
    // app.start();
    App.router = new App.Router();
    Backbone.history.start({ pushState: true });
  }

  document.addEventListener('DOMContentLoaded', initApp);


})(this.App);
