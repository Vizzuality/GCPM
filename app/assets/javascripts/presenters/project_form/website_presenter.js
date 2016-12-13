(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.WebsiteInput = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.WebsiteInput.prototype, {

    initialize: function() {
      this.state = new StateModel();
      this.websiteInput = new App.View.Input({
        el: '#project-website',
        options: {
          label: false,
          placeholder: 'http://www.example.org',
          name: 'project_website',
          type: 'url',
          required: false,
          class: 'c-input',
          inputClass: 'c-section-title -one-line',
        }
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      this.websiteInput.on('change', this.setUrl, this);
    },

    setValue: function(value){
      this.websiteInput.$el.find("input").val(value).trigger("change");
    },

    setUrl: function(input) {
      if (input.el === '#project-website') {
        var value = input.$el.find('input')[0].value;

        if (value && App.Helper.Utils.validateUrl(value)) {
          var obj = {};
          obj[input.options.name] = value;

          this.state.set(obj);
          App.trigger('WebsiteInput:change', this);
        }
      }
    },

    render: function() {
      this.websiteInput.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    },

    setElement: function(el) {
      this.websiteInput.setElement(el);
    },

    getElement: function() {
      return this.websiteInput.$el;
    }

  });

})(this.App);
