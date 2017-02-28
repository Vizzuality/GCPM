(function(App) {

  'use strict';

  App.View.EventForm = Backbone.View.extend({

    events: {
      'click .js-online': 'handleOnline',
      'submit': 'triggerSubmit',
      'click #btn-submit': 'triggerRealSubmit',
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
      this.$required = this.$el.find('.required');
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

    triggerSubmit: function(e, submit) {
      if (e && !submit) {
        e.preventDefault();
        return false;
      }
    },

    triggerRealSubmit: function() {
      this.$el.trigger('submit', [true]);
    },

    handleOnline: function(e) {
      this.trigger('online', e.target.value);
    },

    toggleOnline: function(value) {
      var boolValue = value == 'true';
      boolValue && this.resetAddressInfo();
      this.$addressInfo.toggleClass('-hidden', boolValue);
    },

    resetAddressInfo: function() {
      var $country = this.$el.find('select[name="event[country]"]');
      var $container = this.$el.find('#countries .select2-selection.select2-selection--single');
      var reset = [this.$address, this.$address2, $country, this.$city, this.$state, this.$postcode];

      _.each(reset, function(input) {
        input.val('');
      });

      $container.html('<span class="select2-selection__rendered" id="select2-eventcountry-d0-container"><span class="select2-selection__placeholder">All countries</span></span>');
    },

    highlightRequired: function() {
      this.$required.toggleClass('-error', true);
    }

  });

})(this.App);
