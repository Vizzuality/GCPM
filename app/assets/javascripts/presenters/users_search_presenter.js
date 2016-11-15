
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UsersSearch = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UsersSearch.prototype, {

    initialize: function() {
      this.state = new StateModel();

      this.$el = $('#userSearch');

      this.searchInput = new App.View.Input({
        el: '#search-input',
        options: {
          name: 'name',
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
      this.setEvents();
    },

    setEvents: function() {
      this.$el = $('#userSearch');
      this.$closeIcon = this.$el.find('.icon-close');

      this.$closeIcon.on('click', function() {
        this.searchInput.clear();
      }.bind(this));
    },

    setSubscriptions: function() {
      this.searchInput.on('keyup', this.handleKeyup.bind(this));

      this.state.on('change', function() {
        App.trigger('SearchList:change', this.state.get('filteredUsers'));
      }.bind(this));

      App.on('Remote:load', function(params) {
        if (params.data === 'network') {
          this.setEvents();

          this.searchInput.setElement('#search-input');
          this.searchInput.clear();
          this.searchInput.render();
        }
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
      this.$searchIcon = this.$el.find('.icon-search');
      this.$closeIcon = this.$el.find('.icon-close');
      this.$searchList = $('#search-list');

      this.$searchIcon.toggleClass('-hidden', !value);
      this.$closeIcon.toggleClass('-hidden', value);
      this.$searchList.toggleClass('-hidden', value);
    }

  });

})(this.App);
