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

      this.listeners();
    },

    listeners: function() {
      App.Events.on('params:update', function(params){
        this.params = params;
        this.updateSelects();
      }.bind(this));

      this.model.on('change:type', this.changeType.bind(this));
    },

    /**
     * MODEL CHANGES
     */
    changeType: function() {
      var type = this.model.get('type');
      console.log(type);

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
