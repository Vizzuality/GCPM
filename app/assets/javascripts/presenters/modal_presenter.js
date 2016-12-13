(function(App) {

  'use strict';

  App.Presenter.Modal = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Modal.prototype, {

    initialize: function() {
      this.modal = new App.View.Modal();
    },

    open: function(content) {
      this.modal.open(content);
    },

    close: function() {
      this.modal.close();
    }

  });

})(this.App);
