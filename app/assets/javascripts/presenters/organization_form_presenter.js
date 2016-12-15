(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.OrganizationForm = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationForm.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);
      this.DOMelementId = params.DOMelementId;

      var organizationName = new App.Presenter.OrganizationName();
      var organizationCountry = new App.Presenter.OrganizationCountry();
      var organizationType = new App.Presenter.OrganizationType();
      var organizationLatitude = new App.Presenter.OrganizationLatitude();
      var organizationLongitude = new App.Presenter.OrganizationLongitude();
      var organizationCity = new App.Presenter.OrganizationCity();


      this.children = [organizationName, organizationType, organizationCountry,
         organizationLatitude, organizationLongitude, organizationCity];

      this.modal = new App.View.Modal();
      this.organizationForm = new App.View.OrganizationForm({
        children: this.children
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.organizationForm.on('cancel', this.closeForm, this);
      this.organizationForm.on('submit', function(newState) {
        this.setState(newState);
        App.trigger('OrganizationForm:submit'+this.DOMelementId, this.state.attributes);
        this.closeForm();
      }, this);
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {

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
      this.modal.open(this.organizationForm);
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
      this.organizationForm.render();
      _.each(this.children, function(child){
        // Get && set the value from the state thanks to the name
        // I need to pass the rest of the params because there are some presenters that need other params
        // Then, inside of each presenter, they will handle its state
        var state = _.extend({}, this.state.toJSON(), {
          value: this.state.get(child.defaults.name),
        })

        child.setState(state, { silent: true });

        // Render the child
        child.render();
      }.bind(this));
    }

  });

})(this.App);
