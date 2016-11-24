(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ToolbarMobile = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ToolbarMobile.prototype, {

    initialize: function(params) {
      this.state = new StateModel({ active: false });

      this.toolbarMobile = new App.View.ToolbarMobile({
        el: '#tools'
      });

      this.setEvents();
    },

    setEvents: function() {
      this.state.on('change', this.toggleTools, this);
      this.toolbarMobile.on('click', this.setActive.bind(this));
    },

    setState: function(newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    setActive: function() {
      this.setState({ active: !this.state.get('active') });
    },

    toggleTools: function() {
      this.toolbarMobile.toggleTools(this.state.get('active'));
    }

  });

})(this.App);
