(function(App) {

  'use strict';

  App.View.CountryData = Backbone.View.extend({

    defaults: {
    },

    events: {
    },

    template: HandlebarsTemplates['country_data'],

    initialize: function(settings) {
      var opts = settings && settings.options;
      opts = opts || new Object();
      this.options = _.extend({}, this.defaults, opts);
    },

    setOptions: function(data) {
      this.data = data;
    },

    render: function() {
      console.log(this.$el);
      this.$el.html(this.template(this.data));
      return this;
    }

  });

})(this.App);
