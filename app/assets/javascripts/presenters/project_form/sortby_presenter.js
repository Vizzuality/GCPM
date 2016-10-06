(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.SortBy = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SortBy.prototype, {

    defaults: {
      label: 'Sort By',
      showHeader: true,
      class: '-sortby'
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();

      this.setState({ name: 'Title asc', value: 'title_asc', open: false });
      // Creating view
      this.dropdown = new App.View.Dropdown({
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
      this.dropdown.on('change', this.setState, this);
      this.state.on('change', function() {
        var newState = { sortby: this.state.attributes.value };
        App.trigger('SortBy:change', newState);
        this.render();
      }, this);
    },

    setOptions: function(){
      var options = [
        { name: 'Title asc', value: 'title_asc'},
        { name: 'Title desc', value: 'title_desc'},
        { name: 'Created asc', value: 'created_asc'},
        { name: 'Created desc', value: 'created_desc'}
      ];

      this.dropdown.setOptions(options);
    },

    render: function() {
      this.dropdown.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state) {
      this.state.set(state);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.dropdown.setElement(el);
      this.dropdown.render();
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.dropdown.$el;
    }

  });

})(this.App);
