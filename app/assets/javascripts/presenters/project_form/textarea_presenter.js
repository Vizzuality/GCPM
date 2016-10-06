(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.Textarea = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.Textarea.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.Textarea = new App.View.Textarea({
        el: '#description',
        options: {
          name: 'summary',
          type: 'textarea',
          label: 'Description',
          lableClass: 'c-section-title',
          placeholder: 'Lorem'
        }
      });
    },

    setTextareaValue: function(textarea) {
      var value = textarea.$el.find('textarea')[0].value;
      var obj = {};
      obj[textarea.options.name] = value;

      this.state.set(obj);
    },

    render: function() {
      this.Textarea.render();
    },

    setState: function(state, options) {
      this.state.set(state, options);
    }

  });

})(this.App);
