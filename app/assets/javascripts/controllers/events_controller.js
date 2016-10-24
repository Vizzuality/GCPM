(function(App) {

  'use strict';

  App.Controller.Events = function() {};

  _.extend(App.Controller.Events.prototype, {

    new: function() {
      var pickdate_start = new App.Presenter.PickadateStart({
        name: 'event[start_date]'
      });
      var pickdate_end = new App.Presenter.PickadateEnd({
        name: 'event[end_date]'
      });

      pickdate_start.render();
      pickdate_end.render();
    },

    show: function(params) {
      var newParams = _.extend({}, params, {dataType: 'info'});

      new App.Presenter.MapVis(params);
      new App.Presenter.TabNav(newParams);
      new App.Presenter.ShowMore(params);
    }

  });

})(this.App);
