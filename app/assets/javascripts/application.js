//= require jquery2
//= require jquery_ujs
//= require underscore
//= require backbone
//= require handlebars
//= require leaflet
//= require URIjs
//= require fuse
//= require select2
//= require pickadate/picker
//= require pickadate/picker.date

//= require_self

//= require dispatcher
//= require router

//= require_tree ./models
//= require_tree ./collections
//= require_tree ./presenters
//= require_tree ./helpers
//= require_tree ./templates
//= require_tree ./views
//= require_tree ./controllers
//= require_tree ./facades
//= require_tree ./lib

this.App = {
  facade: {},
  Helper: {},
  Model: {},
  Collection: {},
  Controller: {},
  Presenter: {},
  View: {}
};

_.extend(App, Backbone.Events);

/**
 * Dispatcher will be instanced here
 *
 */
function initApp() {
  var router = new App.Router();
  var dispatcher = new App.Dispatcher();

  router.once('route', function() {
    dispatcher.runAction(router.getCurrent(), router.getParams());
  });

  // Start!
  router.startHistory();
}

document.addEventListener('DOMContentLoaded', initApp)
