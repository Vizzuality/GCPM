(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CountriesList = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CountriesList.prototype, {

    initialize: function() {
      this.state = new StateModel();

      this.cache();
      this.renderComponents();
      this.setSubscriptions();
    },

    cache: function() {
      this.$spinner = $('.c-spinner');
    },

    renderComponents: function() {
      this.countriesList = new App.Collection.Countries();
      this.countriesList.fetch()
        .done(function() {
          this.$spinner.hide();

          this.countries = _.groupBy(
            _.sortBy(this.countriesList.toJSON(), 'region_name'),
            'region_name');
          this.state.set({ 'countries': this.countries });

          this.searchInput = new App.Presenter.SearchInput({
            fullList: this.countries,
            options: {
              placeholder: 'Type the country name_'
            }
          });
          this.searchList = new App.Presenter.SearchList({
            list: this.countries,
            type: 'countries'
          });
        }.bind(this));
    },

    setSubscriptions: function() {
      App.on('SearchInput:change', this.handleSearchValue.bind(this));
      this.state.on('change', function() {
        App.trigger('SearchList:change', this.state.get('filteredCountries'));
      }.bind(this));
    },

    handleSearchValue: function(filteredCountries) {
      this.state.set({ filteredCountries: filteredCountries });
    }

  });

})(this.App);
