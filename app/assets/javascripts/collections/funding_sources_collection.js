(function(App) {

  'use strict';

  App.Collection.FundingSources = Backbone.Collection.extend({

    url: '/api/funding-sources'

  });

})(this.App);
