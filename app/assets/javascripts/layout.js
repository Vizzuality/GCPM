(function(App) {

  'use strict';

  /**
   * Layout is the top-level application “view”.
   * It is tied to the "document" DOM element and handles app-wide events,
   * such as clicks on application-internal links.
   * Most importantly, when a new controller is activated, Layout is responsible
   * for changing the main view to the view of the new controller.
   */
  App.Layout = Backbone.View.extend({

    el: 'document'

  });

})(this.App);
