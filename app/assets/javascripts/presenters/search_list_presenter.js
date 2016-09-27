(function(App) {

  'use strict';

  App.Presenter.SearchList = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.SearchList.prototype, {

    initialize: function(params) {
      this.searchList = new App.View.SearchList({
        el: '#search-list',
        list: params.list instanceof Array ?
          { '': params.list } :
          params.list,
        type: params.type
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      App.on('SearchList:change', this.handleChangeList.bind(this));
    },

    handleChangeList: function(filteredList) {
      this.searchList.updateData(filteredList);
    }

  });

})(this.App);
