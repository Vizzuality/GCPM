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
        console.log(this.widgetConf.data);
      }
      // var emissions_by_source = this.model.get('analysis').emissions_by_source;
      // var chartDiv = this.$el.find('.c-graph').attr('id');

      // this.chart1 = new App.View.Chart({
      //   el: '#' + chartDiv,
      //   options: {
      //     data: {
      //       json: {
      //         'Current practices': _.pluck(emissions_by_source, this.model.get('type'))
      //       },
      //       labels: {
      //         format: function (v, id, i, j) {
      //           if (v > 1000 || v < -1000) {
      //             return d3.format('.3s')(v);
      //           } else {
      //             return d3.round(v, 2);
      //           }
      //         }
      //       },
      //       type: 'bar',
      //       order: null
      //     },
      //     size: {
      //       width: this.$el.find('.graph').width()
      //     },
      //     bar: {
      //       width: {
      //         ratio: 0.75 // this makes bar width 50% of length between ticks
      //       }
      //     },
      //     axis: {
      //       x: {
      //         type: 'category',
      //         categories: _.pluck(emissions_by_source, 'name'),
      //         tick: {
      //           rotate: chartDiv === 'chart-print' && 45
      //         }
      //       },
      //       y: {
      //         label: {
      //           text: 't of CO₂e',
      //           position: 'outer-middle'
      //         },
      //         tick: {
      //           format: function (v, id, i, j) {
      //             if (v > 1000 || v < -1000) {
      //               return d3.format('.3s')(v);
      //             } else {
      //               return d3.round(v, 2);
      //             }
      //           }
      //         }
      //       }
      //     },
      //     grid: {
      //       y: {
      //         lines: [
      //           {value: 0}
      //         ]
      //       }
      //     }
      //   }
      // });
    },

    renderGraph: function() {

    },

    updateGraph: function(widgetConf) {
      this.widgetConf = widgetConf;
      this.render();
    }
  });

})(this.App);
