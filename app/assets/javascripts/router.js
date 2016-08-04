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
      'network/:id/projects/:val/edit': 'editproject',
      'network/:id/projects/new': 'editproject'
    },

    params: new (Backbone.Model.extend()),

    initialize: function(settings) {
      this.utils = App.Helper.Utils;

      var opts = settings && settings.options ? settings.options : {};
      this.options = _.extend({}, this.defaults, opts);
    },

    /**
     * Set params and update model
     * @param {String} name
     * @param {String|Object|Array} value
     * @param {Array[String]} keys
     */
    setParams: function(name, value, keys) {
      if (typeof value === 'string' || typeof value === 'number') {
        this.params.set(name, value);
      } else if (typeof value === 'object' && !_.isArray(value)) {
        if (keys && _.isArray(keys)) {
          // var params = _.pick(value, 'id', 'opacity', 'order');
          // this.params.set(name, JSON.stringify(params));
        } else {
          this.params.set(name, JSON.stringify(value));
        }
      } else if (typeof value === 'object' && _.isArray(value)) {
        if (keys && _.isArray(keys)) {
          var params = _.map(value, function(v) {
            return _.pick(v, keys);
          });
          this.params.set(name, JSON.stringify(params));
        } else {
          this.params.set(name, JSON.stringify(value));
        }
      }
    },

    /**
     * Change url with params
     */
    updateUrl: function() {
      var url = location.pathname.slice(1) + '?' + this._serializeParams();
      this.navigate(url, { trigger: false });
    },

    /**
     * This method will update this.params object when URL change
     * @param  {String} routeName
     * @param  {Array} params
     */
    updateParams: function(params, routeName) {
      if (this.options.decoded && params[0]) {
        try {
          params = this._decodeParams(params[0]);
        } catch(err) {
          console.error('Invalid params. ' + err);
          params = null;
          return this.navigate('map');
        }
        this.params.clear({ silent: true }).set({ config: params });
      } else {
        var p = this._unserializeParams();
        this.params.clear({ silent: true }).set(this._unserializeParams());
      }
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
