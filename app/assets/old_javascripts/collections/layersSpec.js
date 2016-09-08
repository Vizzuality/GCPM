(function(App) {

  'use strict';

  App.Collection = App.Collection || {};

  App.Collection.LayersSpec = Backbone.Collection.extend({

    url: '/data/layersSpec.json',

    /**
     * Filter by ids
     * @param  {Array} ids
     * @return {Collection}
     */
    filterByIds: function(ids) {
      var result = this.models.filter(function(layerModel) {
        var itExists = false;
        for (var i = ids.length - 1; i >= 0 && itExists === false; i--) {
          itExists = ids[i] === layerModel.attributes.id;
        }
        return itExists;
      });

      this.reset(result);
      return this;
    }

  });


})(this.App);
