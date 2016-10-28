(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Actionbar = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Actionbar.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.actionbar = new App.View.Actionbar({ el: '#actionbar' });

      this.setEvents();
      this.setSubscriptions();
      this.setState(params);
    },

    setEvents: function() {
      this.state.on('change', this.render, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change', this.setState, this)
    },

    setState: function(state) {
      this.state.set(state);
    },

    render: function() {
      var data = _.extend({}, this.state.attributes, this.setData());
      this.actionbar.render(data);
      App.trigger('Actionbar:change', this.state.attributes);
    },

    setData: function() {
      var data = this.state.attributes;
      var user = gon.server_params.user || null;
      switch(data.data) {
        case 'projects':
          return {
            visible: true,
            name: 'Project',
            link: (user) ? '/network/'+ user + '/projects/new' : '/users/sign_in'
          }

        case 'people':
          return {
            visible: false
          }

        case 'events':
          return {
            visible: true,
            name: 'Event',
            link: (user) ? '/network/'+ user + '/events/new' : '/users/sign_in'
          }
      }
    }

  });

})(this.App);
