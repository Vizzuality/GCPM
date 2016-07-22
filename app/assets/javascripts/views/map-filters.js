(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapFilters = App.Helper.Modal.extend({

    id: '#map-filters',

    className: "c-modal c-map-filters",

    template: HandlebarsTemplates['map-filters'],

    initialize: function() {
      // Inits
      this.render();
      this.listeners();
      // All the methods that has _ is because they belong to the Parent View
      this._cache();
      this._listeners();

      this.$body.append(this.el);
    },

    listeners: function() {
      Backbone.Events.on('Filters/toggle', function(){
        this.toggle();
      }.bind(this));
    },

    render: function() {
      this.$el.html(this.template());
      return this;
    },

    // Fetch model when click
    sourceClick: function(e) {
      e && e.preventDefault() && e.stopPropagation();
      // current
      this.$current = $(e.currentTarget);
      this.$current.find('svg').attr('class','spinner-info start');

      this.sourceModel = new SourceModel({
        slug: this.$current.data('source'),
      });
      this.sourceModel.fetch({
        update:true,
        parse: true,
        success: this.sourceSuccess.bind(this),
        error: this.sourceError.bind(this),
      });
    },

    sourceSuccess: function() {
      this.$current.find('svg').attr('class','');
      this.$el.html(this.template(this.getData()));
      this.show();
      this.setTargetOfLinks();
      ga('send', 'event', document.title.replace('| Global Forest Watch',''), 'Info', this.sourceModel.get('slug'));
    },

    sourceError: function(error) {
      this.$current.find('svg').attr('class','');
      console.info('The id you are searching for does not exist in the API');
      this.sourceStatic(this.sourceModel.get('slug'));
    },

    // Fetch content when click fails
    sourceStatic: function(slug) {
      var $clone = $('#' + slug).clone();
      if (!!$clone.length) {
        this.$el.html(this.templateStatic({ clone: $clone.html() }));
        this.show();
        this.setTargetOfLinks();
      } else {
        console.info('The id you are searching for does not exist');
        this.presenter.notificate('notification-no-metadata')
      }
    },

    setTargetOfLinks: function() {
      this.$el.find('a').attr('target', '_blank');
    },

    /**
     * [getData]
     * @return {[object]} [source Model with some amendments]
     */
    getData: function() {
      var data = this.sourceModel.toJSON();
      if (data.amazon_link) {
        // var file = encodeURIComponent(data.sql_api + '&format=geojson').replace(/%20/g, "%2520");
        data.open_in_carto = 'http://oneclick.cartodb.com?file='+encodeURIComponent(data.amazon_link);
      }

      if (data.map_service) {
        data.open_in_arcgis = 'http://www.arcgis.com/home/webmap/viewer.html?url='+ data.map_service;
      }

      if (data.download_data || data.open_in_carto || data.open_in_arcgis) {
        data.footer = true;
      }

      return data;
    }

  });

})(this.App);
