(function(App) {

  'use strict';

  var app;

  function initApp() {
    app = new App.MainView();
    if (!Backbone.History.started) {
      app.start();
    }
  }

  function updateApp() {
    if (app && app.update) {
      app.update();
    }
  }

  document.addEventListener('DOMContentLoaded', initApp);

  if (Turbolinks && Turbolinks.supported) {
    document.addEventListener('turbolinks:load', updateApp);
  }

})(this.App);
