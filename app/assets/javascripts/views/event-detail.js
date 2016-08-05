
(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.EventDetail = Backbone.View.extend({

    el: '#content',

    cache: function() {
      this.$startDate = $('.period .start-date');
      this.$endDate = $('.period .end-date');
      this.$bar = $('.c-period-bar .bar');
      this.$filled = $('.bar .filled');
    },

    initialize: function() {
      this.cache();
      this.setTimelineBar();
    },

    setTimelineBar: function() {
      if (EVENT_START_DATE !== '0' && EVENT_END_DATE !== '0') {
        var percentage = App.Helper.Utils.getTimelinePercentage(EVENT_START_DATE, EVENT_END_DATE);
        this.$filled.width(percentage + '%');
      } else {
        this.$bar.addClass('-hidden');

        if (EVENT_START_DATE === '0') {
          this.$startDate.addClass('-hidden');
          this.$endDate.css('text-align', 'left');
        }
        if (EVENT_END_DATE === '0') {
          this.$endDate.addClass('-hidden');
        }
      }
    }

  });

})(this.App);
