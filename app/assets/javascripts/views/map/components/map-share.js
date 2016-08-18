(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapShare = App.Helper.Modal.extend({

    el: '#map-share',

    events: function(){
      return _.extend({}, App.Helper.Modal.prototype.events,{
        'submit #map-filters-form': 'onSubmitFilters'
      });
    },


    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);

      this.utils = App.Helper.Utils;
      this.params = settings.params;

      // Inits
      this.render();
      this.cache();
      this.listeners();
    },

    cache: function() {
      this.$form = this.$el.find('#map-filters-form');
      this.$btnResetFilters = $('.btn-reset-filters');
    },

    listeners: function() {
      App.Events.on('params:update', function(params){
        this.params = params;
        this.updateFilters();
      }.bind(this));
    },

    render: function() {
      this.renderChosen();
      this.renderPickADate();
      return this;
    },


    /**
     * UI EVENTS
     * - onSubmitFilters
     */
    onSubmitFilters: function(e) {
      e && e.preventDefault();
      // Yes, this is the only way I found to achieve it...
      // I'm not proud of it
      var serialization = Backbone.Syphon.serialize(this);
      var newFilters = {};
      _.each(serialization, function(val, key){
        if (_.isArray(val)) {
          newFilters[key+'[]'] = _.flatten(val);
        } else {
          newFilters[key] = val;
        }
      });
      App.Events.trigger('filters:update', newFilters);
      this.hide();
    }

  });

})(this.App);
