(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  /**
   * A wrapper for Marker layers
   * More info: http://docs.cartodb.com/cartodb-platform/cartodb-js.html
   */
  
  App.Helper.MarkerLayer = Backbone.View.extend({

    defaults: {},

    // tooltipEl: $('#locationTooltipView'),
    // tooltipTpl: HandlebarsTemplates['locationsTooltipTpl'],

    initialize: function(map, settings) {
      if (!map && map instanceof L.Map) {
        throw 'First params "map" is required and a valid instance of L.Map.';
      }
      var opts = settings || {};
      this.options = _.extend({}, this.defaults, opts);
      
      this.map = map;
    },

    /**
     * Create a CartoDB layer
     * @param  {Function} callback
     */
    create: function(callback) {
      // var locations = this.options.locations; 

      this.markers = _.map(locations, function(l){
        
        // var lat = l.geometry.coordinates[1];
        // var lng = l.geometry.coordinates[0];
        // var category = l.properties.category;

        // return new L.circleMarker([lat,lng], {
        //   // Stroke
        //   color: '#FFF',
        //   weight: 1,
        //   data: l.properties,
        //   // Fill
        //   fillColor: this.colors[category],
        //   fillOpacity: 0.9,
        //   radius: 10,
        //   className: 'm-marker'

        // }).on('mouseover', this._onMouseover.bind(this))
        //   .on('mouseout', this._onMouseout.bind(this))
        //   .on('click', this._onMouseclick.bind(this));

      }.bind(this));

      // Add to map
      _.each(this.markers, function(marker){
        marker.addTo(this.map);
      }.bind(this));

    },

    /**
     * Remove cartodb layer and sublayers
     */
    remove: function() {
      if (this.markers) {
        _.compact(_.map(this.markers, function(marker){
          marker.off('mouseover')
                .off('mouseout')
                .off('click');
          this.map.removeLayer(marker);  
        }.bind(this)));
        this.markers = null;
      } else {
        console.info('There aren\'t markers.');
      }
    },


    _onMouseover: function(e) {
      // var pos = this.map.latLngToContainerPoint(e.target._latlng);
      // var data = e.target.options.data;
      // e.target.bringToFront();
      // this.tooltipEl
      //   .css({
      //     left: pos.x,
      //     top: pos.y
      //   })
      //   .html(this.tooltipTpl(data))
      //   .removeClass()
      //   .addClass('m-location-tooltip -active -'+data.category);
    },

    _onMouseout: function(e) {
      // this.tooltipEl
      //   .html('')
      //   .removeClass()
      //   .removeClass('-active');
    },

    _onMouseclick: function(e) {
      // // set default radius to all markers
      // this._resetSelected();
      // // set default radius to current
      // Backbone.Events.trigger('Location/update', e.target.options.data.cartodb_id);
    },

    _setSelected: function(id) {
      // if (!!this.markers && !!this.markers.length) {
      //   var currentMarker = _.find(this.markers, function(marker) {
      //     return (marker.options.data.cartodb_id == id);
      //   });
        
      //   currentMarker.bringToFront();
      //   currentMarker.setRadius(25);
      // }
    },

    _resetSelected: function() {
      // if (!!this.markers && !!this.markers.length) {
      //   // set default radius to all markers
      //   _.each(this.markers, function(marker){
      //     marker.setRadius(10);  
      //   }.bind(this));      
      // }
    }

  });

})(this);
