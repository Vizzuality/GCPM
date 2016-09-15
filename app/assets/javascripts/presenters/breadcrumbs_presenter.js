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

      this.setState(params);
      this.setEvents();
      this.setSubscriptions();
      this.breadcrumbs.render();
    },

    setState: function(params) {
      this.state
        .clear({ silent: true })
        .set(_.pick(params, 'region', 'country'));
      console.log(this.state.attributes);
    },

    getState: function() {
      return this.state.attributes;
    },

    setEvents: function() {
      this.breadcrumbs.on('change', function(breadcrumb) {
        console.log(breadcrumb);
        // var newState = {};
        // _.each(breadcrumb, function(b) {
        //   newState[b] = b;
        // });
        // console.log(newState);
        // this.setState(newState);
      }, this);
      this.state.on('change', function() {
        console.log(this.state.attributes);
        // App.trigger('Breadcrumbs:change', this.getState());
      }, this);
    },

    setSubscriptions: function() {
      App.on('Router:change', function(state) {
        this.setState(state);
      }, this);
    }

  });

})(this.App);
