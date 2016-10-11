(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.InvestigatorWebsite = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.InvestigatorWebsite.prototype, {

    defaults: {
      name: 'title'
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#investigatorwebsite',
        options: {
          label: 'Investigator Website',
          placeholder: 'http://www.example.com',
          name: 'investigatorWebsite',
          type: 'url',
          required: true,
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
