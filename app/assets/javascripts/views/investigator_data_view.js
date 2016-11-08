(function(App) {

  'use strict';

  App.View.InvestigatorData = Backbone.View.extend({

    defaults: {
    },

    events: {
    },

    template: HandlebarsTemplates['investigator_data'],

    initialize: function(settings) {
      var opts = settings && settings.options;
      opts = opts || new Object();
      this.options = _.extend({}, this.defaults, opts);
      this.data = {};

      this.render();
    },

    setOptions: function(data) {
      this.data = data;
    },

    render: function() {
      this.$el.html(this.template(this.data));
      return this;
    }

  });

})(this.App);
