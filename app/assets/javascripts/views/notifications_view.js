(function(App) {

  'use strict';

  App.View.Notifications = Backbone.View.extend({

    events: {
      'click .js-action-notifications': 'handleClick',
      'click .list li': 'handleClick'
    },

    initialize: function() {
      this.cache();
      this.setEvents();
    },

    cache: function() {
      this.content = this.$el.find('.dropdown-content');
    },

    setEvents: function() {
      $(document).on('click', this.handleDocumentClick.bind(this));
    },

    handleClick: function(e) {
      var isDropdown = this.el.getElementsByClassName('dropdown-content')[0].contains(e.target);
      if (!isDropdown) {
        this.trigger('toggle');
      } else {
        // var target = $(e.target);
        // var item = target.is('li') ? target : target.closest('li');
        // item.hasClass('-unread') && item.toggleClass('-unread', false);
      }
    },

    toggleDropdown: function(open) {
      this.content.toggleClass('-open', open);
    },

    handleDocumentClick: function(e) {
      if (this.el) {
        var isContained = this.el.contains(e.target);
        !isContained && this.trigger('close', this);
      }
    },

  });

})(this.App);
