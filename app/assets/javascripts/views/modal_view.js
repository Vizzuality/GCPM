(function(App) {

  'use strict';

  App.View.Modal = Backbone.View.extend({

    events: {
      'click .js-modal-backdrop': 'close',
      'click .js-btn-modal-close': 'close'
    },

    template: HandlebarsTemplates['modal'],

    initialize: function(settings) {
      this.$body = $('body');
      this.options = _.extend({}, settings);
      this.$el.addClass('c-modal');
    },

    render: function() {
      this.$el.html(this.template());
      this.$content = this.$el.find('.modal-content');
      this.delegateEvents();
    },

    open: function(content) {
      if (!content) {
        return;
      }
      this.render();
      this.$el.appendTo('body');
      if (typeof content === 'string') {
        this.$content.html(content);
      } else {
        this.$content.html(content.render().$el);
      }
      this.$el.addClass('-active');
      this.$body.addClass('-modal-open');
    },

    close: function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.$el.removeClass('-active');
      this.$body.removeClass('-modal-open');
      setTimeout(function() {
        this.$el.remove();
      }.bind(this), 300);
    },

    toggleLoader: function(loading) {
      this.$el.find('#modal-loader').toggleClass('-start', loading);
    }


  });

})(this.App);
