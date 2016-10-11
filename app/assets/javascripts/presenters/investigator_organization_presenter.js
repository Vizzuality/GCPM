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
        label: null,
        addNew: true,
        multiple: false
      });
      var organization = new App.Presenter.Organization({
        label: null,
        addNew: true,
        multiple: false
      });

      this.investigatorForm = new App.Presenter.InvestigatorForm();
      this.organizationForm = new App.Presenter.OrganizationForm();

      this.children = [investigator, organization];

      this.investigators= new App.View.InvestigatorOrganization({
        children: this.children,
        el: '#investigators'
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {

    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {
      App.on('Investigator:new', function(){
        this.investigatorForm.openForm();
      }, this);

      App.on('Organization:new', function(){
        this.organizationForm.openForm();
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

      var promises = _.compact(_.map(this.children, function(child) {
       if (!!child.fetchData) {
         return child.fetchData();
       }
       return null;
      }));

      $.when.apply($, promises).done(function() {
       this.renderFields();
      }.bind(this));

    },

    renderFields: function() {
      this.investigators.render();
      _.each(this.children, function(child){

        // Render the child
        child.render();
      }.bind(this));
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.investigators.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.investigators.$el;
    },

    addNew: function(){

    }


  });

})(this.App);
