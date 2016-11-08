(function(App) {

  'use strict';

  App.Controller.Posts = function() {};

  _.extend(App.Controller.Posts.prototype, {

    show: function(params) {
      new App.View.ShareButton({ el: '.js-share-button' });
      new App.Presenter.Share(params);
    }

  });

})(this.App);
