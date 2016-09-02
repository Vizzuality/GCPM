(function(App) {

  'use strict';

  /**
   * Between the router and the controllers, there is the Dispatcher listening
   * for routing events. On such events, it loads the target controller,
   * creates an instance of it and calls the target action.
   * The action is actually a method of the controller.
   * The previously active controller is automatically disposed.
   */
  App.Dispatcher = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Dispatcher.prototype, {

    initialize: function() {
      this.params = new (Backbone.Model.extend());
      this.router = new App.Router();

      this.params.on('change', this._updateUrl, this);
      this.router.once('route', this._runAction, this);

      // Global event to update params from external actions
      App.on('Router:update', _.bind(this._updateFromParams, this));
    },

    getState: function() {
      return this.params.attributes;
    },

    /**
     * Facilitates mapping URLs to controller actions
     * based on a user-defined configuration file.
     * It is responsible for observing and acting upon URL changes.
     * @param  {String} routeName
     * @param  {Array} routeParams
     */
    _runAction: function(routeName, routeParams) {
      var routeSplited = routeName.split('#');
      var controllerName = routeSplited[0];
      var actionName = routeSplited[1];
      var controller = this._getController(controllerName);

      this._updateFromQuery(routeParams[0]);

      if (controller) {
        var action = this._getAction(controller, actionName);
        if (action) {
          action(this.getState());
        } else {
          console.error('specified action doesn\'t exist');
        }
      } else {
        console.error('specified controller doesn\'t exist');
      }
    },

    _updateFromQuery: function(queryParams) {
      this.params.set(this.router.unserializeParams(queryParams));
      App.trigger('Router:change', this.getState());
    },

    _updateFromParams: function(params) {
      this.params.set(params, { silent: true });
      this._updateUrl();
    },

    _updateUrl: function() {
      this.router.updateUrl(this.getState());
      App.trigger('Router:change', this.getState());
    },

    _getController: function(controllerName) {
      if (App.Controller[controllerName] &&
        App.Controller.hasOwnProperty(controllerName)) {
        return new App.Controller[controllerName]();
      }
    },

    _getAction: function(controller, actionName) {
      if (controller[actionName] &&
        typeof controller[actionName] === 'function') {
        return controller[actionName];
      }
    }

  });

})(this.App);
