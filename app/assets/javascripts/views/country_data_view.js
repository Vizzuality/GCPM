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

      this.cache();
    },

    cache: function() {
      this.$spinner = this.$el.closest('.l-content').find('.c-spinner');
    },

    setOptions: function(data) {
      this.data = data;
    },

    render: function() {
      this.hideSpinner();

      this.$el.html(this.template(this.data));
      return this;
    },

    hideSpinner: function() {
      this.$spinner && this.$spinner.hasClass('-start') &&
        this.$spinner.toggleClass('-start', false);
    }

  });

})(this.App);
