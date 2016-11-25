(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Header = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Header.prototype, {

    initialize: function() {
      this.state = new StateModel({ active: false });

      this.header = new App.View.HeaderMobile({
        el: '.l-header'
      });

      this.avatar = new App.View.MobileUserMenu({
        el: '.c-menu-mobile'
      });

      this.setEvents();
    },

    setEvents: function() {
      this.state.on('change', this.toggleMenu.bind(this));
      this.header.on('click', this.setState, this);
    },

    setState: function() {
      this.state.set({ active: !this.state.get('active') });
    },

    toggleMenu: function() {
      var active = this.state.get('active');
      this.header.toogleMenu(active);

      if (!active) {
        this.avatar.toogleToDefaultContent();
      }
    }

  });

})(this.App);
