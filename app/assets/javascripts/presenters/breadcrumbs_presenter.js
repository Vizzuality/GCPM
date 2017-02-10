/* global ga */
(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Breadcrumbs = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Breadcrumbs.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.countries = new App.Collection.Countries();
      this.breadcrumbs = new App.View.Breadcrumbs({
        el: '#breadcrumbs'
      });

      this.setEvents();
      this.setSubscriptions();

      this.countries.fetch().done(function() {
        this.setState(params);
      }.bind(this));
    },

    setState: function(newState) {
      newState.global = 'all'; // Always show global link
      this.state
        .clear({ silent: true })
        .set(newState);
    },

    getState: function() {
      return this.state.attributes;
    },

    setEvents: function() {
      this.breadcrumbs.on('change', function(breadcrumb) {
        var newState = {};
        if (breadcrumb.name === 'countries[]') {
          newState['regions[]'] = this.getState()['regions[]'];
          newState['countries[]'] = breadcrumb.value;
        } else if (breadcrumb.name === 'regions[]') {
          newState['regions[]'] = breadcrumb.value;
          newState['countries[]'] = null;
        } else {
          newState['regions[]'] = null;
          newState['countries[]'] = null;
        }
        this.setState(_.extend({}, this.getState(), newState));
        App.trigger('Breadcrumbs:change', this.getState());
       }, this);

      this.state.on('change', function() {
        this.renderBreadcrumbs();
      }, this);
    },

    setSubscriptions: function() {
      App.on('TabNav:change FilterForm:change Map:change', this.setState, this);
    },

    renderBreadcrumbs: function() {
      var state = _.pick(this.getState(), 'global', 'regions[]', 'countries[]');
      var countries = this.countries.toJSON(),
          regions = this.countries.getRegions();

      var data = _.map(state, function(value, key) {
        var string = value;

        switch(key) {
          case 'regions[]':
            if (value) {
              string = _.findWhere(regions, { region_iso: value }).region_name;
              if (!state['countries']) {
                ga('send', 'event', 'Map', 'Zoom to Region', string);
              }
            }
          break;
          case 'countries[]':
            if (value) {
              string = _.findWhere(countries, { country_iso_3: value }).name;
              ga('send', 'event', 'Map', 'Zoom to Country', string);
            }
          break;
        }

        return {
          link: '?' + key + '=' + value,
          name: key,
          value: value,
          string: string
        };
      }.bind(this));
      this.breadcrumbs.updateData(data);
    }

  });

})(this.App);
