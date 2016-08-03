
(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MobileHeader = Backbone.View.extend({

    el: '.c-header',

    model: new (Backbone.Model.extend({
      defaults: {
        hidden: true
      }
    })),

    events: {
      'click .js-hamburger-menu': 'setHidden'
    },

    initialize: function() {
      this.cache();
      this.listeners();
    },

    cache: function() {
      this.$mobileMenu = this.$el.find('.js-mobile-drawer');
      this.$menuItems = this.$el.find('.js-mobile-drawer li');
      this.$document = $(document);
    },

    listeners: function(){
      this.model.off('change:hidden');
      this.model.on('change:hidden', this.changeHidden.bind(this));
      /* To change model status when redirecting to another route &
        allow mobile menu to open next time */
      this.$menuItems.on('click', this.setHidden.bind(this));
    },

    // UI Events
    setHidden: function(e) {
      var hidden = this.model.get('hidden');
      this.model.set('hidden', !hidden);
    },

    // Changes
    changeHidden: function() {
      this.$mobileMenu.toggleClass('-opened', !this.model.get('hidden'));
    }

  });

})(this.App);
