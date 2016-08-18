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

      if (settings.params.cancer_type) {
        urlParams['cancer_type'] = settings.params.cancer_type;
      }
      if (settings.params.layer) {
        urlParams['layer'] = settings.params.layer;
      }

      if (Object.keys(urlParams).length !== 0) {
        this.model.set(urlParams);
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
        cancer_type: this.model.get('cancer_type')
      };

      this.$el.find('li').removeClass('-selected');
      this.$el.find('li[data-layer="'+ this.model.get('layer') +'"]').addClass('-selected');

      var cancerType = this.$el.find('li[data-cancer-type="'+ this.model.get('cancer_type') +'"]');

      if (cancerType.length !== 0) {
        cancerType.addClass('-selected');
      }

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
        cancer_type: $(e.currentTarget).data('cancer-type') || null
      }, { silent: true });
      this.changeLayer();
    },

  });

})(this.App);
