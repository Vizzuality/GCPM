(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Organization = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Organization.prototype, {

    defaults: {
      multiple: false,
      name: 'organization',
      label: 'Organization',
      placeholder: 'All organizations',
      blank: null,
      addNew: true,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.organizations = new App.Collection.Organizations();

      // Creating view
      this.select = new App.View.Select({
        el: viewSettings.DOMelement,
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('new', function(){
        App.trigger('Organization:new');
      }, this);

      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('Organization:change', {state:this.state, el:this.select});
      }, this);

    },

    setSubscriptions: function(){
      App.on('OrganizationForm:submit', function(newState){
        newState.name = newState.organizationName;
        this.organizations.push(newState);
        this.select.addNew(this.organizations.at(this.organizations.length-1));
      }, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.organizations.fetch().done(function() {
        var options = this.organizations.map(function(type) {
          return {
            name: type.attributes.name,
            value: type.attributes.id
          };
        });
        this.select.setOptions(options);
      }.bind(this));
    },

    render: function() {
      this.select.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);
