(function(App) {

  'use strict';

  App.Controller.Search = function() {};

  _.extend(App.Controller.Search.prototype, {

    index: function(params) {
      new App.Presenter.Search();
    }

  });

})(this.App);
