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
        this.data = data;
        this.drawCountries(true);
        this.searchListeners();
      }.bind(this));
    },

    drawCountries(regions, countries) {
      let countriesList = [];

      if (regions) {
        countriesList = this.data;
        this.el.innerHTML = '';
      } else {
        countriesList = [{
          name: '',
          countries, countries
        }];
      }
      countriesList.map(function(region) {
        const html = this.template(region);
        regions ? this.el.innerHTML += html : this.el.innerHTML = html;
      }.bind(this));
    },

    searchListeners() {
      const search = $('#search');
      const options = {
        caseSensitive: false,
        includeScore: false,
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 10,
        maxPatternLength: 0,
        keys: ['name']
      };
      const regions = this.data;
      const self = this;

      search.on('focus', function() {
        this.setSelectionRange(0, this.value.length);
      });

      search.on('keyup', function() {
        const token = this.value;
        let result = [];

        if (token !== '') {
          regions.map(function(region) {
            const countries = region.countries;
            const fuse = new Fuse(countries, options);
            result = result.concat(fuse.search(token));
          }.bind(this));

          self.drawCountries(false, result);
        } else {
          this.value = 'Type the country name_';
          self.drawCountries(true);
        }
      });
    }

  });

})(this.App);
