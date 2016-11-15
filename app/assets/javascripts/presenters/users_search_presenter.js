
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UsersSearch = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UsersSearch.prototype, {

    initialize: function() {
      this.state = new StateModel();

      this.searchInput = new App.View.Input({
        el: '#search-input',
        options: {
          name: 'title',
          class: 'js-search-list',
          inputClass: '-no-bd',
          type: 'text',
          placeholder: 'Search User by name...'
        }
      });

      this.searchList = new App.Presenter.SearchList({
        list: this.users,
        type: 'users',
        options: {
          blank: true,
          keepOriginal: true
        }
      });

      this.setSubscriptions();
      this.cache();
    },

    cache: function() {
      this.$searchIcon = $('.icon-search');
      this.$closeIcon = $('.icon-close');
    },

    setSubscriptions: function() {
      this.searchInput.on('keyup', this.handleKeyup.bind(this));

      this.state.on('change', function() {
        App.trigger('SearchList:change', this.state.get('filteredUsers'));
      }.bind(this));

    },

    handleKeyup: function(ev) {
      var searchValue = ev.value;

      if (searchValue === '') {
        this.handleEmpty(true);
      } else if (searchValue.length === 1) {
        this.handleEmpty(false);
      }

      this.handleSearchValue(searchValue);
    },

    handleSearchValue: function(value) {
      if (value && value != '') {
        $.ajax({
          url: '/api/users?q=' + value,
          method: 'GET',
          success: function(data) {
            this.state.set({ filteredUsers: data });
          }.bind(this)
        });
      } else {
        this.state.set({ filteredUsers: [] });
      }
    },

    handleEmpty: function(value) {
      this.$searchIcon.toggleClass('-hidden', !value);
      this.$closeIcon.toggleClass('-hidden', value);
    }

  });

})(this.App);
