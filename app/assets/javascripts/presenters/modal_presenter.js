(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Modal = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Modal.prototype, {

    initialize: function() {
      console.log('init Modal');
    }

  });

})(this.App);
