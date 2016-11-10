(function(App) {

  'use strict';

  App.Collection.Widgets = Backbone.Collection.extend({

    url: '/api/widgets',

    comparator: function(item) {
      return item.get('name');
    }

  });

})(this.App);
