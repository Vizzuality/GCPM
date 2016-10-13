(function(App) {

  'use strict';

  var blubbleSizes = {
    big: 90,
    medium: 65,
    small: 45
  };

  /**
   * Creating buble marker layer for region and countries layer
   * @param  {Object} geoJson
   * @param  {Object} params
   * @return {Object} layer
   */
  App.helper.bubbleLayer = function(geoJson, params, layerFacade) {
    var markerTemplate = HandlebarsTemplates['marker_bubble'];

    return L.geoJson(geoJson, {
      pointToLayer: function(feature) {
        var location = feature.geometry.coordinates;
        var bubleSize = blubbleSizes.small;
        if (feature.properties.count >= 100 &&
          feature.properties.count < 999) {
          bubleSize = blubbleSizes.medium;
        } else if (feature.properties.count > 999) {
          bubleSize = blubbleSizes.big;
        }
        var className = 'bubble-icon ' +
          (params.data === 'events' ? '-orange' : '-blue');
        var chartData = [
          { value: feature.properties.project_leads },
          { value: feature.properties.collaborators }
        ];
        var donutChart = App.helper.donutChart(chartData);
        var bubbleIcon = L.divIcon({
          iconSize: [bubleSize, bubleSize],
          className: className,
          html: markerTemplate(Object.assign({}, feature.properties, {
            chart:  App.helper.utils.svgToHTml(donutChart)
          }))
        });
        return L.marker(location, { icon: bubbleIcon });
      },
      onEachFeature: function(feature, layer) {
        layer.on('click', function() {
          var eventName = null;
          if (!params['regions[]'] && !params['countries[]']) {
            eventName = 'region';
          } else if (params['regions[]'] && !params['countries[]']) {
            eventName = 'country';
          }
          var newState = Object.assign(feature.properties, params);
          if (eventName) {
            layerFacade.trigger(eventName + ':change', newState);
          }
        });
      }
    });
  };

})(this.App);
