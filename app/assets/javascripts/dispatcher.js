(function(App) {

  'use strict';

  document.addEventListener('turbolinks:load', function(e) {

    /* Url of the new page */
    var url = e.data.url;

    /* Common views to initialize on every pages */
    new App.View.MobileHeader();

    /* How can we initialize the map only in the map page? */
    new App.View.Map();
  });

})(this.App);
