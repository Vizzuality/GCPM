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
      this.tooltipEl = $('#map-tooltip');
      this.tooltipTpl = HandlebarsTemplates['map-tooltip'];
    },

    /**
     * Create a CartoDB layer
     * @param  {Function} callback
     */
    create: function() {
      var markers = this.options.markers;
      if (markers && markers.length) {
        this.markers = _.compact(_.map(markers, function(marker){
          if (! !!marker.centroid) { return null; }

          var size = this.getSize(marker.count),
              svg = this.getSVG(marker);

          // Create icon
          var icon = new L.divIcon({
            iconSize: [size,size],
            // Need to set marker.type on each marker
            className: 'c-marker -' + marker.type + ' -'+this.options.type,
            html: this.template({
              value: (marker.count > 1) ? marker.count : '',
              svg: (!!svg) ? this.getHtmlString(svg) : null
            })
          });

          var markerIcon = L.marker(marker.centroid, {
            icon: icon,
            riseOnHover: true,
            data: {
              type: marker.type,
              path: this.options.type,
              location_id: marker.project || marker.location_id,
              location_name: marker.project_title || marker.title || marker.location_name,
              location_iso: marker.iso
            }
          }).on('mouseover', this._onMouseover.bind(this))
            .on('mouseout', this._onMouseout.bind(this))
            .on('click', this._onMouseclick.bind(this));

          // Return a leaflet marker
          return markerIcon;

        }.bind(this)));

        // Group the markers and add them to the map
        this.markersGroup = L.featureGroup(this.markers).addTo(this.map);
        // Fit bounds to see all the markers
        this.map.fitBounds(this.markersGroup.getBounds(), {
          maxZoom: 10
        });
      } else {
        // TO-DO: notification => no markers with the selected parameters
        console.log('no markers with the selected parameters');
        this.map.setView([0, 0], 3);
      }
    },

    /**
     * Remove cartodb layer and sublayers
     */
    remove: function() {
      if (this.markersGroup) {
        this.map.removeLayer(this.markersGroup);
        this.markersGroup = null;
      } else {
        console.info('There aren\'t markers.');
      }
    },

    getSize: function(value) {
      var constant = 20,
          multiplier = 10,
          size = 16;

      if (value) {
        size = Math.round(constant + (Math.log(value) * multiplier));
      }
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


    /**
     * UI EVENTS
     * - _onMouseover
     * - _onMouseout
     * - _onMouseclick
     */
    _onMouseover: function(e) {
      var pos = this.map.latLngToContainerPoint(e.target._latlng);
      var data = e.target.options.data;

      this.tooltipEl
        .css({
          left: pos.x,
          top: pos.y
        })
        .html(this.tooltipTpl(data))
        .addClass('-active');

    },

    _onMouseout: function(e) {
      this.tooltipEl
        .html('')
        .removeClass('-active');
    },

    _onMouseclick: function(e) {
      // Remove the tooltip if it was openend
      this.tooltipEl
        .html('')
        .removeClass('-active');

      var data = e.target.options.data;
      
      if (data.type == 'region') {
        Backbone.Events.trigger('filters:update', {
          'regions[]': data.location_iso
        });
      }

      if (data.type == 'country') {
        Backbone.Events.trigger('filters:update', {
          // Should we set the regions to null?
          // 'regions[]': null,
          'countries[]': data.location_id
        });
      }

      if (data.type == 'point') {
        var path = '/'+data.path+'/';
        // And events??
        window.location = path + data.location_id
      }      
    },

  });

})(this.App);
