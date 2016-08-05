(function(App) {

  'use strict';

  App.View = {};
  App.View.Modal = Backbone.View.extend({

    events: {
      'click .js-btn-modal-close': 'close',
      'click .js-modal-backdrop': 'close'
    },

    defaults: {
      defaultContent: null
    },

    template: HandlebarsTemplates['modal'],

    initialize: function(settings) {
      this.options = _.extend({}, this.defaults, settings.options || {});
      // It will open modal if defaultContent exists
      if (this.options.defaultContent) {
        this.currentContent = this.options.defaultContent;
        this.open();
      }
      this.setListeners();
    },

    /**
     * Settings global events
     */
    setListeners: function() {
      App.Events.on('Modal:open', _.bind(this.open, this));
      App.Events.on('Modal:close', _.bind(this.close, this));

      // Keyboard events
      $(document).on('keyup.modal', _.bind(function(e) {
        if (e.keyCode === 27) {
          this.close();
        }
      }, this));
    },

    /**
     * Open/show modal window
     * if htmlContent is not specified,
     * we are going to use last currentContent
     * @param  {String} htmlContent
     */
    open: function(htmlContent) {
      this.currentContent = htmlContent || this.currentContent;
      this.render();
      this.el.classList.add('-open');
    },

    /**
     * Close/hide modal window
     */
    close: function() {
      this.el.classList.remove('-open');
      this.clear();
    },

    /**
     * Render html in element
     */
    render: function() {
      if (!this.currentContent) {
        console.error('"content" attribute should exist.');
      } else if (typeof this.currentContent !== 'string') {
        console.error('"content" attribute should be string.');
      } else {
        this.$el.html(this.template({ content: this.currentContent }));
      }
      return this;
    },

    /**
     * Clear content in element
     */
    clear: function() {
      this.$el.html(null);
      return this;
    }

  });

})(this.App);
