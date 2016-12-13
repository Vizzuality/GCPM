(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.FilterBar = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FilterBar.prototype, {

    initialize: function(params) {
      this.state = new StateModel(params);


      this.countries = new App.Collection.Countries();
      this.cancerTypes = new App.Collection.CancerTypes();
      this.organizations = new App.Collection.Organizations();
      this.organizationTypes = new App.Collection.OrganizationTypes();
      this.projectTypes = new App.Collection.ProjectTypes();
      this.fundingSources = new App.Collection.FundingSources();

      this.filterBar = new App.View.FilterBar({
        el: '#filterBarView'
      });

      this.setEvents();
      this.setSubscriptions();

      var promises = [
        this.countries.fetch(),
        this.cancerTypes.fetch(),
        this.organizations.fetch(),
        this.organizationTypes.fetch(),
        this.projectTypes.fetch(),
        this.organizationTypes.fetch(),
        this.fundingSources.fetch()
      ];

      $.when.apply($, promises).done(function() {
        this.setState(params, { silent: true });
        this.getParsedFilters();
      }.bind(this));
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
    },

    /**
     * Subscribing to global events
     */
    setSubscriptions: function() {
      App.on('FilterForm:change TabNav:change Breadcrumbs:change Map:change', function(newState){
        this.setState(newState, { silent: true });
        this.getParsedFilters();
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

    getParsedFilters: function() {
      var state = _.pick(this.getState(), 'regions[]', 'countries[]', 'cancer_types[]', 'organizations[]', 'organization_types[]', 'project_types[]', 'funding_sources[]', 'start_date', 'end_date');
      var countries = this.countries.toJSON(),
          regions = this.countries.getRegions();
      var _value = null;

      var cancerTypes = this.cancerTypes.toJSON();
      var organizations = this.organizations.toJSON();
      var organizationTypes = this.organizationTypes.toJSON();
      var projectTypes = this.projectTypes.toJSON();
      var fundingSources = this.fundingSources.toJSON();

      var data = _.compact(_.map(state, function(value, key) {
        switch(key) {
          case 'regions[]':
            if (value) {
              return { value: _.findWhere(regions, { region_iso: value }).region_name};
            }
          break
          case 'countries[]':
            if (value) {
              return { value: _.findWhere(countries, { country_iso_3: value }).name};
            }
          break
          case 'cancer_types[]':
            if (value) {
              _value = this.getValue(value, cancerTypes);
              return (_value) ? { value: _value } : null;
            }
          break
          case 'organizations[]':
            if (value) {
              _value = this.getValue(value, organizations);
              return (_value) ? { value: _value } : null;
            }
          break
          case 'organization_types[]':
            if (value) {
              _value = this.getValue(value, organizationTypes);
              return (_value) ? { value: _value } : null;
            }
          break
          case 'project_types[]':
            if (value) {
              _value = this.getValue(value, projectTypes);
              return (_value) ? { value: _value } : null;
            }
          break
          case 'funding_sources[]':
            if (value) {
              _value = this.getValue(value, fundingSources);
              return (_value) ? { value: _value } : null;
            }
          break
          case 'start_date':
            if (value) {
              return { value: value };
            }
          break
          case 'end_date':
            if (value) {
              return { value: value };
            }
          break
          default:
            if (value) {
              return { value: _.isArray(value) ? value.join(', ') : value };
            }
        }
        return null;
      }.bind(this)));

      this.filterBar.updateFilters(data);
    },

    getValue: function(value, arr) {
      var _value = null;
      if (_.isArray(value)) {
        _value =  _.compact(_.map(value, function(v){
          var selected = _.findWhere(arr, { id: +v })
          return (selected) ? selected.name : null;
        })).join(', ');
      } else {
        var selected = _.findWhere(arr, { id: +value });
        _value = (selected) ? selected.name : null;
      }

      return _value;
    }
  });

})(this.App);
