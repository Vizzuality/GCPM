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
      'blur input': 'triggerChange',
      'keyup input': 'triggerKeyup',
      'click input': 'triggerClick'
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
      if (!e.currentTarget.value) return;
      this.trigger('change', {
        name: e.currentTarget.name,
        value: e.currentTarget.value
      });
    },

    triggerKeyup: function(e) {
      this.trigger('keyup', {
        name: e.currentTarget.name,
        value: e.currentTarget.value
      });
    },

    triggerClick: function(e) {
      if (!e.currentTarget.value) return;
      e.target.setSelectionRange(0, e.target.value.length);
    }

  });

})(this.App);
