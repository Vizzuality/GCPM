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
      'map': 'Map#index',
      'network/:id': 'User#index',

      'projects/:id': 'Projects#index',
      'network/:id/projects/:val/edit': 'Projects#new',
      'network/:id/projects/:val': 'Projects#new',
      'network/:id/projects/new': 'Projects#new',
      'network/:id/projects/edit': 'Projects#new',
      'network/:id/projects': 'Projects#new',

      'events/:id': 'Events#index',
      'network/:id/events/:val/edit': 'Events#new',
      'network/:id/events/:val': 'Events#new',
      'network/:id/events/new': 'Events#new',
      'network/:id/events/edit': 'Events#new',
      'network/:id/events': 'Events#new',

      'countries': 'Countries#index',
      'countries/:iso': 'Countries#show'
    },

    initialize: function() {
      // We are going to save params in model
      this.params = new (Backbone.Model.extend());
      // Listening events
      this.params.on('change', _.bind(this.updateUrl, this));
      // Global event to update params from external actions
      App.Events.on('params:update', _.bind(this.updateParams, this));
    },

    /**
     * Get URL params
     * @return {Object}
     */
    getParams: function(routeParams) {
      return this._unserializeParams(routeParams);
    },

    /**
     * Update model with new params
     * @param  {Object} params
     */
    updateParams: function(params) {
      this.params.clear().set(params, { silent: true });
      this.updateUrl();
    },

    /**
     * Change URL with current params
     */
    updateUrl: function() {
      var url = location.pathname.slice(1) + this._serializeParams();
      this.navigate(url, { trigger: false });
    },

    /**
     * Transform URL string params to object
     * @param  {String} routeParams
     * @return {Object}
     * @example https://medialize.github.io/URI.js/docs.html
     */
    _unserializeParams: function(routeParams) {
      var params = {};
      if (typeof routeParams === 'string' && routeParams.length) {
        var uri = new URI('?' + routeParams);
        params = uri.search(true);
      }
      return params;
    },

    /**
     * Transform object params to URL string
     * @return {String}
     * @example https://medialize.github.io/URI.js/docs.html
     */
    _serializeParams: function() {
      var uri = new URI();
      uri.search(this.params.attributes);
      return uri.search();
    }

  });

})(this.App);
