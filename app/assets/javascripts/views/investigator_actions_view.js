(function(App) {

  'use strict';

  App.View.InvestigatorActions = Backbone.View.extend({

    events: {
      'click .js-btn-toggle-message': 'triggerToggle'
    },

    initialize: function() {
      this.cache();
    },

    cache: function() {
      this.$buttons = this.$el.find('.js-btn-toggle-message');
      this.$forms = this.$el.find('.js-form-message');

    },

    triggerToggle: function(e) {
      e && e.preventDefault();
      var $current = $(e.currentTarget);
      var user = null;
      if (!$current.hasClass('-active')) {
        user = $current.data('user');
      }

      this.trigger('toggle', user);
    },

    toggleForm: function(user) {
      var $currentBtn = this.$buttons.filter('[data-user='+ user +']');
      var $currentForm = this.$el.find('#form-message-'+ user);
      
      this.$buttons.toggleClass('-active', false);
      this.$forms.toggleClass('-active', false);

      $currentBtn.toggleClass('-active', true);
      $currentForm.toggleClass('-active', true);
    }

  });

})(this.App);
