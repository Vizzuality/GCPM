(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.FilterForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FilterForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      var projectTypes = new App.Presenter.ProjectTypes();
      var cancerTypes = new App.Presenter.CancerTypes()
      this.inputs = {
        // projectTypes: projectTypes.projectTypesSelect,
        cancerTypes: cancerTypes,
        // fundingSources: new App.Presenter.FundingSources()
      };
      this.modal = new App.View.Modal();
      this.filterForm = new App.View.FilterForm({ inputs: this.inputs });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      App.on('Toolbar:action', this.openForm, this);
    },

    openForm: function(actionName) {
      if (actionName === 'filter') {
        this.modal.open(this.filterForm);
      }
    }

  });

})(this.App);
