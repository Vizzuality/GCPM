(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Regions = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Regions.prototype, {

    defaults: {
      multiple: false,
      name: 'regions[]',
      label: 'Regions',
      placeholder: 'All regions',
      blank: true,
      addNew: true,
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

      // Creating view
      this.select = new App.View.Select({
        el: '#regions',
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
        App.trigger('Regions:change', this.state.attributes);
      }, this);

      this.select.on('change', this.setState, this);

      App.on('Countries:change', this.triggerCountryChange, this);
      // App.on('MapCountry:change', this.triggerCountryChange, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.countries.fetch().done(function() {
        var options = this.countries.getRegions().map(function(region) {
          return {
            name: region.region_name,
            value: region.region_iso
          };
        });
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
     * Trigger region change
     */
    triggerCountryChange: function(selected) {
      var country = selected.value[0];
      if (country) {
        var countrySelected = _.findWhere(this.countries.toJSON(), {
          country_iso_3: country
        });
        this.select.setValue(countrySelected.region_iso);
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
