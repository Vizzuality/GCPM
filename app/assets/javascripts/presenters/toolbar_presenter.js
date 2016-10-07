(function(App) {

  'use strict';

  App.Presenter.Toolbar = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Toolbar.prototype, {

    initialize: function(params) {
      this.toolbar = new App.View.Toolbar({ el: '#toolbar' });
      this.setEvents();
    },

    setEvents: function() {
      this.toolbar.on('action', function(actionName) {
        App.trigger('Toolbar:action', actionName);
      }, this);
    }

  });

})(this.App);
