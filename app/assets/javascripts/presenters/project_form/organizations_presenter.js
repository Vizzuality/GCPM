(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Organizations = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Organizations.prototype, {

    defaults: {
      multiple: true,
      name: 'organizations[]',
      label: 'Organizations',
      placeholder: 'All organizations',
      blank: null,
      addNew: true
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.organizations = new App.Collection.Organizations();
      this.options = _.extend({}, this.defaults, viewSettings || {});

      // Creating view
      this.autocomplete = new App.View.Autocomplete({
        el: '#organizations',
        options: this.options,
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

      this.autocomplete.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return false;
      // return this.organizations.fetch().done(function() {
      //   var options = this.organizations.map(function(type) {
      //     return {
      //       name: type.attributes.name,
      //       id: type.attributes.id
      //     };
      //   });
      //   this.autocomplete.setOptions(options);
      // }.bind(this));
    },

    render: function() {
      this.autocomplete.render();
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
      this.autocomplete.setElement(el);
      this.autocomplete.render();
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.autocomplete.$el;
    }

  });

})(this.App);
