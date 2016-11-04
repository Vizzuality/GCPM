/* global ga */
(function(App) {

  'use strict';

  App.Presenter.EventForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.EventForm.prototype, {

    initialize: function() {
      this.pickdate_start = new App.Presenter.PickadateStart({
        name: 'event[start_date]'
      });

      this.pickdate_end = new App.Presenter.PickadateEnd({
        name: 'event[end_date]'
      });

      this.countries = new App.Collection.Countries();

      this.eventsForm = new App.View.EventForm({
        el: '#newEventView'
      });
      this.render();

      this.setEvents();
    },

    render: function() {
      this.pickdate_start.render();
      this.pickdate_end.render();

      this.countries.fetch().done(function(){
        this.options = this.countries.toJSON().map(function(country){
          return {
            value: country.name,
            name: country.name
          };
        });

        var countries = new App.Presenter.Countries({
          label: null,
          addNew: false,
          options: this.options,
          name: 'event[country]'
        });

        countries.render();
      }.bind(this));
    },

    setEvents: function() {
      this.eventsForm.on('submit', function() {
        ga('send', 'event', 'Users', 'Add data', 'Add event');
      });
    }

  });

})(this.App);
