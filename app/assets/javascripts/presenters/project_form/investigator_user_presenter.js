(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorUser = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorUser.prototype, {

    defaults: {
      name: 'invesitagoruser'
    },

    initialize: function() {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#investigatoruser',
        options: {
          label: 'Investigator User Relationship',
          name: 'investigatorUser',
          type: 'checkbox',
          required: false,
          class: 'c-input',
          info: 'Is that you?',
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
