(function(App) {

  'use strict';

  App.View.Actionbar = Backbone.View.extend({

    template: HandlebarsTemplates[ gon.isMobile ? 'actionbar_mobile' : 'actionbar'],

    events: {
      'click .js-actionbar-action': 'fireAction'
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
      App.trigger('Actionbar:'+ $currentTarget.data('action'));
    }

  });

})(this.App);
