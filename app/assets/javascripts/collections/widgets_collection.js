(function(App) {

  'use strict';

  App.Collection.Widgets = Backbone.Collection.extend({

    url: '/api/widgets'
    
  });

})(this.App);
