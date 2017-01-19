(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.SignUp = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SignUp.prototype, {

    initialize: function() {
      this.state = new StateModel();

      this.share = new App.View.SignUp({
        el: '.l-main'
      });
    }
  });

})(this.App);
