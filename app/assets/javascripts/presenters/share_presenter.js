(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Share = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Share.prototype, {

    initialize: function() {
      this.state = new StateModel();

      this.share = new App.View.Share();
      this.modal = new App.View.Modal();

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.share.on('cancel', this.closeShare, this);
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {
      App.on('Actionbar:save', function() {
        this.openShare();
      }, this);
    },

    /**
     * Setting form state
     * @param {Object} newState
     */
    setState: function(newState) {
      this.state.set(newState);
    },

    /**
     * Open modal and render form inside
     */
    openShare: function() {
      this.modal.open(this.share);
      this.renderShare();
    },

    /**
     * Close form and modal
     */
    closeShare: function() {
      this.modal.close();
    },

    /**
     * Fetch all presenters and render all children
     */
    renderShare: function() {
      this.share.render();
    }

  });

})(this.App);
