(function(App) {

  'use strict';

  App.Collection.Specialities = Backbone.Collection.extend({

    url: '/api/specialities'

  });

})(this.App);
