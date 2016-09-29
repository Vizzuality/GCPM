(function (App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});

  App.Presenter.Legends = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Legends.prototype, {

    initialize: function (params) {
      this.state = new StateModel();
      this.legends = new App.View.Legends({ el: '#legends' });

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setState: function (params) {
      this.state
        .set(_.pick(params, 'data', 'global', 'region', 'country'));
    },

    getState: function () {
      return this.state.attributes;
    },

    setEvents: function () {
      this.state.on('change', function () {
        this.renderLegends();
        App.trigger('Legends:change', this.getState());
      }, this);
    },

    setSubscriptions: function () {
      App.on('Map:change', this.setState, this);
    },

    renderLegends: function () {
      var data;
      var attributes = this.getState();

      switch (attributes.data) {
        case 'projects':
          data = [{ blueCircle: true, description: 'Number of Projects' }];
          if (typeof attributes.country !== 'undefined') {
            data = [
              { blueMarker: true, description: 'Project Leads' },
              { purpleCircle: true, description: 'Researchers' }
            ];
          }
          break;
        case 'events':
          data = [{ orangeCircle: true, description: 'Events Per Region' }];
          if (typeof attributes.region !== 'undefined') {
            data = [{ orangeCircle: true, description: 'Number of Events' }];
            if (typeof attributes.country !== 'undefined') {
              data = [{ orangeMarker: true, description: 'Events' }];
            }
          }
          break;
        case 'people':
          break;
        default:
          break;
      }

      this.legends.updateData(data);
    }
  });

})(this.App);
