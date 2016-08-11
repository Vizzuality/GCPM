(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.Helper.CartoOptions = App.Helper.Class.extend({

    defaults: {},

    initialize: function(settings) {
      this.layer = settings.layer;
      this.options = settings.options;
    },

    /* Returns cartodb layer options */
    getCartoOptions: function() {
      return {
        sql: this.templateString('queries/' + this.layer, this.options),
        cartocss: this.templateString('cartocss/' + this.layer, this.options)
      };
    },

    /* Transforms psql & cartocss into string by handlebars */
    templateString(path, options) {
      return HandlebarsTemplates[path](options);
    }

  });

})(this.App);
