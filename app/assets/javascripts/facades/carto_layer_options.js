(function(App) {

  'use strict';


  var cartoLayerOptionsFacade = {

    /* Return cartodb layer options */
    getCartoOptions: function(params) {
      this.layer = params.layer;
      this.options = params.options;

      return {
        sql: this.templateString('layers_list/queries/' + this.layer, this.options),
        cartocss: this.templateString('layers_list/cartocss/' + this.layer, this.options)
      };
    },

    /* Transforms psql & cartocss into string by handlebars */
    templateString: function(path, options) {
      return HandlebarsTemplates[path](options);
    }
  };

  App.facade.cartoLayerOptions = _.extend(cartoLayerOptionsFacade, Backbone.Events);

})(this.App);
