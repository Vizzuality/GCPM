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
      this.list = list && list instanceof Array ?
        { '': list } :
        list || {};
      this.render();
    }

  });

})(this.App);
