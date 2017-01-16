(function(App) {

  'use strict';

  App.Collection.Widgets = Backbone.Collection.extend({

    url: '/api/widgets',

    defaults: {
      featured: false
    },

    initialize: function(settings){
      this.options = _.extend({}, this.defaults, settings || {});
    },

    comparator: function(item) {
      return item.get('name');
    },

    parse: function(response) {
      var data = _.compact(_.map(response, function(item){
        if (item.featured != this.options.featured) {
          return null;
        }

        if (this.options.innerPage !== item.inner_page) {
          if ((this.options.innerPage === 'none' && item.inner_page) ||
            this.options.innerPage !== 'none') {
            return null;
          }
        }

        item.x_axis = (item.x_axis) ? JSON.parse(item.x_axis) : null;
        item.y_axis = (item.y_axis) ? JSON.parse(item.y_axis) : null;

        return item;
      }.bind(this)));

      return data;
    }

  });

})(this.App);
