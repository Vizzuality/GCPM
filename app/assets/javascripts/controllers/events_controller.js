(function(App) {

  'use strict';

  App.Controller.Events = function() {};

  _.extend(App.Controller.Events.prototype, {

    new: function() {
      // new App.Presenter.EventForm();
    },

    show: function(params) {
      var newParams = _.extend({}, params, {dataType: 'info'});

      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(newParams);
      new App.Presenter.ShowMore(params);
    }

  });

})(this.App);
