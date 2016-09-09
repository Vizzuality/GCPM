(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.CancerTypes = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.CancerTypes.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.cancerTypes = new App.Collection.CancerTypes();
      this.cancerTypesSelect = new App.View.Select({
        el: '#cancer-types',
        options: {
          name: 'cancer-types',
          type: 'text',
          label: 'Cancer types',
          inputClass: 'c-section-title -one-line',
          placeholder: 'Cancer types'
        }
      });

      this.render();
      this.setSubscriptions();
    },

    render: function() {
      this.cancerTypes
        .fetch()
        .done(function() {
          var options = this.cancerTypes.toJSON().map(function(type) {
            return { name: type.name, value: type.id };
          });
          this.cancerTypesSelect.renderOptions(options);
        }.bind(this));
    },

    setSubscriptions: function() {
      this.cancerTypesSelect.on('change', this.setSelectValues, this);
    },

    setSelectValues: function(select) {
      var value = select.$el.find('select')[0].value;

      if (value) {
        var obj = {};
        obj[select.options.name] = Number(value);

        this.state.set(obj);
        App.trigger('cancerTypesSelect:change', this);
      }
    }

  });

})(this.App);
