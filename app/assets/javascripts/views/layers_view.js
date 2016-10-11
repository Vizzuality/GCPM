(function(App) {

  'use strict';

  App.View.Layers = Backbone.View.extend({

    template: HandlebarsTemplates['layers'],

    events: {
      'click input[name="layer"]': 'handleRadio',
      'click button.js-collapse-layer': 'collapseLayer',
      'click button.js-actionbar-action': 'hideLayersWindow',

    },

    initialize: function(settings) {
      this.data = (settings && settings.layers) || [];
      this.current = null;
      this.opened = [];
    },

    updateData: function(layers) {
      this.data = layers || [];
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.data));
      return this;
    },

    triggerChange: function(e) {
      var radio = e.target;
      this.trigger('change', this.current);
    },

    handleRadio: function(e) {
      var radio = e.target;
      if(this.current && radio.getAttribute('id') === this.current.getAttribute('id')) {
        radio.checked = false;
        this.current = null;
      } else {
        this.current = radio;
      }

      this.triggerChange(e);
    },

    collapseLayer: function(e) {
      var layersItem = $(e.target).closest('div.layers-item');
      layersItem.toggleClass('-collapsed');
    },

    hideLayersWindow: function() {
      this.trigger('close');
    }

  });

})(this.App);
