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
      'network/:id/projects/:val/edit': 'Editproject#index',
      'network/:id/projects/new': 'Editproject#index',
      'network/:id/projects/edit': 'Editproject#index'
    },

    initialize: function() {
      // We are going to save params in model
      this.params = new (Backbone.Model.extend());
      // Listening events
      this.on('route', this.runController);
      this.params.on('change', _.bind(this.updateUrl, this));
      // Global event to update params from external actions
      App.Events.on('Router:update', _.bind(this.updateParams, this));
    },

    /**
     * Facilitates mapping URLs to controller actions
     * based on a user-defined configuration file.
     * It is responsible for observing and acting upon URL changes.
     * @param  {String} routeName
     * @param  {Array} routeParams
     */
    runController: function(routeName, routeParams) {
      var routeSplited = routeName.split('#');
      var controllerName = routeSplited[0];
      var actionName = routeSplited[1];
      var params = this.getParams(routeParams[0]);
      if (App.Controller[controllerName] &&
        App.Controller.hasOwnProperty(controllerName)) {
        var currentController = new App.Controller[controllerName]();
        // Checking if action exists
        if (currentController[actionName] &&
          typeof currentController[actionName] === 'function') {
          // Setting new params in model
          this.updateParams(params);
          // Executing controller#action and passing url params
          currentController[actionName](this.params.attributes);
        } else {
          console.error('specified action doesn\'t exist');
        }
      } else {
        console.error('specified controller doesn\'t exist');
      }
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
    },

    /**
     * Change URL with current params
     */
    updateUrl: function() {
      var url = location.pathname.slice(1) + '?' + this._serializeParams();
      this.navigate(url, { trigger: false });
    },

    /**
     * Transform URL string params to object
     * @param  {String} routeParams
     * @return {Object}
     */
    _unserializeParams: function(routeParams) {
      var params = {};
      if (typeof routeParams === 'string' && routeParams.length) {
        params = App.Helper.Utils.getParams(routeParams);
      }
      return params;
    },

    /**
     * Transform object params to URL string
     * @return {String}
     */
    _serializeParams: function() {
      return $.param(this.params.attributes);
    }

  });

})(this.App);
