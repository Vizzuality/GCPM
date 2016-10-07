(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({

    defaults: {
      sortby: 'title_asc'
    }

  });

  App.Presenter.SortBy = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SortBy.prototype, {

    initialize: function(params, viewSettings) {
      this.state = new StateModel(_.pick(params, 'sortby'));

      var dropdownOptions = _.map([
        { name: 'Title asc', value: 'title_asc' },
        { name: 'Title desc', value: 'title_desc'},
        { name: 'Created asc', value: 'created_asc'},
        { name: 'Created desc', value: 'created_desc'}
      ], function(opt) {
        opt.selected = this.state.get('sortby') === opt.value;
        return opt;
      }, this);

      // Creating view
      this.dropdown = new App.View.Dropdown({
        el: '#sortby',
        options: _.extend({}, {
          label: 'Sort by',
          className: '-sortby',
          options: dropdownOptions,
        }, viewSettings || {})
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.dropdown.on('change', this.onDropdownChange, this);
      this.state.on('change', function() {
        App.trigger('SortBy:change', this.getState());
      }, this);
    },

    onDropdownChange: function(current) {
      var newState = {
        sortby: current.value
      };
      this.setState(newState);
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state) {
      var newState = _.pick(state, 'sortby');
      this.state.set(state);
    },

    getState: function() {
      return this.state.attributes;
    }

  });

})(this.App);
