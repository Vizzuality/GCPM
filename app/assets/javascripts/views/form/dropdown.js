(function(App) {

  'use strict';

  App.View.Dropdown = Backbone.View.extend({

    defaults: {
      label: null,
      showHeader: true,
      class: '',
      options: []
    },

    events: {
      'click div.js-open': 'triggerOpen',
      'click a.js-option': 'triggerChange'
    },

    template: HandlebarsTemplates['dropdown'],


    initialize: function(settings) {
      var opts = settings && settings.options;
      opts = opts || new Object();
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.state = settings.state;
      this.options = _.extend({}, this.defaults, opts);
    },

    render: function() {
      this.options.header = this.state.attributes.name;
      this.options.open = this.state.attributes.open;
      this.$el.html(this.template(this.options));
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

    setState: function(state) {
      this.state.attributes = state;
    },

    triggerChange: function(e) {
      var value = e.currentTarget.getAttribute('data-value');
      var name = e.currentTarget.getAttribute('name');
      var newState = {
        value: value,
        name: name,
        open: !this.state.attributes.open
      };
      this.trigger('change', newState);
    },

    triggerOpen: function(e) {
      this.trigger('change', { open: !this.state.attributes.open });
    }

  });

})(this.App);
