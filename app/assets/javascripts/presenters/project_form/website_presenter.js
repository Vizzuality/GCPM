(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.WebsiteInput = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.WebsiteInput.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.websiteInput = new App.View.Input({
        el: '#project-website',
        options: {
          name: 'website',
          type: 'text',
          label: 'Project website',
          inputClass: 'c-section-title -one-line',
          placeholder: 'http://example.org'
        }
      });

      this.setSubscriptions();
    },

    setSubscriptions: function() {
      this.websiteInput.on('change', this.setUrl, this);
    },

    setUrl: function(input) {
      if (input.el === '#project-website') {
        var value = input.$el.find('input')[0].value;

        if (value && App.Helper.Utils.validateUrl(value)) {
          var obj = {};
          obj[input.options.name] = value;

          this.state.set(obj);
          App.trigger('Website:change', this);
        }
      }
    },

  });

})(this.App);
