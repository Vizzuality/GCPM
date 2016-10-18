(function(App) {

  'use strict';

  App.View.Input = Backbone.View.extend({

    defaults: {
      label: null,
      placeholder: null,
      name: null,
      type: 'text',
      required: false,
      info: false,
      class: 'c-input',
      min: false,
      max: false
    },

    events: {
      'blur input': 'triggerChange',
      'focus input': 'triggerFocus'
    },

    template: HandlebarsTemplates['form/input'],

    initialize: function(settings) {
      var opts = (settings && settings.options) || {};
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.options = _.extend({}, this.defaults, opts);

      this.$el.addClass(this.options.class);
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.options));
    },

    triggerChange: function(e) {
      if (!e.currentTarget.value) return;
      this.trigger('change', {
        name: e.currentTarget.name,
        value: e.currentTarget.value
      });
    },

    triggerFocus: function(e){
      e.currentTarget.placeholder = '';
    }

  });

})(this.App);
