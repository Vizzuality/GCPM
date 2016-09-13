(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      this.initializeFormComponents();
      this.setComponentsKeys();

      this.setSubscriptions();
    },

    initializeFormComponents: function() {
      this.titleInput = new App.View.Input({
        el: '#title',
        options: {
          name: 'title',
          class: '',
          inputClass: 'c-title -bigger -bold',
          type: 'text',
          placeholder: 'Project Title_'
        }
      });

      this.descTextarea = new App.View.Textarea({
        el: '#description',
        options: {
          name: 'summary',
          type: 'textarea',
          label: 'Description',
          lableClass: 'c-section-title',
          placeholder: 'Lorem'
        }
      });

      this.pickdate = new App.View.Pickdate({el: '.pickdate'});

      this.websiteInput = new App.Presenter.WebsiteInput();
      this.projectTypesSelect = new App.Presenter.ProjectTypes();
      this.cancerTypesSelect = new App.Presenter.CancerTypes();
      this.fundingSourcesSelect = new App.Presenter.FundingSources();

      this.investigatorsSelect = new App.Presenter.Investigators();

      this.submitButton = new App.View.SubmitButton({ el: '.project_add'});


      this.modal = new App.Presenter.Modal();
    },

    setSubscriptions: function() {
      this.titleInput.on('change', this.setInputValue, this);
      this.descTextarea.on('change', this.setTextareaValue, this);
      this.pickdate.on('change', this.setDates, this);
      this.submitButton.on('click', this.handleSubmit, this);

      App.on('WebsiteInput:change', this.setPresenterValue, this);
      App.on('ProjectTypesSelect:change', this.setPresenterValue, this);
      App.on('CancerTypesSelect:change', this.setPresenterValue, this);
      App.on('FundingSourcesSelect:change', this.setPresenterValue, this);
      App.on('InvestigatorsSelect:change', this.setPresenterValue, this);
    },

    setComponentsKeys: function() {
      this.components = {
        'title': this.titleInput,
        'summary': this.descTextarea,
        'start_date': this.pickdate,
        'end_date': this.pickdate,
        'project_website': this.websiteInput.websiteInput,
        'project_type_ids': this.projectTypesSelect.projectTypesSelect,
        'cancer_type_ids': this.cancerTypesSelect.cancerTypesSelect,
        'funding_source_ids': this.fundingSourcesSelect.fundingSourcesSelect
      };
    },

    setDates: function(pickdate) {
      var startDate = pickdate.$startDatePicker.get('select') &&
        pickdate.$startDatePicker.get('select').obj;

      var endDate = pickdate.$endDatePicker.get('select') ?
        pickdate.$endDatePicker.get('select').obj :
        startDate;

      this.state.set({start_date: startDate, end_date: endDate});
    },

    setInputValue: function(input) {
      var value = input.$el.find('input')[0].value;
      var obj = {};
      obj[input.options.name] = value;

      this.state.set(obj);
    },

    setTextareaValue: function(textarea) {
      var value = textarea.$el.find('textarea')[0].value;
      var obj = {};
      obj[textarea.options.name] = value;

      this.state.set(obj);
    },

    setPresenterValue: function(presenter) {
      var obj = presenter.state.attributes;
      this.state.set(obj);
    },

    handleSubmit: function() {
      var keys = Object.keys(this.components);
      var fieldsLeft = keys.filter(function(key) {
        if (this.state.attributes[key] && this.state.attributes[key].length !== 0) {
          var required = this.components[key].$el.find('.c-required');
          required && required.addClass('-hidden');
        }

        return !this.state.attributes[key] || this.state.attributes[key].length === 0;
      }.bind(this));

      if (fieldsLeft.length !== 0) {
        fieldsLeft.map(function(field) {
          var required = this.components[field].$el.find('.c-required');
          required && required.removeClass('-hidden');
        }.bind(this));

      } else {
        // this.state.save();
        console.log('All fields filled!');
      }
    }

    // openModal: function(formType) {
    //   var view = this.formsViews[formType];
    //   this.modal.setView(view);
    //   this.modal.open();
    // }

  });

})(this.App);
