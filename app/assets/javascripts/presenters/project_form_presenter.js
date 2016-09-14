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
      this.titleInput           = new App.Presenter.Input();
      this.descTextarea         = new App.Presenter.Textarea();
      this.pickdate             = new App.Presenter.Pickdate();
      this.websiteInput         = new App.Presenter.WebsiteInput();
      this.projectTypesSelect   = new App.Presenter.ProjectTypes();
      this.cancerTypesSelect    = new App.Presenter.CancerTypes();
      this.fundingSourcesSelect = new App.Presenter.FundingSources();
      this.investigatorsSelect  = new App.Presenter.Investigators();
      this.submitButton         = new App.Presenter.SubmitButton().submitButton;
      this.modal                = new App.Presenter.Modal();
    },

    setSubscriptions: function() {
      this.titleInput.Input.on(       'change', this.titleInput.setInputValue, this);
      this.descTextarea.Textarea.on(  'change', this.descTextarea.setTextareaValue, this);
      this.pickdate.pickdate.on(      'change', this.pickdate.setDates, this);
      this.submitButton.on(           'click',  this.handleSubmit, this);

      App.on('WebsiteInput:change',         this.setPresenterValue, this);
      App.on('ProjectTypesSelect:change',   this.setPresenterValue, this);
      App.on('CancerTypesSelect:change',    this.setPresenterValue, this);
      App.on('FundingSourcesSelect:change', this.setPresenterValue, this);
      App.on('InvestigatorsSelect:change',  this.setPresenterValue, this);
    },

    setComponentsKeys: function() {
      this.components = {
        'title': this.titleInput.Input,
        'summary': this.descTextarea.Textarea,
        'start_date': this.pickdate.pickdate,
        'end_date': this.pickdate.pickdate,
        'project_website': this.websiteInput.websiteInput,
        'project_type_ids': this.projectTypesSelect.projectTypesSelect,
        'cancer_type_ids': this.cancerTypesSelect.cancerTypesSelect,
        'funding_source_ids': this.fundingSourcesSelect.fundingSourcesSelect
      };
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
