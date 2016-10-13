(function (App) {

  'use strict';

  var StateModel = Backbone.Model.extend({});
  var MARKER_ICON = '<svg class="marker-icon"><use xlink:href="#icon-marker"></use></svg>';
  var CIRCLE_ICON = '<div class="circle-icon"></div>'
  var CLUSTER_ICON = '<div class="cluster-icon"></div>';

  App.Presenter.Legend = function () {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Legend.prototype, {

    initialize: function (params) {
      this.state = new StateModel();

      this.legend = new App.View.Legend({
        el: '#legend',
        data: null
      });

      this.setEvents();
      this.setSubscriptions();

      this.setState(params);
    },

    setState: function (newState) {
      this.state
        .clear({ silent: true })
        .set(newState);
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
      App.on('TabNav:change Breadcrumbs:change FilterForm:change Map:change', this.setState, this);
    },

    renderLegends: function () {
      var data;
      var attributes = this.getState();

      switch (attributes.data) {
        case 'projects':
          data = [
            { name: 'Projects', icon: CIRCLE_ICON, dataType: 'projects' }
          ];

          if (attributes['countries[]']) {
            data = [
              { name: 'Cluster', icon: CLUSTER_ICON, dataType: 'projects' },
              { name: 'Project leads', icon: MARKER_ICON, dataType: 'projects' },
              { name: 'Collaborators', icon: CIRCLE_ICON, dataType: 'collaborators' }
            ];
          }
          break;
        case 'events':
          data = [
            { name: 'Events', icon: CIRCLE_ICON, dataType: 'events' }
          ];

          if (attributes['countries[]']) {
            data = [
              { name: 'Events', icon: MARKER_ICON, dataType: 'events' },
              { name: 'Cluster', icon: CLUSTER_ICON, dataType: 'events' }
            ];
          }
          break;
        case 'people':
          data = [
            { name: 'People', icon: CIRCLE_ICON, dataType: 'people' }
          ];

          if (attributes['countries[]']) {
            data = [
              { name: 'People', icon: MARKER_ICON, dataType: 'people' },
              { name: 'Cluster', icon: CLUSTER_ICON, dataType: 'people' }
            ];
          }
          break;
        default:
          data = [
            { name: 'Projects', icon: CIRCLE_ICON, dataType: 'projects' }
          ]
          break;
      }

      this.legend.updateData(data);
    }
  });

})(this.App);
