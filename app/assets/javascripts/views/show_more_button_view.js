(function(App) {

  'use strict';

  App.View.ShowMoreButton = Backbone.View.extend({

    events: {
      'click a.js-circle-button': 'nextPage'
    },

    template: HandlebarsTemplates['show_more_button'],

    initialize: function() {
      this.render();
      this.page = 1;
    },

    render: function() {
      this.$el.html(this.template({ url: '' }));
      return this;
    },

    nextPage: function() {
      this.page += 1;
    },

    setURI: function(params) {
      params.page = this.page;
      var url = Object.keys(params).map(function(k) {
          return encodeURIComponent(k) + '=' + encodeURIComponent(params[k])
      }).join('&');
      this.$el.html(this.template({ url: url }));
    }

  });

})(this.App);
