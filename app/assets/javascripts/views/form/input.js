(function(App) {

  'use strict';

  App.View.Input = Backbone.View.extend({

    defaults: {
    },

    template: HandlebarsTemplates['input'],

    initialize: function(settings) {
      this.el = settings.el;
      this.options = _.extend({}, this.defaults, settings.options || {});
      this.render();
      this.setEvents();
    },

    render: function() {
      this.$el.html(this.template(this.options));
    },

    setEvents: function() {
      this.$el.find('input').on('blur', this.triggerChange.bind(this));
    },

    triggerChange: function(e) {
      App.trigger('Input:change', this);
    }

  });

})(this.App);
