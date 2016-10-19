(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.SubmitButton = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SubmitButton.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.submitButton = new App.View.SubmitButton({ el: '.project_add'});
    },

    render: function() {
      this.submitButton.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    }

  });

})(this.App);
