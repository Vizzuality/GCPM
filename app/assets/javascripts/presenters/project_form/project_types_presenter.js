(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectTypes = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectTypes.prototype, {

    defaults: {
      multiple: true,
      name: 'project_type_ids',
      label: 'Project types',
      placeholder: 'All project types',
      blank: null,
      addNew: false,
      select2Options: {
        // closeOnSelect: false
        // It solves the closing of the dropdown menu
        // It adds a lot of UX issues
        // - Scroll: On select, scroll will go to first highlighted choice => How to resolve the scroll issue https://github.com/select2/select2/issues/1672#issuecomment-240411031
        // - Click: On each click dropdown will appear and dissapear
      }

    },

    initialize: function(params, viewSettings) {
      this.state = new StateModel();
      this.projectTypes = new App.Collection.ProjectTypes();

      // Creating view
      this.select = new App.View.Select({
        el: '#project-types',
        options: _.extend({}, this.defaults, viewSettings || {})
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('ProjectTypes:change', this.state.attributes);
      }, this);
      this.select.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchOptions: function() {
      return this.projectTypes.fetch().done(function() {
        var options = this.projectTypes.map(function(type) {
          return {
            name: type.attributes.name,
            value: type.attributes.id
          };
        });
        this.select.setOptions(options);
      }.bind(this));
    },

    /**
     * Method to set a new state
     * @param {Object} state
     */
    setState: function(state) {
      var result = {};
      _.each(state, function(s) {
        return result[s.value] = s.name;
      });
      this.state.set(result);
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
