/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ActionLayerMobile = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ActionLayerMobile.prototype, {

    initialize: function() {
      this.state = new StateModel({ active: false });

      this.layerBtn = new App.View.ActionLayerMobile({
        el: '#layersBtn'
      });

      this.setSubscriptions();
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    setSubscriptions: function() {
      this.state.on('change', this.toogleButton.bind(this));
      this.layerBtn.on('click', this.setActive.bind(this));
    },

    setActive: function() {
      var active = { active: !this.state.get('active') || true };
      this.setState(active);
    },

    toogleButton: function() {
      App.trigger('Actionbar:layers');
    }

  });

})(this.App);
