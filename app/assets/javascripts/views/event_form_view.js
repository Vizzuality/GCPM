(function(App) {

  'use strict';

  App.View.EventForm = Backbone.View.extend({

    events: {
      'click .js-online': 'handleOnline',
      'submit form': 'triggerSubmit'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$addressInfo = this.$el.find('.address-info');
      this.$online = this.$el.find('.js-online');
      this.$address = this.$el.find('#event_address');
      this.$address2 = this.$el.find('#event_address2');
      this.$city = this.$el.find('#event_city');
      this.$state = this.$el.find('#event_state');
      this.$postcode = this.$el.find('#event_postcode');
    },

    getLocation: function() {
      return {
        lat: this.$el.find('#event_latitude').val() || 52,
        lng: this.$el.find('#event_longitude').val() || 7
      }
    },

    setLocation: function(center) {
      this.$el.find('#event_latitude').val(Number(center.lat).toFixed(2));
      this.$el.find('#event_longitude').val(Number(center.lng).toFixed(2));
    },


    triggerSubmit: function(e) {
      debugger;
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
    },

    handleOnline: function(e) {
      this.trigger('online', e.target.value);
    },

    toggleOnline: function(value) {
      var boolValue = value == 'true';
      boolValue && this.resetAddressInfo();
      this.$addressInfo.toggleClass('hiddeable', boolValue);
    },

    resetAddressInfo: function() {
      var $country = this.$el.find('select[name="event[country]"]');
      var $container = this.$el.find('#countries .select2-selection.select2-selection--single');
      var reset = [this.$address, this.$address2, $country, this.$city, this.$state, this.$postcode];

      _.each(reset, function(input) {
        input.val('');
      });

      $container.html('<span class="select2-selection__rendered" id="select2-eventcountry-d0-container"><span class="select2-selection__placeholder">All countries</span></span>');
    }

  });

})(this.App);
