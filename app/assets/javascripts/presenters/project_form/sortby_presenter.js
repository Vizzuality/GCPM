(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.SortBy = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SortBy.prototype, {

    defaults: {
      multiple: false,
      name: 'sortBy',
      label: 'Sort By',
      placeholder: null,
      blank: null,
      addNew: false,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear
         minimumResultsForSearch: Infinity
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();

      // Creating view
      this.select = new App.View.Select({
        el: '#sortby',
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
        var newState = { sortby: this.state.attributes.value };
        App.trigger('SortBy:change', newState);
      }, this);
      this.select.on('change', this.setState, this);
    },

    setOptions: function(){
      var options = [
        { name: 'Title asc', value: 'title_asc'},
        { name: 'Title desc', value: 'title_desc'},
        { name: 'Created asc', value: 'created_asc'},
        { name: 'Created desc', value: 'created_desc'}
      ];

      this.select.setOptions(options);
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
