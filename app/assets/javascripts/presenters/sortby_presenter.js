/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var dataSpecs = {
    projects: [
      { name: 'Title (A-Z)', value: 'title_asc' },
      { name: 'Title (Z-A)', value: 'title_desc' },
      { name: 'Submitted Date (Most recent to earliest)', value: 'created_asc' },
      { name: 'Submitted Date (Earliest to most recent)', value: 'created_desc' }
    ],
    people: [
      { name: 'Name (A-Z)', value: 'title_asc' },
      { name: 'Name (Z-A)', value: 'title_desc' },
      { name: 'Submitted Date (Most recent to earliest)', value: 'created_asc' },
      { name: 'Submitted Date (Earliest to most recent)', value: 'created_desc' }
    ],
    events: [
      { name: 'Start Date (Most recent to earliest)', value: 'start_date_asc' },
      { name: 'Start Date (Earliest to most recent)', value: 'start_date_desc' },
      { name: 'Title (A-Z)', value: 'title_asc' },
      { name: 'Title (Z-A)', value: 'title_desc' }
    ],
  };

  App.Presenter.SortBy = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SortBy.prototype, {
    initialize: function(params, viewSettings) {
      var sortby = _.pick(params, 'sortby');

      this.state = new StateModel(_.extend({},
        { sortby: params.data && params.data === 'events' ? 'start_date_desc' : 'title_asc' },
        sortby, _.pick(params, 'data')));

      this.dropdownOptions = _.map(dataSpecs[params.data || 'projects'], function(opt) {
        opt.selected = this.state.get('sortby') === opt.value;
        return opt;
      }, this);

      // Creating view
      this.dropdown = new App.View.Dropdown({
        el: '#sortby',
        options: _.extend({}, {
            label: 'Sort by',
            className: '-sortby',
            contentClassName: gon.isMobile && '-top',
            options: this.dropdownOptions,
            arrows: false
          },
          viewSettings || {})
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.dropdown.on('change', this.onDropdownChange, this);
      this.state.on('change', function() {
        App.trigger('SortBy:change', this.getState());
      }, this);

      App.on('TabNav:change', function() {
        this.setState(_.extend({}, this.getState(),
          { sortby: this.state.get('data') === 'events' ? 'start_date_desc' : 'title_asc' }
        ));

        var options = _.map(dataSpecs[this.state.get('data') || 'projects'], function(opt) {
          opt.selected = this.state.get('sortby') === opt.value;
          return opt;
        }, this);

        this.dropdown.setOptions(options);
      }.bind(this));
    },

    setSubscriptions: function() {
      var eventsNames = [
        'Router:change', 'Map:change', 'TabNav:change',
        'FilterForm:change', 'Breadcrumbs:change', 'Legends:change'
      ].join(' ');

      App.on(eventsNames, function(newState) {
        var localState = _.pick(this.getState(), 'sortby');
        this.setState(_.extend({}, this.getState(), localState, newState), { silent: true })
      }, this);
    },

    onDropdownChange: function(current) {
      var newState = {};
      var sortby = current.value;

      newState = { sortby: sortby };

      var localState = _.pick(this.getState(), 'sortby');
      this.setState(_.extend({}, this.getState(), localState, newState));
      ga('send', 'event', 'Map', 'Sort by', this.state.get('sortby'));
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state
        .clear({ silent: true })
        .set(state, options);
    },

    getState: function() {
      return this.state.attributes;
    },

    splitSortby: function(newSortby) {
      var sortby = newSortby.split('_');
      return {
        type: sortby[0],
        direction: sortby[1]
      }
    }

  });

})(this.App);
