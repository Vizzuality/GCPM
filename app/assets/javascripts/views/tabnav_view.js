(function(App) {

  'use strict';

  App.View.TabNav = Backbone.View.extend({

    events: {
      'click li > a': 'onClickItem'
    },

    initialize: function() {
    },

    onClickItem: function(e) {
      e.preventDefault();
      var el = $(e.currentTarget);
      var value = el.data('type');
      this.setActive({ data: value });
      this.trigger('change', value);
    },

    setActive: function(state) {
      this.$el.find('a').removeClass('-active');
      this.$el.find('a[data-type="' + state.data + '"]').addClass('-active');
    }

  });

})(this.App);
