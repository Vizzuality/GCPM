(function(App) {

  'use strict';

  App.View.UserManualDownload = Backbone.View.extend({

    events: {
      'click a' : 'onClickDownloadUserManual'
    },

    initialize: function() {

    },

    onClickDownloadUserManual: function(e) {
      this.trigger('download')
    }

  });

})(this.App);
