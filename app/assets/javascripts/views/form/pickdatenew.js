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
      this.state = settings.state;
    },

    render: function() {
      this.$el.html(this.template(this.options));

      this.setPickdate();
      this.setEvents();
    },

    setPickdate: function() {
      this.$picker = this.$el.find('.pickadate-input')
        .val(this.state.get('value'))
        .pickadate(_.extend({}, this.pickadateOptions, {
          container: '#'+this.options.name+'-container',
          min: this.state.get('min') || undefined,
          max: this.state.get('max') || undefined
        }));

      this.$datePicker = this.$picker.pickadate('picker');
    },

    setEvents: function() {
      this.$datePicker.on('set', this.triggerChange.bind(this));
    },

    triggerChange: function(e) {
      if (e.select) {
        this.trigger('change', {
          value: e.select
        });
      }
    }

  });

})(this.App);
