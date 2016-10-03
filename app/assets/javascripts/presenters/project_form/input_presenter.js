(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Input = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Input.prototype, {

    defaults: {
      name: 'title'
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#title',
        options: {
          label: false,
          placeholder: 'Project Title_',
          name: 'title',
          type: 'text',
          required: true,
          class: 'c-input',
          inputClass: 'c-title -bigger -bold',
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