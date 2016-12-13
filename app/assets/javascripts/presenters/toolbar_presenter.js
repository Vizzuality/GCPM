(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Toolbar = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Toolbar.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.toolbar = new App.View.Toolbar({
        el: '#toolbar'
      });
      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setEvents: function() {
      this.state.on('change', this.setActiveFilters, this);

      this.toolbar.on('action', function(actionName) {
        App.trigger('Toolbar:action', actionName);
      }, this);
    },

    setSubscriptions: function() {
      App.on('Router:change Breadcrumbs:change FilterForm:change Map:change', this.setState, this);
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    setActiveFilters: function() {
      var filters = _.pick(this.getState(), 'countries[]', 'cancer_types[]',
        'organization_types[]', 'organizations[]', 'project_types[]',
        'start_date', 'end_date');

      var activeFilters = _.filter(filters, function(value){
        var active;
        // If they are arrays
        if (_.isArray(value)) {
          active = value.length
          return !!active;
        }
        return value != null
      }).length;

      this.toolbar.updateActiveFilters(activeFilters);
    }



  });

})(this.App);
