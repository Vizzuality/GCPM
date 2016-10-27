(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.InvestigatorOrganizationEdit = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorOrganizationEdit.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      this.investigatorOrganizationEdit = new App.View.InvestigatorOrganizationEdit({
        el: '#investigatororganizationedit'
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.investigatorOrganizationEdit.on('deleteElement', function(elementId){

        debugger
        _.each(this.elements, function(element) {
          if(element && element.id === parseInt(elementId)){
            var index = this.elements.indexOf(element);
            this.elements.splice(index, 1);
            this.investigatorOrganizationEdit.elements = this.elements;
            this.render();
            return true;
          }
        }, this);

      }, this);

    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {

    },

    /**
     * Setting form state
     * @param {Object} newState
     */
    setState: function(newState) {
      this.state.set(newState);
    },


    render: function(){

      this.investigatorOrganizationEdit.render();

      _.each(this.elements, function(element) {

        _.each(element.children, function(child){

          // Render the child
          child.render();
        }.bind(this));

      }, this);

        App.trigger('InvestigatorOrganizationEdit:complete');

    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.investigatorOrganizationEdit.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.investigatorOrganizationEdit.$el;
    },

    setValue: function(memberships){

      App.on('InvestigatorOrganizationEdit:complete', function(){
        _.each(memberships, function(membership, index){
          _.each(this.elements, function(element) {
            if(element && element.id === index+1){
              element.children[0].setValue(membership.investigator.name);
              element.children[1].setValue(membership.organization.name);
              element.children[2].setValue(membership.membership_type);
            }
          });
        }, this);
      }, this);

      var i;
      for(i=0; i < memberships.length; i++){
        this.createElement();
      }
      this.render();
    },

    createElement: function(){
      this.investigatorOrganizationEdit.generateId();
      var investigator  = new App.Presenter.InvestigatorEdit({
        DOMelement: "#investigatoredit-"+this.investigatorOrganizationEdit.elementId,
        name:"investigatoredit-"+this.investigatorOrganizationEdit.elementId,
        label: null,
        addNew: true,
        multiple: false
      });
      var organization = new App.Presenter.OrganizationEdit({
        DOMelement: "#organizationedit-"+this.investigatorOrganizationEdit.elementId,
        name:"organizationedit-"+this.investigatorOrganizationEdit.elementId,
        label: null,
        addNew: true,
        multiple: false
      });
      var lead = new App.Presenter.OrganizationLead({
        DOMelement: "#leadedit-"+this.investigatorOrganizationEdit.elementId,
        name: "lead",
        value: "leadedit-"+this.investigatorOrganizationEdit.elementId,
        label: false,
      });
      var newElementChildren = [investigator, organization, lead]
      this.investigatorOrganizationEdit.createElement(newElementChildren);
      this.elements = this.investigatorOrganizationEdit.elements;
    }


  });

})(this.App);
