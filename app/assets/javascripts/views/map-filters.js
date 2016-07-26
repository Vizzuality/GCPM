(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapFilters = App.Helper.Modal.extend({

    id: '#map-filters',

    className: "c-modal",

    template: HandlebarsTemplates['map-filters'],

    initialize: function() {
      // Inits
      this.render();
      this.listeners();
      // All the methods that has _ is because they belong to the Parent View
      this._cache();
      this._listeners();

      this.$body.append(this.el);
    },

    listeners: function() {
      Backbone.Events.on('Filters/toggle', function(){
        this.toggle();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template());
      return this;

    },

  });

})(this.App);
