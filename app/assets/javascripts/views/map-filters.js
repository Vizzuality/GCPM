(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapFilters = App.Helper.Modal.extend({

    el: '#map-filters',

    events: function(){
      return _.extend({}, App.Helper.Modal.prototype.events,{
        'submit #map-filters-form': 'onSubmitFilters'
      });
    },

    pickadateOptions: {
      today: false,
      clear: false,
      close: false,
      closeOnClear: false,
      closeOnSelect: false,
      selectYears: function() { // birthday is a date
        var ageDifMs = new Date(1904,1,1) - new Date(2040,1,1);
        var ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
      }(),
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
      }
    },




    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);

      this.utils = App.Helper.Utils;
      this.params = settings.params;

      // Inits
      this.render();
      this.cache();
      this.listeners();
    },

    cache: function() {
      this.$form = this.$el.find('#map-filters-form');
    },

    listeners: function() {
      App.Events.on('Filters/toggle', function(){
        this.toggle();
      }.bind(this));
    },

    render: function() {
      this.renderChosen();
      this.renderPickADate();
      return this;
    },

    renderChosen: function() {
      if(! !!$(this.$el.find('.chosen-select')[0]).data('chosen')) {
        var chosenSelects = this.$el.find('.chosen-select').chosen({
          width: '100%',
          allow_single_deselect: true,
          inherit_select_classes: true,
          no_results_text: "Oops, nothing found!"        
        });

        // Fix to keep the chosen always visible 
        // https://github.com/harvesthq/chosen/issues/1546
        // Really????? This is the huge shit I've seen in my life
        // The issue has been opened since 2013...
        _.each(chosenSelects, function(select) {
          var chosen = $(select).data('chosen');
          var autoClose = false;
          var chosen_resultSelect_fn = chosen.result_select;
          chosen.search_contains = true;
          chosen.result_select = function(evt) {
            var resultHighlight = null;
            if (autoClose === false) {
              evt['metaKey'] = true;
              evt['ctrlKey'] = true;
              resultHighlight = chosen.result_highlight;
            }
            var stext = chosen.get_search_text();
            var result = chosen_resultSelect_fn.call(chosen, evt);
            if (autoClose === false && resultHighlight !== null){
              resultHighlight.addClass('result-selected');
            }
                
            // this.search_field.val(stext);               
            this.winnow_results();
            this.search_field_scale();

            return result;
          };
        });
      }
    },

    renderPickADate: function() {
      var $start = this.$el.find('#pickadate-start-input').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-start-container',
        min: new Date(1905,1,1),
        max: this.params.end_date || new Date(2040,1,1),
      }));
      var $startPicker = $start.pickadate('picker');

      var $end = this.$el.find('#pickadate-end-input').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-end-container',
        min: this.params.start_date || new Date(1905,1,1),
        max: new Date(2040,1,1),
      }));
      var $endPicker = $end.pickadate('picker');

      $startPicker.on('set', function(e) {
        if ( e.select ) {
          $endPicker.set('min', $startPicker.get('select'))
        }
      })
      $endPicker.on('set', function(e) {
        if ( e.select ) {
          $startPicker.set('max', $endPicker.get('select'))
        }
      })

    },

    /**
     * UI EVENTS
     * - onSubmitFilters
     */
    onSubmitFilters: function(e) {
      e && e.preventDefault();
      var newFilters = this.utils.getParams(this.$form.serialize());
      App.Events.trigger('params:update', newFilters)
    },

  });

})(this.App);
