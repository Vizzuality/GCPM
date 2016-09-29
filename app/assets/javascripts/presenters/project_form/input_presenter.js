(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Input = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Input.prototype, {

    initialize: function() {
      this.state = new StateModel();
      this.Input = new App.View.Input({
        el: '#title',
        options: {
          name: 'title',
          class: '',
          inputClass: 'c-title -bigger -bold',
          type: 'text',
          placeholder: 'Project Title_'
        }
      });
    },

    setInputValue: function(input) {
      var value = input.$el.find('input')[0].value;
      var obj = {};
      obj[input.options.name] = value;

      this.state.set(obj);
    },

  });

})(this.App);
