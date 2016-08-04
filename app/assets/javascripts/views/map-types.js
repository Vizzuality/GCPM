(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapTypes = Backbone.View.extend({

    el: '#map-types',

    events: {
      'click .js-btn-mapmenu-type' : 'onClickType'
    },

    model: new (Backbone.Model.extend({
      defaults: {
        type: 'projects'
      }
    })),

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);
      this.params = settings.params;

      if (!!this.params.type) {
        this.model.set('type', this.params.type);
      }

      this.listeners();
    },

    listeners: function() {
      this.model.on('change:type', this.changeType.bind(this));
    },

    /**
     * MODEL CHANGES
     */
    changeType: function() {
      var type = this.model.get('type');
      // Select buttons
      this.$el.find('.js-btn-mapmenu-type').removeClass('-active');
      this.$el.find('.js-btn-mapmenu-type[data-type='+type+']').addClass('-active');

      // Publish the type
      var newFilters = {
        type: this.model.get('type')
      };
      App.Events.trigger('filters:update', newFilters);

    },

    /**
     * UI EVENTS
     * - onClickType
     */
    onClickType: function(e) {
      e && e.preventDefault();
      this.model.set('type', $(e.currentTarget).data('type'));
    }

  });

})(this.App);
