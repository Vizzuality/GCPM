(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.PickadateEnd = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.PickadateEnd.prototype, {

    defaults: {
      name: 'end_date',
      label: 'End date',
      min: new Date(1905,1,1),
      max: new Date(2040,1,1)
    },

    initialize: function(params, viewSettings) {
      this.state = new StateModel();

      // Creating view
      this.pickadate = new App.View.PickadateNew({
        el: '#pickadate-end',
        options: _.extend({}, this.defaults, viewSettings || {})
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        console.log(this.state.attributes);
        App.trigger('PickadateEnd:change', this.state.attributes);
      }, this);

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
    setState: function(state) {
      var result = {};
      result[state.name] = state.pick;
      this.state.set(result);
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
