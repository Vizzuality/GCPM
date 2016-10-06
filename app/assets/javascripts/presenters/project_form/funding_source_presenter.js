(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.FundingSources = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.FundingSources.prototype, {
    initialize: function(params) {
      this.state = new StateModel();
      this.fundingInput = new App.View.Input({
        el: '#funding-sources',
        options: {
          name: 'funding-sources',
          type: 'text',
          label: 'funding-sources',
          inputClass: 'funding-sources',
          placeholder: 'name'
        }
      });

      this.setEvents();
    },

    setEvents: function() {
      this.state.on('change', function(){
        if (this.state.attributes.value && App.Helper.Utils.validateUrl(this.state.attributes.value)) {
          App.trigger('fundingInput:change', this.state.attributes);
        }
      }, this);

      this.fundingInput.on('change', this.setState, this);
    },

    render: function(){
      this.fundingInput.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.fundingInput.setElement(el);
    },

    getElement: function() {
      return this.fundingInput.$el;
    }

  });

})(this.App);
