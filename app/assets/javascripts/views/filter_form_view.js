(function(App) {

  'use strict';

  App.View.FilterForm = Backbone.View.extend({

    template: HandlebarsTemplates['filter_form'],

    events: {
      'click .js-filter-form-cancel': 'triggerCancel',
      'submit form': 'triggerSubmit'
    },

    initialize: function(settings) {
      this.inputs = (settings && settings.inputs) || {};
    },

    render: function() {
      this.$el.html(this.template());

      // Rebinding elements and events
      _.each(this.inputs, function(presenter) {
        presenter.setElement(presenter.getElement().selector);
      }, this);

      return this;
    },

    triggerCancel: function() {
      this.trigger('cancel');
    },

    triggerSubmit: function(e) {
      if (e) {
        e.preventDefault();
      }
      this.trigger('submit', this.serializeForm());
    },

    /**
     * Using URI.js lib to serialize form
     * @return {Object}
     */
    serializeForm: function() {
      var searchString = this.$el.find('form').serialize();
      var uri = new URI().search(searchString);
      return uri.search(true);
    }

  });

})(this.App);
