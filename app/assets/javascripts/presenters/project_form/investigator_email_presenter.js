(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorEmail = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorEmail.prototype, {

    defaults: {
      name: 'title'
    },

    initialize: function() {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#investigatoremail',
        options: {
          label: 'Investigator Email',
          placeholder: 'test@test.com',
          name: 'investigatorEmail',
          type: 'email',
          required: false,
          class: 'c-input'
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
