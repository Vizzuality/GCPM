(function(App) {

  'use strict';

  App.View.Toolbar = Backbone.View.extend({

    template: HandlebarsTemplates['toolbar'],

    events: {
      'click .js-toolbar-action': 'fireAction'
    },

    initialize: function() {
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
    },

    fireAction: function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      var $currentTarget = $(e.currentTarget);
      this.trigger('action', $currentTarget.data('action'));
    }

  });

})(this.App);
