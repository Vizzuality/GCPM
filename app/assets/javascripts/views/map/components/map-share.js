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
      this.link = window.location.href;

      // Inits
      this.render();
      this.cache();
      this.listeners();
    },

    cache: function() {
      this.$btnCopy = $('.btn-copy');
      this.$pasteMassage = $('.paste-massage');
      this.$url = $('#url');
    },

    listeners: function() {

      App.Events.on('Share/toggle', function(){
        this.show();
        this.link = window.location.href;
        this._setInputUrl();
        this._setCopyButton(false);
      }.bind(this));
      this.$btnCopy.on('click', this._copyToClipboard.bind(this));
    },

    render: function() {
      // Can not be on cache because is needed before cache is called
      this.$contentContainer = $('#map-share .modal-content');
      var html = this.tempmlate({ link: this.link });

      this.$contentContainer.html(html);
    },

    _setInputUrl: function() {
      this.link = window.location.href;
      this.$url.val(this.link);
    },

    _copyToClipboard: function() {
      this.$url.select();
      this._setCopyButton(true);
    },

    _setCopyButton: function(isSelected) {
      if (isSelected) {
        try {
          var successful = document.execCommand('copy');
          this.$btnCopy.html('Copied')
            .prop('disabled', true)
            .removeClass('-filled');
          this.$pasteMassage.html('Now press &#8984; + V or Ctrl + V to paste');
        } catch(err) {
          console.log('Not supported')
        }
      } else {
        this.$btnCopy.html('Copy')
          .prop('disabled', false)
          .addClass('-filled');
        this.$pasteMassage.html('');
      }
    }

  });

})(this.App);
