(function(App) {

  'use strict';

  App.View.Select = Backbone.View.extend({

    defaults: {
      label: null,
      name: null,
      multiple: false,
      required: false,
      class: 'c-select',
      blank: '-- Select an option --', // use false to disable this
      addNew: false,
      options: [],
      select2Options: {
        theme: "default"
      }
    },

    events: {
      'change select': 'triggerChange'
    },

    template: HandlebarsTemplates['form/select'],

    initialize: function(settings) {
      var opts = (settings && settings.options) || {};
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.options = _.extend({}, this.defaults, opts);
      this.options.select2Options = _.extend({}, this.defaults.select2Options, opts.select2Options);
    },

    render: function() {
      this.$el.html(this.template(this.options));
      this.select = this.$el.find('select').select2(this.options.select2Options);
      return this;
    },

    /**
     * Render new options and render again
     * @param {Array} options
     * @example
     * [{ name: 'Title', value: 1 }]
     */
    setOptions: function(options) {
      this.options.options = options;
    },

    triggerChange: function(e) {
      var selectedOptions = e.currentTarget.selectedOptions;
      var currentOptions = _.filter(_.map(selectedOptions, function(option) {
        return {
          name: option.innerHTML,
          value: option.getAttribute('value')
        };
      }), function(option) {
        return !!option.value;
      });
      this.trigger('change', currentOptions);
    }

  });

})(this.App);
