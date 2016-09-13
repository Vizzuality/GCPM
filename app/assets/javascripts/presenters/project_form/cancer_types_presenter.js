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
          multiple: true,
          name: 'cancer_type_ids',
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
      this.cancerTypesSelect.on('change', this.setSelectMultipleValues, this);
    },

    setSelectMultipleValues: function(select) {
      var values = [];
      var options = select.$el.find('select :selected');

      options.map(function(index, option) {
        values.push(Number(option.value));
      }.bind(this));

      if (values) {
        var obj = {};
        obj[select.options.name] = values;

        this.state.set(obj);
        App.trigger('CancerTypesSelect:change', this);
      }
    }

  });

})(this.App);
