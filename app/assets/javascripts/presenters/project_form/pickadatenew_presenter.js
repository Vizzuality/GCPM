(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.PickadateStartNew = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.PickadateStartNew.prototype, {

    defaults: {
      name: 'start_date',
      label: 'Start date',
      container: '#pickadate-start-container',
      min: new Date(1905,1,1),
      max: new Date(2040,1,1)
    },

    initialize: function(params, viewSettings) {
      this.state = new StateModel();

      // Creating view
      this.pickadate = new App.View.PickadateNew({
        el: '#pickadate-start',
        options: _.extend({}, this.defaults, viewSettings || {})
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('PickadateStartNew:change', this.state.attributes);
      }, this);

      // this.pickadate.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    render: function() {
      this.pickadate.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state) {
      var result = {};
      _.each(state, function(s) {
        return result[s.value] = s.name;
      });
      this.state.set(result);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.pickadate.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.pickadate.$el;
    }

  });

})(this.App);


// (function(App) {
//
//   'use strict';
//
//   var StateModel = Backbone.Model.extend();
//
//   App.Presenter.Pickdate = function() {
//     this.initialize.apply(this, arguments);
//   };
//
//   _.extend(App.Presenter.Pickdate.prototype, {
//
//   	initialize: function(params) {
//       this.state = new StateModel();
//       this.pickdate = new App.View.Pickdate({el: '.pickdate'});
//     },
//
//     // setDates: function(pickdate) {
//     //   var startDate = pickdate.$startDatePicker.get('pickadate') &&
//     //     pickdate.$startDatePicker.get('pickadate').obj;
//     //
//     //   var endDate = pickdate.$endDatePicker.get('pickadate') ?
//     //     pickdate.$endDatePicker.get('pickadate').obj :
//     //     startDate;
//     //
//     //   this.state.set({start_date: startDate, end_date: endDate});
//     // }
//
//   });
//
// })(this.App);
