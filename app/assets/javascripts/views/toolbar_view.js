(function(App) {

  'use strict';

  App.View.Toolbar = Backbone.View.extend({

    template: HandlebarsTemplates['toolbar'],

    events: {
      'click .btn-mapmenu-action': 'fireAction'
    },

    render: function(data) {
      if (data) {
        this.$el.html(this.template(data));
      }
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
