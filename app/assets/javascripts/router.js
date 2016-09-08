(function(App) {

  'use strict';

  App.Router = Backbone.Router.extend({

    /**
     * Inspired by Rails, we have a routes file that specifies these routes
     * and any additional route parameters.
     * @type {Object}
     */
    routes: {
      'map': 'Map#index',
      'network/:id/projects/new': 'Project#new'
    },

    initialize: function() {
      this.params = new (Backbone.Model.extend());

      // Start!
      this.startHistory();

      // Setting listeners
      this.setSubscriptions();
      this.setEvents();

      // Setting firs state
      this.setParams();
    },

    setEvents: function() {
      this.params.on('change', this.updateUrl, this);
      this.on('route', function() {
        this.setParams();
        App.trigger('Router:change', this.getParams());
      }, this);
    },

    setSubscriptions: function() {
      App.on('Map:change', this.setParams, this);
      App.on('TabNav:change', this.setParams, this);
    },

    startHistory: function() {
      if (!Backbone.History.started) {
        Backbone.history.start({ pushState: true });
      }
    },

    /**
     * Setting new params and update it
     * @param {Object} params
     */
    setParams: function(params) {
      var uri = new URI();
      var newParams = params ?
        Object.assign(uri.search(true), params) : uri.search(true);
      this.params.clear({ silent: true }).set(newParams);
    },

    /**
     * Namespace to get current params
     */
    getParams: function() {
      return this.params.attributes;
    },

    /**
     * Get current fragment url
     * @return {[type]} [description]
     */
    getCurrent: function() {
      var Router = this;
      var fragment = Backbone.history.getFragment().split('?')[0];
      var routes = _.pairs(Router.routes);
      var matched = _.find(routes, function(handler) {
        var route = handler[0];
        // Convert the route to RegExp using the
        // Backbone Router's internal convert
        // function (if it already isn't a RegExp)
        route = _.isRegExp(route) ? route :  Router._routeToRegExp(route);
        // Test the regexp against the current fragment
        return route.test(fragment);
      });
      return this.routes[matched[0]];
    },

    /**
     * Change URL with current params
     */
    updateUrl: function() {
      var uri = new URI();
      uri.query(this._serializeParams(this.getParams()));
      this.navigate(uri.path().slice(1) + uri.search(), { trigger: false });
    },

    /**
     * Transform URL string params to object
     * @param  {String} paramsQuery
     * @return {Object}
     * @example https://medialize.github.io/URI.js/docs.html
     */
    _unserializeParams: function(paramsQuery) {
      var params = {};
      if (typeof paramsQuery === 'string' && paramsQuery.length) {
        var uri = new URI();
        uri.query(paramsQuery);
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
    _serializeParams: function(params) {
      var uri = new URI();
      uri.search(params);
      return uri.search();
    }

  });

})(this.App);
