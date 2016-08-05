
(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.Notice = Backbone.View.extend({

    el: '.c-notice',

    events: {
      'click #js-close' : '_closeNotice'
    },

    initialize: function() {
      if (this.el) {
        window.setTimeout(this._hideNotice.bind(this), 3000);
      }
    },

    _closeNotice: function() {
      this.$el.remove();
    },

    _hideNotice: function() {
      this.$el.addClass('-hidden');
    }

  });

})(this.App);
