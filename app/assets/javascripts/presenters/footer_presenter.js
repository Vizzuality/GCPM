/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Footer = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Footer.prototype, {

    initialize: function() {
      this.state = new StateModel();
      this.userManualDownload = new App.View.UserManualDownload({
        el: '#userManualDownload'
      });
      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.userManualDownload.on('download', function(){
        ga('send', 'event', 'Download', 'User Manual');
      }.bind(this))
    },

    setSubscriptions: function() {
    }
  });

})(this.App);
