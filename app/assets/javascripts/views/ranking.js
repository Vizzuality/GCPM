(function(App) {

  'use strict';

  App.View.Ranking = Backbone.View.extend({

    defaults: {
    },

    events: {
      'click .js-btn-info': 'onClickInfo',
    },

    template: HandlebarsTemplates['ranking'],

    initialize: function(settings) {
      var opts = settings && settings.options;
      opts = opts || new Object();
      this.options = _.extend({}, this.defaults, opts);

      this.cache();
    },

    cache: function() {
      this.$spinner = this.$el.closest('.l-content').find('.c-spinner');
    },

    setData: function(model, data, name) {
      this.name = name;
      this.data = data;
      this.model = model;
    },

    render: function() {
      this.hideSpinner();
      this.$el.html(this.template({
        name: this.name,
        data: this.data
      }));
      return this;
    },

    hideSpinner: function() {
      this.$spinner && this.$spinner.hasClass('-start') &&
        this.$spinner.toggleClass('-start', false);
    },

    onClickInfo: function() {
      var info = this.model.info;
      this.trigger('info', info);
    },

  });

})(this.App);
