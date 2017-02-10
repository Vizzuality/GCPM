(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Notifications = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Notifications.prototype, {

    initialize: function() {
      this.state = new StateModel({ open: false });

      this.notifications = new App.View.Notifications({
        el: '#notifications'
      });

      this.setEvents();
    },

    setEvents: function() {
      this.state.on('change', this.toggleDropdown, this);
      this.notifications.on('toggle', this.handleToggle, this);
      this.notifications.on('close', this.handleClose, this);
    },

    setState: function(newState) {
      this.state
        .set(newState);
    },

    handleToggle: function() {
      var newState = _.extend({}, this.state.attributes, { open: !this.state.get('open')} );
      this.setState(newState);
    },

    handleClose: function() {
      if (this.state.get('open')) {
        var newState = _.extend({}, this.state.attributes, { open: false } );
        this.setState(newState);
      }
    },

    toggleDropdown: function() {
      this.notifications.toggleDropdown(this.state.get('open'));
    }

  });

})(this.App);
