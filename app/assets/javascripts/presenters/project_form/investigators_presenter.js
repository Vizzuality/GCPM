(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Investigators = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Investigators.prototype, {

<<<<<<< efa37edac46b74986c8bda20783172157c8f3208
    initialize: function(params) {
      this.state = new StateModel();
      this.investigators = new App.Collection.Investigators();
      this.investigators.url = '/api/investigators?token=' + window.AUTH_TOKEN;
      this.investigatorsId = 0;
=======
    defaults: {
      multiple: true,
      name: 'investigators',
      label: 'Investigators',
      placeholder: 'All investigators',
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
      this.investigators = new App.Collection.Investigators();
>>>>>>> new project, investigator and organization forms

      // Creating view
      this.select = new App.View.Select({
        el: '#investigators',
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('Investigators:change', this.state.attributes);
      }, this);

<<<<<<< efa37edac46b74986c8bda20783172157c8f3208
    renderOrganizations: function(investigatorId) {
      $.ajax({
        url: '/api/investigators/' + investigatorId + '?token=' + window.AUTH_TOKEN,
        method: 'GET',
        success: function(data) {
          var organizations = data.organizations.map(function(organization) {
            return {
              name: organization.name,
              value: organization.id
            };
          }.bind(this));
          this.organizationsSelect.setOptions(organizations, true);
          data.organizations.length !== 0 &&
            this.renderAddresses(organizations[0].value);
        }.bind(this)
      });
=======
      this.select.on('change', this.setState, this);
>>>>>>> new project, investigator and organization forms
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.investigators.fetch().done(function() {
        var options = this.investigators.map(function(type) {
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
