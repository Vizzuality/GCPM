(function(App) {

  'use strict';

  App.Router = Backbone.Router.extend({

    routes: {
      /* Had to set root path this way to allow main
       listeners to init common views in the home */
      '': '',
      // map
      'map': 'map',
      'countries': 'countries',
      'countries/:iso': 'country',
      'cancer-types': 'cancer-types',
      'cancer-types/:iso': 'cancer-type',
      'about': 'about',
      'events/:id': 'event',
      'projects/:id': 'project',
      'network/:id': 'network',
      'network/:id/projects/:val/edit': 'editproject'
    },

    params: new (Backbone.Model.extend()),

    initialize: function(settings) {
      this.utils = App.Helper.Utils;

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);

      this.listeners()
    },

    listeners: function() {
      App.Events.on('params:update', function(params){
        this.params.clear().set(params, { silent: true });
        this.updateUrl();
      }.bind(this));      
    },

    /**
     * Change url with params
     */
    updateUrl: function() {
      var url = location.pathname.slice(1) + '?' + this._serializeParams();
      this.navigate(url, { trigger: false });
    },

    /**
     * Transform URL string params to object
     * @return {Object}
     */
    _unserializeParams: function() {
      var params = {};
      var search = window.location.search;
      if (!!search) {
        params = this.utils.getParams(search.substring(1));
      }
      return params;
    },

    /**
     * Transform object params to URL string
     * @return {String}
     */
    _serializeParams: function() {
      return this.params ? $.param(this.params.attributes) : null;
    },

    /**
     * - getParams
     * Return params
     * @return {Object}
     */
    getParams: function() {
      return this._unserializeParams();
    }

  });

})(this.App);
