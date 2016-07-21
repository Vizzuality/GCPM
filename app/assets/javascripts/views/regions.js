(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.Regions = Backbone.View.extend({

    el: '#regions-list',

    defaults: {},

    template: HandlebarsTemplates['countries-list'],

    initialize: function(settings) {
      if (!this.el) {
        return;
      }

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);
      this.regions = settings.regions;

      this.drawCountriesTable();
    },

    drawCountriesTable: function() {
      this.regions.fetch().done(function(data) {
        this.regionsList = data;

        data.map(function(region) {
          const html = this.template(region);

          this.el.innerHTML += html;
        }.bind(this));
      }.bind(this));


    }

  });

})(this.App);
