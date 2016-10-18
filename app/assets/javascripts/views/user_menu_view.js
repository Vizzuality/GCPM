(function(App) {

  'use strict';

  App.View.UserMenu = Backbone.View.extend({

    events: {
      'click': 'handleUserMenu'
    },

    initialize: function() {
      this.setEvents();
    },

    setEvents: function() {
      $(document).on('click', this.handleDocumentClick.bind(this));
    },

    handleDocumentClick: function(e) {
      var isContained = this.el.contains(e.target);
      !isContained && this.trigger('close', this);
    },

    handleUserMenu: function() {
      this.trigger('click', this);
    }

  });

})(this.App);
