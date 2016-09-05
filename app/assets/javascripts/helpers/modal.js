(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.Helper.Modal = Backbone.View.extend({

    events: {
      'click .js-btn-modal-close' : 'hide',
      'click': 'onClickBackdrop'
    },

    initialize: function() {
      this.model = new (Backbone.Model.extend({
        defaults: {
          hidden: true
        }
      }));

      // All the methods that has _ is because they belong to the Parent View
      this._cache();
      this._listeners();
    },

    _listeners: function() {
      this.model.off('change:hidden');
      this.model.on('change:hidden', this.changeHidden, this);
    },

    _cache: function() {
      this.$window = $(window);
      this.$document = $(document);
      this.$body = $('body');
      this.$htmlbody = $('html, body');

      this.$content =        this.$el.find('.modal-content');
      this.$contentWrapper = this.$el.find('.modal-wrapper');
      this.$backdrop =       this.$el.find('.modal-backdrop');
      this.$close =          this.$el.find('.modal-close');
    },

    onClickBackdrop: function(e) {
      if(e.target === e.currentTarget) {
        this.hide();
      }
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
      this.$el.toggleClass('-active', !hidden);
    },


    /**
     * UI EVENTS
     * - show
     * - hide
     */
    show: function(isFilterEvents) {
      this.hideEventsFields(!!isFilterEvents);
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
      // document keyup
      this.$document.on('keyup.modal', _.bind(function(e) {
        if (e.keyCode === 27) {
          this.hide();
        }
      },this));
      // backdrop
      this.$backdrop.on('click', _.bind(function() {
        this.hide();
      },this));
    },

    unsetBindings: function() {
      this.$document.off('keyup.modal');
      this.$backdrop.off('click');
    },

    hideEventsFields: function(hide) {
      (hide) ? this.$content.find('.grid-filters .c-select:not(:first)').hide() : this.$content.find('.grid-filters .c-select:not(:first)').show();
    }

  });

})(this.App);
