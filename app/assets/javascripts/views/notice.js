
(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.Notice = Backbone.View.extend({

    el: '.c-notice',

    initialize: function() {
      if (this.el) {
        window.setTimeout(this._hideNotice.bind(this), 3000);
      }
    },

    _hideNotice: function() {
      console.log('hide');
      this.$el.addClass('-hidden');
    }

  });

})(this.App);
