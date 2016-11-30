(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.UserNetworkList = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.UserNetworkList.prototype, {

    initialize: function() {
      this.state = new StateModel({ list: null });

      this.lists = new App.View.UserNetworkLists({
        el: '.c-network-list'
      });

      this.setEvents();
    },

    setEvents: function() {
      this.state.on('change', this.toggleList, this);
      this.lists.on('click', this.handleClick, this);
    },

    setState: function(newState) {
      this.state
        .set(newState);
    },

    handleClick: function(name) {
      var stateList = this.state.get('list');
      var list = !stateList || stateList != name ?
        name : null;

      this.setState({ list : list });
    },

    toggleList: function() {
      this.lists.toggleList(this.state.get('list'));
    }

  });

})(this.App);
