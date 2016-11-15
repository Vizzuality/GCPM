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
        type: params.type,
        options: params.options
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      App.on('SearchList:change', this.handleChangeList.bind(this));

      App.on('Remote:load', function(params) {
        if (params.data === 'network') {
          this.searchList.setElement('#search-list');
          this.searchList.render(true);
        }
      }.bind(this));
    },

    handleChangeList: function(filteredList) {
      this.searchList.updateData(filteredList);
    }

  });

})(this.App);
