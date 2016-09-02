(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapMenu = Backbone.View.extend({

    el: '#map-menu',

    template: HandlebarsTemplates['map-menu'],

    events: {
      'click .btn-mapmenu-action' : 'triggerAction'
    },

    model: new (Backbone.Model.extend()),

    colors: {
      'projects': '-color-1',
      'events': '-color-2',
      'default': '-color-1'
    },

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.params ? settings.params : {};
      this.options = _.extend({}, this.defaults, opts);

      this.model.set(this.setParams(this.options.type));
      this.listeners();
      this.render();
    },

    listeners: function() {
      App.Events.on('params:update', function(params){
        this.params = params;
        var newParams = this.setParams(params.type);
        this.model.set(newParams);
      }.bind(this));
      this.model.on('change', this.render.bind(this));
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    setParams: function(type) {
      return {
        type: type || 'projects',
        color: this.colors[type] || this.colors['default'],
        userId: USER_ID
      }
    },

    triggerAction: function(e) {
      e && e.preventDefault();
      var action = $(e.currentTarget).data('action');
      Backbone.Events.trigger('MapMenu/action');
      Backbone.Events.trigger(action, e);
    }


  });

})(this.App);
