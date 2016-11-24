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
      this.layersCollection = new App.Collection.Layers();
      this.layersCollection.fetch();

      this.legend = new App.View.Legend({
        el: '#legend',
        data: null
      });

      this.modal = new App.View.Modal();

      this.setEvents();
      this.setSubscriptions();

      this.setState(_.extend({}, params, { active: false }));
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
      this.layersCollection.on('reset sync change', function(){
        this.renderLegends();
      }, this);

      this.legend.on('info', function(info){
        var data = info;
        if (!info || info === '') {
          data = 'No info available.';
        }
        this.modal.open(data);
      }, this);

      this.state.on('change', function () {
        this.renderLegends();
        App.trigger('Legends:change', this.getState());
      }, this);
    },

    setSubscriptions: function () {
      App.on('Action:legend', this.toggleActive, this);
      App.on('TabNav:change Breadcrumbs:change FilterForm:change Map:change', this.setState, this);
      this.legend.on('close', this.closeLayer.bind(this));

    },

    renderLegends: function () {
      var markerLegend = this.getMarkerLegend();
      var layerLegend = this.getLayerLegend();

      this.legend.updateData(markerLegend, layerLegend);
    },

    getMarkerLegend: function() {
      var data;
      var attributes = this.getState();
      switch (attributes.data) {
        case 'projects':
          data = [
            { name: 'Projects', icon: CIRCLE_ICON, dataType: 'projects' },
            { name: 'Project leads', icon: '<div class="square-icon" style="background: #FFFFFF"></div>', dataType: 'projects' },
            { name: 'Collaborators', icon: '<div class="square-icon" style="background: #78bbe8"></div>', dataType: 'projects' }
          ];

          if (attributes['countries[]']) {
            data = [
              { name: 'Project leads', icon: MARKER_ICON, dataType: 'projects' },
              { name: 'Collaborators', icon: CIRCLE_ICON, dataType: 'collaborators' },
              { name: 'Cluster', icon: CLUSTER_ICON, dataType: 'projects' }
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

      return data;
    },

    getLayerLegend: function() {
      var attributes = this.getState();
      var layers = this.layersCollection.toJSON();

      if (attributes.cartoLayer && layers && !!layers.length) {
        var layer = _.findWhere(layers, { slug: attributes.cartoLayer });
        layer.legend = (layer.legend) ? JSON.parse(layer.legend) : null;
        return layer;
      }
      return null;
    },

    closeLayer: function() {
      this.getState().active && this.toggleActive();
    },

    toggleActive: function(){
      var active = this.getState().active ? false : true;
      this.legend.$el.toggleClass('-active', active);

      this.setState(_.extend({}, this.state.attributes, { active: active }));
    },

  });

})(this.App);
