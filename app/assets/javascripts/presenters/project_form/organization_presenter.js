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
      this.DOMelementId = viewSettings.DOMelement.split("-")[1];

      this.organizationForm = new App.Presenter.OrganizationForm({
        DOMelementId: this.DOMelementId
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('new', function(){
        this.organizationForm.openForm();
      }, this);

      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('Organization:change', {state:this.state, el:this.select});
      }, this);

    },

    setSubscriptions: function(){
      App.on('OrganizationForm:submit'+this.DOMelementId, function(newOrganization){
        var newOption = {
          value: JSON.stringify(newOrganization)
        };
        newOption.name = newOrganization.organizationName;
        this.select.options.options.unshift(newOption);
        this.select.render();
        // Auto set value
        this.setValue(newOption.value);
      }, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      if(this.organizations.length > 0){
        return this.organizations;
      }
      return this.organizations.fetch({add: true}).done(function() {
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

    setValue: function(values){
      this.select.$el.find("select").val(values).trigger("change");
    },

    setFetchedValues: function(value){
      this.select.$el.find("select").val(value).trigger("change");
      this.select.$el.find("select").attr("disabled", true);
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
