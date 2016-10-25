(function(App) {

  'use strict';

  App.View.Layers = Backbone.View.extend({

    template: HandlebarsTemplates['layers'],

    events: {
      'click input[name="layer"]': 'handleRadio',
      'click .js-collapse-layer': 'collapseLayer',
      'click button.js-actionbar-action': 'hideLayersWindow'
    },

    initialize: function(settings) {
      this.data = (settings && settings.layers) || [];
      this.current = null;
      this.opened = [];

      this.setEvents();
    },

    setEvents: function() {
      $(document).on('click', this.handleDocumentClick.bind(this));
    },

    updateData: function(data) {
      this.data = data || [];
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.data));

      if (this.data.cartoLayer) {
        // Handle human develpment index
        if (this.data.cartoLayer.indexOf('human-development-index') !== -1) {
          this.data.cartoLayer = 'human-development-index';
        }

        var current = $('.c-layers .layers-content').find('input[value=' + this.data.cartoLayer + ']');

        if (current && current.length > 0) {
          this.current = current[0];
          this.current.checked = true;
        }

      }
      return this;
    },

    triggerChange: function() {
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

      this.triggerChange();
    },

    collapseLayer: function(e) {
      var layersItem = $(e.target).closest('div.layers-item');
      layersItem.toggleClass('-collapsed');
    },

    handleDocumentClick: function(e) {
      if (this.$el.find('.js-actionbar-action').length > 0) {
        var isContained = this.el.contains(e.target);
        !isContained && this.hideLayersWindow();
      }
    },

    hideLayersWindow: function() {
      this.trigger('close');
    }
  });

})(this.App);
