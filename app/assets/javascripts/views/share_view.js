/* global ga*/
(function(App) {

  'use strict';

  App.View.Share = Backbone.View.extend({

    template: HandlebarsTemplates['share'],

    events: {
      'focus .js-input-share': 'triggerSelect',
      'click .js-btn-share': 'triggerCopy',
      'click .js-btn-share-social': 'triggerPopup'
    },

    initialize: function() {
    },

    cache: function() {
      this.$inputShare = this.$el.find('.js-input-share');
      this.$btnShare = this.$el.find('.js-btn-share');
    },

    render: function() {
      this.$el.html(this.template({
        url: window.location.href,
        urlEncoded: encodeURIComponent(window.location.href)
      }));

      // Rebinding elements and events
      this.delegateEvents();

      this.cache();

      return this;
    },

    triggerSelect: function() {
      this.$inputShare.select();
    },

    triggerCopy: function() {
      this.$inputShare.select();

      try {
        document.execCommand('copy');
        this.$btnShare
          .html('copied');

        ga('send', 'event', 'Map', 'Share', 'Copy Link');


      } catch(err) {
        console.error(err);
      }
    },

    triggerPopup: function(e) {
      e && e.preventDefault();
      var width  = 575,
          height = 400,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          url    = $(e.currentTarget).attr('href'),
          opts   = 'status=1' +
                   ',width='  + width  +
                   ',height=' + height +
                   ',top='    + top    +
                   ',left='   + left;

      window.open(url, 'Share this analysis', opts);

      ga('send', 'event', 'Map', 'Share', e.currentTarget.dataset.social);
    }

  });

})(this.App);
