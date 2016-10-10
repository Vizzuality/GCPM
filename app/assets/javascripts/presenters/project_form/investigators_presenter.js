(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Investigators = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Investigators.prototype, {

    defaults: {
      multiple: true,
      name: 'investigators[]',
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

      // Creating view
      this.select = new App.View.Select({
        el: '#investigators',
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
      this.select.on('new', function(){
        App.trigger('Investigators:new');
      }, this);

      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('Investigators:change', this.state.attributes);
      }, this);

    },

    setSubscriptions: function(){
      App.on('InvestigatorForm:submit', function(newState){
        newState.name = newState.investigatorName;
        this.investigators.push(newState);
        this.select.addNew(this.investigators.at(this.investigators.length-1));
      }, this);
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
