(function(App) {

  'use strict';

  /**
   * Main Application View
   */
  App.MainView = Backbone.View.extend({

    /**
     * Main DOM element
     * @type {Object}
     */
    el: 'body',

    events: {
      'click a[data-magic]': 'isMagicLink'
    },

    initialize: function() {
      this.$content = $('#content');
      this.router = new App.Router();
      // this.initCommonTools();
      // this.initCommonViews();
      this.listeners();
    },

    listeners: function() {
      this.listenTo(this.router, 'route:countries', this.countriesPage);
      this.listenTo(this.router, 'route:country', this.countryPage);
      this.listenTo(this.router, 'route:event', this.eventDetailPage);
      this.listenTo(this.router, 'route:project', this.projectDetailPage);
      this.listenTo(this.router, 'route:network', this.userPage);
      this.listenTo(this.router, 'route:editproject', this.editProjectPage);
      this.listenTo(this.router, 'route:editevent', this.editEventPage);

      // Listening magic links
      App.Events.on('params:update', this.getContent);
      App.Events.on('remote:load', this.replaceContent);

      // Update params
      App.Events.on('filters:update', this.publishParams.bind(this));
      App.Events.on('filters:reset', this.resetParams.bind(this));
    },

    /**
     * Use data-magic attribute with remote: true
     * @param  {Event}  e
     */
    isMagicLink: function(e) {
      var href = e.currentTarget.getAttribute('href');
      this.router.navigate(href);

      /* Toggle c-section-menu item to -active */
      $(".c-section-menu li a").removeClass('-active');
      $(e.target).addClass("-active");
    },

    initCommonTools: function() {
      App.Helper.Utils.handlebarsHelpers();
    },

    // initCommonViews: function() {
    //   new App.View.MobileHeader();
    //   new App.View.Notice();
    //   new App.View.UserDropdownMenu();
    //   new App.View.Modal({ el: '#modalView' });
    // },

    getContent: function() {
      $.getScript(window.location.pathname + window.location.search, function(data, textStatus, jqxhr){
        // console.log(data, textStatus, jqxhr);
      })
    },

    replaceContent: function(data) {
      var contentElement = document.getElementById('content');
      if (contentElement) {
        contentElement.innerHTML = data.content;
      }
    },

    countriesPage: function() {
      this.params = this.setParams(this.router.getParams());
      /* Countries index search view */
      var regionsCollection = new App.Collection.Regions();
      var regionsView = new App.View.SearchList({
        searchList: regionsCollection,
        options: {
          template: HandlebarsTemplates['countries-list'],
          innerSearchListName: 'countries',
          itemSearchedCategory: 'country_name',
          isTwoLevels: true
        }
      });

      regionsCollection.fetch();
    },

    countryPage: function() {
      this.params = this.setParams(this.router.getParams());
      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
        options: {
          basemap: 'customDetail'
        }
      });
    },

    userPage: function() {
      this.params = this.setParams(this.router.getParams());
      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
        options: {
          basemap: 'customDetail'
        }
      });
    },

    editProjectPage: function() {
      new App.View.AddNewProject();
    },

    editEventPage: function() {
      new App.View.AddNewEvent();
    },

    eventDetailPage: function() {
      var params = this.router.getParams();

      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
        options: {
          basemap: 'customDetail',
          apiUrl: '/api/map/events/'+EVENT_ID
        }
      });

      layersCollection.toggleLayers([
        params.type || 'org-project-markers'
      ]);

      new App.View.EventDetail();
    },

    projectDetailPage: function() {
      var params = this.router.getParams();

      // Map view
      var layersCollection = new App.Collection.Layers();
      var mapView = new App.View.Map({
        layers: layersCollection,
        options: {
          basemap: 'customDetail',
          apiUrl: '/api/map/projects/'+PROJECT_ID
        }
      });

      layersCollection.toggleLayers([
        params.type || 'org-project-markers'
      ]);

      new App.View.ProjectDetail();
    },

    /**
     * - setParams
     * This function will parse the params of the url, if we need
     * different group or something like that
     *
     */
    setParams: function(params) {
      for (var i in params) {
        if (! !!params[i]) delete params[i];
        if (_.isArray(params[i]) && ! !!params[i].length) delete params[i];
      }

      if (params['regions[]']) {
        params.group = 'countries';
      }

      if (params['countries[]']) {
        params.group = 'points';
      }

      return params;
    },

    publishParams: function(newFilters) {
      // TO-DO: review when you have only one country, we need to save it as an array
      // TO-DO convert params to a backbone model. Like the other views like map or router
      this.params = this.setParams(_.extend({}, this.params, newFilters));
      App.Events.trigger('params:update', this.params);
    },

    resetParams: function() {
      // TO-DO: review when you have only one country, we need to save it as an array
      this.params = {};
      App.Events.trigger('params:update', this.params);
    },

  });

})(this.App);
