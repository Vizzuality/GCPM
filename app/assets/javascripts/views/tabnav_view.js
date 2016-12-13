(function(App) {

  'use strict';

  App.View.TabNav = Backbone.View.extend({

    events: {
      'click li > a': 'onClickItem'
    },

    onClickItem: function(e) {
      e.preventDefault();
      var $el = $(e.currentTarget);
      var dataType = $el.data('datatype');
      this.setActive({ data: dataType });
      this.trigger('change', dataType);
    },

    setActive: function(data) {
      this.$el.find('a[data-datatype="' + data.data + '"]').addClass('-active')
        .parent().siblings().find('a').removeClass('-active');
    },

    updateUrl: function(url) {
      var uri = new URI(url);
      var urlParams = uri.query(true);
      this.$el.find('a').each(function(i, el) {
        uri.query(_.extend({}, urlParams, {
          data: el.getAttribute('data-datatype')
        }));
        el.setAttribute('href', uri.toString());
      });
    },

    setMessagesBadge: function(data) {
      var $messagesBadge = $('.messages-badge');
      var unreadCount = data.unreadCount;

      if (unreadCount > 0) {
        gon.unreadCount = data.equal ? unreadCount : unreadCount - 1;
        $messagesBadge.toggleClass('-hidden', false);

        $messagesBadge.text(gon.unreadCount <= 9 ? gon.unreadCount : '9+');
      } else {
        gon.unreadCount = 0;
      }

      $messagesBadge.toggleClass('-hidden', gon.unreadCount === 0);
    }

  });

})(this.App);
