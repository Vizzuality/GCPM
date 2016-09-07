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

    start: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({ pushState: true });
      }
    },

    initialize: function() {
      this.params = new (Backbone.Model.extend());

      this.updateParams();
      this.start();

      App.on('Router:update', this.updateUrl, this);

      this.params.on('change', function() {
        App.trigger('Router:change', this.getParams());
      }, this);
    },

    updateParams: function() {
      var uri = new URI();
      this.params
        .clear({ silent: true })
        .set(uri.search(true));
    },

    getCurrent: function() {
      return this.routes[Backbone.history.getFragment().split('?')[0]];
    },

    getParams: function() {
      return this.params.attributes;
    },

    /**
     * Change URL with current params
     * @param  {Object} params
     * @param  {Object} options
     */
    updateUrl: function(params, options) {
      var settings = Object.assign({ trigger: false }, options || {});
      var uri = new URI();
      this.params.set(params || {});
      uri.query(this.serializeParams(this.params.attributes));
      this.navigate(uri.path().slice(1) + uri.search(), settings);
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
