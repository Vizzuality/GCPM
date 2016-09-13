(function(App) {

  'use strict';

  var StateModel = Backbone.Model.extend();

  App.Presenter.ProjectTypes = function() {
    this.initialize.apply(this, arguments);
  };

  _.extend(App.Presenter.ProjectTypes.prototype, {

    initialize: function(params) {
      this.state = new StateModel();
      this.projectTypes = new App.Collection.ProjectTypes();
      this.projectTypesSelect = new App.View.Select({
        el: '#project-types',
        options: {
          multiple: true,
          name: 'project_type_ids',
          type: 'text',
          label: 'Project types',
          inputClass: 'c-section-title -one-line',
          placeholder: 'Project types'
        }
      });

      this.render();
      this.setSubscriptions();
    },

    render: function() {
      this.projectTypes
        .fetch()
        .done(function() {
          var options = this.projectTypes.toJSON().map(function(type) {
            return { name: type.name, value: type.id };
          });
          this.projectTypesSelect.setOptions(options);
        }.bind(this));
    },

    setSubscriptions: function() {
      this.projectTypesSelect.on('change', this.setSelectMultipleValues, this);
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
        App.trigger('ProjectTypesSelect:change', this);
      }
    }

  });

})(this.App);
