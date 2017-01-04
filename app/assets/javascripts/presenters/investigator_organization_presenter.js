(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.InvestigatorOrganization = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorOrganization.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);

      var investigator  = new App.Presenter.Investigator({
        DOMelement: "#investigator-1",
        name: "investigator-1",
        label: null,
        required: this.state.get('required'),
        addNew: true,
        multiple: false,
        select2Options: {
          ajax: {
            url: '/api/investigators',
            delay: 150,
            cache: true,
            data: function (params) {
              var query = {
                q: params.term,
                page: params.page || 1,
                token: window.AUTH_TOKEN
              }
              // Query paramters will be ?q=[term]&page=[page]
              return query;
            },

            processResults: function (organizations) {
              return {
                results: _.sortBy(_.map(organizations, function(org){
                  return {
                    text: org.name,
                    id: org.id
                  };
                }), 'text')
              }
            }
          }
        }

      });
      var organization = new App.Presenter.Organization({
        DOMelement: "#organization-1",
        name: "organization-1",
        label: null,
        required: this.state.get('required'),
        addNew: true,
        multiple: false
      });
      var address = new App.Presenter.OrganizationAddress({
        DOMelement: "#address-1",
        name: "address-1",
        label: null,
        required: this.state.get('required'),
        addNew: false,
        multiple: false
      });
      var lead = new App.Presenter.OrganizationLead({
        DOMelement: "#lead-1",
        name: "lead",
        value: "lead-1",
        label: false
      });

      this.investigatorOrganization = new App.View.InvestigatorOrganization({
        el: '#investigatororganization'
      });

      var elementOneChildren = [investigator, organization, address, lead];
      this.investigatorOrganization.createElement(elementOneChildren);
      this.elements = this.investigatorOrganization.elements;

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.investigatorOrganization.on('deleteElement', function(elementId){
        if(this.elements.length === 1){
          return false;
        }

        _.each(this.elements, function(element) {
          if(element.id === parseInt(elementId)){
            var index = this.elements.indexOf(element);
            this.elements.splice(index, 1);
            this.investigatorOrganization.elements = this.elements;
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
      App.on('ProjectForm:newInvestigator', function(){
        this.createElement();
      }, this);

      App.on('Organization:change', function(data){
        var selector = data.el.$el.selector;
        App.trigger('Organization:'+selector, data.state.attributes);
      }, this);
    },

    /**
     * Setting form state
     * @param {Object} newState
     */
    setState: function(newState) {
      this.state.set(newState);
    },


    render: function(){

      _.each(this.elements, function(element) {

        var promises = _.compact(_.map(element.children, function(child) {
         if (child.fetchData) {
           return child.fetchData();
         }
         return null;
        }));

        $.when.apply($, promises).done(function() {

          this.investigatorOrganization.render();

          _.each(this.elements, function(element) {

            _.each(element.children, function(child){

              // Render the child
              child.render();
            }.bind(this));

          }, this);

        }.bind(this));

      }, this);

    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.investigatorOrganization.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.investigatorOrganization.$el;
    },

    createElement: function(){
      this.investigatorOrganization.generateId();
      var investigator  = new App.Presenter.Investigator({
        DOMelement: "#investigator-"+this.investigatorOrganization.elementId,
        name:"investigator-"+this.investigatorOrganization.elementId,
        label: null,
        addNew: true,
        multiple: false
      });
      var organization = new App.Presenter.Organization({
        DOMelement: "#organization-"+this.investigatorOrganization.elementId,
        name:"organization-"+this.investigatorOrganization.elementId,
        label: null,
        addNew: true,
        multiple: false
      });
      var address = new App.Presenter.OrganizationAddress({
        DOMelement: "#address-"+this.investigatorOrganization.elementId,
        name: "address-"+this.investigatorOrganization.elementId,
        label: null,
        addNew: false,
        multiple: false
      });
      var lead = new App.Presenter.OrganizationLead({
        DOMelement: "#lead-"+this.investigatorOrganization.elementId,
        name: "lead",
        value: "lead-"+this.investigatorOrganization.elementId,
        label: false,
      });
      var newElementChildren = [investigator, organization, address, lead]
      this.investigatorOrganization.createElement(newElementChildren);
      this.elements = this.investigatorOrganization.elements;
      this.render();
      return newElementChildren;
    }


  });

})(this.App);
