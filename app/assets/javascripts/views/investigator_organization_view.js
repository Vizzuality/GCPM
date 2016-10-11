(function(App) {

  'use strict';

  App.View.InvestigatorOrganization = Backbone.View.extend({

    template: HandlebarsTemplates['investigator_organization'],

    initialize: function(settings) {
      this.children = (settings && settings.children) || {};
    },

    render: function() {
      this.$el.html(this.template());

      // Rebinding elements and events
      this.delegateEvents();

      _.each(this.children, function(presenter) {
        presenter.setElement(presenter.getElement().selector);
      }, this);

      return this;
    },


  });

})(this.App);
