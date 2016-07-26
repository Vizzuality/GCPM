(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapFilters = App.Helper.Modal.extend({

    el: '#map-filters',

    initialize: function() {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.render();
      this.listeners();     
    },

    listeners: function() {
      Backbone.Events.on('Filters/toggle', function(){
        this.toggle();
      }.bind(this));
    },

    render: function() {
      this.renderChosen();
      return this;
    },

    renderChosen: function() {
      this.$el.find('.chosen-select').chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"        
      });
    }

  });

})(this.App);
