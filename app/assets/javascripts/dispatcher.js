(function(App) {

  'use strict';

  document.addEventListener('turbolinks:load', function(e) {
    /* Initialize router */
    console.log(e);
    new App.MainView().start();
  });

})(this.App);
