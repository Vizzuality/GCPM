(function(App) {

  'use strict';

  App.View.SearchList = Backbone.View.extend({

    template: HandlebarsTemplates['search_list'],

    initialize: function(settings) {
      this.el = settings && settings.el;
      this.list = (settings && settings.list) || {};

      this.render();
    },

    render: function() {
      this.$el.html(this.template({ regions: this.list }));
      return this;
    },

    updateData: function(list) {
      if (list && list instanceof Array) {
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
