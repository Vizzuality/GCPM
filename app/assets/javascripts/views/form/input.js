(function(App) {

  'use strict';

  App.View.Input = Backbone.View.extend({

    defaults: {
      label: null,
      placeholder: null,
      name: null,
      type: 'text',
      required: false,
      class: 'c-input'
    },

    events: {
      'blur input': 'triggerChange'
    },

    template: HandlebarsTemplates['form/input'],

    initialize: function(settings) {
      var opts = (settings && settings.options) || {};
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.options = _.extend({}, this.defaults, opts);

      this.$el.addClass(this.options.class);
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.options));
    },

    triggerChange: function(e) {
      this.trigger('change', {
        name: e.currentTarget.name,
        value: e.currentTarget.value
      });
    }

  });

})(this.App);
