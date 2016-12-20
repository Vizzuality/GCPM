/* global URI */
(function(App) {

  'use strict';

  App.Router = Backbone.Router.extend({

    /**
     * Inspired by Rails, we have a routes file that specifies these routes
     * and any additional route parameters.
     * @type {Object}
     */
    routes: {
      '(/)':                                       'Home#index',
      'map(?*query)(/)':                           'Map#index',
      'projects/:slug(/)':                         'Project#show',
      'events/:slug(/)':                           'Events#show',
      'network/:id/projects/new(/)':               'Project#new',
      'network/:network_id/projects/:id/edit(/)':  'Project#edit',
      'countries(/)':                              'Countries#index',
      'countries/:iso(/)':                         'Countries#show',
      'investigators/:slug(/)':                    'Investigators#show',
      'organizations/:slug(/)':                    'Organizations#show',
      'cancer-types(/)':                           'CancerTypes#index',
      'cancer-types/:slug(/)':                     'CancerTypes#show',
      'network/:id(/)':                            'Users#show',
      'posts/new(/)':                              'Posts#new',
      'posts/:id(/)':                              'Posts#show',
      'posts/:id/edit(/)':                         'Posts#edit',
      'search(/)':                                 'Search#index',
      'network/:id/events(/)':                     'Events#index',
      'network/:id/events/new(/)':                 'Events#new',
      'network/:id/events/:id/edit(/)':            'Events#edit'
    },

    initialize: function() {
      this.params = new (Backbone.Model.extend());

      // Setting listeners
      this.setSubscriptions();
      this.setEvents();
    },

    setEvents: function() {
      this.params.on('change', this.updateUrl, this);
      this.on('route', function(routeName, params) {
        this.setParams({ vars: params.splice(0, params.length - 1) });
        App.trigger('Router:change', this.getParams());
      }, this);
    },

    setSubscriptions: function() {
      var eventsNames = [
        'Map:change', 'TabNav:change',
        'SortBy:change', 'FilterForm:change',
        'Breadcrumbs:change', 'Timeline:change'
      ].join(' ');
      App.on(eventsNames, this.setParams, this);
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
        _.extend({}, uri.search(true), params) : uri.search(true);
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
      var Router = this,
        fragment = Backbone.history.getFragment(),
        routes = _.pairs(Router.routes),
        route = null,
        matched;

      matched = _.find(routes, function(handler) {
        route = _.isRegExp(handler[0]) ? handler[0] : Router._routeToRegExp(handler[0]);
        return route.test(fragment);
      });

      if(matched) {
        // NEW: Extracts the params using the internal
        // function _extractParameters
        // params = Router._extractParameters(route, fragment);
        route = matched[1];
      }

      return route;
    },

    /**
     * Change URL with current params
     */
    updateUrl: function() {
      var uri = new URI();
      var params = _.omit(this.getParams(), 'vars', 'dataSingular', 'userId', 'group', 'direction', 'type', 'dataType');
      uri.query(this._serializeParams(params));
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
      params = _.pick(params, function(value) {
        return value != null
      });

      uri.search(params);
      return uri.search();
    }

  });

})(this.App);
