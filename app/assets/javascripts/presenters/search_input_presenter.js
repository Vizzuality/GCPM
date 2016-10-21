/* global Fuse */
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
      this.fullList = params.fullList instanceof Array ?
        { '': params.fullList } :
        params.fullList;

      this.searchInput = new App.View.Input({
        el: '#search-input',
        options: {
          name: 'title',
          class: 'js-search-list',
          inputClass: '-large',
          type: 'text',
          placeholder: params.options.placeholder
        }
      });

      this.setSubscriptions();
      this.focusInput();
    },

    setSubscriptions: function() {
      this.searchInput.on('keyup', this.handleKeyup.bind(this));

      this.state.on('change', function() {
        var filteredList = this.state.get('filteredList');
        if (filteredList) {
          App.trigger('SearchInput:change', filteredList, this);
        }
      }.bind(this));
    },

    focusInput: function() {
      this.searchInput.$el.find('input').focus();
    },

    handleKeyup: function(ev) {
      this.searchValue = ev.value;
      this.getFilteredList();
    },

    getFilteredList: function() {
      var result = [];
      if (this.searchValue !== '') {
        _.each(this.fullList, function(groups) {
          var fuse = new Fuse(groups, this.defaults.fuseOptions);
          result = result.concat(fuse.search(this.searchValue));
        }.bind(this));

        this.state.set({ filteredList: result });
      } else { this.state.set({ filteredList: this.fullList }); }
    }

  });

})(this.App);
