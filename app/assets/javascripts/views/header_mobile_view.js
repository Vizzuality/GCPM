(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.HeaderMobile = Backbone.View.extend({

    events: {
      'click .js-hamburger-menu': 'handleClick'
    },

    initialize: function() {
      this.cache();
      this.setEvents();
    },

    cache: function() {
      this.$menuBtn = this.$el.find('.js-hamburger-menu');
      this.$menuMobile = this.$el.next('.c-menu-mobile');
      this.$menuCloseBtn = this.$menuMobile.find('.js-menu-close');
    },

    setEvents: function() {
      this.$menuCloseBtn.on('click', this.handleClick.bind(this));
    },

    handleClick: function() {
      this.trigger('click');
    },

    toogleMenu: function(active) {
      this.$menuMobile.toggleClass('-active', active);
    }

  });

})(this.App);
