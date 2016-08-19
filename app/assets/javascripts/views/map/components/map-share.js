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


    initialize: function(settings) {
      // Initialize Parent
      this.constructor.__super__.initialize.apply(this);

      this.utils = App.Helper.Utils;
      this.params = settings.params;
      this.link = window.location.href;

      // Inits
      this.cache();
      this.render();
      this.listeners();
    },

    cache: function() {
      this.$contentContainer = $('#map-share .modal-content');
    },

    listeners: function() {
      // Can not be on cache because render has to be called before
      this.$btnCopy = $('.btn-copy');

      App.Events.on('Share/toggle', function(){
        this.show();
        this.link = window.location.href;
        this.render();
      }.bind(this));
      this.$btnCopy.on('click', this._copyToClipboard.bind(this));
    },

    render: function() {
      var html = this.tempmlate({ link: this.link });
      this.$contentContainer.html(html);
      return this;
    },

    _copyToClipboard: function(e) {
      var url = document.querySelector('#url');
      url.select();

      try {
        var successful = document.execCommand('copy');
        $(e.currentTarget).html('copied');
        $('.paste-massage').html('Now press &#8984; + V or Ctrl + V to paste');
      } catch(err) {
        console.log('Not supported')
      }
    },

    /**
     * UI EVENTS
     * - onSubmitFilters
     */



  });

})(this.App);
