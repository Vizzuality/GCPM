/* global d3 */
(function(App) {

  'use strict';

  App.View.WidgetGraph = Backbone.View.extend({

    defaults: {

    },

    events: {

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

      console.log(config);
      console.log(data);

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
            // labels: {
            //   format: function (v) {
            //     if (v > 1000 || v < -1000) {
            //       return d3.format('.3s')(v);
            //     } else {
            //       return d3.round(v, 2);
            //     }
            //   }
            // },
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
                text: config.yaxis.name,
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

      // TODO: change this...
      // We should now the columns to iterate them,
      // I mean to know which value should we get
      var data1 = _.pluck(data, 'valuey1');
      var data2 = _.has(data[0], 'valuey2') ? _.pluck(data, 'valuey2') : null;
      var data3 = _.has(data[0], 'valuey3') ? _.pluck(data, 'valuey3') : null;
      var data4 = _.has(data[0], 'valuey4') ? _.pluck(data, 'valuey4') : null;
      var data5 = _.has(data[0], 'valuey5') ? _.pluck(data, 'valuey5') : null;
      var data6 = _.has(data[0], 'valuey6') ? _.pluck(data, 'valuey6') : null;

      json['data1'] = data1;
      (data2) ? json['data2'] = data2 : null;
      (data3) ? json['data3'] = data3 : null;
      (data4) ? json['data4'] = data4 : null;
      (data5) ? json['data5'] = data5 : null;
      (data6) ? json['data6'] = data6 : null;

      return json;
    }
  });

})(this.App);
