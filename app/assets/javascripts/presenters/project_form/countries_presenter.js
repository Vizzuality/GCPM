(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Countries = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Countries.prototype, {

    defaults: {
      multiple: false,
      name: 'countries[]',
      label: 'Countries',
      placeholder: 'All countries',
      blank: true,
      addNew: true,
      valueName: 'country_iso_3',
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear

        // Use this if you want a single select
        allowClear: true,
        templateSelection: function (data) {
          // Return the placeholder
          if (!data.id) {
            return data.text;
          }
          // Return the selected option
          return $('<span class="select2-selection__choice">' + data.text + '<span class="select2-selection__clear">×</span></span>');
        }
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.countries = new App.Collection.Countries();
      this.options = _.extend({}, this.defaults, viewSettings || {});
      // Creating view
      this.select = new App.View.Select({
        el: '#countries',
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
        App.trigger('Countries:change', this.state.attributes);
      }, this);

      this.select.on('change', this.setState, this);

      App.on('Regions:change', this.triggerRegionChange, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.countries.fetch().done(function() {
        var options = this.countries.map(function(country) {
          return {
            name: country.attributes.name,
            value: country.attributes[this.options.valueName]
          };
        }.bind(this));
        this.select.setOptions(options);
      }.bind(this));
    },

    render: function() {
      this.select.render();

      if (arguments[0]) {
        var state = new StateModel();
        state.set(_.extend({}, this.state.attributes, arguments[0]));
        this.select.setState(state);
      }
    },

    /**
     * Trigger country change
     */
    triggerRegionChange: function(selected) {
      if (this.state.get('value') && this.state.get('value')[0]) {
        var countrySelected = _.findWhere(this.countries.toJSON(), {
          country_iso_3: this.state.get('value')[0]
        });
        if (countrySelected.region_iso != selected.value[0]) {
          this.select.resetValue();
        }
      }
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
