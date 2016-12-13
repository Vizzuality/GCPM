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
        el: '.simple_form'
      });

      this.view = new App.View.Map({
        el: '#map',
        options: {
          zoom: 3,
          minZoom: 3,
          center: this.eventsForm.getLocation(),
          basemap: 'secondary'
        }
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

      // Location
      this.eventsForm.setLocation(this.eventsForm.getLocation());
    },

    setEvents: function() {
      this.eventsForm.on('submit', function() {
        ga('send', 'event', 'Users', 'Add data', 'Add event');
      });

      this.view.on('pan', function(){
        var center = this.view.map.getCenter();
        this.eventsForm.setLocation(center);
      }.bind(this));
    }

  });

})(this.App);
