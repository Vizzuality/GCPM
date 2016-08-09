(function(App) {

  'use strict';

  function initApp() {
    var app = new App.MainView();
    if (Backbone.History.started) {
      app.stop();
    }
    app.start();
  }

  document.addEventListener('DOMContentLoaded', initApp);


})(this.App);
