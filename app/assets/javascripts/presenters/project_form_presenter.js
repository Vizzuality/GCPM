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
      this.titleInput = new App.Presenter.TitleInput({
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

      this.websiteInput = new App.View.Input({
        el: '#project-website',
        options: {
          name: 'projectWebsite',
          type: 'text',
          label: 'Project website',
          inputClass: 'c-section-title -one-line',
          placeholder: 'http://example.org'
        }
      });

      // this.projectTypeSelect = new App.Presenter.ProjectTypes({});
    },


    setSubscriptions: function() {
      App.on('Pickdate:change', this.setDates, this);
    },

    setDates: function(pickdate) {
      var startDate = pickdate.$startDatePicker.get('select');
      var endDate = pickdate.$endDatePicker.get('select') || startDate;

      this.state.set({startDate, endDate});
    }



  });

})(this.App);