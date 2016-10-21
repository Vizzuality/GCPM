(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.OrganizationLead = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.OrganizationLead.prototype, {

    defaults: {
      label: null,
      info: 'Lead',
      name: 'lead',
      type: 'radio',
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
      this.state.on('change', function(newState){
        this.setState(newState);
        App.trigger('OrganizationLead:change', this.state);
      }, this);

      this.input.on('change', this.setState, this);
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
