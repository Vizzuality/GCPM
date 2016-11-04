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
      this.commonActions();
    },

    /**
     * Facilitates mapping URLs to controller actions
     * based on a user-defined configuration file.
     * It is responsible for observing and acting upon URL changes.
     * @param  {String} routeName
     * @param  {Object} routeParams
     */
    runAction: function(routeName, routeParams) {
      if (!routeName) {
        return;
      }

      var routeSplited = routeName.split('#');
      var controllerName = routeSplited[0];
      var actionName = routeSplited[1];
      var controller = this._getController(controllerName);

      if (controller) {
        var action = this._getAction(controller, actionName);
        if (action) {
          action(routeParams);
        } else {
          console.error('specified action doesn\'t exist');
        }
      } else {
        console.error('specified controller doesn\'t exist');
      }
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
    },

    commonActions: function() {
      new App.View.MobileHeader();
      new App.Presenter.UserMenu();
      new App.Presenter.Footer();
    }

  });

})(this.App);
