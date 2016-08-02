// (function(App) {

//   'use strict';

//   App.View = App.View || {};

//   App.View.MobileHeader = Backbone.View.extend({

//     el: '.c-header',

//     events: {
//       'click .js-hamburger-menu': 'toggleDrawer'
//     },

//     initialize: function() {
//       this.drawer = document.querySelector('.js-mobile-drawer');
//     },

//     toggleDrawer: function(e) {
//       e.preventDefault();
//       this.drawer.classList.toggle('-opened');
//     }

//   });

// })(this.App);



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
      !this.model.get('hidden') ? this.setBindings() : this.unsetBindings() ;
    },

     /**
     * BINDINGS
     * - setBindings
     * - unsetBindings
     */
    setBindings: function() {
      this.$document.on('click.mobile-menu', function(e) {
        if(!this.el.contains(e.target) && this.el !== e.target) {
          this.model.set('hidden', true);
        }
      }.bind(this));
    },

    unsetBindings: function() {
      this.$document.off('click.mobile-menu');
    }

  });

})(this.App);
