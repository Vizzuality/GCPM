(function(App) {

  'use strict';

  App.View.Layers = Backbone.View.extend({

    template: HandlebarsTemplates['layers'],

    events: {
      'click input[name="layer"]': 'uncheckRadio',
      'change input[name="layer"]': 'triggerChange'
    },

    initialize: function(settings) {
      this.data = (settings && settings.data)||[];
      this.current = null;
      this.opened = [];
    },

    updateData: function(data) {
      this.data = data||[];
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.data));
      return this;
    },

    triggerChange: function(e) {
      var radio = e.target;
      this.current = radio.getAttribute('id');
      this.trigger('change', radio);
    },

    uncheckRadio: function (e) {
      var radio = e.target;
      if(radio.getAttribute('id') === this.current) {
        radio.checked = false;
        this.current = null;
      }
    }

  });

})(this.App);
