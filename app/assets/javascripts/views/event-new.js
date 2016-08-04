(function(App) {

  'use strict';

  App.View = App.View || {};
  App.View.AddNewEvent = Backbone.View.extend({

      el: '.project_add',

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

    events: {
      'click .-editable' : 'displaInputs',
      'click .lead-investigator' : 'selectLead',
      'click .f-submit' : 'onSubmit',
      'click .remove_fields' : 'removeRelation',
      'click .f-circle-parent' : 'changeLead'
    },

    initialize: function() {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.render();
    },

    render: function() {
      // this.fillPregenerated();
      this.renderChosen();
      this.renderPickADate();


      return this;
    },

    // removeRelation: function(ev) {
    //   var target = $(ev.target).parent().parent();
    //   var id = target.data('id');
    //   AUTH_TOKEN = 'X18fTWv64i4W7Dam5WeN';
    //   $.ajax({
    //     url: 'http://192.168.1.69:3000/api/projects/'+PROJECT_ID+'/memberships/'+id+'?token='+AUTH_TOKEN,
    //     method: 'DELETE'
    //   });
    //   target.fadeOut();
    // },

    // changeLead: function(ev){
    //   var target = $(ev.target).parent();
    //   var id = target.data('id');
    //   this.$el.find('.-getrow').find('.circle').remove();
    //   target.find('.f-circle-parent').html('<span class="circle"></span>');
    //   AUTH_TOKEN = 'X18fTWv64i4W7Dam5WeN';
    //   $.ajax({
    //     url: 'http://192.168.1.69:3000/api/projects/'+PROJECT_ID+'/memberships/'+id+'?token='+AUTH_TOKEN,
    //     method: 'PUT',
    //     data: {'membership': {'membership_type':'main'}}
    //   });
    //   target.siblings().each(function(i, el){
    //     $.ajax({
    //       url: 'http://192.168.1.69:3000/api/projects/'+PROJECT_ID+'/memberships/'+$(el).data('id')+'?token='+AUTH_TOKEN,
    //       method: 'PUT',
    //       data: {'membership': {'membership_type':'secondary'}}
    //     });
    //   });
    // },

    getOrganizations: function(ev) {
      var id = ev.target;
    },

    renderChosen: function() {
      this.$el.find('.chosen-select').chosen({
        width: '100%',
        allow_single_deselect: true,
        inherit_select_classes: true,
        no_results_text: "Oops, nothing found!"
      });
    },

    displaInputs: function() {
      $('body').addClass('f-edited');
    },

    selectLead: function(ev) {
      $('.lead-investigator').prop('checked',false);
      $(ev.target).prop('checked',true);
    },

    onSubmit: function() {
      if (! !!$('#project_memberships_attributes_undefined_research_unit_id').val()) {
        $('.c-pregenerated').last().remove();
      }
    },

    renderPickADate: function() {
      var $start = this.$el.find('#add-project-start_date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-start-container'
      }));

      var $end = this.$el.find('#add-project-end_date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-end-container'
      }));

    }
  });

})(this.App);
