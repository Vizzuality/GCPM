(function(App) {

  'use strict';

  App.View.Timeline = Backbone.View.extend({

    template: HandlebarsTemplates['timeline'],

    events: {
      'click .js-btn-timeline-year' : 'onClickTimelineYear'
    },

    render: function(years) {
      this.$el.html(this.template({
        years: years
      }));
      this.cache();
    },

    cache: function() {
      this.$btnTimelineYear = this.$el.find('.js-btn-timeline-year');
    },

    toggle: function(active) {
      this.$el.toggleClass('-active', active);
    },

    setActive: function(year) {
      this.$btnTimelineYear.removeClass('-active');
      this.$btnTimelineYear.filter('[data-year="'+ year +'"]').addClass('-active');
    },

    onClickTimelineYear: function(e) {
      var year = $(e.currentTarget).data('year');
      this.trigger('change', year);
    }

  });

})(this.App);
