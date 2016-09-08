(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.TitleInput = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.TitleInput.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.titleInput = new App.View.Input(params);
    }

  });

})(this.App);
