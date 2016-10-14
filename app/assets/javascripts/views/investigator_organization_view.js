(function(App) {

  'use strict';

  App.View.InvestigatorOrganization = Backbone.View.extend({

    template: HandlebarsTemplates['investigator_organization'],

    events:{
      'click .delete': 'deleteElement'
    },

    initialize: function(settings) {
      this.elements = [];
      this.elementId = 0;
      this.generateId();
      this.createElements(settings.children);
    },

    createElements: function(children){
      var element = {}
      element.id = this.elementId;
      element.children = children;
      this.elements.push(element);
    },

    deleteElement: function(e, el){
      var elementId = e.target.id.split("-")[1];
      this.trigger('deleteElement', elementId);
    },

    generateId: function(){
      this.elementId++;
    },

    render: function() {
      this.$el.html(this.template({ elements: this.elements }));

      // Rebinding elements and events
      this.delegateEvents();

      _.each(this.elements, function(element) {

        _.each(element.children, function(presenter) {
          presenter.setElement(presenter.getElement().selector);
        }, this);

      }, this);

      return this;
    }

  });

})(this.App);
