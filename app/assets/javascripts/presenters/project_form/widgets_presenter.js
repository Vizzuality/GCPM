(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  var WidgetModel = Backbone.Model.extend({
    setUrl: function(iso, sql) {
      _.templateSettings = {
        interpolate: /\{\{(.+?)\}\}/g
      };

      var urlTemplate = _.template(sql);
      var sql_parsed = urlTemplate({COUNTRY_ISO: iso });
      this.url = 'https://' + gon.carto_account + '.carto.com/api/v2/sql/?q=' + sql_parsed + '&api_key=' + gon.carto_key;
    },

    parse: function(response) {
      var data = response.rows[0] || {};
      return {
        data: data
      };
    }
  });



  App.Presenter.Widgets = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Widgets.prototype, {

    defaults: {
      multiple: false,
      name: 'widgets[]',
      label: 'Widgets',
      placeholder: 'All widgets',
      blank: null,
      addNew: false,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear

        // Use this if you want a single select
        allowClear: true,
        templateSelection: function (data) {
          // Return the placeholder
          if (!data.id) {
            return data.text;
          }
          // Return the selected option
          return $('<span class="select2-selection__choice">' + data.text + '<span class="select2-selection__clear">×</span></span>');
        }
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.widgetModel = new WidgetModel();
      this.widgets = new App.Collection.Widgets();

      // Creating view
      this.select = new App.View.Select({
        el: '#widgets-select',
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });

      // Creating view
      this.graph = new App.View.WidgetGraph({
        el: '#widgets-graph',
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });


      this.setEvents();
      this.setSubscriptions();
      this.fetchWidgets();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.select.on('change', function(newState){
        this.setState({
          widget: newState.value[0]
        });
      }, this);

      this.state.on('change:widget', this.changeWidget.bind(this));
    },

    setSubscriptions: function(){
    },

    changeWidget: function() {
      var widget = this.state.get('widget');
      this.fetchWidget(widget);
    },

    /**
     * Fetch widgets from API
     * @return {Promise}
     */
    fetchWidgets: function() {
      return this.widgets.fetch({add: true}).done(function() {
        var options = this.widgets.map(function(widget) {
          return {
            name: widget.attributes.name,
            value: widget.attributes.slug
          };
        });
        this.select.setOptions(options);
        this.select.render();
      }.bind(this));
    },

    fetchWidget: function(widget) {
      // GET the Widget config
      var widgetConf = this.widgets.findWhere({
        slug: widget
      });

      // FETCH the CARTO 'query'
      // before upgrading the view
      this.widgetModel.setUrl(gon.server_params['countries[]'], widgetConf.get('query'));
      this.widgetModel
        .clear({ silent: true })
        .fetch().done(function() {
          this.widgetModel.set('config', widgetConf.toJSON());
          this.graph.updateGraph(this.widgetModel.toJSON());
        }.bind(this));
    },

    render: function() {
      this.select.render();
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    setValue: function(values){
      this.select.$el.find("select").val(values).trigger("change");
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
    },

    /**
     * Exposing DOM element
     * @return {DOM}
     */
    getElement: function() {
      return this.select.$el;
    }

  });

})(this.App);
