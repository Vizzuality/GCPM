(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UserMenu = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UserMenu.prototype, {

    initialize: function() {
      this.state = new StateModel();
      this.userMenu = new App.View.UserMenu();

      this.setState({ active: false });
      this.setSubscriptions();
    },

    setSubscriptions: function() {
      this.state.on('change', this.toggleUserMenu.bind(this));
      this.userMenu.on('click', this.handleUserMenu.bind(this));
    },

    setState: function(params) {
      this.state.set(params);
    },

    handleUserMenu: function(element) {
      var active = this.state.get('active');
      this.setState({ active: !active });
    },

    toggleUserMenu: function() {
      var active = this.state.get('active');
      var element = this.userMenu.$el.find('.c-user-menu');
      active ?
        element.attr('style', 'display:flex') :
        element.attr('style', 'display:none')
    }

  });

})(this.App);
