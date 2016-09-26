(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CountriesList = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CountriesList.prototype, {

    defaults: {
      fuseOptions: {
        caseSensitive: false,
        includeScore: false,
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        maxPatternLength: 0,
        keys: ['name']
      }
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.setFullCountriesListByRegions();
      this.setSubscriptions();

      this.searchInput = new App.Presenter.SearchInput();
      // this.searchList = new App.Presenter.SearchList();
    },

    setFullCountriesListByRegions: function() {
      this.countriesList = new App.Collection.Countries();
      this.countriesList.fetch()
        .done(function() {
          this.countries = _.groupBy(this.countriesList.toJSON(), 'region_name');
          this.state.set({ 'countries': this.countries });
        }.bind(this));
    },

    setSubscriptions: function() {
      App.on('SearchInput:change', this.handleSearchValue.bind(this));
      this.state.on('change', function() {
        App.trigger('filteredCountries:change', this.state.get('filteredCountries'));
      }.bind(this));
    },

    handleSearchValue: function(value) {
      this.value = value;
      this.getFilteredList();
    },

    getFilteredList: function() {
      var result = [];

      if (this.value !== '') {
        _.each(this.countries, function(regionCountries, region) {
          var fuse = new Fuse(regionCountries, this.defaults.fuseOptions);
          result = result.concat(fuse.search(this.value));
        }.bind(this));

        this.state.set({ filteredCountries: result });
      } else { this.state.set({ filteredCountries: null }); }
    }

  });

})(this.App);
