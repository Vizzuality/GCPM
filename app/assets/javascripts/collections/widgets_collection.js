(function(App) {

  'use strict';

  App.Collection.Widgets = Backbone.Collection.extend({

    url: '/api/widgets',

    comparator: function(item) {
      return item.get('name');
    },

    parse: function(response) {
      response.map(function(item){
        item.x_axis = (!!item.x_axis) ? JSON.parse(item.x_axis) : null;
        item.y_axis = (!!item.y_axis) ? JSON.parse(item.y_axis) : null;
      })
      return response;
    }

  });

})(this.App);
