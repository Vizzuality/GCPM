(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Projects = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Projects.prototype, {

    defaults: {
      multiple: true,
      name: 'projects[]',
      label: 'Projects',
      placeholder: 'All projects',
      blank: null,
      addNew: true,
      select2Options: {
        minimumInputLength: 3,
        ajax: {
          url: '/api/projects',
          delay: 150,
          cache: false,
          data: function (params) {
            var query = {
              q: params.term,
              page: params.page || 1,
              active: true
            }
            // Query paramters will be ?q=[term]&page=[page]
            return query;
          },

          processResults: function (organizations) {
            return {
              results: _.sortBy(_.map(organizations, function(org){
                return {
                  text: org.name,
                  id: org.id
                };
              }), 'text')
            }
          }
        }
      }
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.projects = new App.Collection.Projects();
      this.options = _.extend({}, this.defaults, viewSettings || {});

      // Creating view
      this.select = new App.View.Select({
        el: '#projects',
        options: this.options,
        state: this.state
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('Projects:change', this.state.attributes);
      }, this);

      this.select.on('setValues', function(values){
        this.setValues(values);
      }, this);

      this.select.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchData: function() {
      return this.projects.fetch().done(function() {
        var options = this.projects.map(function(type) {
          return {
            name: type.attributes.title,
            value: type.attributes.id
          };
        });
        this.select.setOptions(options);
      }.bind(this));
    },

    render: function() {
      this.select.render();
    },

    setValues: function(values) {
      _.each(values, function(v){
        if (v) {
          this.projectModel = new App.Model.Project({
            id: v
          });
          this.projectModel.fetch().done(function(model){
            $(this.select.select.selector).select2("trigger", "select", {
              data: {
                id: model.id,
                text: model.name
              }
            });
          }.bind(this));
        }
        // var current = _.findWhere(this.options.options, { id: parseInt(v) }) || _.findWhere(this.options.options, { value: parseInt(v) });
      }.bind(this));
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state, options) {
      this.state.set(state, options);
    },

    /**
     * Rebinding element, events and render again
     * @param {DOM|String} el
     */
    setElement: function(el) {
      this.select.setElement(el);
      this.select.render();
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
