(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationLead = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationLead.prototype, {

    defaults: {
      label: null,
      placeholder: 'Lead',
      name: 'lead',
      type: 'checkbox',
      class: 'c-input',
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.input = new App.View.Input({
        el: viewSettings.DOMelement,
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });
      this.setEvents();
    },

    setEvents: function(){
      this.input.on('change', function(newState){
        this.setState(newState);
        App.trigger('OrganizationLead:change', this.state);
      }, this);
    },

    render: function(){
      this.input.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.input.setElement(el);
    },

    getElement: function() {
      return this.input.$el;
    }

  });

})(this.App);
