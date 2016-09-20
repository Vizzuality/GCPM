(function(App) {

  'use strict';

  App.View.PickadateNew = Backbone.View.extend({

    defaults: {
    },

    template: HandlebarsTemplates['form/pickadate'],

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
    },

    render: function() {
      this.$el.html(this.template(this.options));

      // this.setEvents();
      // this.setPickdate();
    },

    setPickdate: function() {
      this.$picker = this.$el.find('.start-date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-start-container',
        min: new Date(1905,1,1),
        max: new Date(2040,1,1)
      }));
      this.$datePicker = this.$picker.pickadate('picker');

      // this.$datePicker.on('set', function(e) {
      //   if (e.select) {
      //     this.$endDatePicker.set('min', this.$datePicker.get('select'));
      //   }
      // }.bind(this));
    },

    setEvents: function() {
      this.$datePicker.on('set', this.triggerChange.bind(this));
    },

    triggerChange: function(e) {
      console.log(e);
      // if (e.select) {
      //   var start = this.$datePicker.get('select');
      //   var end = this.$endDatePicker.get('select');
      //   this.trigger('change', this);
      // }
    }

  });

})(this.App);
