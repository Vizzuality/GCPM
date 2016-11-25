/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ActionLegendMobile = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ActionLegendMobile.prototype, {

    initialize: function() {
      this.state = new StateModel({ active: false });

      this.legendBtn = new App.View.ActionLegendMobile({
        el: '#legendBtn'
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
      this.legendBtn.on('click', this.setActive.bind(this));
    },

    setActive: function() {
      var active = { active: !this.state.get('active') || true };
      this.setState(active);
    },

    toogleButton: function() {
      App.trigger('Action:legend');
    }

  });

})(this.App);
