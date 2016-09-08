(function(App) {

  'use strict';

  App.View.Textarea = Backbone.View.extend({

    defaults: {
    },

    template: HandlebarsTemplates['textarea'],

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
      this.$el.find('textarea').on('blur', this.triggerChange.bind(this));
    },

    triggerChange: function(e) {
      App.trigger('Textarea:change', this);
    }

  });

})(this.App);
