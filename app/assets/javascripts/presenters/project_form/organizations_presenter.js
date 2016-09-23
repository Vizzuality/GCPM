(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Organizations = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Organizations.prototype, {

    defaults: {
      multiple: true,
      name: 'organizations',
      label: 'Organizations',
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
        el: '#organizations',
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
        App.trigger('Organizations:change', this.state.attributes);
      }, this);

      this.select.on('change', this.setState, this);
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
      this.select.render();
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
