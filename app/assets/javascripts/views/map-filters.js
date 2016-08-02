(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapFilters = App.Helper.Modal.extend({

    el: '#map-filters',

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
      this.params = settings.params;

      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);

      // Inits
      this.render();
      this.listeners();     


    },

    listeners: function() {
      Backbone.Events.on('Filters/toggle', function(){
        this.toggle();
      }.bind(this));

      Backbone.Events.on('Filters/update', function(newFilters){
        this.publishFilters(newFilters);
      }.bind(this));
    },

    render: function() {
      this.renderChosen();
      this.renderPickADate();
      return this;
    },

    renderChosen: function() {
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
          if(autoClose === false) {
              evt['metaKey'] = true;
              evt['ctrlKey'] = true;
              resultHighlight = chosen.result_highlight;
          }
          var stext = chosen.get_search_text();
          var result = chosen_resultSelect_fn.call(chosen, evt);
          if(autoClose === false && resultHighlight !== null)
              resultHighlight.addClass('result-selected');

          // this.search_field.val(stext);               
          this.winnow_results();
          this.search_field_scale();

          return result;
        };
      });
    },

    renderPickADate: function() {
      var $start = this.$el.find('#pickadate-start-input').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-start-container'
      }));

      var $end = this.$el.find('#pickadate-end-input').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-end-container'
      }));
    },


    /**
     * PUBLISH
     */
    publishFilters: function(newFilters) {
      var newParams = _.extend({}, this.params, newFilters);
      window.location = '/map?' + $.param(newParams)
    }

  });

})(this.App);
