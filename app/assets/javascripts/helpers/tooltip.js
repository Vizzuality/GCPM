(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.Helper.Tooltip = Backbone.View.extend({

    model: new (Backbone.Model.extend({
      defaults: {
        hidden: true
      }
    })),

    initialize: function() {
      // All the methods that has _ is because they belong to the Parent View
      this._cache();
      this._listeners();
    },

    _listeners: function() {
      this.model.on('change:hidden', this.changeHidden, this);
    },

    _cache: function() {
      this.$document = $(document);
    },

    /**
     * MODEL CHANGES
     * -changeHidden
     */
    changeHidden: function() {
      var hidden = !!this.model.get('hidden');

      // Set bindings
      (hidden) ? this.unsetBindings() : this.setBindings();
      // Toggle states
      this.$el.toggleClass('-opened', !hidden);
    },


    /**
     * UI EVENTS
     * - show
     * - hide
     * - toggle
     */
    show: function() {
      this.model.set('hidden', false);
    },

    hide: function() {
      this.model.set('hidden', true);
    },

    toggle: function() {
      var hidden = this.model.get('hidden');
      this.model.set('hidden', !hidden);
    },


    /**
     * BINDINGS
     * - setBindings
     * - unsetBindings
     */
    setBindings: function() {
      this.$document.on('click', _.bind(function(e) {
        if(e.target !== this.initiator && this.el !== e.target &&
          !$.contains(this.el, e.target)) {
          this.hide();
        }
      },this));
    },

    unsetBindings: function() {
      this.$document.off('click');
    }

  });

})(this.App);
