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
    }

  });

})(this.App);
