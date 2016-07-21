(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapMenu = Backbone.View.extend({

    el: '#map-menu',

    events: {
      'click .btn-mapmenu-action' : 'triggerAction'
    },

    model: new (Backbone.Model.extend({
      defaults: {

      }
    })),

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);

      this.listeners();
    },

    listeners: function() {
    },

    triggerAction: function(e) {
      e && e.preventDefault();
      var action = $(e.currentTarget).data('action');
      Backbone.Events.trigger('MapMenu/action');
      Backbone.Events.trigger(action);
      console.log(action);
    }


  });

})(this.App);
