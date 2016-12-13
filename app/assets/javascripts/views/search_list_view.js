(function(App) {

  'use strict';

  App.View.SearchList = Backbone.View.extend({

    initialize: function(settings) {
      this.el = settings && settings.el;
      this.options = settings && settings.options;
      this.list = (settings && settings.list) || {};
      this.type = (settings && settings.type) || 'countries';
      this.template = HandlebarsTemplates[this.type + '_list'];

      this.render(this.options && this.options.blank);
    },

    render: function(blank) {
      var obj = this.options && this.options.keepOriginal ?
        { items: blank ? [] : this.list } :
        { groups: this.list };

      this.$el.html(this.template(obj));
      return this;
    },

    updateData: function(list) {
      if (list && list instanceof Array &&
        (!this.options || !this.options.keepOriginal)) {
        this.list = list.length !== 0 ?
          { '': list } :
          null;
      } else {
        this.list = list ? list : null;
      }

      this.render();
    }

  });

})(this.App);
