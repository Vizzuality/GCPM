(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CancerTypes = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CancerTypes.prototype, {

    defaults: {
      multiple: true,
      name: 'cancer_type_ids',
      label: 'Cancer types',
      placeholder: 'Cancer types',
      addNew: true
    },

    initialize: function(params, viewSettings) {
      this.state = new StateModel();
      this.cancerTypes = new App.Collection.CancerTypes();

      // Creating view
      this.select = new App.View.Select({
        el: '#cancer-types',
        options: _.extend({}, this.defaults, viewSettings || {})
      });

      this.setEvents();
    },

    /**
     * Setting internal events
     */
    setEvents: function() {
      this.state.on('change', function() {
        App.trigger('CancerTypes:change', this.state.attributes);
      }, this);
      this.select.on('change', this.setState, this);
    },

    /**
     * Fetch cancer types from API
     * @return {Promise}
     */
    fetchOptions: function() {
      return this.cancerTypes.fetch().done(function() {
        var options = this.cancerTypes.map(function(type) {
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