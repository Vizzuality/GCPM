(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.FilterForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FilterForm.prototype, {

    defaults: {
      'countries[]': undefined,
      'regions[]': undefined,
      'cancer_types[]': undefined,
      'organization_types[]': undefined,
      'organizations[]': undefined,
      'project_types[]': undefined,
      start_date: null,
      end_date: null
    },

    initialize: function(params) {
      this.state = new StateModel(params);

      var countries = new App.Presenter.Countries({
        label: null,
        addNew: false
      });
      var organizations = new App.Presenter.Organizations({
        label: null,
        addNew: false
      });
      var cancerTypes = new App.Presenter.CancerTypes({
        label: null,
        addNew: false
      });
      var projectTypes = new App.Presenter.ProjectTypes({
        label: null,
        addNew: false
      });
      var organizationsTypes = new App.Presenter.OrganizationTypes({
        label: null,
        addNew: false
      });

      var pickadateStart = new App.Presenter.PickadateStart();
      var pickadateEnd = new App.Presenter.PickadateEnd();

      this.children = [countries, organizations, cancerTypes, projectTypes, organizationsTypes, pickadateStart, pickadateEnd];

      this.countries = new App.Collection.Countries();
      this.countries.fetch();

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
        // Set the region before setting the newState
        if (newState['countries[]']) {
          newState['regions[]'] = _.findWhere(this.countries.toJSON(), { country_iso_3: newState['countries[]'] }).region_iso;
        }
        this.setState(newState);
        this.closeForm();
      }, this);

      this.filterForm.on('reset', function() {
        this.setState(this.defaults);
        this.closeForm();
        App.trigger('FilterForm:reset');
      }, this)

      this.state.on('change', function() {
        App.trigger('FilterForm:change', this.getState());
      }, this);

      App.on('TabNav:change Breadcrumbs:change Map:change', function(newState){
        this.setState(newState, { silent: true });
      }, this);
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
    setState: function(newState, options) {
      this.state
        .clear({ silent: true })
        .set(newState, options);
    },

    getState: function() {
      return this.state.attributes
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
        App.trigger('Modal:loading', { loading: true });

        var promises = _.compact(_.map(this.children, function(child) {
          if (child.fetchData) {
            return child.fetchData();
          }
          return null;
        }));

        $.when.apply($, promises).done(function() {
          this.loaded = true;
          this.renderFormElements();
          App.trigger('Modal:loading', { loading: false });
        }.bind(this));

      } else {
        this.renderFormElements();
        App.trigger('Modal:loading', { loading: false });
      }
    },

    renderFormElements: function() {
      this.filterForm.render();
      _.each(this.children, function(child){
        // Get && set the value from the state thanks to the name
        // I need to pass the rest of the params because there are some presenters that need other params
        // Then, inside of each presenter, they will handle its state
        var state = _.extend({}, this.state.toJSON(), {
          value: this.state.get(child.defaults.name)
        });
        child.setState(state, { silent: true });

        // Render the child
        child.render();
      }.bind(this));
    }
  });

})(this.App);
