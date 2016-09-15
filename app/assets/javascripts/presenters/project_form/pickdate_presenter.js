(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Pickdate = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Pickdate.prototype, {

  	initialize: function(params) {
      this.state = new StateModel();
      this.pickdate = new App.View.Pickdate({el: '.pickdate'});
    },

    setDates: function(pickdate) {
      var startDate = pickdate.$startDatePicker.get('select') &&
        pickdate.$startDatePicker.get('select').obj;

      var endDate = pickdate.$endDatePicker.get('select') ?
        pickdate.$endDatePicker.get('select').obj :
        startDate;

      this.state.set({start_date: startDate, end_date: endDate});
    }

  });

})(this.App);