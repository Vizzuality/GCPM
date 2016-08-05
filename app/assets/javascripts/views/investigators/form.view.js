/**
 * Example of use:
 *
 * var investigatorForm = new App.View.Investigator.Form();
 * Backbone.Events.trigger('Modal:open', investigatorForm.render().el);
 */

(function(App) {

  'use strict';

  App.View = App.View || {};
  App.View.Investigator = {};

  App.View.Investigator.Form = Backbone.View.extend({

    events: {
      'submit': 'onSubmit'
    },

    template: HandlebarsTemplates['investigators/form'],

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    onSubmit: function(e) {
      e.preventDefault();
    }

  });

})(this.App);
