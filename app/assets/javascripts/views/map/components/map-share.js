(function(App) {

  'use strict';

  App.View = App.View || {};

  App.View.MapShare = App.Helper.Modal.extend({

    el: '#map-share',

    tempmlate: HandlebarsTemplates['map-share'],

    events: function(){
      return _.extend({}, App.Helper.Modal.prototype.events,{

      });
    },

    cache: function() {
      this.contentContainer = $('#map-share .modal-content');
    },

    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);

      this.utils = App.Helper.Utils;
      this.params = settings.params;

      // Inits
      this.render();
      // this.cache();
      this.listeners();
    },

    // cache: function() {
    // },

    listeners: function() {

      App.Events.on('Share/toggle', function(){
        this.show();
      }.bind(this));
    },

    render: function() {
      var html = this.tempmlate({ link: window.location.href });
      this.contentContainer.html(html);
      return this;
    },


    /**
     * UI EVENTS
     * - onSubmitFilters
     */



  });

})(this.App);
