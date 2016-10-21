(function(App) {

  'use strict';

  App.Collection.CancerTypes = Backbone.Collection.extend({

    url: '/api/cancer-types'

  });

})(this.App);
