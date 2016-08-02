(function(App) {

  'use strict';

  App.Helper = App.Helper || {};

  App.Helper.MarkerLayer = App.Helper.Class.extend({

    defaults: {},

    template: HandlebarsTemplates['marker'],

    colors: {
      'projects': ['#5aade4', '#f57823', '#68299b', '#CCC'],
      'people': ['#FFF', '#8653AF'],
      'event': ['#FFF', '#F59356']
    },

    strokeColors: {
      'projects': '#FFF',
      'people': '#68299b',
      'event': '#f57823'
    },

    initialize: function(map, settings) {
      if (!map && map instanceof L.Map) {
        throw 'First params "map" is required and a valid instance of L.Map.';
      }

      this.map = map;
      this.options = _.extend({}, this.defaults, settings || {});
    },

    /**
     * Create a CartoDB layer
     * @param  {Function} callback
     */
    create: function(callback) {
      var markers = this.options.markers;
      if (markers && markers.length) {
        this.markers = _.map(markers, function(marker){
          var size = this.getSize(marker.count),
              svg = this.getSVG(marker);

          // Create icon
          var icon = new L.divIcon({
            iconSize: [size,size],
            // Need to set marker.type on each marker
            className: 'c-marker -' + marker.type,
            html: this.template({
              value: (marker.count > 1) ? marker.count : '',
              svg: (!!svg) ? this.getHtmlString(svg) : null
            })
          });

          var markerIcon = L.marker(marker.centroid, {
            icon: icon,
            riseOnHover: true,
            data: {
              location_name: marker.location_name,
              iso: marker.iso
            }
          }).on('mouseover', this._onMouseover.bind(this))
            .on('mouseout', this._onMouseout.bind(this))
            .on('click', this._onMouseclick.bind(this));

          // Return a leaflet marker
          return markerIcon;

        }.bind(this));

        // Group the markers and add them to the map
        var group = L.featureGroup(this.markers).addTo(this.map);
        // Fit bounds to see all the markers
        this.map.fitBounds(group.getBounds());
      } else {
        // TO-DO: notification => no markers with the selected parameters
        alert('no markers with the selected parameters');
        this.map.setView([0, 0], 3);
      }
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

    getSize: function(value) {
      var constant = 20,
          multiplier = 10,
          size = Math.round(constant + (Math.log(value) * multiplier));

      return size;
    },

    getSVG: function(marker) {
      if (marker.segments) {
        var marker = marker,
            size = this.getSize(marker.value),
            total = marker.value,
            pi = Math.PI;


        // Create an svg element
        var svg = document.createElementNS(d3.ns.prefix.svg, 'svg');

        // Set the svg with the arc
        var vis = d3.select(svg)
                    .attr('width', size)
                    .attr('height', size)

        // Add each arc to the svg element
        var angle = 0;
        _.each(marker.segments, function(segment, i){
          var degrees = Math.round(360*(segment.value/total));
          // Create an arc
          var arc = d3.svg.arc()
            .innerRadius(size/2 - 10)
            .outerRadius(size/2 - 4)
            .startAngle(angle * (pi/180)) //converting from degs to radians
            .endAngle((angle + degrees) * (pi/180)) //converting from degs to radians

          vis.append('path')
            .attr('d', arc)
            .attr('fill', this.colors[this.options.type][i])
            .attr('stroke-width', 2)
            .attr('stroke', this.strokeColors[this.options.type])
            .attr('transform', 'translate('+size/2+','+size/2+')');

          angle = angle + Math.round(360*segment.value/total);

        }.bind(this));
        return svg;        
      }

      return null;

    },

    getHtmlString: function(xmlNode) {
      if (typeof window.XMLSerializer != 'undefined') {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
      } else if (typeof xmlNode.xml != 'undefined') {
        return xmlNode.xml;
      }
      return "";
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
      console.log(e);
      console.log(e.target.options.data);
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

})(this.App);
