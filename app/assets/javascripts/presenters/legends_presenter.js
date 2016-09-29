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
          data = [
            { blueCircle: true, description: 'Projects', number: '1,387' },
            { blueSquare: true, description: 'Collaborators', number: '1,829' },
            { whiteSquare: true, description: 'Project Leads', number: '16,322' }
            ];
          break;
        case 'events':
          data = [
            { orangeCircle: true, description: 'Events Per Region', number: '1,387' },
            { orangeSquare: true, description: 'Public Events', number: '1,829' },
            { whiteSquare: true, description: 'Private Events', number: '16,322' }
            ];
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
