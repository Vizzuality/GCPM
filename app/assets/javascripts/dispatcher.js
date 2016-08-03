(function(App) {

  'use strict';

  function initApp() {
    var app = new App.MainView();
    if (Backbone.History.started) {
      app.stop();
    }
    app.start();
  }

  if (Turbolinks && Turbolinks.supported) {
    document.addEventListener('turbolinks:load', initApp);
  } else {
    document.addEventListener('DOMContentLoaded', initApp);
  }

})(this.App);
