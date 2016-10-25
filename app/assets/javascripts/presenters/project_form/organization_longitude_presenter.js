(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationLongitude = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationLongitude.prototype, {

    defaults: {
      name: 'organizationlongitude'
    },

    initialize: function() {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#organizationlongitude',
        options: {
          label: 'Organization Longitude',
          placeholder: '',
          name: 'organizationLongitude',
          type: 'number',
          required: false,
          class: 'c-input',
          min: -180,
          max: 180
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
