(function(App) {

  'use strict';

  App.View = App.View || {};
  App.View.AddNewProject = Backbone.View.extend({

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
      'click .f-circle-parent' : 'changeLead',
      'change .selectInvestigator' : 'loadOrgaAndAddr',
      'change .selectElements'  : 'updateResearchUnit',
      'click .pre-submit'   : 'onSubmit',
      'click .saveRelation' : 'saveRelation',
      'click .add-new-investigator' : 'addInvestigatorForm'
    },

    initialize: function() {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);
      // Inits
      this.checkRelations();
      this.render();
      this.setListeners();
    },

    /**
     * Settings global events
     */
    setListeners: function() {
      App.Events.on('addNewOrganization', this.addNewOrganization, this);
    },

    render: function() {
      this.fillPregenerated();
      this.renderChosen();
      this.renderPickADate();
      return this;
    },

    checkRelations: function() {
      if (location.search.includes('relations') || location.pathname.includes('/edit')) {
        var relations = document.getElementById('relations');
        relations.classList.remove('-hide-staff');
        relations.scrollIntoView();
      }
    },  

    removeRelation: function(ev) {
      var target = $(ev.target).parent().parent();
      var id = target.data('id');
      $.ajax({
        url: '/api/projects/'+PROJECT_ID+'/memberships/'+id+'?token='+AUTH_TOKEN,
        method: 'DELETE'
      });
      target.fadeOut();
    },

    changeLead: function(ev){
      var target = $(ev.target).parent();
      var id = target.data('id');
      this.$el.find('.-getrow').find('.circle').remove();
      target.find('.f-circle-parent').html('<span class="circle"></span>');
      $.ajax({
        url: '/api/projects/'+PROJECT_ID+'/memberships/'+id+'?token='+AUTH_TOKEN,
        method: 'POST',
        data: {'membership': {'membership_type':'main'}}
      });
      target.siblings().each(function(i, el){
        if (! !!$(el).data('id')) return;
        $.ajax({
          url: '/api/projects/'+PROJECT_ID+'/memberships/'+$(el).data('id')+'?token='+AUTH_TOKEN,
          method: 'POST',
          data: {'membership': {'membership_type':'secondary'}}
        });
      });
    },

    loadOrgaAndAddr: function(ev) {
      $.ajax({
        url: '/api/investigators/'+ev.target.value+'?token='+AUTH_TOKEN,
        method: 'GET',
        success: function(data) {
          var paintOrgOrAdd = function (elements) {
            var selectElements = document.createElement("SELECT");
            for (var i = 0; i < elements.length; i++) {
              var option = document.createElement("OPTION");
              option.innerText = elements[i].name || elements[i].line_1;
              option.value = elements[i].id;
              selectElements.appendChild(option);
            }
            selectElements.classList.add('chosen-select', 'selectElements');
            var item = document.createElement('SPAN');
            item.classList.add('-item','-m-edited');
            item.appendChild(selectElements);
            $('#c-pregenerated-container').find('.-getrow').last().append($(item));
            $(selectElements).chosen({
              width: '100%',
              allow_single_deselect: true,
              inherit_select_classes: true,
              no_results_text: "Oops, nothing found!"
            });
          }
          var addLead = function(){
            $('#c-pregenerated-container').find('.-getrow').last().append('<span class="-item -m-edited f-circle-parent"></span>');
          }
          paintOrgOrAdd(data.organizations);
          paintOrgOrAdd(data.addresses);
          addLead();
          this.fillPregeneratedInvestigators();
        }.bind(this)
      });
      window.setTimeout(function(){
        this.updateResearchUnit(ev);
      }.bind(this),1500)
    },


    updateResearchUnit: function(ev) {
      var target = $(ev.target).parent();
      var data = {
        'investigator_id' : target.find('select.selectInvestigator').val(),
        'address_id' :  target.parent().find('select.selectElements').last().val()
      }
      $.ajax({
        url: '/api/check_research_unit?token='+AUTH_TOKEN,
        method: 'GET',
        data: data,
        success: function(data) {
          target.closest('.-getrow').attr('data-research_unit', data.research_unit_id);
        }
      });
    },

    fillPregeneratedInvestigators: function() {
      $.ajax({
        url: '/api/investigators?token='+AUTH_TOKEN,
        method: 'GET',
        success: function(data) {
          var selectInvestigators = document.createElement("SELECT");
          selectInvestigators.dataset.placeholder = 'Select or add investigator';
          for (var i = 0; i < data.length; i++) {
            if (i == 0) {
              // clean the first option
              var option = document.createElement("OPTION");
              selectInvestigators.appendChild(option); 
              // add the `Add new` option first
              var option_new = document.createElement("OPTION");
              option_new.innerText = 'Add new';
              option_new.value = '-1';
              option_new.classList.add('add-new-investigator');
              selectInvestigators.appendChild(option_new); 
              continue;
            }
            var option = document.createElement("OPTION");
            option.innerText = data[i].name;
            option.value = data[i].id;
            selectInvestigators.appendChild(option);
          }
          selectInvestigators.classList.add('chosen-select', 'selectInvestigator');
          var getrow = document.createElement('div');
          getrow.classList.add('-getrow');
          var item = document.createElement('SPAN');
          item.classList.add('-item', '-m-edited');
          item.appendChild(selectInvestigators);
          getrow.appendChild(item);
          document.getElementById('c-pregenerated-container').appendChild(getrow);
          $(selectInvestigators).chosen({
            width: '100%',
            allow_single_deselect: true,
            inherit_select_classes: true,
            no_results_text: "Oops, nothing found!",
            placeholder_text_single: "Select or add investigator"
          });
        }
      });
    },

    fillPregenerated: function() {
      if (! PROJECT_ID) {
        this.fillPregeneratedInvestigators();
        return;
      };

      var CONTAINER = document.getElementById('c-pregenerated-container');
      $.ajax({
        url: '/api/projects/'+PROJECT_ID+'/memberships?token='+AUTH_TOKEN,
        success: function(data) {

          for (var i = 0; i < data.length; i++) {
          var row = '<div class="-getrow" data-id="'+data[i].id+'">';
          row     +=  '<span class="-item -m-edited">';
          row     +=    '<a href="#" class="remove_fields">×</a>';
          row     +=    data[i].investigator.name;
          row     +=  '</span>';
          row     +=  '<span class="-item -m-edited">';
          row     +=    data[i].organization.name;
          row     +=  '</span>';
          row     +=  '<span class="-item -m-edited">';
          row     +=    data[i].address.line_1;
          row     +=  '</span>';
          row     +=  '<span class="-item -m-edited f-circle-parent">';
          if (data[i].membership_type == 'main') {
            row     +=    '<span class="circle"></span>';
          }
          row     +=  '</span>';
          row     += '</div>';
          CONTAINER.innerHTML = CONTAINER.innerHTML + row;

          }
        }.bind(this),
        error:function (xhr, ajaxOptions, thrownError){
            if(xhr.status==404) {
                // this.fillPregeneratedInvestigators();
            }
        }.bind(this)
      });
      this.fillPregeneratedInvestigators();
    },

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

    saveRelation: function() {
      var elems = document.getElementsByClassName('-getrow');
      for (var i = 0; i < elems.length; i++){
        var data = {
          "membership" : {
            "project_id" : PROJECT_ID,
            "research_unit_id" : $(elems[i]).data('research_unit'),
            "membership_type" : !!$(elems[i]).find('.circle') ? 'main' : 'secondary'
          }
        };
        $.ajax({
          url: '/api/projects/'+PROJECT_ID+'/memberships/?token='+AUTH_TOKEN,
          data: data,
          method: 'POST'
        });
      }
    },

    displaInputs: function() {
      $('body').addClass('f-edited');
    },

    renderPickADate: function() {
      var $start = this.$el.find('#add-project-start_date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-start-container'
      }));

      var $end = this.$el.find('#add-project-end_date').pickadate(_.extend({}, this.pickadateOptions, {
        container: '#pickadate-end-container'
      }));

    },

    addNewOrganization: function() {
      $('#modalPickOrganization').fadeOut(function(){
        $('.modal-module').show();
      })
    },
    addInvestigatorForm: function() {
      var investigatorForm = new App.View.Investigator.Form();
      Backbone.Events.trigger('Modal:open', investigatorForm.render().el);
      $('.modal-container').addClass('-tall');
      this.loadPickableOrganizations();
      this.loadPickableCountry();
      return;
    },

    loadPickableOrganizations: function() {
      $.ajax({
        url: '/api/organizations?token='+AUTH_TOKEN,
        method: 'GET',
        success: function(data) {
          var selectOrganization = document.createElement("SELECT");
          selectOrganization.name = "country_org";
          selectOrganization.dataset.placeholder = 'Select or add organization';
          for (var i = 0; i < data.length; i++) {
            if (i == 0) {
              // clean the first option
              var option = document.createElement("OPTION");
              selectOrganization.appendChild(option); 
              // add the `Add new` option first
              var option_new = document.createElement("OPTION");
              option_new.innerText = 'Add new';
              option_new.value = '-1';
              option_new.classList.add('add-new-organization');
              selectOrganization.appendChild(option_new); 
              continue;
            }
            var option = document.createElement("OPTION");
            option.innerText = data[i].name;
            option.value = data[i].id;
            selectOrganization.appendChild(option);
          }
          selectOrganization.classList.add('chosen-select', 'selectOrganization');
          var getrow = document.createElement('div');
          getrow.classList.add('-getrow');
          var item = document.createElement('SPAN');
          item.classList.add('-item', '-m-edited');
          item.appendChild(selectOrganization);
          getrow.appendChild(item);
          document.getElementById('modalPickOrganization').appendChild(getrow);
          $(selectOrganization).chosen({
            width: '100%',
            allow_single_deselect: true,
            inherit_select_classes: true,
            no_results_text: "Oops, nothing found!",
            placeholder_text_single: "Select or add organization"
          });
        }
      });
    },
    loadPickableCountry: function() {
      $.ajax({
        url: '/api/countries?token='+AUTH_TOKEN,
        method: 'GET',
        success: function(data) {
          var selectOrganization = document.createElement("SELECT");
          selectOrganization.name = "organization_id";
          selectOrganization.dataset.placeholder = 'Select or add country';
          for (var i = 0; i < data.length; i++) {
            if (i == 0) {
              // clean the first option
              var option = document.createElement("OPTION");
              selectOrganization.appendChild(option); 
              // add the `Add new` option first
              var option_new = document.createElement("OPTION");
              option_new.innerText = 'Add new';
              option_new.value = '-1';
              selectOrganization.appendChild(option_new); 
              continue;
            }
            var option = document.createElement("OPTION");
            option.innerText = data[i].name;
            option.value = data[i].id;
            selectOrganization.appendChild(option);
          }
          selectOrganization.classList.add('chosen-select', 'selectOrganization');
          var getrow = document.createElement('div');
          getrow.classList.add('-getrow');
          var item = document.createElement('SPAN');
          item.classList.add('-item', '-m-edited');
          item.appendChild(selectOrganization);
          getrow.appendChild(item);
          document.getElementById('modalPickCountry').appendChild(getrow);
          $(selectOrganization).chosen({
            width: '100%',
            allow_single_deselect: true,
            inherit_select_classes: true,
            no_results_text: "Oops, nothing found!",
            placeholder_text_single: "Select or add country"
          });
        }
      });
    }
  });

})(this.App);
