(function (App) {

  'use strict';

  App.Presenter.Remote = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Remote.prototype, {

    initialize: function() {
      this.setSubscriptions();
    },

    setSubscriptions: function() {
      var eventNames = ['Map:change', 'Router:change', 'FilterForm:change'];
      App.on(eventNames.join(' '), this.fetchContent, this);
    },

    fetchContent: function() {
      var link = $('<a></a>');
      link.attr('href', window.location.href);
      link.data('remote', true);
      $.rails.handleRemote(link).done(function() {
        link.remove();
        App.trigger('Remote:load');
      });
    }

  });

})(this.App);
