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
      var opts = settings && settings.options;
      opts = opts || new Object();
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.state = settings.state;
      this.options = _.extend({}, this.defaults, opts);
      this.options.select2Options = _.extend({}, this.defaults.select2Options, opts.select2Options);
    },

    render: function() {
      this.$el.html(this.template(this.options));
      this.select = this.$el.find('select').select2(this.options.select2Options);
      this.setValue();
      return this;
    },

    setState: function(state) {
      this.state = state;
      this.setValue();
    },

    /**
     * Render new options and render again
     * @param {Array} options
     * @example
     * [{ name: 'Title', value: 1 }]
     */
    setValue: function() {
      $(this.select.selector).val(this.state.get('value')).trigger("change");
    },

    setOptions: function(options) {
      this.options.options = options;
    },

    triggerChange: function(e) {
      var selectedOptions = e.currentTarget.selectedOptions;
      var currentOptions = _.pluck(selectedOptions, 'value');
      this.trigger('change', { value: currentOptions });
    }

  });

})(this.App);
