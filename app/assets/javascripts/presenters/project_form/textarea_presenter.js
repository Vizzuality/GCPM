(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Textarea = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Textarea.prototype, {

    defaults: {
      name: 'summary'
    },

    initialize: function(params) {
      this.state = new StateModel();
      this.Textarea = new App.View.Textarea({
        el: '#description',
        options: {
          value: null,
          label: false,
          required: false,
          class: 'c-textarea',
          name: 'summary',
          type: 'textarea',
          lableClass: 'c-section-title',
          placeholder: "Cancer is the second leading cause of deaths globally with 70% of all cancer deaths occurring in developing countries. Morocco's cancer burden is increasing and therefore, the country has prioritized cancer prevention and control as part of its health strategy. To achieve the goal of reducing the national cancer burden Morocco is strengthening its two population based cancer registries, has opened new cancer treatment hospitals in underserved regions and a breast cancer and cervical cancer screening facility in its capital. \
            Finally, Morocco has allocated funding for cancer research. However much remains to be done including documenting the cancer distribution and the factors associated with cancer, as well as treatment outcomes to inform cancer prevention and treatment guidelines nationally."
        }
      });

      this.setEvents();
    },

    setEvents: function(){
      this.state.on('change', function(){
        App.trigger('Textarea:change', this.state.attributes);
      }, this);

      this.Textarea.on('change', this.setState, this);
    },

    render: function(){
      this.Textarea.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.Textarea.setElement(el);
    },

    getElement: function() {
      return this.Textarea.$el;
    }

  });

})(this.App);
