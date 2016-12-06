(function(App) {

  'use strict';

  App.Controller.Posts = function() {};

  _.extend(App.Controller.Posts.prototype, {

    show: function(params) {
      new App.View.ShareButton({ el: '.js-share-button' });
      new App.Presenter.Share(params);
    },

    new: function(params) {
      new App.Presenter.PostFormPresenter(params);
    }

  });

})(this.App);
