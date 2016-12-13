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
      max: false,
      firstRadio: false
    },

    events: {
      'click input': 'triggerClick',
      'blur input': 'triggerChange',
      'keyup input': 'triggerKeyup'
    },

    template: HandlebarsTemplates['form/input'],

    initialize: function(settings) {
      var opts = (settings && settings.options) || {};
      opts.class = [this.defaults.class, opts.class || ''].join(' ');
      this.options = _.extend({}, this.defaults, opts);

      if(this.options.type === "radio" && this.options.firstRadio){
        this.options.checked = true;
      }

      this.$el.addClass(this.options.class);
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.options));
    },

    clear: function() {
      var e = {
        currentTarget: {
          name: this.$el.find('input').attr('name'),
          value: ''
        }
      }

      this.$el.find('input').val('');
      this.triggerKeyup(e);
    },

    triggerChange: function(e) {
      if (!e.currentTarget.value) return;
      this.trigger('change', {
        name: e.currentTarget.name,
        value: e.currentTarget.value
      });
    },

    triggerKeyup: function(e) {
      this.value = e.currentTarget.value;
      this.trigger('keyup', {
        keyCode: e.keyCode,
        name: e.currentTarget.name,
        value: e.currentTarget.value
      });
    },

    triggerClick: function(e){
      if (!e.currentTarget.value) return;
      if(e.currentTarget.type == "radio"){
        this.trigger('change', {
          name: e.currentTarget.name,
          value: e.currentTarget.value
        });
      }
    }

  });

})(this.App);
