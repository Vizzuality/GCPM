(function(App) {

  'use strict';

  App.Controller.Map = function() {};

  _.extend(App.Controller.Map.prototype, {

    index: function(params) {
      var initialState = {};
      if (!params.data) {
        initialState.data = 'projects';
      }
      new App.Presenter.Map(Object.assign(params, initialState));
    }

  });

})(this.App);
