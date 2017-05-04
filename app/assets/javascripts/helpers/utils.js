(function(App) {

  'use strict';

  /**
   * Helper to extract form params in JSON object
   * @return {Object}
   */
  $.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  // Extending Handlebars
  // Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  //   switch (operator) {
  //     case '==':
  //       return (v1 == v2) ? options.fn(this) : options.inverse(this);
  //     case '===':
  //       return (v1 === v2) ? options.fn(this) : options.inverse(this);
  //     case '!==':
  //       return (v1 !== v2) ? options.fn(this) : options.inverse(this);
  //     case '<':
  //       return (v1 < v2) ? options.fn(this) : options.inverse(this);
  //     case '<=':
  //       return (v1 <= v2) ? options.fn(this) : options.inverse(this);
  //     case '>':
  //       return (v1 > v2) ? options.fn(this) : options.inverse(this);
  //     case '>=':
  //       return (v1 >= v2) ? options.fn(this) : options.inverse(this);
  //     case '&&':
  //       return (v1 && v2) ? options.fn(this) : options.inverse(this);
  //     case '||':
  //       return (v1 || v2) ? options.fn(this) : options.inverse(this);
  //     default:
  //       return options.inverse(this);
  //   }
  // });

  App.Helper = App.Helper || {};

  /**
   * Helper function to correctly set up the prototype chain for subclasses.
   * Similar to `goog.inherits`, but uses a hash of prototype properties and
   * class properties to be extended.
   * @param {Object} attributes
   */
  App.helper.utils = {

    getParams: function(paramString) {
      var params = {};
      paramString.split('&').forEach(function(pair) {
        pair = pair.split('=');
        var key = decodeURIComponent(pair[0]),
            val = decodeURIComponent(pair[1]);

        val = val ? val.replace(/\++/g,' ').trim() : '';

        if (key.length === 0) {
          return;
        }
        if (params[key] === undefined) {
          params[key] = (!!val && !isNaN(val)) ? Number(val) : val || null;
        }
        else {
          if ("function" !== typeof params[key].push) {
            params[key] = [params[key]];
          }

          params[key].push((!isNaN(val)) ? Number(val) : val || null);
        }

      });

      return params;
    },

    getTimelinePercentage: function(startDate, endDate) {
      var current = new Date().getTime();
      var start = new Date(startDate).getTime();
      var end = new Date(endDate).getTime();
      var percentage = 0;

      if ( current > end ) {
        percentage = 100;
      } else if (current < start ) {
        percentage = 0;
      } else {
        percentage = ((current - start) * 100 ) / ( end - start );
      }

      return percentage;
    },

    validateUrl: function(value) {
      var exp = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
      return exp.test(value);
    },

    svgToHTml: function(svgNode) {
      if (typeof window.XMLSerializer != 'undefined') {
        return (new window.XMLSerializer()).serializeToString(svgNode);
      } else if (typeof svgNode.xml != 'undefined') {
        return svgNode.xml;
      }
      return "";
    },

    validLng: function(lng) {
      return lng + 360;
    }



  }

})(this.App);
