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
      'network/:id': 'network'
    },

    params: new (Backbone.Model.extend()),

    initialize: function(settings) {
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
      if (search) {
        search.substring(1).split('&').forEach(function(pair) {
          pair = pair.split('=');
          if (!!pair[1]) {
            var key = decodeURIComponent(pair[0]),
                val = decodeURIComponent(pair[1]),
                val = val ? val.replace(/\++/g,' ').trim() : '';

            if (key.length === 0) {
              return;
            }
            if (params[key] === undefined) {
              console.log(val, !isNaN(val));
              params[key] = (!isNaN(val)) ? Number(val) : val;
            }
            else {
              if ("function" !== typeof params[key].push) {
                params[key] = [params[key]];
              }
              
              params[key].push((!isNaN(val)) ? Number(val) : val);
            }
          }
        });        
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
