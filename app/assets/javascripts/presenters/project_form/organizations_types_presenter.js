(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationTypes = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationTypes.prototype, {

    defaults: {
      multiple: true,
      name: 'organization_types',
      label: 'Organization Types',
      placeholder: 'All organization types',
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

    initialize: function(params, viewSettings) {
      this.state = new StateModel();
      this.organization_types = new App.Collection.OrganizationTypes();

      // Creating view
      this.select = new App.View.Select({
        el: '#organization-types',
        options: _.extend({}, this.defaults, params || {}, viewSettings || {})
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('OrganizationTypes:change', this.state.attributes);
      }, this);

      this.select.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.organization_types.fetch().done(function() {
        var options = this.organization_types.map(function(type) {
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
    setState: function(state) {
      var result = {};
      _.each(state, function(s) {
        return result[s.value] = s.name;
      });
      this.state.set(result);
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
