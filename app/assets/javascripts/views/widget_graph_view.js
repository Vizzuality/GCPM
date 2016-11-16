/* global d3 */
(function(App) {

  'use strict';

  App.View.WidgetGraph = Backbone.View.extend({

    defaults: {

    },

    events: {
      'click .js-btn-info': 'onClickInfo'
    },

    template: HandlebarsTemplates['graph'],

    initialize: function(settings) {
      var opts = settings && settings.options;
      opts = opts || new Object();
      this.options = _.extend({}, this.defaults, opts);

      this.render();
    },

    render: function() {
      if (this.widgetConf) {
        this.$el.html(this.template({
          info: this.widgetConf.config || {}
        }));
        this.renderGraph();
      }
    },

    renderGraph: function() {
      var config = this.widgetConf.config;
      var data = this.widgetConf.data;
      /**
       * Let's get the correct data to render
       * json = {
       *   'name_to_render': [1,5,7,9],
       *   'name_to_render_2': [1,6,7,5],
       * }
       */
      var json = this.parseData();

      this.chart1 = new App.View.Chart({
        el: '#graph-box',
        options: {
          data: {
            json: json,
            type: config.graphic_type
          },
          size: {
            width: this.$el.width()
          },
          bar: {
            width: {
              ratio: 0.5 // this makes bar width 50% of length between ticks
            }
          },
          legend: {
            show: false
          },
          axis: {
            x: {
              // I think that it's unnecessary to show the Years label
              // label: {
              //   text: config.xaxis.name,
              //   position: 'outer-center'
              // },
              type: 'category',
              categories: _.pluck(data, 'year'),
              tick: {
                fit: false,
                centered: true
                // rotate: 45,
                // count: (data.length > 14) ? 10 : undefined,
                // culling: {
                //   max: 10
                // }
              }
            },
            y: {
              label: {
                text: config.y_axis.name || 'no-name-provided',
                position: 'outer-middle'
              },
              tick: {
                format: function (v) {
                  if (v > 1000 || v < -1000) {
                    return d3.format('.3s')(v);
                  } else {
                    return d3.round(v, 2);
                  }
                }
              }
            }
          }
        }
      });
    },

    updateGraph: function(widgetConf) {
      this.widgetConf = widgetConf;
      this.render();
    },

    parseData: function() {
      var config = this.widgetConf.config;
      var data = this.widgetConf.data;

      var json = {};
      _.each(config.y_axis.values, function(value){
        json[value.name] = _.pluck(data, value.slug);
      });

      return json;
    },

    onClickInfo: function() {
      this.trigger('info', this.widgetConf.config.source);
    }
  });

})(this.App);