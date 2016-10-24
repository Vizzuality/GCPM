(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.PickadateStart = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.PickadateStart.prototype, {

    defaults: {
      name: 'start_date',
      slug: 'start_date',
      label: 'Start date',
      min: new Date(1905,1,1),
      max: new Date(2040,1,1)
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      // Creating view
      this.pickadate = new App.View.PickadateNew({
        el: '#pickadate-start',
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
        App.trigger('PickadateStart:change', this.state.attributes);
      }, this);

      App.on('PickadateEnd:change', function(state) {
        this.pickadate.$datePicker && this.pickadate.$datePicker.set('max', new Date(state.value));
      }.bind(this));

      App.on('FilterForm:reset', function() {
        this.state
          .clear({ silent: true })
          .set(this.defaults, { silent: true });
      }.bind(this));

      this.pickadate.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    render: function() {
      this.pickadate.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
      this.setMax();
    },

    setMax: function() {
      this.state.set({
        // If it doesn't exist set it to 'undefined'. Otherwise it will break the filters
        max: this.state.get('end_date') || this.defaults.max
      }, { silent: true });
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.pickadate.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.pickadate.$el;
    }

  });

})(this.App);
