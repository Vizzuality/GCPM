(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Organization = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Organization.prototype, {

    defaults: {
      multiple: false,
      name: 'organization',
      label: 'Organization',
      placeholder: 'All organizations',
      blank: true,
      addNew: true,
      select2Options: {
        minimumInputLength: 3,
        ajax: {
          url: '/api/organizations',
          delay: 150,
          cache: false,
          data: function (params) {
            var query = {
              q: params.term,
              page: params.page || 1
            }
            // Query paramters will be ?q=[term]&page=[page]
            return query;
          },

          processResults: function (organizations) {
            return {
              results: _.sortBy(_.map(organizations, function(org){
                return {
                  text: org.name,
                  id: org.id
                };
              }), 'text')
            }
          }
        }
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.organizations = new App.Collection.Organizations();

      // Creating view
      this.select = new App.View.Select({
        el: viewSettings.DOMelement,
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });
      this.DOMelementId = viewSettings.DOMelement.split("-")[1];

      this.organizationForm = new App.Presenter.OrganizationForm({
        DOMelementId: this.DOMelementId
      });

      this.setEvents();
      this.setSubscriptions();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('new', function(){
        this.organizationForm.openForm();
      }, this);

      this.select.on('setValues', function(values){
        this.setValues(values);
      }, this);

      this.select.on('change', function(newState){
        this.setState(newState);
        App.trigger('Organization:change', {state:this.state, el:this.select});
      }, this);

    },

    setSubscriptions: function(){
      App.on('OrganizationForm:submit'+this.DOMelementId, function(newOrganization){
        var newOption = {
          value: JSON.stringify(newOrganization)
        };
        newOption.name = newOrganization.organizationName;
        this.select.options.options.unshift(newOption);
        this.select.render();
        // Auto set value
        this.setValue(newOption.value);
      }, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return true;
    },

    render: function() {
      this.select.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    setValue: function(values){
      this.select.$el.find("select").val(values).trigger("change");
    },

    setValues: function(values) {
      _.each(values, function(v){
        if (v) {
          this.organizationModel = new App.Model.Organization({
            id: v
          });
          this.organizationModel.fetch().done(function(model){
            $(this.select.select.selector).select2("trigger", "select", {
              data: {
                id: model.id,
                text: model.name
              }
            });
          }.bind(this));
        }
        // var current = _.findWhere(this.options.options, { id: parseInt(v) }) || _.findWhere(this.options.options, { value: parseInt(v) });
      }.bind(this));
    },

    setFetchedValues: function(value){
      this.select.$el.find("select").val(value).trigger("change");
      this.select.$el.find("select").attr("disabled", true);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);
