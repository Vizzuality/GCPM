(function(App) {

  'use strict';

  App.Model.Follow = Backbone.Model.extend({

    sync: function(method, model, options) {

      if( model && (method === 'create' || method === 'update' || method === 'patch') ) {
        options.contentType = 'application/json';
        options.data = JSON.stringify(options.attrs || model.toJSON());
      }

      _.extend(options.data, {
        "access_token": "some-token"
      });

      console.log(options);

      return Backbone.sync.call(this, method, model, options );
    },

    setUrl: function(data) {
      this.url = '/follows/'+ data.resource + '/' + data.id
    },

    parse: function(response) {
      console.log(response);
      return response;
    }

  });

})(this.App);
