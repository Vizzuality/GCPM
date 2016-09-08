(function(App) {

  'use strict';

  App.View.Textarea = Backbone.View.extend({

    defaults: {
    },

    template: HandlebarsTemplates['textarea'],

    initialize: function(settings) {
      this.el = settings.el;
      this.options = _.extend({}, this.defaults, settings.options || {});
      this.render();
    },

    render: function() {
      this.$el.html(this.template(this.options));
    }

  });

})(this.App);
