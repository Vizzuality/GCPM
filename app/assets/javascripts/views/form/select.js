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
    //template: HandlebarsTemplates['dropdown'],

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
    setValue: function(value) {
      var val = value || this.state.get('value');

      if(this.options.select2Options.ajax && !!val) {
        var arrValues = val;
        if (!_.isArray(val)) {
          arrValues = [val];
        }
        _.each(arrValues, function(v){
          var current = _.findWhere(this.options.options, { id: parseInt(v) });
          $(this.select.selector).select2("trigger", "select", {
            data: {
              id: current.id,
              text: current.text
            }
          });
        }.bind(this));
      }

      if (!this.options.select2Options.ajax && !!val) {
        $(this.select.selector).val(val).trigger("change");
      }

    },

    resetValue: function() {
      $(this.select.selector).val(null).trigger("change");
    },

    addNew: function(option){
      var obj = {
        id: option.cid,
        value: JSON.stringify(option.attributes),
        name: option.attributes.name
      };
      this.options.options.unshift(obj);
      this.render();
    },

    setOptions: function(options) {
      this.options.options = options;
    },

    triggerChange: function(e) {
      var selectedOptions = e.currentTarget.selectedOptions;
      var currentOptions = _.pluck(selectedOptions, 'value');
      var index = currentOptions.indexOf("Add new");
      if (index > -1){
        //currentOptions.splice(index, 1);
        this.render();
        this.trigger('new');
      }
      else{
        this.trigger('change', {value: currentOptions });
      }
    }

  });

})(this.App);
