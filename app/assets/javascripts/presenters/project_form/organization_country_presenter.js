(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationCountry = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationCountry.prototype, {

    defaults: {
      multiple: false,
      name: 'organizationCountry',
      label: 'Organization Country',
      required: true,
      placeholder: 'All Countries',
      blank: true,
      addNew: false,
      select2Options: {}
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.organizationCountry = new App.Collection.Countries();

      // Creating view
      this.select = new App.View.Select({
        el: '#organizationcountry',
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('change', function(){
        App.trigger('OrganizationCountry:change', this.state.attributes);
      }, this);

      this.select.on('change', this.setState, this);

    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.organizationCountry.fetch().done(function() {
        var options = this.organizationCountry.map(function(type) {
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
