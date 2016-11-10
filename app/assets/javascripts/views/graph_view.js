(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.Chart = Backbone.View.extend({

    model: new (Backbone.Model.extend()),

    defaults: {
      color: {
        pattern: ['#68299b', '#5aade4', '#f57823']
      }
    },

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({
        bindto: this.el
      }, this.defaults, opts);

      this.render();
    },

    render: function() {
      this.chart = c3.generate(this.options);
    }

  });

})(this.App);
