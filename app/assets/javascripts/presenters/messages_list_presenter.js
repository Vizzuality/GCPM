(function(App) {

  'use strict';

  App.Presenter.MessagesList = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.MessagesList.prototype, {

    initialize: function() {
      this.messagesList = new App.View.MessagesList({
        el: '#messages-list'
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      App.on('ProjectForm:errors', function(messages){
        this.handleChangeList(messages);
      }, this);
    },

    handleChangeList: function(messages) {
      this.messagesList.updateData(messages);
    },

    render: function() {
      this.messagesList.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.messagesList.setElement(el);
    },

    getElement: function() {
      return this.messagesList.$el;
    }

  });

})(this.App);
