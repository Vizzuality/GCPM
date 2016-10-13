(function(App) {

  'use strict';

  App.View.InvestigatorOrganization = Backbone.View.extend({

    template: HandlebarsTemplates['investigator_organization'],

    initialize: function(settings) {
      var obj = {id:1}
      this.elements = [obj];
      this.children = (settings && settings.children) || {};
    },

    addNew: function(){
      var obj = {}
      this.elements.push(obj);
      this.elements[this.elements.length-1].id = this.getId();
      this.render();
    },

    getId: function(){
      return this.elements.length;
    },

    render: function() {
      this.$el.html(this.template({ elements: this.elements }));

      // Rebinding elements and events
      this.delegateEvents();

      _.each(this.children, function(presenter) {
        presenter.setElement(presenter.getElement().selector);
      }, this);

      return this;
    },


  });

})(this.App);
