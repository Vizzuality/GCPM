(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.SearchInput = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SearchInput.prototype, {

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
      this.fullList = params.fullList;

      this.searchInput = new App.View.Input({
        el: '#search-input',
        options: {
          name: 'title',
          class: 'js-search-list',
          inputClass: 'c-title -bigger -bold',
          type: 'text',
          placeholder: 'Type the country name_'
        }
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      this.searchInput.on('keyup', this.handleKeyup.bind(this));

      this.state.on('change', function() {
        var filteredCountries = this.state.get('filteredCountries');
        if (filteredCountries) {
          App.trigger('SearchInput:change', filteredCountries, this);
        }
      }.bind(this));
    },

    handleKeyup: function(ev) {
      this.searchValue = ev.value;
      this.getFilteredList();
    },

    getFilteredList: function() {
      var result = [];
      if (this.searchValue !== '') {
        _.each(this.fullList, function(regionCountries, region) {
          var fuse = new Fuse(regionCountries, this.defaults.fuseOptions);
          result = result.concat(fuse.search(this.searchValue));
        }.bind(this));

        this.state.set({ filteredCountries: result });
      } else { this.state.set({ filteredCountries: this.fullList }); }
    }

  });

})(this.App);
