/* global google */
(function(App) {

  'use strict';

  App.View.Footer = Backbone.View.extend({

    initialize: function() {
      this.initTranslate();
    },

    initTranslate: function() {
      setTimeout(function() {
        window['googleTranslateElementInitGFW'] = function() {
          new google.translate.TranslateElement({
            pageLanguage: '',
            includedLanguages: 'ar,es,en,fr,id,pt,ru,zh-CN,de,uk,ro,tr,it,hi,km',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },'googleTranslateGCPM');
        }

        var translateScript = document.createElement('script');
        translateScript.type= 'text/javascript';
        translateScript.src = 'http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInitGFW';
        document.head.appendChild(translateScript);
      }, 0);
    }

  });

})(this.App);
