(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.SearchInput = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SearchInput.prototype, {

    initialize: function() {
      this.state = new StateModel();

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

      // this.state.on('change', this.triggerChange.bind(this));
    },

    handleKeyup: function(ev) {
      // this.state.set({ 'searchValue':  ev.value });
      App.trigger('SearchInput:change', ev.value);
    },

    triggerChange: function() {
      // App.trigger('SearchInput:change', this.state.get('searchValue'));
    }


  });

})(this.App);
