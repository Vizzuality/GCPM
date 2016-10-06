(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectForm.prototype, {
    initialize: function(params) {
      this.state = new StateModel(params);

      var titleInput = new App.Presenter.Input({
        label: null
      });
      var descTextarea = new App.Presenter.Textarea({
        label: null
      });
      var startPickadate = new App.Presenter.PickadateStart({
        label: null
      });
      var endPickadate = new App.Presenter.PickadateEnd({
        label: null
      });
      var websiteInput = new App.Presenter.WebsiteInput({
        label: null
      });
      var projectTypes = new App.Presenter.ProjectTypes({
        label: null,
        addNew: false
      });
      var cancerTypes = new App.Presenter.CancerTypes({
        label: null,
        addNew: false
      });
      var fundingSources = new App.Presenter.FundingSources({
        label: null,
        addNew: false
      });
      var investigators  = new App.Presenter.Investigators({
        label: null,
        addNew: false
      });
      var organizations = new App.Presenter.Organizations({
        label: null,
        addNew: false
      });

      this.children = [titleInput, descTextarea, startPickadate, endPickadate,
         websiteInput, projectTypes, cancerTypes, fundingSources, investigators,
         organizations];

      this.modal = new App.View.Modal();
      this.projectForm = new App.View.ProjectForm({
        children: this.children,
        el: '#project_form'
      });

      this.setEvents();
>>>>>>> projectForm presenter (added other fields)
      this.setSubscriptions();
    },

<<<<<<< 59a01e2199cb4ae774af65929714291c9f6e7b37
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
=======
    /**
     * Setting internal events
     */
    setEvents: function(){
      this.state.on('change', function(){
        App.trigger('ProjectForm:change', this.state.attributes);
      }, this);

      this.projectForm.on('submit', function(newState) {
        this.setState(newState);
        this.handleSubmit();
      }, this);
>>>>>>> projectForm presenter (added other fields)
    },

    setSubscriptions: function() {
<<<<<<< 59a01e2199cb4ae774af65929714291c9f6e7b37
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
=======

    },

    setState: function(newState) {
      this.state.set(newState);
>>>>>>> projectForm presenter (added other fields)
    },

    /**
     * Subscribing to global events
     */
    handleSubmit: function() {
<<<<<<< 59a01e2199cb4ae774af65929714291c9f6e7b37
      var keys = Object.keys(this.components);
      var fieldsLeft = keys.filter(function(key) {
        if (this.state.attributes[key] && this.state.attributes[key].length !== 0) {
          var required = this.components[key].$el.find('.c-required');
          required && required.addClass('-hidden');
        }

        return !this.state.attributes[key] || this.state.attributes[key].length === 0;
=======
      console.log(this.state.attributes);
      var url = "";
      var req = new XMLHttpRequest();
      req.onload = function(){
        if(this.status = 200){
          console.log("success");
        }
        else{
          console.log("error");
        }
      };
      req.open("POST", url, true);
      req.send(this.state.attributes);
    },

    renderForm: function(){
      this.projectForm.render();
      this.renderFormElements();
    },

    renderFormElements: function() {
      _.each(this.children, function(child){
        // Get && set the value from the state thanks to the name
        // I need to pass the rest of the params because there are some presenters that need other params
        // Then, inside of each presenter, they will handle its state
        var state = _.extend({}, this.state.toJSON(), {
          value: this.state.get(child.defaults.name),
        });

        child.setState(state, { silent: true });

        // Render the child
        child.render();
>>>>>>> projectForm presenter (added other fields)
      }.bind(this));

      if (fieldsLeft.length !== 0) {
        fieldsLeft.map(function(field) {
          var required = this.components[field].$el.find('.c-required');
          required && required.removeClass('-hidden');
        }.bind(this));
      }
    }

    // openModal: function(formType) {
    //   var view = this.formsViews[formType];
    //   this.modal.setView(view);
    //   this.modal.open();
    // }

  });

})(this.App);
