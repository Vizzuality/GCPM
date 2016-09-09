(function(App) {

  'use strict';

  App.View.Pickdate = Backbone.View.extend({

    defaults: {
    },

    pickadateOptions: {
      today: false,
      clear: false,
      close: false,
      closeOnClear: false,
      closeOnSelect: false,
      selectYears: true,
      selectMonths: true,
      editable: false,
      format: 'yyyy-mm-dd',

      klass: {
        picker: 'picker-custom',
        holder: 'picker-holder-custom',
      },
      onStart: function() {
        this.$root.find( 'button, select' ).attr( 'disabled', false );
      },
      onRender: function() {
        this.$root.find( 'button, select' ).attr( 'disabled', false );
      },
      onOpen: function() {
        this.$root.find( 'button, select' ).attr( 'disabled', false );
      },
      onClose: function() {
        this.$root.find( 'button, select' ).attr( 'disabled', false );
      },
      onStop: function() {
        this.$root.find( 'button, select' ).attr( 'disabled', false );
      },
      onSet: function(context) {
        this.$root.find( 'button, select' ).attr( 'disabled', false );
      }
    },

    initialize: function(settings) {
      this.el = settings.el;
      this.options = _.extend({}, this.defaults, settings.options || {});
      this.render();
      this.setEvents();
    },

    render: function() {
      this.setPickdate();
    },

    setPickdate: function() {
      this.$start = this.$el.find('.start-date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-start-container',
        min: new Date(1905,1,1),
        max: new Date(2040,1,1)
      }));
      this.$startDatePicker = this.$start.pickadate('picker');

      this.$end = this.$el.find('.end-date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-end-container',
        min: new Date(1905,1,1),
        max: new Date(2040,1,1)
      }));
      this.$endDatePicker = this.$end.pickadate('picker');

      this.$startDatePicker.on('set', function(e) {
        if (e.select) {
          this.$endDatePicker.set('min', this.$startDatePicker.get('select'));
        }
      }.bind(this));
    },

    setEvents: function() {
      this.$startDatePicker.on('set', this.triggerChange.bind(this));
      this.$endDatePicker.on('set', this.triggerChange.bind(this));
    },

    triggerChange: function(e) {
      if (e.select) {
        var start = this.$startDatePicker.get('select');
        var end = this.$endDatePicker.get('select');
        this.trigger('change', this);
      }
    }

  });

})(this.App);
