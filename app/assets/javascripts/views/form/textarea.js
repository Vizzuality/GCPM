(function(App) {

  'use strict';

  App.View.Textarea = Backbone.View.extend({

    defaults: {
      label: null,
      placeholder: null,
      name: null,
      required: false,
      class: 'c-textarea'
    },

    events: {
      'blur textarea': 'triggerChange',
      'focus textarea': 'triggerFocus'
    },

    template: HandlebarsTemplates['form/textarea'],

    initialize: function(settings) {
      var opts = settings && settings.options;
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.options = _.extend({}, this.defaults, opts);

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
      if (!e.currentTarget.value) return;
      e.currentTarget.placeholder = '';
    }


  });

})(this.App);
