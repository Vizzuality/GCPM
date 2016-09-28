(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CancerTypesList = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CancerTypesList.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.renderComponents();
      this.setSubscriptions();
    },

    renderComponents: function() {
      this.cancerTypesList = new App.Collection.CancerTypes();
      this.cancerTypesList.fetch()
        .done(function() {
          this.cancerTypes = _.sortBy(this.cancerTypesList.toJSON(), 'name');
          this.state.set({ 'cancerTypes': this.cancerTypes });

          this.searchInput = new App.Presenter.SearchInput({
            fullList: this.cancerTypes,
            options: {
              placeholder: 'Type the cancer type_'
            }
          });
          this.searchList = new App.Presenter.SearchList({
            list: this.cancerTypes,
            type: 'cancer_types'
          });
        }.bind(this));
    },

    setSubscriptions: function() {
      App.on('SearchInput:change', this.handleSearchValue.bind(this));
      this.state.on('change', function() {
        App.trigger('SearchList:change', this.state.get('filteredCancerTypes'));
      }.bind(this));
    },

    handleSearchValue: function(filteredCancerTypes) {
      this.state.set({ filteredCancerTypes: filteredCancerTypes });
    }

  });

})(this.App);
