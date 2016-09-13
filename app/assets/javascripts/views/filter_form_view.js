(function(App) {

  'use strict';

  App.View.FilterForm = Backbone.View.extend({

    template: HandlebarsTemplates['filter_form'],

    initialize: function(settings) {
      this.inputs = settings.inputs || {};
    },

    render: function() {
      this.$el.html(this.template());

      _.each(this.inputs, function(presenter, key) {
        var $input = this.$el.find('#input-' + key);
        if ($input && $input.length) {
          presenter.setElement($input).render();
        }
      }, this);

      return this;
    }

  });

})(this.App);
