(function(App) {

  'use strict';

  App.Controller.Map = function() {};

  _.extend(App.Controller.Map.prototype, {

    index: function(params) {
      var initialState = {};

      if (!params.data) {
        initialState.data = 'projects';
      }

      initialState = Object.assign(params, initialState);

      App.trigger('Router:update', initialState);

      new App.Presenter.Map(initialState);
    }

  });

})(this.App);
