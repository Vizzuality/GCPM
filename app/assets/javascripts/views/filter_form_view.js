(function(App) {

  'use strict';

  App.View.FilterForm = Backbone.View.extend({

    template: HandlebarsTemplates['filter_form'],

    events: {
      'click .js-filter-form-cancel': 'triggerCancel',
      'submit form': 'triggerSubmit'
    },

    initialize: function(settings) {
      this.children = (settings && settings.children) || {};
    },

    render: function() {
      this.$el.html(this.template());

      // Rebinding elements and events
      this.delegateEvents();

      _.each(this.children, function(presenter) {
        presenter.setElement(presenter.getElement().selector);
      }, this);

      return this;
    },

    triggerCancel: function(e) {
      this.trigger('cancel');
    },

    triggerSubmit: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.trigger('submit', this.serializeForm());
    },

    /**
     * Using form2Object
     * @return {Object}
     */
    serializeForm: function() {
      var searchString = this.$el.find('form').serialize();
      return this.form2Object(this.$el.find('form')[0]);
    },


    /**
     * HELPERS
     * We want to retrieve the form as an object. As we are using multiple selects, those ones MUST be an array
     * - How will we deal with disabled or hidden inputs?
     * -
     * @return {Object}
     */
    form2Object: function(form) {
      var body = {}
      var inputs = form.querySelectorAll('input, textarea, select, checkbox, radio');
      var names = _.groupBy(inputs, 'name');

      _.each(inputs, function(el) {
        var key = el.name;
        var type = el.type;
        var is_array = names[key].length > 1;

        // Ignore an element if it has no name
        if (!key) return;

        // Ignore this kind of inputs
        if (['file', 'reset', 'submit', 'button'].indexOf(el.type) > -1) return;
        
        switch (type) {
          case 'select-multiple':
            // If select is multiple we need to send an array
            body[key] = _.pluck(el.selectedOptions, 'value');
          break;

          case 'checkbox':
            // If checkbox is an array we need to send an array
            if (is_array) {
              var arr = body[key] || [];
              el.checked && arr.push(el.value);
              body[key] = arr;
            } else {
              body[key] = el.checked;
            }
          break;

          default:
            body[key] = el.value || null;
        }
      }.bind(this));

      return body
    }
  });

})(this.App);
