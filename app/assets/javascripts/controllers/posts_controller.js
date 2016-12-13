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
    },

    edit: function(params) {
      var newParams = _.extend({}, params, gon.server_params);
      new App.Presenter.PostFormPresenter(newParams);
    }

  });

})(this.App);
