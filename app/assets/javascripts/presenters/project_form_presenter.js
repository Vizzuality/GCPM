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
          name: 'descrition',
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
    },

    setSubscriptions: function() {
      this.titleInput.on('change', this.setInputValue, this);
      this.descTextarea.on('change', this.setTextareaValue, this);
      this.pickdate.on('change', this.setDates, this);

      App.on('WebsiteInput:change', this.setPresenterValue, this);
      App.on('projectTypesSelect:change', this.setPresenterValue, this);
      App.on('cancerTypesSelect:change', this.setPresenterValue, this);
    },

    setDates: function(pickdate) {
      var startDate = pickdate.$startDatePicker.get('select') &&
        pickdate.$startDatePicker.get('select').obj;

      var endDate = pickdate.$endDatePicker.get('select') ?
        pickdate.$endDatePicker.get('select').obj :
        startDate;

      this.state.set({startDate, endDate});
    },

    setInputValue: function(input) {
      var value = input.$el.find('input')[0].value;

      if (value !== '') {
        var obj = {};
        obj[input.options.name] = value;

        this.state.set(obj);
      }
    },

    setTextareaValue: function(textarea) {
      var value = textarea.$el.find('textarea')[0].value;

      if (value !== '') {
        var obj = {};
        obj[textarea.options.name] = value;

        this.state.set(obj);
      }
    },

    setPresenterValue: function(presenter) {
      var obj = presenter.state.attributes;

      this.state.set(obj);
    }

  });

})(this.App);
