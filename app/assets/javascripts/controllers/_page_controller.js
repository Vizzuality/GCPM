(function(App) {

  'use strict';

  /**
   * Backbone way to create a Class
   * @param {Object} options
   */
  var Controller = function(options) {
    _.extend(this, options);
    this._instanceCommonViews();
    this.initialize.apply(this, arguments);
  };

  _.extend(Controller.prototype, Backbone.Events, {});

  Controller.extend = Backbone.Router.extend;

  /**
   * Page Controller Class
   */
  App.Controller = App.Controller || {};

  App.Controller.Page = Controller.extend({

    initialize: function() {},

    /**
     * Instance common and global view here
     * @return {[type]} [description]
     */
    _instanceCommonViews() {
      new App.View.MobileHeader();
      new App.View.Notice();
      new App.View.UserDropdownMenu();
      new App.View.Modal({ el: '#modalView' });
    }

  });


})(this.App);
