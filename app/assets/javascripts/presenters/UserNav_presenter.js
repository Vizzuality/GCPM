(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UserNav = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UserNav.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.tabnav = new App.View.UserNav({ el: '#UserNav' });
    }

  });


})(this.App);