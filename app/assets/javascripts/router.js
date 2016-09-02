(function(App) {

  'use strict';

  App.Router = Backbone.Router.extend({

    /**
     * Inspired by Rails, we have a routes file that specifies these routes
     * and any additional route parameters.
     * @type {Object}
     */
    routes: {
      '': 'Home#index',
      'map': 'Map#index'
    },

    /**
     * Change URL with current params
     * @param  {Object} params
     */
    updateUrl: function(params) {
      var uri = new URI();
      uri.query(this.serializeParams(params));
      this.navigate(uri.path().slice(1) + uri.search(), { trigger: false });
    },

    /**
     * Transform URL string params to object
     * @param  {String} paramsQuery
     * @return {Object}
     * @example https://medialize.github.io/URI.js/docs.html
     */
    unserializeParams: function(paramsQuery) {
      var params = {};
      if (typeof paramsQuery === 'string' && paramsQuery.length) {
        var uri = new URI('?' + paramsQuery);
        params = uri.search(true);
      }
      return params;
    },

    /**
     * Transform object params to URL string
     * @param  {Object} params
     * @return {String}
     * @example https://medialize.github.io/URI.js/docs.html
     */
    serializeParams: function(params) {
      var uri = new URI();
      uri.search(params);
      return uri.search();
    }

  });

})(this.App);
