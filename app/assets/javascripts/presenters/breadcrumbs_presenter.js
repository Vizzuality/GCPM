(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Breadcrumbs = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Breadcrumbs.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.breadcrumbs = new App.View.Breadcrumbs({ el: '#breadcrumbs' });

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setState: function(params) {
      params.global = 'all'; // Always show global link
      this.state
        .clear({ silent: true })
        .set(_.pick(params, 'global', 'region', 'country'));
    },

    getState: function() {
      return this.state.attributes;
    },

    setEvents: function() {
      this.breadcrumbs.on('change', function(breadcrumb) {
        var newState = {};

        if(breadcrumb.key === 'country'){
          newState.country = breadcrumb.value;
          newState.region = this.getState().region;
        }
        else if(breadcrumb.key === 'region'){
          newState.region = breadcrumb.value;
        }
         this.setState(newState);
       }, this);
      this.state.on('change', function() {
        this.renderBreadcrumbs();
        App.trigger('Breadcrumbs:change', this.getState());
      }, this);
    },

    setSubscriptions: function() {
      App.on('Router:change', this.setState, this);
      App.on('Map:change', this.setState, this);
    },

    renderBreadcrumbs: function() {
      var data = [];
      _.each(this.getState(), function(value, key) {
        data.push({ link: '?' + key + '=' + value, name: key, value: value });
      });
      this.breadcrumbs.updateData(data);
    }

  });

})(this.App);
