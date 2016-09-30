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
        uri.query(Object.assign(urlParams, {
          data: el.getAttribute('data-datatype')
        }));
        el.setAttribute('href', uri.toString());
      });
    }

  });

})(this.App);
