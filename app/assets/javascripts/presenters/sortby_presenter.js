/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({

    defaults: {
      sortby: 'title_asc',
      type: 'title',
      direction: 'asc'
    }

  });

  App.Presenter.SortBy = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SortBy.prototype, {
    initialize: function(params, viewSettings) {
      var sortby = _.pick(params, 'sortby');
      var specs = sortby.sortby && _.extend(this.splitSortby(sortby.sortby)) || {};
      this.state = new StateModel(_.extend(specs, sortby, _.pick(params, 'data')));

      var dropdownOptions = _.map([
        { name: 'Title', value: 'title' },
        { name: 'Created', value: 'created'}
      ], function(opt) {
        opt.selected = this.state.get('sortby').split('_')[0] === opt.value;
        return opt;
      }, this);

      // Creating view
      this.dropdown = new App.View.Dropdown({
        el: '#sortby',
        options: _.extend({}, {
          label: 'Sort by',
          className: '-sortby',
          contentClassName: gon.isMobile && '-top',
          options: dropdownOptions,
          arrows: true,
          direction: specs.direction
        }, viewSettings||{})
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
    },

    setSubscriptions: function() {
      var eventsNames = [
        'Router:change', 'Map:change', 'TabNav:change',
        'FilterForm:change', 'Breadcrumbs:change', 'Legends:change'
      ].join(' ');

      App.on(eventsNames, function(newState) {
        var localState = _.pick(this.getState(), 'type', 'direction', 'sortby');
        this.setState(_.extend({}, this.getState(), localState, newState), { silent: true })
      }, this);
    },

    onDropdownChange: function(current) {
      var newState = {};
      var sortby = '';

      if (current.arrows) {
        var direction = this.state.get('direction') === 'asc' ? 'desc' : 'asc';
        sortby = this.state.get('type') + '_' + direction ;

        newState = { type: this.state.get('type'), direction: direction, sortby: sortby };

      } else {
        var type = current.value;
        sortby =  type + '_' + this.state.get('direction') ;

        newState = { type: type, sortby: sortby, direction: this.state.get('direction') };

      }

      var localState = _.pick(this.getState(), 'type', 'direction', 'sortby');
      this.setState(_.extend({}, this.getState(), localState, newState))
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
