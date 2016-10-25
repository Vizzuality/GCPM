/* global URI */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Download = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Download.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.download = new App.View.Download({
        el: '#download'
      });
      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        var state = this.getState(),
            uri = new URI(),
            is_projects = (state.data === 'projects');


        uri.query(state);
        this.download.toggleBtn(is_projects);
        this.download.updateUrl('/api/map/download' + uri.search());
      }, this);
    },

    setSubscriptions: function() {
      var eventsNames = [
        'Router:change', 'Map:change', 'TabNav:change',
        'SortBy:change', 'FilterForm:change',
        'Breadcrumbs:change'
      ].join(' ');
      App.on(eventsNames, this.setState, this);
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(newState, options) {
      this.state
        .clear({ silent: true})
        .set(newState, options);
    },

    getState: function() {
      return this.state.attributes;
    }

  });

})(this.App);
