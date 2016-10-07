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
        var bubbleIcon = L.divIcon({
          iconSize: [bubleSize, bubleSize],
          className: className,
          html: feature.properties.count
        });
        return L.marker(location, { icon: bubbleIcon });
      },
      onEachFeature: function(feature, layer) {
        layer.on('click', function() {
          var eventName = null;
          if (!params.region && !params.country) {
            eventName = 'region';
          } else if (params.region && !params.country) {
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
