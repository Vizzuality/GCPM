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
        var className = 'bubble-icon';
        var chartData = [];
        var markerData = {};
        var chartColors = [];
        if (params.data === 'events') {
          chartColors = ['#ffffff', '#fbbf96'];
          // chartData = [
          //   { value: feature.properties.collaborators },
          //   { value: feature.properties.project_leads }
          // ];
        } else if (params.data === 'people') {
          chartColors = ['#ffffff', '#68299b'];
          // chartData = [
          //   { value: feature.properties.collaborators },
          //   { value: feature.properties.project_leads }
          // ];
        } else if (params.data === 'projects') {
          chartColors = ['#ffffff', '#78bbe8'];
          chartData = [
            { value: feature.properties.project_leads },
            { value: feature.properties.collaborators }
          ];
        }
        if (chartData.length > 0) {
          var donutChart = App.helper.donutChart(chartData, {
            size: {
              width: bubleSize,
              height: bubleSize,
              radius: 3,
              padding: 2
            },
            colors: chartColors
          });

          markerData = _.extend({}, feature.properties, {
            chart:  App.helper.utils.svgToHTml(donutChart)
          })
        } else {
          markerData = feature.properties;
        }
        var bubbleIcon = L.divIcon({
          iconSize: [bubleSize, bubleSize],
          className: className,
          html: markerTemplate(markerData)
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

          var newState = _.extend({}, feature.properties, params);
          if (eventName) {
            layerFacade.trigger(eventName + ':change', newState);
          }
        });
      }
    });
  };

})(this.App);
