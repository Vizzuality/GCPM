(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Policy = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Policy.prototype, {

    defaults: {
      label: null,
      name: 'policy',
      info: 'Accept privacy policy',
      type: 'checkbox',
      required: true,
      class: 'c-input',
    },

    initialize: function(viewSettings) {
      this.state = new StateModel();
      this.input = new App.View.Input({
        el: '#policy',
        options: _.extend({}, this.defaults, viewSettings || {}),
        state: this.state
      });
      this.setEvents();
    },

    setEvents: function(){
      this.state.on('change', function(){
        App.trigger('Policy:change', this.state.attributes);
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
