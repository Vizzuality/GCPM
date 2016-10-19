(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationLatitude = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationLatitude.prototype, {

    defaults: {
      name: 'organizationlatitude'
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#organizationlatitude',
        options: {
          label: 'Organization Latitude',
          placeholder: '',
          name: 'organizationLatitude',
          type: 'number',
          required: false,
          class: 'c-input',
          min: -90,
          max: 90
        }
      });

      this.setEvents();
    },

    setEvents: function(){
      this.state.on('change', function(){
        App.trigger('Input:change', this.state.attributes);
      }, this);

      this.Input.on('change', this.setState, this);
    },

    render: function(){
      this.Input.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.Input.setElement(el);
    },

    getElement: function() {
      return this.Input.$el;
    }

  });

})(this.App);
