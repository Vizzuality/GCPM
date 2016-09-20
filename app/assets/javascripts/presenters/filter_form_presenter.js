(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.FilterForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FilterForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel();

      var countries  = new App.Presenter.Countries(null, {
        label: null,
        addNew: false
      });
      var organizations  = new App.Presenter.Organizations(null, {
        label: null,
        addNew: false
      });
      var cancerTypes  = new App.Presenter.CancerTypes(null, {
        label: null,
        addNew: false
      });
      var projectTypes = new App.Presenter.ProjectTypes(null, {
        label: null,
        addNew: false
      });

      this.inputs = [countries, organizations, cancerTypes, projectTypes];
      this.modal = new App.View.Modal();
      this.filterForm = new App.View.FilterForm({
        inputs: this.inputs
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.filterForm.on('cancel', this.closeForm, this);
      this.filterForm.on('submit', function(newState) {
        this.setState(newState);
        this.closeForm();
      }, this);
      this.state.on('change', function() {
        App.trigger('FilterForm:change', this.state.attributes);
      }, this)
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {
      App.on('Toolbar:action', function(actionName) {
        if (actionName === 'filter') {
          this.openForm();
        }
      }, this);
    },

    /**
     * Setting form state
     * @param {Object} newState
     */
    setState: function(newState) {
      this.state.set(newState);
    },

    /**
     * Open modal and render form inside
     */
    openForm: function() {
      this.modal.open(this.filterForm);
      this.renderForm();
    },

    /**
     * Close form and modal
     */
    closeForm: function() {
      this.modal.close();
    },

    /**
     * Fetch all presenters and render all inputs
     */
    renderForm: function() {
      if (!this.loaded) {
        var promises = _.map(this.inputs, function(input) {
          return input.fetchOptions();
        });
        $.when.apply($, promises).done(function() {
          this.filterForm.render();
          this.loaded = true;
        }.bind(this));
      } else {
        this.filterForm.render();
      }
    }

  });

})(this.App);
