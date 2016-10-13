(function(App) {

  'use strict';

  App.View.DatesTimeline = Backbone.View.extend({

    el: '.c-dates-timeline',

    initialize: function(settings) {
      this.cache();
      this.$timeline.length > 0 && this.setTimelineLineWidth();
    },

    cache: function() {
      this.$timeline = this.$el.find('.timeline-line');
    },

    setTimelineLineWidth: function() {
      var width = this.getTimelineWith();
      this.$timeline.width(width + '%');
    },

    getTimelineWith: function() {
      var current = new Date().getTime();
      var start = new Date(START_DATE).getTime();
      var end = new Date(END_DATE).getTime();

      var width = ((current - start) * 100) / (end - start);

      if (width < 0) {
        width = 0;
      } else if (width > 100) {
        width = 100;
      }

      return width;
    }

  });

})(this.App);
