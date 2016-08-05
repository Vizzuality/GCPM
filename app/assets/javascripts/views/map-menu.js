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

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.params ? settings.params : {};
      this.options = _.extend({}, this.defaults, opts);

      this.model.set(this.typeDictionary(this.options.type));
      this.listeners();
      this.render();
    },

    listeners: function() {
      App.Events.on('params:update', function(params){
        this.params = params;
        var newParams = this.typeDictionary(params.type);
        this.model.set(newParams);
      }.bind(this));
      this.model.on('change', this.render.bind(this));
    },

    render: function() {
      var html = this.template(this.model.toJSON());
      this.$el.html(html);
    },

    typeDictionary: function(type) {
      var typeParams = {};
      switch(type) {
        case 'projects':
          typeParams = {
            type: 'projects',
            color: '-color-1'
          }; break;
        case 'events':
          typeParams = {
            type: 'events',
            color: '-color-2'
          }; break;
        default:
          typeParams = {
            type: 'projects',
            color: '-color-1'
          };
      }
      return typeParams;
    },

    triggerAction: function(e) {
      e && e.preventDefault();
      var action = $(e.currentTarget).data('action');
      Backbone.Events.trigger('MapMenu/action');
      Backbone.Events.trigger(action, e);
    }


  });

})(this.App);
