(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapLayers = App.Helper.Tooltip.extend({

    el: '#map-layers',

    model: new (Backbone.Model.extend({
      defaults: {
      }
    })),

    events: {
      'click .btn-map-layer' : 'onClickLayer'
    },

    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.listeners();
      var urlParams = {};

      ['cancer_type', 'date', 'layer'].map(function(key) {
        if (settings.params[key]) {
          urlParams[key] = settings.params[key];
        }
      }.bind(this));

      if (Object.keys(urlParams).length !== 0) {
        this.model.set(urlParams);
        this.changeLayer();
      }
    },


    listeners: function() {
      App.Events.on('Layers/toggle', function(e) {
        var $currentTarget = $(e.currentTarget);
        var offsets = $currentTarget.offset();

        this.model.set('currentTarget', e.currentTarget);

        // Position tooltip
        this.$el.css({
          top: offsets.top + $currentTarget.innerHeight(),
          left: offsets.left
        });

        // Position arrow
        this.$el.find('.tooltip-arrow').css({
          left: $currentTarget.innerWidth()/2
        });

        this.toggle();
      }.bind(this));
    },

    changeLayer: function() {
      var layerParams = {
        layer: this.model.get('layer'),
        cancer_type: this.model.get('cancer_type'),
        date: this.model.get('date')
      };

      this.$el.find('li').removeClass('-selected');
      var layer = this.$el.find('.layers-list > li[data-layer="'+ this.model.get('layer') +'"]');
      var cancerType = this.$el.find('li[data-cancer-type="'+ this.model.get('cancer_type') +'"]');
      var date = this.$el.find('li[data-date="'+ this.model.get('date') +'"]');

      [layer, cancerType, date].map(function(type) {
        type.addClass('-selected');
      }.bind(this));

      App.Events.trigger('filters:update', layerParams);
    },


    /**
     * UI EVENTS
     * - onClickLayer
     */
    onClickLayer: function(e) {
      e & e.preventDefault({});
      this.model.set({
        layer: $(e.currentTarget).data('layer') || null,
        cancer_type: $(e.currentTarget).data('cancer-type') || null,
        date: $(e.currentTarget).data('date') || null
      }, { silent: true });
      this.changeLayer();
    },

  });

})(this.App);
