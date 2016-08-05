
(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.EventDetail = Backbone.View.extend({

    el: '#content',

    initialize: function() {
      this.setTImelineBar();
    },

    setTImelineBar: function() {
      var current = new Date().getTime();
      var percentage = 0;

      if (EVENT_START_DATE !== '0' && EVENT_END_DATE !== '0') {
        var start = new Date(EVENT_START_DATE).getTime();
        var end = new Date(EVENT_END_DATE).getTime();

        var percentage = ((current - start) * 100 ) / ( end - start );

      } else {
        /* In case one of the dates is not delivered */
        percentage = 50;
      }

      $('.bar .filled').width(percentage + '%');
    }

  });

})(this.App);
