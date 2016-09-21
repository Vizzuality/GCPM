(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.FilterForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FilterForm.prototype, {

    initialize: function(params) {
      console.log(params);
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
      var organizationsTypes = new App.Presenter.OrganizationTypes(null, {
        label: null,
        addNew: false
      });

      var pickadateStart = new App.Presenter.PickadateStart();
      var pickadateEnd = new App.Presenter.PickadateEnd();

      this.children = [countries, organizations, cancerTypes, projectTypes, organizationsTypes, pickadateStart, pickadateEnd];

      this.modal = new App.View.Modal();
      this.filterForm = new App.View.FilterForm({
        children: this.children
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

      App.on('Modal:loading', function(state) {
        var loading = state.loading;
        this.modal.toggleLoader(loading);
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
     * Fetch all presenters and render all children
     */
    renderForm: function() {
      if (!this.loaded) {
        App.trigger('Modal:loading', {
          loading: true
        });
        // this.filterForm.showSpinner();
        var promises = _.compact(_.map(this.children, function(child) {
          if (!!child.fetchData) {
            return child.fetchData();
          }
          return null;
        }));

        $.when.apply($, promises).done(function() {
          App.trigger('Modal:loading', {
            loading: false
          });
          this.filterForm.render();
          _.each(this.children, function(child){
            child.render();
          });
          this.loaded = true;
        }.bind(this));

      } else {
        this.filterForm.render();
        _.each(this.children, function(child){
          child.render();
        });
        App.trigger('Modal:loading', {
          loading: false
        });
      }
    }

  });

})(this.App);
