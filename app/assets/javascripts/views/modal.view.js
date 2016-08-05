(function(App) {

  'use strict';

  App.View = {};
  App.View.Modal = Backbone.View.extend({

    events: {},

    defaults: {
      defaultContent: null
    },

    template: HandlebarsTemplates['modal'],

    initialize: function(settings) {
      this.options = _.extend({}, this.defaults, settings.options);
      if (typeof this.options.defaultContent !== 'string') {
        throw new Error('"content" attribute should be string.');
      }
      if (this.options.defaultContent) {
        this.currentContent = this.options.defaultContent;
        this.render();
      }
      this.setListeners();
    },

    setListeners: function() {
      App.Events.on('Modal:open', this.open.bind(this));
    },

    open: function(htmlContent) {
      this.currentContent = htmlContent;
      this.render();
    },

    render: function() {
      if (!this.currentContent || typeof this.currentContent !== 'string') {
        throw new Error('"content" attribute should be string.');
      }
      this.$el.html(this.template(this.currentContent));
      return this;
    }

  });

})(this.App);
