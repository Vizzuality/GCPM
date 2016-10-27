(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationEdit = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationEdit.prototype, {

    defaults: {
      disabled: true
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();

      // Creating view
      this.input = new App.View.Input({
        el: viewSettings.DOMelement,
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {

    },

    setSubscriptions: function(){

    },


    render: function() {
      this.input.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    setValue: function(value){
      this.input.$el.find("input").val(value).trigger("change");
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.input.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.input.$el;
    }

  });

})(this.App);
