(function(App) {

  'use strict';

  App.View.Timeline = Backbone.View.extend({

    template: HandlebarsTemplates[ gon.isMobile ? 'timeline_mobile' : 'timeline' ],

    events: {
      'click .js-btn-timeline-year' : 'onClickTimelineYear',
      'change .js-select-timeline-year' : 'onChangeTimelineYear'
    },

    render: function(years) {
      this.$el.append(this.template({
        years: years
      }));
      this.cache();
    },

    cache: function() {
      this.$btnTimelineYear = this.$el.find('.js-btn-timeline-year');
      this.$btnSelectTimelineYear = this.$el.find('.js-select-timeline-year');
      this.$year = this.$el.next('.js-viel-year');
    },

    toggle: function(active) {
      gon.isMobile ?
        this.$el.closest('.timeline-btn').toggleClass('-active', active) :
        this.$el.toggleClass('-active', active);
    },

    setActive: function(year) {
      if (gon.isMobile) {
        this.renderVielYear(year);
      } else {
        this.$btnTimelineYear.removeClass('-active');
        this.$btnTimelineYear.filter('[data-year="'+ year +'"]').addClass('-active');
      }
    },

    onClickTimelineYear: function(e) {
      var year = $(e.currentTarget).data('year');
      this.trigger('change', year);
    },

    // Mobile year selection
    onChangeTimelineYear: function(e) {
      var year = e.target.value;
      this.renderVielYear(year);
      this.trigger('change', year);
    },

    renderVielYear: function(year) {
      this.$year.text(year);
    }

  });

})(this.App);
