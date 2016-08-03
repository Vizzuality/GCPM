(function(App) {

  'use strict';

  var MainView = new App.MainView();

  function initApp() {
    if (Backbone.History.started) {
      MainView.stop();
    }
    MainView.start();
  }

  if (Turbolinks && Turbolinks.supported) {
    document.addEventListener('turbolinks:load', initApp);
  } else {
    document.addEventListener('DOMContentLoaded', initApp);
  }

})(this.App);
