(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.UserDropdownMenu = Backbone.View.extend({

    el: '.user-avatar',

    model: new (Backbone.Model.extend({
      defaults: {
        hidden: true
      }
    })),

    events: {
      'click': 'setHidden'
    },

    initialize: function() {
      this.cache();
      this.listeners();
    },

    cache: function() {
      this.$dropdownMenu = this.$el.find('.js-user-dropdown-menu');
      this.$document = $(document);
    },

    listeners: function(){
      this.model.off('change:hidden');
      this.model.on('change:hidden', this.changeHidden.bind(this));
    },

    // UI Events
    setHidden: function(e) {
      var hidden = this.model.get('hidden');
      this.model.set('hidden', !hidden);
    },

    // Changes
    changeHidden: function() {
      this.$dropdownMenu.toggleClass('-open', !this.model.get('hidden'));
      !this.model.get('hidden') ? this.setBindings() : this.unsetBindings() ;
    },

     /**
     * BINDINGS
     * - setBindings
     * - unsetBindings
     */
    setBindings: function() {
      this.$document.on('click.user-dropdown', function(e) {
        if(!this.el.contains(e.target) && this.el !== e.target) {
          this.model.set('hidden', true);
        }
      }.bind(this));
    },

    unsetBindings: function() {
      this.$document.off('click.user-dropdown');
    }

  });

})(this.App);
