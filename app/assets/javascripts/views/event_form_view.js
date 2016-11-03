(function(App) {

  'use strict';

  App.View.EventForm = Backbone.View.extend({

    events: {
      'submit form': 'triggerSubmit'
    },

    initialize: function() {

    },

    triggerSubmit: function() {
      this.trigger('submit', this.serializeForm());
    },

    /**
     * Using form2Object
     * @return {Object}
     */
    serializeForm: function() {
      //var searchString = this.$el.find('form').serialize();
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
      var radios = [];

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

          case 'radio':
            if(radios.length == 0){
              if(el.checked == true){
                radios.push(el);
              }
            }
            else {
              _.each(radios, function(radio){
                if(el.name == radio.name){
                  return false;
                }
                if(el.checked == true){
                  radios.push(el);
                }
              });
            }
            break

          default:
            body[key] = el.value || null;
        }
      }.bind(this));

      _.each(radios, function(radio){
        body[radio.name] = radio.value || null;
      });

      return body
    }
  });

})(this.App);
