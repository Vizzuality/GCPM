(function(App) {

  'use strict';

  App.View.DatesTimeline = Backbone.View.extend({

    initialize: function() {
      this.setTimelineLineWidth();
    },

    setTimelineLineWidth: function() {
      var $timeline = this.$el.find('.timeline-line');
      if($timeline && !!$timeline.length) {
        var width = this.getTimelineWith();
        $timeline.width(width + '%');
      }
    },

    getTimelineWith: function() {
      var current = new Date().getTime();
      var start = new Date(gon.start_date).getTime();
      var end = new Date(gon.end_date).getTime();

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
